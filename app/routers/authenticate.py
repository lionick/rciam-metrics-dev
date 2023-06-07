from pprint import pprint

from fastapi import APIRouter, Depends, HTTPException, status, Security, Request, Depends
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import json, jwt, requests
from app.utils import configParser, globalMethods
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
        # todo: the key could become configurable and per tenant
        jwt_user = jwt.encode(payload=user_info_data,
                              key="a custom key",
                              algorithm="HS256")
        # print(jwt_user)

        # XXX The max_age of the cookie is the same as the
        # access token max age which we extract from the token
        # itself
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


def validate_token(token: str = Depends(HTTPBearer())) -> str:
    credentials = token.credentials
    # Perform token validation logic here
    # For example, you can validate the token against a database or check if it's expired
    if not credentials:
        raise HTTPException(status_code=401, detail="Invalid token")
    return credentials

# Validate and authorize the access token
def authorize_access_token(access_token):
    introspect_endpoint = "https://aai-dev.egi.eu/auth/realms/egi/protocol/openid-connect/token/introspect"
    payload = {
        "token": access_token,
        "client_id": "metrics-api-client",
        "client_secret": "qjwjgA2IArAeqpDJGvzaTrlpBCqeB3tyIOS28FbEBrSnEJKtCdZzjle9E17oaEcH9WQ1muJxbwXV3qeBKjXnD8T"
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    print(payload)
    response = requests.post(introspect_endpoint, data=payload, headers=headers)
    print(response.content)
    response.raise_for_status()
    introspect_data = response.json()
    print(introspect_data)
    is_token_active = introspect_data.get("active", False)
    if is_token_active:
        # Perform additional authorization checks based on roles, permissions, etc.
        permissions = globalMethods.permissionsCalculation(introspect_data)
        print(permissions)
        if(permissions['administrator'] is True):
            return True
    return False


def validate_client_credentials(client_id: str, client_secret: str):
    # Define the proxy's authentication endpoint URL
    authentication_url = "https://aai-dev.egi.eu/auth/realms/egi/protocol/openid-connect/token"

    # Prepare the request payload with client ID and secret
    payload = {
        "grant_type": "client_credentials",
        "client_id": "metrics-api-client",
        "client_secret": "qjwjgA2IArAeqpDJGvzaTrlpBCqeB3tyIOS28FbEBrSnEJKtCdZzjle9E17oaEcH9WQ1muJxbwXV3qeBKjXnD8T",
        "scope": "openid voperson_id eduperson_entitlement"
    }

    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    print(payload)
    # Make a POST request to the proxy's authentication endpoint
    response = requests.post(authentication_url, data=payload, headers=headers)

    # response = requests.post(authentication_url, {
    #   'headers': headers,
    #   'form_params': payload
    # })
    response_data = response.json()
    print(response_data)
    access_token = response_data.get("access_token")
    # Decode the token payload
    decoded_payload = jwt.decode(access_token, algorithms=["HS256"], options={"verify_signature": False})

    # Print the decoded payload
    print(decoded_payload)
    if access_token:
        print("Access Token:", access_token)
    else:
        print("Access Token not found in the response.")

    print(authorize_access_token(access_token))

    # Check the response status code
    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid client credentials")

    # Additional validation logic based on the proxy's response
    # ...
    
    raise HTTPException(status_code=401, detail="Invalid client credentials")
    # Successful validation
    return
