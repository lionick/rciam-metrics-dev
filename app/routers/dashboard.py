from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Field, Session, SQLModel, create_engine, select
from typing import Union
from xmlrpc.client import boolean

from app.database import get_session
from app.utils.globalMethods import AuthNZCheck

router = APIRouter(
    tags=["dashboard"],
    dependencies=[Depends(AuthNZCheck("dashboard"))]
)

@router.get("/tenenv/{tenant_name}/{environment_name}")
async def read_tenenv_byname(
        *,
        session: Session = Depends(get_session),
        offset: int = 0,
        tenant_name: str,
        environment_name: str
):
    tenenv = None
    if tenant_name and environment_name:
        tenenv = session.exec("""
            SELECT * FROM tenenv_info 
            JOIN tenant_info ON tenant_info.id=tenant_id
                AND LOWER(tenant_info.name)=LOWER('{0}')
            JOIN environment_info ON environment_info.id=env_id
                AND LOWER(environment_info.name)=LOWER('{1}')
        """.format(tenant_name, environment_name)).all()
    return tenenv


@router.get("/environment_byname/{environment_name}")
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


@router.get("/idps")
async def read_idps(
        *,
        session: Session = Depends(get_session),
        tenenv_id: int,
        idpId: int = None
):
    idpId_subquery = ""
    if idpId:
        idpId_subquery = """
            AND id = {0}
        """.format(idpId)
    idps = session.exec("""
            SELECT * FROM identityprovidersmap 
            WHERE tenenv_id='{0}' {1}
        """.format(tenenv_id, idpId_subquery)).all()
    return idps


@router.get("/sps")
async def read_sps(
        *,
        session: Session = Depends(get_session),
        tenenv_id: int,
        spId: int = None
):
    spId_subquery = ""
    if spId:
        spId_subquery = """
            AND id = {0}
        """.format(spId)
    sps = session.exec("""
            SELECT * FROM serviceprovidersmap 
            WHERE tenenv_id='{0}' {1}
        """.format(tenenv_id, spId_subquery)).all()
    return sps
