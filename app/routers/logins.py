from pprint import pprint

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Field, Session, SQLModel, create_engine, select
from starlette.responses import JSONResponse
from sqlalchemy.exc import NoResultFound
from typing import Union
from xmlrpc.client import boolean

from app.database import get_session
from app.utils.globalMethods import AuthNZCheck

# LOGINS ROUTES ARE OPEN

router = APIRouter(
    tags=["logins"],
    dependencies=[Depends(AuthNZCheck("logins", True))]
)


@router.get("/logins_per_idp")
async def read_logins_per_idp(
        *,
        request: Request,
        session: Session = Depends(get_session),
        offset: int = 0,
        sp: str = None,  # type: ignore
        startDate: str = None,  # type: ignore
        endDate: str = None,  # type: ignore
        tenenv_id: int,
        unique_logins: Union[boolean, None] = False,
):
    interval_subquery = ""
    sp_subquery_join = ""
    if sp:
        # Is the user authenticated?
        AuthNZCheck("logins", False)

        # Fetch the data
        sp_subquery_join = """
            JOIN serviceprovidersmap ON serviceprovidersmap.id=serviceid
            AND serviceprovidersmap.tenenv_id=statistics_country_hashed.tenenv_id
            AND serviceprovidersmap.tenenv_id={1}
            AND serviceid = '{0}'
            """.format(
            sp, tenenv_id
        )

    if startDate and endDate:
        interval_subquery = """
            AND date BETWEEN '{0}' AND '{1}'
        """.format(startDate, endDate)
    if unique_logins == False:
        sub_select = """
            sum(count) as count
        """
    else:
        sub_select = """
            count(DISTINCT hasheduserid) as count
        """
    logins = session.exec("""
        select identityprovidersmap.id, identityprovidersmap.name, entityid, sourceidpid, {0}
        from statistics_country_hashed
        join identityprovidersmap ON identityprovidersmap.id=sourceidpid  
            AND identityprovidersmap.tenenv_id=statistics_country_hashed.tenenv_id
        {1}
        WHERE statistics_country_hashed.tenenv_id = {2}
        {3}
        GROUP BY identityprovidersmap.id, sourceidpid, identityprovidersmap.name, entityid
        ORDER BY count DESC
        """.format(
        sub_select, sp_subquery_join, tenenv_id, interval_subquery
    )
    ).all()

    return logins


@router.get("/logins_per_sp")
async def read_logins_per_sp(
        *,
        session: Session = Depends(get_session),
        request: Request,
        offset: int = 0,
        idp: str = None,
        startDate: str = None,
        endDate: str = None,
        tenenv_id: int,
        unique_logins: Union[boolean, None] = False,
):
    interval_subquery = ""
    idp_subquery_join = ""
    if idp:
        # Is the user authenticated?
        AuthNZCheck("logins", False)

        # Fetch the data
        idp_subquery_join = """
              JOIN identityprovidersmap ON identityprovidersmap.id=sourceidpid
              AND identityprovidersmap.tenenv_id=statistics_country_hashed.tenenv_id
              AND identityprovidersmap.tenenv_id={1}
              AND identityprovidersmap.id = '{0}'
              """.format(
            idp, tenenv_id
        )

    if startDate and endDate:
        interval_subquery = """
            AND date BETWEEN '{0}' AND '{1}'
        """.format(startDate, endDate)

    if unique_logins == False:
        sub_select = """
            sum(count) as count
        """
    else:
        sub_select = """
            count(DISTINCT hasheduserid) as count
        """

    logins = session.exec("""    
            select serviceprovidersmap.id, serviceprovidersmap.name, identifier, serviceid, {0}
            from statistics_country_hashed
            join serviceprovidersmap ON serviceprovidersmap.id=serviceid 
                AND serviceprovidersmap.tenenv_id=statistics_country_hashed.tenenv_id
            {1}
            WHERE statistics_country_hashed.tenenv_id = {2}
            {3}
            GROUP BY serviceprovidersmap.id, serviceid, serviceprovidersmap.name, identifier
            ORDER BY count DESC
        """.format(
        sub_select, idp_subquery_join, tenenv_id, interval_subquery
    )
    ).all()
    return logins


@router.get("/logins_per_country")
async def read_logins_per_country(
        *,
        session: Session = Depends(get_session),
        offset: int = 0,
        group_by: Union[str, None] = None,
        startDate: str = None,
        endDate: str = None,
        tenenv_id: int,
        unique_logins: Union[boolean, None] = False,
        idpId: Union[int, None] = None,
        spId: Union[int, None] = None,
):
    interval_subquery = ""
    entity_subquery = ""
    sp_subquery = ""
    if idpId:
        entity_subquery = """
            AND sourceidpid = {0}
        """.format(idpId)
    if spId:
        sp_subquery = """
            AND serviceid = {0}
        """.format(spId)
    if group_by:
        if startDate and endDate:
            interval_subquery = """
                AND date BETWEEN '{0}' AND '{1}'
            """.format(startDate, endDate)

        if unique_logins == False:
            sub_select = """
                sum(count) as count_country
            """
            sum = "sum(count)"
        else:
            sub_select = """
                count(DISTINCT hasheduserid) as count_country
            """
            sum = "count(DISTINCT hasheduserid)"
        logins = session.exec("""
        SELECT range_date, sum(count_country) as count, min(min_login_date) as min_date, STRING_AGG(country, '|| ') as countries 
        FROM (
            SELECT date_trunc('{0}', date) as range_date, min(date) as min_login_date, {1}, CONCAT(country,': ',{2}) as country
            from statistics_country_hashed
            JOIN country_codes ON countryid=country_codes.id
            WHERE tenenv_id = {3}
            {4} {5} {6}
            GROUP BY range_date, country
            ORDER BY range_date,country ASC
            ) country_logins
        GROUP BY range_date
        """.format(
            group_by,
            sub_select,
            sum,
            tenenv_id,
            interval_subquery,
            entity_subquery,
            sp_subquery,
        )
        ).all()
    else:
        if startDate and endDate:
            interval_subquery = """
                AND date BETWEEN '{0}' AND '{1}'
            """.format(startDate, endDate)

        if unique_logins == False:
            sub_select = """
                sum(count) as sum
            """
        else:
            sub_select = """
                count(DISTINCT hasheduserid) as sum
            """
        logins = session.exec(""" 
                SELECT country, countrycode, {0}
                FROM statistics_country_hashed
                JOIN country_codes ON countryid=country_codes.id
                WHERE tenenv_id = {1}
                    {2} {3} {4}
                GROUP BY country,countrycode
            """.format(
            sub_select, tenenv_id, interval_subquery, entity_subquery, sp_subquery
        )
        ).all()
    return logins


