[database_parameters]
database_url=postgresql+psycopg2://rciam:secret@db/metrics_dev
db=metrics_dev
db_admin=rciam
db_password=secret

[oidc_client]
client_id=43d15851-40f5-4a3b-b3c0-c5bba5f05096
client_secret=6N4AOEbgcveaIvViCa2XSJL-RNtxtkwMNq6wNormK7E-hXnFkqNHPfVshCK6G1nySie7ZAWW0xrRyMXWbr3Vibs
issuer=https://aai-dev.egi.eu/auth/realms/egi
openid_connect_url=https://aai-dev.egi.eu/auth/realms/egi/.well-known/openid-configuration
idtoken_model=KeycloakIDToken
redirect_uri=http://localhost:8004/callback