import os
import sys

from xmlrpc.client import boolean
from fastapi import Depends, FastAPI, HTTPException, Query, Request, HTTPException, status
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from sqlmodel import Field, Session, SQLModel, create_engine, select
from sqlalchemy import func
from sqlalchemy.orm import selectinload

from app.database import get_session
from app.models.community_info_model import *
from app.models.community_model import *
from app.models.member_model import *
from app.models.service_model import *
from app.models.country_model import *
from app.models.idp_model import *
from app.models.country_hashed_user_model import *

from .routers import authenticate, communities, countries, logins, users, dashboard
from app.utils import configParser


sys.path.insert(0, os.path.realpath('__file__'))
# Development Environment: dev
environment = os.getenv('API_ENVIRONMENT')
SERVER_config = configParser.getConfig('server_config')

# Instantiate app according to the environment configuration
app = FastAPI() if environment == "dev" else FastAPI(root_path="/api/v1",
                                                     root_path_in_servers=False,
                                                     servers=[{"url": "/api/v1"}])


if environment == "dev":
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.add_middleware(SessionMiddleware,
                   secret_key="some-random-string")

CommunityReadwithInfo.update_forward_refs(
    Community_InfoRead=Community_InfoRead)
Statistics_Country_HashedwithInfo.update_forward_refs(
    IdentityprovidersmapRead=IdentityprovidersmapRead,
    ServiceprovidersmapRead=ServiceprovidersmapRead,
    Country_CodesRead=Country_CodesRead)

app.include_router(authenticate.router)
app.include_router(users.router)
app.include_router(communities.router)
app.include_router(countries.router)
app.include_router(logins.router)
app.include_router(dashboard.router)


