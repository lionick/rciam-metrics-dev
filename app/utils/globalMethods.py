from pprint import pprint
import requests as reqs
from fastapi import Depends, FastAPI, HTTPException, Query, Request, HTTPException, status
from starlette.responses import HTMLResponse, RedirectResponse

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

async def is_authenticated(request: Request,
                           response_class=RedirectResponse):
    access_token = request.headers.get('x-access-token')
    try:
        rciam = oauth.create_client('rciam')
        metadata = await rciam.load_server_metadata()

        headers = {'Authorization': f'Bearer {access_token}'}
        resp = reqs.get(metadata['userinfo_endpoint'], headers=headers)
        # todo: Role Component
        # pprint(resp)
        # pprint(resp.status_code)
        # pprint(resp.reason)
        resp.raise_for_status()
        data = resp.json()
        pprint(data)
    except Exception as er:
        # Force deleting the cookies
        # redirect_uri = SERVER_config['protocol'] + "://" + SERVER_config['client'] + "/egi/devel"
        # request.session.pop('user', None)
        #
        # # Set cookies when returning a RedirectResponse
        # # https://github.com/tiangolo/fastapi/issues/2452
        # response = RedirectResponse(url=redirect_uri)
        # response.set_cookie('userinfo',
        #                     expires=0,
        #                     max_age=0,
        #                     domain=SERVER_config['domain'])
        #
        # response.set_cookie('idtoken',
        #                     expires=0,
        #                     max_age=0,
        #                     domain=SERVER_config['domain'])
        #
        # response.set_cookie(key="atoken",
        #                     expires=0,
        #                     max_age=0,
        #                     domain=SERVER_config['domain'])

        raise HTTPException(status_code=401)


async def rolesCalculation():
    roles = []
    actions = []

    return [roles, actions]