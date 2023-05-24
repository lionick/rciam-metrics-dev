from fastapi import APIRouter, Depends, HTTPException, Query
from app.database import get_session
from sqlmodel import Field, Session, SQLModel, create_engine, select
from typing import Union

from app.models.country_model import *
from app.models.country_hashed_user_model import *
from app.utils.globalMethods import AuthNZCheck


# from ..dependencies import get_token_header

router = APIRouter(
    tags=["countries"],
    dependencies=[Depends(AuthNZCheck)],
    # responses={404: {"description": "Not found"}},
)


@router.get("/countries/", response_model=List[Country_CodesRead])
async def read_countries(
        *,
        session: Session = Depends(get_session),
        offset: int = 0
):
    countries = session.exec(select(Country_Codes).offset(offset)).all()
    return countries


@router.get("/country_stats/", response_model=List[Statistics_Country_HashedwithInfo])
async def read_country_stats(
        *,
        session: Session = Depends(get_session),
        offset: int = 0
):
    stats = session.exec(
        select(Statistics_Country_Hashed).offset(offset)).all()
    return stats


@router.get("/country_stats_by_vo/{community_id}")
async def read_country_stats_by_vo(
        *,
        session: Session = Depends(get_session),
        offset: int = 0,
        community_id: Union[None, int] = None
):
    stats = []
    stats_country = session.exec("""
    WITH users_countries AS (
        SELECT statistics_country_hashed.hasheduserid as userid, status, country, countrycode, count(*) as sum_count
        FROM statistics_country_hashed
        JOIN members ON members.hasheduserid=statistics_country_hashed.hasheduserid
        JOIN country_codes ON countryid=country_codes.id
        WHERE community_id={0} AND country!='Unknown'
        GROUP BY userid, status, country, countrycode
    ),
    max_count_users_countries AS (
        SELECT DISTINCT userid, status, max(sum_count) as max_sum_count,row_number() OVER (ORDER BY userid, status) as row_number 
        FROM users_countries
        GROUP BY  userid, status
    )
    SELECT country,countrycode,count(*) as sum 
    FROM users_countries
    JOIN (
            SELECT userid, status, max_sum_count, max(row_number) 
            FROM max_count_users_countries GROUP BY userid, status, max_sum_count 
         ) max_count_users_countries_no_duplicates
    ON users_countries.userid=max_count_users_countries_no_duplicates.userid 
        AND users_countries.sum_count=max_count_users_countries_no_duplicates.max_sum_count
    GROUP BY country,countrycode
    ORDER BY country;
          """.format(community_id)).all()
    status_per_country = session.exec("""
    WITH users_countries AS (
        SELECT statistics_country_hashed.hasheduserid as userid, status, country, countrycode, count(*) as sum_count
        FROM statistics_country_hashed
        JOIN members ON members.hasheduserid=statistics_country_hashed.hasheduserid
        JOIN country_codes ON countryid=country_codes.id
        WHERE community_id={0} AND country!='Unknown'
        GROUP BY userid, status, country, countrycode
    ),
    max_count_users_countries AS (
        SELECT DISTINCT userid, status, max(sum_count) as max_sum_count, row_number() OVER (ORDER BY userid, status) as row_number 
        FROM users_countries
        GROUP BY  userid, status
    )
    SELECT country,countrycode, users_countries.status, count(*) as sum 
    FROM users_countries
    JOIN (
            SELECT userid, status, max_sum_count, max(row_number) 
            FROM max_count_users_countries GROUP BY userid, status, max_sum_count 
         ) max_count_users_countries_no_duplicates
    ON users_countries.userid=max_count_users_countries_no_duplicates.userid 
        AND users_countries.sum_count=max_count_users_countries_no_duplicates.max_sum_count
    GROUP BY country,countrycode, users_countries.status
    ORDER BY country;
        """.format(community_id)).all()
    stats.append(stats_country)
    stats.append(status_per_country)
    return stats
