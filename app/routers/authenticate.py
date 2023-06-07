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

# TODO: Tenenv hardcoded for now
OIDC_config = configParser.getConfig('oidc_client_egi')
SERVER_config = configParser.getConfig('server_config')
oauth = OAuth()

oauth.register(
    'rciam',
    client_id=OIDC_config['client_id'],
    client_secret=OIDC_config['client_secret'],
    server_metadata_url=OIDC_config['issuer'] + "/.well-known/openid-configuration",
    client_kwargs={'scope': 'openid profile email voperson_id eduperson_entitlement'}
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
    # Creating our own redirect url is what make it possible
    # to add the cookie
    response = RedirectResponse(url=urllib.parse.unquote(login_start_url))
    response.delete_cookie("login_start")

    rciam = oauth.create_client('rciam')
    try:
        token = await rciam.authorize_access_token(request)
    except OAuthError as error:
        return HTMLResponse(f'<h1>{error.error}</h1>')
    user = token.get('userinfo')
    pprint(token)

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
        # print("user info data:")
        # pprint(user_info_data)
        # Encode the data to jwt
        # todo: the key could become configurable and per tenenv
        jwt_user = jwt.encode(payload=user_info_data,
                              key="a custom key",
                              algorithm="HS256")
        # print(jwt_user)

        # XXX The max_age of the cookie is the same as the
        # access token max age which we extract from the token
        # itself
        response.headers["Access-Control-Expose-Headers"] = "X-Permissions, X-Authenticated"
        response.set_cookie(key="userinfo",
                            value=jwt_user,
                            secure=None,
                            max_age=token.get('expires_in'),
                            domain=SERVER_config['domain'])

        response.set_cookie(key="idtoken",
                            value=token.get('id_token'),
                            secure=None,
                            max_age=token.get('expires_in'),
                            domain=SERVER_config['domain'])

        response.set_cookie(key="atoken",
                            value=token.get('access_token'),
                            secure=None,
                            max_age=token.get('expires_in'),
                            domain=SERVER_config['domain'])
        response.headers["X-Authenticated"] = "true"

    return response


@router.get('/logout',
            include_in_schema=False,
            response_class=RedirectResponse)
async def logout(request: Request):
    rciam = oauth.create_client('rciam')
    metadata = await rciam.load_server_metadata()
    redirect_uri = SERVER_config['protocol'] + "://" + SERVER_config['client'] + "/egi/devel"
    logout_endpoint = metadata['end_session_endpoint'] + "?post_logout_redirect_uri=" + urllib.parse.unquote(
        redirect_uri) + "&id_token_hint=" + request.cookies.get("idtoken")

    request.session.pop('user', None)

    # Set cookies when returning a RedirectResponse
    # https://github.com/tiangolo/fastapi/issues/2452
    response = RedirectResponse(url=logout_endpoint)
    response.set_cookie('userinfo',
                        expires=0,
                        max_age=0,
                        domain=SERVER_config['domain'])

    response.set_cookie('idtoken',
                        expires=0,
                        max_age=0,
                        domain=SERVER_config['domain'])

    response.set_cookie(key="atoken",
                        expires=0,
                        max_age=0,
                        domain=SERVER_config['domain'])

    return response
