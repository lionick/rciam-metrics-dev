from fastapi import APIRouter, Depends, HTTPException, status, Security, Request, Depends
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import json, jwt, requests
from app.utils import configParser, globalMethods
import urllib.parse
from starlette.responses import HTMLResponse, RedirectResponse
from authlib.integrations.starlette_client import OAuth, OAuthError
from authlib.integrations.requests_client import OAuth2Session

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


async def validate_client_credentials(client_id: str, client_secret: str):

    # TODO: Tenant hardcoded for now
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


    # oauth_session = OAuth2Session(client_id="metrics-api-client",
    #     client_secret="qjwjgA2IArAeqpDJGvzaTrlpBCqeB3tyIOS28FbEBrSnEJKtCdZzjle9E17oaEcH9WQ1muJxbwXV3qeBKjXnD8T",
    #     scope="openid voperson_id eduperson_entitlement")
    attributes=dir(client)
    # Print all attributes
    for attribute in attributes:
        print(attribute)
        #print(client[attribute])

    # load server metadata
    client_metadata = await client.load_server_metadata()
    
    oauth_session = OAuth2Session(client_id=client.client_id,
                                  client_secret=client.client_secret,
                                  token_endpoint=client_metadata.get('token_endpoint'),
                                  scope="openid voperson_id eduperson_entitlement")
    
    # Fetch an access token using client credentials grant type
    token = oauth_session.fetch_token(url=client_metadata.get('token_endpoint'),
                                      grant_type='client_credentials'
                                      )

    
    # token = await client.fetch_access_token()
    print(token["access_token"])
    claims = oauth_session.introspect_token(url=client_metadata.get('introspection_endpoint'), token=token["access_token"])
    print(claims.json())
    # try:
        
    # except Exception as e:
    #     raise HTTPException(status_code=401, detail="Invalid token")
    
    
    # # Define the proxy's authentication endpoint URL
    # authentication_url = "https://aai-dev.egi.eu/auth/realms/egi/protocol/openid-connect/token"

    # # Prepare the request payload with client ID and secret
    # payload = {
    #     "grant_type": "client_credentials",
    #     "client_id": "metrics-api-client",
    #     "client_secret": "qjwjgA2IArAeqpDJGvzaTrlpBCqeB3tyIOS28FbEBrSnEJKtCdZzjle9E17oaEcH9WQ1muJxbwXV3qeBKjXnD8T",
    #     "scope": "openid voperson_id eduperson_entitlement"
    # }

    # headers = {
    #     "Content-Type": "application/x-www-form-urlencoded"
    # }
    # print(payload)
    # # Make a POST request to the proxy's authentication endpoint
    # response = requests.post(authentication_url, data=payload, headers=headers)

    # # response = requests.post(authentication_url, {
    # #   'headers': headers,
    # #   'form_params': payload
    # # })
    # response_data = response.json()
    # print(response_data)
    # access_token = response_data.get("access_token")
    # # Decode the token payload
    # decoded_payload = jwt.decode(access_token, algorithms=["HS256"], options={"verify_signature": False})

    # # Print the decoded payload
    # print(decoded_payload)
    # if access_token:
    #     print("Access Token:", access_token)
    # else:
    #     print("Access Token not found in the response.")

    # print(authorize_access_token(access_token))
    raise HTTPException(status_code=401, detail="Invalid client credentials")
    # Check the response status code
      # if response.status_code != 200:
      #     raise HTTPException(status_code=401, detail="Invalid client credentials")

    # Additional validation logic based on the proxy's response
    # ...
    
    raise HTTPException(status_code=401, detail="Invalid client credentials")
    # Successful validation
    return
