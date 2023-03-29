from fastapi import APIRouter, Depends, HTTPException, status, Security, Request
from pydantic import BaseModel
from typing import List, Optional, TYPE_CHECKING

from app.utils import configParser
import json
from starlette.config import Config
from authlib.integrations.starlette_client import OAuth

router = APIRouter(
    tags=["authenticate"],
    # dependencies=[Depends(get_token_header)],
    # responses={404: {"description": "Not found"}},
)

OIDC_config = configParser.getConfig('oidc_client')
# auth = Auth(
#     openid_connect_url=OIDC_config['openid_connect_url'],
#     issuer=OIDC_config['issuer'],
#     client_id=OIDC_config['client_id'],
#     redirect_uri=OIDC_config['redirect_uri'],
#     idtoken_model=OIDC_config['idtoken_model'],
#     scopes=["openid", "email", "profile", "eduperson_entitlement"],
#     grant_types=[GrantType.AUTHORIZATION_CODE]
# )

config = Config('.env')
oauth = OAuth(config)

oauth.register(
    'rciam',
    client_id=OIDC_config['client_id'],
    client_secret=OIDC_config['client_secret'],
    server_metadata_url=OIDC_config['openid_connect_url'],
    client_kwargs={'scope': 'openid profile email eduperson_entitlement'}
)

# openid_configuration = requests.get(OIDC_config['openid_connect_url']).json()
#
# @router.get('/login'):
# async def login_endpoint():
#     session = OAuth2Session(OIDC_config['client_id'], OIDC_config['client_secret'],
#                             token_endpoint=openid_configuration["token_endpoint"])
#     uri, state = session.create_authorization_url(openid_configuration["authorization_endpoint"])
#     print(uri)

@router.get('/login')
async def login_endpoint(request: Request):
    rciam = oauth.create_client('rciam')
    redirect_uri = request.url_for('authorize_rciam')
    return await rciam.authorize_redirect(request, redirect_uri)

@router.get('/auth', include_in_schema=False)
async def authorize_rciam(request: Request):
    rciam = oauth.create_client('rciam')
    token = await rciam.authorize_access_token(request)
    # do something with the token and userinfo
    print(token['userinfo'])

# @router.get('/logout')
# async def logout(request):
#     request.session.pop('user', None)
#     return RedirectResponse(url='/')
