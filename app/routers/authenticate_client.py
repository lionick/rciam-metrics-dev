from fastapi import APIRouter, Depends, HTTPException, status, Security, Request, Depends
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import json, jwt, requests
from app.utils import configParser, globalMethods
import urllib.parse
from starlette.responses import HTMLResponse, RedirectResponse
from authlib.integrations.starlette_client import OAuth, OAuthError
from authlib.integrations.requests_client import OAuth2Session

# This client validation is used for pushing statistics_raw data to metrics
async def validate_client_credentials(client_id: str, client_secret: str):

    # TODO: Tenenv hardcoded for now
    OIDC_config = configParser.getConfig('oidc_client_egi')
    SERVER_config = configParser.getConfig('server_config')

    oauth_client = OAuth()
    oauth_client.register(
        client_id,
        # client_id=client_id,
        # client_secret=client_secret,
        client_id="metrics-api-client",
        client_secret="qjwjgA2IArAeqpDJGvzaTrlpBCqeB3tyIOS28FbEBrSnEJKtCdZzjle9E17oaEcH9WQ1muJxbwXV3qeBKjXnD8T",
        server_metadata_url=OIDC_config['issuer'] + "/.well-known/openid-configuration",
        client_kwargs={'scope': 'openid voperson_id eduperson_entitlement'}
    )
    client = oauth_client.create_client(client_id)

    # Load server metadata
    client_metadata = await client.load_server_metadata()

    oauth_session = OAuth2Session(client_id=client.client_id,
                                  client_secret=client.client_secret,
                                  token_endpoint=client_metadata.get('token_endpoint'),
                                  scope="openid voperson_id eduperson_entitlement")

    # Fetch an access token using client credentials grant type
    token = oauth_session.fetch_token(url=client_metadata.get('token_endpoint'),
                                      grant_type='client_credentials'
                                      )

    access_token = token["access_token"]

    # Get claims from introspection endpoint
    claims = oauth_session.introspect_token(url=client_metadata.get('introspection_endpoint'), token=access_token)
    claims_json = claims.json()

    is_token_active = claims_json.get("active", False)

    # Check if token is active
    if is_token_active:
        # Perform additional authorization checks based on roles, permissions, etc.
        permissions = globalMethods.permissionsCalculation(claims_json)
        if (globalMethods.hasAction(permissions["actions"],
                                    'statistics_raw',
                                    'write')):
            print("authorized")
            return

    raise HTTPException(status_code=401, detail="Invalid client credentials")
