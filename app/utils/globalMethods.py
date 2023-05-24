from pprint import pprint
import requests as reqs
from fastapi import Depends, FastAPI, HTTPException, Query, Request, HTTPException, status, Response

from app.utils import configParser
from authlib.integrations.starlette_client import OAuth, OAuthError

# TODO: Tenant hardcoded for now
OIDC_config = configParser.getConfig('oidc_client_egi')
SERVER_config = configParser.getConfig('server_config')
entitlements_config = configParser.getConfig('entitlements', 'authorize.py')

oauth = OAuth()

oauth.register(
    'rciam',
    client_id=OIDC_config['client_id'],
    client_secret=OIDC_config['client_secret'],
    server_metadata_url=OIDC_config['issuer'] + "/.well-known/openid-configuration",
    client_kwargs={'scope': 'openid profile email voperson_id eduperson_entitlement'}
)

class AuthNZCheck:
    def __init__(self, tag: str = ""):
        self.tag = tag

    async def __call__(self, request: Request):
        access_token = request.headers.get('x-access-token')
        rciam = oauth.create_client('rciam')
        metadata = await rciam.load_server_metadata()

        headers = {'Authorization': f'Bearer {access_token}'}
        resp = reqs.get(metadata['userinfo_endpoint'], headers=headers)
        if resp.status_code == 401:
            HTTPException(status_code=401)
        else:
            resp.raise_for_status()
        data = resp.json()
        permissions = permissionsCalculation(data)
        # pprint(permissions)
        # pprint(permissions['actions'][self.tag]['view'])
        if bool(self.tag):
            # Currently we only care about view
            if permissions['actions'][self.tag]['view'] == False:
                HTTPException(status_code=404)


def permissionsCalculation(user_info):
    user_entitlements = user_info.get('eduperson_entitlement')

    roles = {
        'anonymous': False,
        'authenticated': False,
        'administrator': False
    }

    for ent, role in entitlements_config.items():
        if ent in user_entitlements:
            # The role might be a csv list. So we need to
            # explode and act accordingly
            for item_role in role.split(","):
                roles[item_role] = True

    # pprint(roles)

    actions = {
        'dashboard': {
            'view': False,
            'write': False
        },
        'identity_providers': {
            'view': False,
            'write': False
        },
        'service_providers': {
            'view': False,
            'write': False
        },
        'registered_users': {
            'view': False,
            'write': False
        },
        'communities': {
            'view': False,
            'write': False
        },
    }

    for role in roles.keys():
        if roles[role]:
            role_actions = configParser.getConfig(role, 'authorize.py')
            for view, config_actions in role_actions.items():
                for item in config_actions.split(","):
                    actions[view][item] = True

    return {
        'roles': roles,
        'actions': actions
    }

