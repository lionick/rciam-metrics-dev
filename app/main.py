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

from .routers import authenticate, communities, countries, logins, users
from app.utils.globalMethods import is_authenticated

sys.path.insert(0, os.path.realpath('__file__'))
# Development Environment: dev
environment = os.getenv('API_ENVIRONMENT')


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


@app.get("/tenant/{project_name}/{environment_name}")
async def read_tenant_byname(
        *,
        session: Session = Depends(get_session),
        offset: int = 0,
        project_name: str,
        environment_name: str
):
    tenant = None
    if project_name and environment_name:
        tenant = session.exec("""
            SELECT * FROM tenant_info 
            JOIN project_info ON project_info.id=project_id
                AND LOWER(project_info.name)=LOWER('{0}')
            JOIN environment_info ON environment_info.id=env_id
                AND LOWER(environment_info.name)=LOWER('{1}')
        """.format(project_name, environment_name)).all()
    return tenant


@app.get("/environment_byname/{environment_name}")
async def read_environment_byname(
        *,
        session: Session = Depends(get_session),
        offset: int = 0,
        environment_name: str
):
    environment = None
    if environment_name:
        environment = session.exec("""
            SELECT * FROM environment_info 
            WHERE name='{0}' LIMIT 1
        """.format(environment_name)).all()
    return environment


@app.get("/idps")
async def read_idps(
        *,
        session: Session = Depends(get_session),
        tenant_id: int,
        idpId: int = None
):
    idpId_subquery = ""
    if idpId:
        idpId_subquery = """
            AND id = {0}
        """.format(idpId)
    idps = session.exec("""
            SELECT * FROM identityprovidersmap 
            WHERE tenant_id='{0}' {1}
        """.format(tenant_id, idpId_subquery)).all()
    return idps


@app.get("/sps")
async def read_sps(
        *,
        session: Session = Depends(get_session),
        tenant_id: int,
        spId: int = None
):
    spId_subquery = ""
    if spId:
        spId_subquery = """
            AND id = {0}
        """.format(spId)
    sps = session.exec("""
            SELECT * FROM serviceprovidersmap 
            WHERE tenant_id='{0}' {1}
        """.format(tenant_id, spId_subquery)).all()
    return sps
