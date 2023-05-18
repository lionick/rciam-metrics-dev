from pprint import pprint
import requests as reqs
from fastapi import Depends, FastAPI, HTTPException, Query, Request, HTTPException, status

from app.utils import configParser
from authlib.integrations.starlette_client import OAuth, OAuthError

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

async def is_authenticated(request: Request):
    access_token = request.headers.get('x-access-token')
    try:
        rciam = oauth.create_client('rciam')
        metadata = await rciam.load_server_metadata()

        headers = {'Authorization': f'Bearer {access_token}'}
        resp = reqs.get(metadata['userinfo_endpoint'], headers=headers)
        # pprint(resp)
        # pprint(resp.status_code)
        # pprint(resp.reason)
        resp.raise_for_status()
        data = resp.json()
        pprint(data)
    except Exception as er:
        raise HTTPException(status_code=401)