from pprint import pprint
import requests as reqs
from fastapi import Depends, FastAPI, HTTPException, Query, Request, HTTPException, status, Response
import json, jwt

from app.utils import configParser
from authlib.integrations.starlette_client import OAuth, OAuthError

# TODO: Tenenv hardcoded for now
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


# https://www.fastapitutorial.com/blog/class-based-dependency-injection/
class AuthNZCheck:
    def __init__(self, tag: str = ""):
        self.tag = tag

    async def __call__(self, request: Request, response: Response):
        response.headers["Access-Control-Expose-Headers"] = "X-Permissions, X-Authenticated"

        # permissions calculation
        access_token = request.headers.get('x-access-token')
        rciam = oauth.create_client('rciam')
        metadata = await rciam.load_server_metadata()

        headers = {'Authorization': f'Bearer {access_token}'}
        resp = reqs.get(metadata['userinfo_endpoint'], headers=headers)

        # Authentication
        if resp.status_code == 401:
            # For now we skip logins and dashboard routes
            if self.tag == 'logins' or self.tag == 'dashboard':
                permissions = permissionsCalculation()
                permissions_json = json.dumps(permissions).replace(" ", "").replace("\n", "")
                pprint(permissions_json)
                response.headers["X-Permissions"] = permissions_json
                response.headers["X-Authenticated"] = "false"
                return

            raise HTTPException(
                status_code=401,
                detail="Authentication failed",
                headers={
                    "X-Authenticated": "false",
                    "Access-Control-Expose-Headers": "X-Permissions, X-Authenticated"
                }
            )
        else:
            try:
                resp.raise_for_status()
                data = resp.json()
            except Exception as er:
                # TODO: Log here
                raise HTTPException(status_code=500)

        # Authorization
        permissions = permissionsCalculation(data)
        permissions_json = json.dumps(permissions).replace(" ", "").replace("\n", "")

        # Add the permission to a custom header field
        response.headers["X-Permissions"] = permissions_json
        response.headers["X-Authenticated"] = "true"

        if bool(self.tag):
            # Currently we only care about view
            if permissions['actions'][self.tag]['view'] == False:
                HTTPException(status_code=403)


def permissionsCalculation(user_info = None):
    user_entitlements = {}
    if user_info is not None:
        user_entitlements = user_info.get('eduperson_entitlement')

    roles = {
        'anonymous': True,
        'authenticated': False,
        'administrator': False
    }

    for ent, role in entitlements_config.items():
        if user_entitlements is not None and ent in user_entitlements:
            # Reset the default anonymous role
            roles['anonymous'] = False
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
        'logins': {
            'view': True,
            'write': True
        },
        'registered_users': {
            'view': False,
            'write': False
        },
        'communities': {
            'view': False,
            'write': False
        },
        'statistics_raw': {
            'views': False,
            'write': False,
        }
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


def hasAction(user_actions, category, action):
    if (user_actions[category][action] is True):
        return True
    return False
