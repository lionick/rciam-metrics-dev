from pprint import pprint

from fastapi import APIRouter, Depends, HTTPException, status, Security, Request
from fastapi.responses import JSONResponse
import json, jwt


from app.utils import configParser
import urllib.parse
from starlette.responses import HTMLResponse, RedirectResponse
from authlib.integrations.starlette_client import OAuth, OAuthError

router = APIRouter(
    tags=["authenticate"],
    # dependencies=[Depends(get_token_header)],
    # responses={404: {"description": "Not found"}},
)

# TODO: Tenant hardcoded for now
OIDC_config = configParser.getConfig('oidc_client_egi')
SERVER_config = configParser.getConfig('server_config')
oauth = OAuth()

oauth.register(
    'rciam',
    client_id=OIDC_config['client_id'],
    client_secret=OIDC_config['client_secret'],
    server_metadata_url=OIDC_config['issuer'] + "/.well-known/openid-configuration",
    client_kwargs={'scope': 'openid profile email eduperson_entitlement'}
)

@router.get('/login', include_in_schema=False)
async def login_endpoint(request: Request):
    rciam = oauth.create_client('rciam')
    redirect_uri = SERVER_config['protocol'] + "://" + SERVER_config['host'] + SERVER_config['api_path'] + "/auth"
    return await rciam.authorize_redirect(request, redirect_uri)

@router.get('/auth',
            include_in_schema=False,
            response_class=RedirectResponse)
async def authorize_rciam(request: Request):
    login_start_url = request.cookies.get("login_start")
    # pprint(request.cookies.get("login_start"))
    if not login_start_url:
        login_start_url = "/"

    # Set cookies when returning a RedirectResponse
    # https://github.com/tiangolo/fastapi/issues/2452
    response = RedirectResponse(url=urllib.parse.unquote(login_start_url))
    response.delete_cookie("login_start")

    rciam = oauth.create_client('rciam')
    try:
        token = await rciam.authorize_access_token(request)
    except OAuthError as error:
        return HTMLResponse(f'<h1>{error.error}</h1>')
    user = token.get('userinfo')
    if user:
        request.session['user'] = dict(user)
    # Fetch the userinfo data
    if user.get("email") is None:
        metadata = await rciam.load_server_metadata()
        if not metadata['userinfo_endpoint']:
            raise RuntimeError('Missing "userinfo_endpoint" value')
        # Make a request to the userinfo endpoint
        user_info = await rciam.get(metadata['userinfo_endpoint'], token=token)
        user_info.raise_for_status()
        user_info_data = user_info.json()
        # Encode the data to jwt
        # todo: the key could become configurable and per tenant
        jwt_user = jwt.encode(payload=user_info_data,
                              key="a custom key",
                              algorithm="HS256")
        print(jwt_user)

        response.set_cookie(key="userinfo",
                            value=jwt_user,
                            secure=None,
                            domain=SERVER_config['domain'])

    return response

@router.get('/logout',
            include_in_schema=False,
            response_class=RedirectResponse)
async def logout(request):
    logout_start_url = request.cookies.get("logout_start")
    # pprint(request.cookies.get("logout_start"))
    if not logout_start_url:
        logout_start_url = "/"

    # Set cookies when returning a RedirectResponse
    # https://github.com/tiangolo/fastapi/issues/2452
    response = RedirectResponse(url=urllib.parse.unquote(logout_start_url))
    response.delete_cookie("logout_start")

    request.session.pop('user', None)
    return response