@router.get("/logins_countby")
async def read_logins_countby(
        *,
        session: Session = Depends(get_session),
        offset: int = 0,
        interval: Union[str, None] = None,
        count_interval: int = None,
        tenenv_id: int,
        unique_logins: Union[boolean, None] = False,
        idpId: Union[int, None] = None,
        spId: Union[int, None] = None,
):
    interval_subquery = ""
    idp_subquery = ""
    sp_subquery = ""
    if interval and count_interval:
        interval_subquery = """AND date >
        CURRENT_DATE - INTERVAL '{0} {1}'""".format(count_interval, interval)
    if idpId:
        idp_subquery = """
            AND sourceidpid = '{0}'
        """.format(idpId)
    if spId:
        sp_subquery = """
            AND serviceid = '{0}'
        """.format(spId)
    if unique_logins == False:
        logins = session.exec("""
            select sum(count) as count
            from statistics_country_hashed WHERE tenenv_id={0}
            {1} {2} {3}
        """.format(
            tenenv_id, interval_subquery, idp_subquery, sp_subquery
        )
        ).all()
    else:
        logins = session.exec("""
            select count(DISTINCT hasheduserid) as count
            from statistics_country_hashed WHERE tenenv_id={0}
            {1} {2} {3}
        """.format(
            tenenv_id, interval_subquery, idp_subquery, sp_subquery
        )
        ).all()
    return logins


@router.get("/logins_groupby/{group_by}")
async def read_logins_groupby(
        *,
        session: Session = Depends(get_session),
        request: Request,
        offset: int = 0,
        group_by: str,
        idp: str = None,
        sp: str = None,
        tenenv_id: int,
        unique_logins: Union[boolean, None] = False,
):
    days_seq_table = """
        with days as (select generate_series(
                                 (select date_trunc('day', min(date))
                                  from statistics_country_hashed
                                  where statistics_country_hashed.tenenv_id = {0})::timestamp,
                                 (select date_trunc('day', max(date))
                                  from statistics_country_hashed
                                  where statistics_country_hashed.tenenv_id = {0}),
                                 '1 day'::interval
                             ) as day)
    """.format(tenenv_id)

    interval_subquery = ""
    if idp != None:
        # Is the user authenticated?
        AuthNZCheck("logins", False)

        # Fetch the data
        interval_subquery = """ 
            JOIN identityprovidersmap ON sourceidpid=identityprovidersmap.id
                AND identityprovidersmap.tenenv_id=statistics_country_hashed.tenenv_id
            WHERE identityprovidersmap.id = '{0}'
        """.format(idp)
    elif sp != None:
        # Is the user authenticated?
        AuthNZCheck("logins", False)

        # Fetch the data
        interval_subquery = """ 
            JOIN serviceprovidersmap ON serviceid=serviceprovidersmap.id
                AND serviceprovidersmap.tenenv_id=statistics_country_hashed.tenenv_id
            WHERE serviceprovidersmap.id = '{0}'
        """.format(sp)
    if interval_subquery == "":
        interval_subquery = (
            """WHERE statistics_country_hashed.tenenv_id = {0}""".format(tenenv_id)
        )
    else:
        interval_subquery += (
            """ AND statistics_country_hashed.tenenv_id = {0} """.format(tenenv_id)
        )
    logins_count_raw = """
              select sum(count) as count, date_trunc('{0}', date) as date
              from statistics_country_hashed
              {1}
              GROUP BY date_trunc('{0}', date)
              ORDER BY date_trunc('{0}', date) ASC
          """.format(group_by, interval_subquery)
    if unique_logins is True:
        logins_count_raw = """
            select count(DISTINCT hasheduserid) as count, date_trunc('{0}', date) as date
            from statistics_country_hashed
            {1}
            GROUP BY date_trunc('{0}', date)
            ORDER BY date_trunc('{0}', date) ASC
        """.format(group_by, interval_subquery)

    # print("""
    #         {0},
    #         logins_count as ({1})
    #         select days.day as date, logins_count.count as count
    #         from days left join logins_count on logins_count.date = days.day
    #         ORDER BY date ASC;
    # """.format(days_seq_table, logins_count_raw))

    logins = session.exec("""
            {0},
            logins_count as ({1})
            select days.day as date, logins_count.count as count
            from days left join logins_count on logins_count.date = days.day
            ORDER BY date ASC;
    """.format(days_seq_table, logins_count_raw)).all()
    return logins
