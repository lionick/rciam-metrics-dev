from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Field, Session, SQLModel, create_engine, select
from typing import Union

from app.database import get_session
from app.utils.globalMethods import is_authenticated


# from ..dependencies import get_token_header

router = APIRouter(
    tags=["users"],
    dependencies=[Depends(is_authenticated)],
    # responses={404: {"description": "Not found"}},
)


@router.get("/registered_users_country")
async def read_users_country(
        *,
        session: Session = Depends(get_session),
        offset: int = 0,
        startDate: str = None,
        endDate: str = None,
        tenant_id: int
):
    interval_subquery = ""
    if startDate and endDate:
        interval_subquery = """
                WHERE users.created BETWEEN '{0}' AND '{1}'
            """.format(startDate, endDate)
    users_countries = session.exec(
        """WITH users_countries AS (
        SELECT statistics_country_hashed.hasheduserid as userid, country, countrycode, count(*) as sum_count
        FROM statistics_country_hashed
        JOIN country_codes ON countryid=country_codes.id
        WHERE tenant_id = {1}
        GROUP BY userid, country, countrycode
        ),
        max_count_users_countries AS (
            SELECT DISTINCT userid, max(sum_count) as max_sum_count,row_number() OVER (ORDER BY userid) as row_number 
            FROM users_countries
            GROUP BY  userid
        )
        SELECT country,countrycode, count(*) as sum 
            FROM users_countries
            JOIN (
                    SELECT userid, max_sum_count, max(row_number) 
                    FROM max_count_users_countries GROUP BY userid, max_sum_count 
                ) max_count_users_countries_no_duplicates
            ON users_countries.userid=max_count_users_countries_no_duplicates.userid 
                AND users_countries.sum_count=max_count_users_countries_no_duplicates.max_sum_count
            JOIN users ON users.hasheduserid=users_countries.userid AND status='A'
            {0}
            GROUP BY country,countrycode
            ORDER BY country,countrycode
        """.format(interval_subquery, tenant_id)).all()
    return users_countries


@router.get("/registered_users_country_group_by/{group_by}")
async def read_users_country_groupby(
        *,
        session: Session = Depends(get_session),
        offset: int = 0,
        group_by: str,
        startDate: str = None,
        endDate: str = None,
        tenant_id: int
):
    if group_by:
        interval_subquery = ""
        if startDate and endDate:
            interval_subquery = """
                WHERE users.created BETWEEN '{0}' AND '{1}'
            """.format(startDate, endDate)
        users = session.exec(
            """WITH users_countries AS (
        SELECT statistics_country_hashed.hasheduserid as userid, country, countrycode, count(*) as sum_count
        FROM statistics_country_hashed
        JOIN country_codes ON countryid=country_codes.id
        WHERE tenant_id = {2}
        GROUP BY userid, country, countrycode
        ),
        max_count_users_countries AS (
            SELECT DISTINCT userid, max(sum_count) as max_sum_count,row_number() OVER (ORDER BY userid) as row_number 
            FROM users_countries
            GROUP BY  userid
        )
        SELECT range_date, min(created_min_date) as min_date, STRING_AGG(country, '|| ') as countries, sum(sum)  as count
        FROM 
            (
                SELECT date_trunc('{0}', users.created) as range_date, CONCAT(country,': ',count(*)) as country, min(users.created) as created_min_date,  count(*) as sum 
                FROM users_countries
                JOIN (
                        SELECT userid, max_sum_count, max(row_number) 
                        FROM max_count_users_countries GROUP BY userid, max_sum_count 
                    ) max_count_users_countries_no_duplicates
                ON users_countries.userid=max_count_users_countries_no_duplicates.userid 
                    AND users_countries.sum_count=max_count_users_countries_no_duplicates.max_sum_count
                JOIN users ON users.hasheduserid=users_countries.userid AND status='A'
                {1}
                GROUP BY range_date, country,countrycode
                ORDER BY range_date, country
            ) user_country_group_by
        GROUP BY range_date""".format(group_by, interval_subquery, tenant_id)).all()
        return users


@router.get("/registered_users_groupby/{group_by}")
async def read_users_groupby(
        *,
        session: Session = Depends(get_session),
        offset: int = 0,
        group_by: str,
        interval: Union[str, None] = None,
        count_interval: int = None,
        startDate: str = None,
        endDate: str = None,
        tenant_id: int
):
    interval_subquery = ""
    if group_by:
        if interval and count_interval:
            interval_subquery = """AND created >
        date_trunc('{0}', CURRENT_DATE) - INTERVAL '{1} {2}'""".format(group_by, count_interval, interval)
        if startDate and endDate:
            interval_subquery = """
                AND created BETWEEN '{0}' AND '{1}'
            """.format(startDate, endDate)
        users = session.exec("""
        select count(*) as count, date_trunc( '{0}', created ) as range_date, 
            min(created) as min_date
        from users
        WHERE status = 'A' AND tenant_id = {1}
        {2}
        group by range_date
        ORDER BY range_date ASC
        """.format(group_by, tenant_id, interval_subquery)).all()
    return users


@router.get("/registered_users_countby")
async def read_users_countby(
        *,
        session: Session = Depends(get_session),
        offset: int = 0,
        interval: Union[str, None] = None,
        count_interval: int = None,
        tenant_id: int
):
    interval_subquery = ""
    if interval and count_interval:
        interval_subquery = """AND created >
        CURRENT_DATE - INTERVAL '{0} {1}'""".format(count_interval, interval)

    users = session.exec("""
    select count(*) as count
    from users
    WHERE status = 'A' AND tenant_id = {1}
    {0}""".format(interval_subquery, tenant_id)).all()
    return users
