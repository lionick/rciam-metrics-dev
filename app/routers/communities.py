from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Field, Session, SQLModel, create_engine, select
from typing import Union

from app.database import get_session
from app.models.community_info_model import *
from app.models.community_model import *
from app.models.member_model import MembersReadWithCommunityInfo
from app.utils.globalMethods import AuthNZCheck


MembersReadWithCommunityInfo.update_forward_refs(
    Community_InfoRead=Community_InfoRead)

router = APIRouter(
    tags=["communities"],
    dependencies=[Depends(AuthNZCheck("communities"))]
)

@router.get("/members/", response_model=List[MembersReadWithCommunityInfo])
async def read_members(
        *,
        session: Session = Depends(get_session),
        offset: int = 0,
        # community_id: Union[None, int] = None
):
    # if not community_id:
    #     members = session.exec(select(Members).offset(offset)).all()
    # else:
    members = session.exec(select(Members).offset(offset)).all()
    return members

@router.get("/min_date_communities")
async def read_min_date_communities(
        *,
        session: Session = Depends(get_session),
        offset: int = 0,
        tenenv_id: int,
):
    min_date = session.exec("""
             SELECT min(created) as min_date 
             FROM community
             WHERE tenenv_id={0}
          """.format(tenenv_id)).one()
    return min_date
@router.get("/members_bystatus/")
async def read_members_bystatus(
        *,
        session: Session = Depends(get_session),
        offset: int = 0,
        community_id: Union[None, int] = None,
        tenenv_id: int,
):
    if not community_id:
        members = session.exec(select(Members).offset(offset)).all()
    else:
        # members = session.exec(select(Members).offset(offset)).all()
        members = session.exec("""
             SELECT count(*) as count, community_id, status FROM members 
             WHERE community_id={0} AND tenenv_id={1}
             GROUP BY community_id, status
          """.format(community_id, tenenv_id)).all()
        # members = session.exec(""" SELECT community_id FROM members """)
    return members


@router.get("/communities_groupby/{group_by}")
async def read_communities(
        *,
        session: Session = Depends(get_session),
        offset: int = 0,
        group_by: str,
        tenenv_id: int,
        interval: Union[str, None] = None,
        count_interval: int = None,
        startDate: str = None,
        endDate: str = None,
):
    interval_subquery = ""
    if group_by:
        if interval and count_interval:
            interval_subquery = """WHERE created >
        date_trunc('{0}', CURRENT_DATE) - INTERVAL '{1} {2}'""".format(group_by, count_interval, interval)
        if startDate and endDate:
            interval_subquery = """
                WHERE created BETWEEN '{0}' AND '{1}'
            """.format(startDate, endDate)
        if interval_subquery == "":
            interval_subquery = """
                WHERE community.tenenv_id={0}
            """.format(tenenv_id)
        else:
            interval_subquery += """ AND community.tenenv_id={0} 
            """.format(tenenv_id)

        communities = session.exec("""
        select count(*) as count, date_trunc( '{0}', created ) as range_date, 
            min(created) as min_date , string_agg(name,'|| ') as names, 
            string_agg(to_char(created, 'YYYY-MM-DD'),', ') as created_date, 
            string_agg(description,'|| ') as description
        from community
        join community_info on community.community_id=community_info.id
        {1}
        group by range_date
        ORDER BY range_date ASC
        """.format(group_by, interval_subquery)).all()
    return communities


@router.get("/communities/")
async def read_community(
        *,
        session: Session = Depends(get_session),
        community_id: Union[None, int] = None,
        tenenv_id: int):
    sql_subquery = ''
    if community_id:
        sql_subquery = 'id={0} and'.format(community_id)
    community = session.exec("""
        SELECT * FROM community_info WHERE {0} tenenv_id={1}
    """.format(sql_subquery, tenenv_id)).all()
    # statement = select(Community).options(selectinload(Community.community_info))
    # result = session.exec(statement)
    # community = result.one()
    # if not community:
    #     raise HTTPException(status_code=404, detail="Community not found")
    return community


@router.get("/communities_info/", response_model=List[Community_InfoRead])
async def read_communities_info(
        *,
        session: Session = Depends(get_session),
        offset: int = 0
):
    communities = session.exec(select(Community_Info).offset(offset)).all()
    return communities
