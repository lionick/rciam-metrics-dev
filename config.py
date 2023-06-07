[database_parameters]
database_url=postgresql+psycopg2://rciam:secret@db/metrics_dev
db=metrics_dev
db_admin=rciam
db_password=secret

[ip_database_file]
db_filename = GeoLite2-Country.mmdb

[server_config]
protocol = http
host = localhost:8004
client = localhost:3300
domain = localhost
api_path = /

[oidc_client_egi]
client_id = 43d15851-40f5-4a3b-b3c0-c5bba5f05096
client_secret = 6N4AOEbgcveaIvViCa2XSJL-RNtxtkwMNq6wNormK7E-hXnFkqNHPfVshCK6G1nySie7ZAWW0xrRyMXWbr3Vibs
issuer = https://aai-dev.egi.eu/auth/realms/egi
redirect_uri = http://localhost/api/v1/callback