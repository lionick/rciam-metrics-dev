from pprint import pprint
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, status, Security, Request
from fastapi.responses import JSONResponse
import json, jwt

from app.utils import configParser
import urllib.parse
from starlette.responses import HTMLResponse, RedirectResponse
from authlib.integrations.starlette_client import OAuth, OAuthError

from app.utils.globalMethods import permissionsCalculation, g

router = APIRouter(
    tags=["authenticate"],
    # dependencies=[Depends(get_token_header)],
    # responses={404: {"description": "Not found"}},
)

def initializeAuthOb():
    config_file = 'config.' + g.tenant + '.' + g.environment + '.py'
    oidc_config = configParser.getConfig('oidc_client_egi', config_file)
    oauth = OAuth()

    oauth.register(
        'rciam',
        client_id=oidc_config['client_id'],
        client_secret=oidc_config['client_secret'],
        server_metadata_url=oidc_config['issuer'] + "/.well-known/openid-configuration",
        client_kwargs={'scope': 'openid profile email voperson_id eduperson_entitlement'}
    )
    return oauth

def getServerConfig():
    config_file = 'config.' + g.tenant + '.' + g.environment + '.py'
    return configParser.getConfig('server_config', config_file)

@router.get('/login',
            include_in_schema=False
            )
async def login_endpoint(
        request: Request,
        oauth_ob= Depends(initializeAuthOb),
        server_config= Depends(getServerConfig)):
    rciam = oauth_ob.create_client('rciam')
    redirect_uri = server_config['protocol'] + "://" + server_config['host'] + server_config['api_path'] + "/auth"
    return await rciam.authorize_redirect(request, redirect_uri)


@router.get('/auth',
            include_in_schema=False,
            response_class=RedirectResponse)
async def authorize_rciam(
        request: Request,
        oauth_ob= Depends(initializeAuthOb),
        server_config=Depends(getServerConfig)
):
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

    rciam = oauth_ob.create_client('rciam')
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
        # Encode the data to jwt
        # todo: the key could become configurable and per tenenv
        jwt_user = jwt.encode(payload=user_info_data,
                              key="a custom key",
                              algorithm="HS256")
        # print(jwt_user)

        # XXX The max_age of the cookie is the same as the
        # access token max age which we extract from the token
        # itself
        response.headers["Access-Control-Expose-Headers"] = "X-Permissions, X-Authenticated, X-Redirect"
        response.set_cookie(key="userinfo",
                            value=jwt_user,
                            secure=None,
                            max_age=token.get('expires_in'),
                            domain=server_config['domain'])

        response.set_cookie(key="idtoken",
                            value=token.get('id_token'),
                            secure=None,
                            max_age=token.get('expires_in'),
                            domain=server_config['domain'])

        response.set_cookie(key="atoken",
                            value=token.get('access_token'),
                            secure=None,
                            max_age=token.get('expires_in'),
                            domain=server_config['domain'])
        response.headers["X-Authenticated"] = "true"

        # Authorization
        authorize_file = 'authorize.' + g.tenant + '.' + g.environment + '.py'
        entitlements_config = configParser.getConfig('entitlements', authorize_file)
        permissions = permissionsCalculation(entitlements_config, user_info_data)
        permissions_json = json.dumps(permissions).replace(" ", "").replace("\n", "")

        # Set the permissions cookie.
        jwt_persmissions = jwt.encode(payload=permissions,
                                      key="a custom key",
                                      algorithm="HS256")
        response.set_cookie(key="permissions",
                            value=jwt_persmissions,
                            secure=None,
                            max_age=token.get('expires_in'),
                            domain=server_config['domain'])
        # Add the permission to a custom header field
        response.headers["X-Permissions"] = permissions_json

    return response


@router.get('/logout',
            include_in_schema=False,
            response_class=RedirectResponse)
async def logout(
        request: Request,
        oauth_ob= Depends(initializeAuthOb),
        server_config=Depends(getServerConfig)
):
    rciam = oauth_ob.create_client('rciam')
    metadata = await rciam.load_server_metadata()
    # todo: Fix this after we complete the multitenacy
    redirect_uri = server_config['protocol'] + "://" + server_config['client'] + "/" + g.tenant + "/" + g.environment
    logout_endpoint = metadata['end_session_endpoint'] + "?post_logout_redirect_uri=" + urllib.parse.unquote(
        redirect_uri) + "&id_token_hint=" + request.cookies.get("idtoken")

    request.session.pop('user', None)

    # Set cookies when returning a RedirectResponse
    # https://github.com/tiangolo/fastapi/issues/2452
    response = RedirectResponse(url=logout_endpoint)
    response.set_cookie('userinfo',
                        expires=0,
                        max_age=0,
                        domain=server_config['domain'])

    response.set_cookie('idtoken',
                        expires=0,
                        max_age=0,
                        domain=server_config['domain'])

    response.set_cookie(key="atoken",
                        expires=0,
                        max_age=0,
                        domain=server_config['domain'])

    response.set_cookie(key="permissions",
                        expires=0,
                        max_age=0,
                        domain=server_config['domain'])

    return response
