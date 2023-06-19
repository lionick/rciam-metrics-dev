from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Field, Session, SQLModel, create_engine, select
from starlette.responses import JSONResponse
from sqlalchemy.exc import NoResultFound
from .authenticate_client import validate_client_credentials
from typing import Union
from xmlrpc.client import boolean
import hashlib
import json
from app.database import get_session
from app.utils.globalMethods import AuthNZCheck
from app.utils.ipDatabase import geoip2Database

# LOGINS ROUTES ARE OPEN

router = APIRouter(
    tags=["logins"],
    dependencies=[Depends(AuthNZCheck("logins"))]
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
    tenant_id: int,
    unique_logins: Union[boolean, None] = False,
):
    interval_subquery = ""
    sp_subquery_join = ""
    if sp:
        # Is the user authenticated?
        AuthNZCheck(request)

        # Fetch the data
        sp_subquery_join = """
    JOIN serviceprovidersmap ON serviceprovidersmap.id=serviceid
    AND serviceprovidersmap.tenant_id=statistics_country_hashed.tenant_id
    AND serviceprovidersmap.tenant_id={1}
    AND serviceid = '{0}'
    """.format(
            sp, tenant_id
        )

    if startDate and endDate:
        interval_subquery = """
        AND date BETWEEN '{0}' AND '{1}'
    """.format(
            startDate, endDate
        )
    if unique_logins is False:
        sub_select = """
        sum(count) as count
    """
    else:
        sub_select = """
        count(DISTINCT hasheduserid) as count
    """
    logins = session.exec(
        """
    select identityprovidersmap.id, identityprovidersmap.name, entityid, sourceidpid, {0}
    from statistics_country_hashed
    join identityprovidersmap ON identityprovidersmap.id=sourceidpid  
        AND identityprovidersmap.tenant_id=statistics_country_hashed.tenant_id
    {1}
    WHERE statistics_country_hashed.tenant_id = {2}
    {3}
    GROUP BY identityprovidersmap.id, sourceidpid, identityprovidersmap.name, entityid
    ORDER BY count DESC
    """.format(
            sub_select, sp_subquery_join, tenant_id, interval_subquery
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
    tenant_id: int,
    unique_logins: Union[boolean, None] = False,
):
    interval_subquery = ""
    idp_subquery_join = ""
    if idp:
        # Is the user authenticated?
        AuthNZCheck(request)

        # Fetch the data
        idp_subquery_join = """
      JOIN identityprovidersmap ON identityprovidersmap.id=sourceidpid
      AND identityprovidersmap.tenant_id=statistics_country_hashed.tenant_id
      AND identityprovidersmap.tenant_id={1}
      AND identityprovidersmap.id = '{0}'
      """.format(
            idp, tenant_id
        )

    if startDate and endDate:
        interval_subquery = """
          AND date BETWEEN '{0}' AND '{1}'
      """.format(
            startDate, endDate
        )

    if unique_logins is False:
        sub_select = """
          sum(count) as count
      """
    else:
        sub_select = """
          count(DISTINCT hasheduserid) as count
      """

    logins = session.exec(
        """
      select serviceprovidersmap.id, serviceprovidersmap.name, identifier, serviceid, {0}
      from statistics_country_hashed
      join serviceprovidersmap ON serviceprovidersmap.id=serviceid 
          AND serviceprovidersmap.tenant_id=statistics_country_hashed.tenant_id
      {1}
      WHERE statistics_country_hashed.tenant_id = {2}
      {3}
      GROUP BY serviceprovidersmap.id, serviceid, serviceprovidersmap.name, identifier
      ORDER BY count DESC
  """.format(
            sub_select, idp_subquery_join, tenant_id, interval_subquery
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
    tenant_id: int,
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
        """.format(
            idpId
        )
    if spId:
        sp_subquery = """
            AND serviceid = {0}
        """.format(
            spId
        )
    if group_by:
        if startDate and endDate:
            interval_subquery = """
                AND date BETWEEN '{0}' AND '{1}'
            """.format(
                startDate, endDate
            )

        if unique_logins is False:
            sub_select = """
                sum(count) as count_country
            """
            sum = "sum(count)"
        else:
            sub_select = """
                count(DISTINCT hasheduserid) as count_country
            """
            sum = "count(DISTINCT hasheduserid)"
        logins = session.exec(
            """
        SELECT range_date, sum(count_country) as count, min(min_login_date) as min_date, STRING_AGG(country, '|| ') as countries 
        FROM (
            SELECT date_trunc('{0}', date) as range_date, min(date) as min_login_date, {1}, CONCAT(country,': ',{2}) as country
            from statistics_country_hashed
            JOIN country_codes ON countryid=country_codes.id
            WHERE tenant_id = {3}
            {4} {5} {6}
            GROUP BY range_date, country
            ORDER BY range_date,country ASC
            ) country_logins
        GROUP BY range_date
        """.format(
                group_by,
                sub_select,
                sum,
                tenant_id,
                interval_subquery,
                entity_subquery,
                sp_subquery,
            )
        ).all()
    else:
        if startDate and endDate:
            interval_subquery = """
                AND date BETWEEN '{0}' AND '{1}'
            """.format(
                startDate, endDate
            )

        if unique_logins == False:
            sub_select = """
                sum(count) as sum
            """
        else:
            sub_select = """
                count(DISTINCT hasheduserid) as sum
            """
        logins = session.exec(
            """
            SELECT country, countrycode, {0}
            FROM statistics_country_hashed
            JOIN country_codes ON countryid=country_codes.id
            WHERE tenant_id = {1}
                {2} {3} {4}
            GROUP BY country,countrycode
        """.format(
                sub_select, tenant_id, interval_subquery, entity_subquery, sp_subquery
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
    tenant_id: int,
    unique_logins: Union[boolean, None] = False,
    idpId: Union[int, None] = None,
    spId: Union[int, None] = None,
):
    interval_subquery = ""
    idp_subquery = ""
    sp_subquery = ""
    if interval and count_interval:
        interval_subquery = """AND date >
        CURRENT_DATE - INTERVAL '{0} {1}'""".format(
            count_interval, interval
        )
    if idpId:
        idp_subquery = """
            AND sourceidpid = '{0}'
        """.format(
            idpId
        )
    if spId:
        sp_subquery = """
            AND serviceid = '{0}'
        """.format(
            spId
        )
    if unique_logins is False:
        logins = session.exec(
            """
        select sum(count) as count
        from statistics_country_hashed WHERE tenant_id={0}
        {1} {2} {3}""".format(
                tenant_id, interval_subquery, idp_subquery, sp_subquery
            )
        ).all()
    else:
        logins = session.exec(
            """
        select count(DISTINCT hasheduserid) as count
        from statistics_country_hashed WHERE tenant_id={0}
        {1} {2} {3}""".format(
                tenant_id, interval_subquery, idp_subquery, sp_subquery
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
    tenant_id: int,
    unique_logins: Union[boolean, None] = False,
):
    interval_subquery = ""
    if idp is not None:
        # Is the user authenticated?
        AuthNZCheck(request)

        # Fetch the data
        interval_subquery = """
            JOIN identityprovidersmap ON sourceidpid=identityprovidersmap.id
                AND identityprovidersmap.tenant_id=statistics_country_hashed.tenant_id
            WHERE identityprovidersmap.id = '{0}'
        """.format(
            idp
        )
    elif sp is not None:
        # Is the user authenticated?
        AuthNZCheck(request)

        # Fetch the data
        interval_subquery = """
            JOIN serviceprovidersmap ON serviceid=serviceprovidersmap.id
                AND serviceprovidersmap.tenant_id=statistics_country_hashed.tenant_id
            WHERE serviceprovidersmap.id = '{0}'
        """.format(
            sp
        )
    if interval_subquery == "":
        interval_subquery = (
            """WHERE statistics_country_hashed.tenant_id = {0}""".format(tenant_id)
        )
    else:
        interval_subquery += (
            """ AND statistics_country_hashed.tenant_id = {0} """.format(tenant_id)
        )
    if unique_logins is False:
        logins = session.exec(
          """
            select sum(count) as count, date_trunc('{0}', date) as date
            from statistics_country_hashed
            {1}
            GROUP BY date_trunc('{0}', date)
            ORDER BY date_trunc('{0}', date) ASC
          """.format(
                group_by, interval_subquery
            )
        ).all()
    else:
        logins = session.exec(
            """
            select count(DISTINCT hasheduserid) as count, date_trunc('{0}', date) as date
            from statistics_country_hashed
            {1}
            GROUP BY date_trunc('{0}', date)
            ORDER BY date_trunc('{0}', date) ASC
        """.format(
                group_by, interval_subquery
            )
        ).all()
    return logins


# Endpoint for storing statistics raw data
@router.post("/statistics")
async def save_statistics_raw_data(
    request: Request,
    token: str = Depends(validate_client_credentials),
    session: Session = Depends(get_session)
):
    data = {
            "userid": "5510ee31992ab29c9f534c765b09124e",
            "entityid": "https://aai-dev.egi.eu/google/saml2/idp/metadata.php",
            "identifier": "https://aai-dev.egi.eu/oidc2",
            "spName": "EGI AAI OpenID Connect Provider Proxy (DEV)2",
            "idpName": "Google",
            "ipAddress": "2a02:586:2421:da84:983b:22ac:739:9920",
            "date": "2023-05-24 00:12:12",
            "failedLogin": False,
            "type": "login",
            "source": "keycloak_egi",
            "eventIdentifier": 101,
            "tenenvId": 1
            }

    session.exec(
        """
        INSERT INTO statistics_raw(date, type, event_identifier, source,
        tenenv_id, jsondata)
        VALUES ('{0}', '{1}', '{2}', '{3}', '{4}','{5}')
        ON CONFLICT (event_identifier, source, tenenv_id)
        DO NOTHING
        """.format(
            data["date"],
            data["type"],
            data['eventIdentifier'],
            data['source'],
            data['tenenvId'],
            json.dumps(data)
        )
    )
    session.commit()


# Endpoint for storing login's data
@router.post("/logins")
async def post_logins_data(
    request: Request,
    # token: str = Depends(validate_client_credentials),
    session: Session = Depends(get_session),
):
    # Access the request body
    # data = await request.json()
    data = {"realm": "egi",
            "environment": "devel",
            "userid": "5510ee31992ab29c9f534c765b09124e",
            "entityid": "https://aai-dev.egi.eu/google/saml2/idp/metadata.php",
            "identifier": "https://aai-dev.egi.eu/oidc2",
            "spName": "EGI AAI OpenID Connect Provider Proxy (DEV)2",
            "idpName": "Google",
            "ipAddress": "2a02:586:2421:da84:983b:22ac:739:9920",
            "date": "2023-05-24",
            "failedLogin": False
            }
    # Process the data
    # ...
    # Check if tenenv_id exists
    try:
        tenenvId = session.exec(
            """
            SELECT tenenv_info.id FROM tenenv_info
            JOIN tenant_info ON tenant_info.id=tenant_id
              AND LOWER(tenant_info.name)=LOWER('{0}')
            JOIN environment_info ON environment_info.id=env_id
              AND LOWER(environment_info.name)=LOWER('{1}')
            """.format(
                data["realm"], data["environment"]
            )
        ).one()
    except NoResultFound:
        # if tenenv_id doesn't exist return a relevant message
        return JSONResponse(
            {
                "message": "Tenenv {0}/{1} doesn't exist at metrics".format(
                    data["realm"], data["environment"]
                )
            }
        )
    print(tenenvId[0])

    # Check if userid exists
    try:
        hasheduserid = session.exec(
            """
              SELECT hasheduserid FROM users WHERE hasheduserid='{0}' AND tenenv_id={1}
            """.format(
                  # hashlib.md5(data["userid"]).hexdigest() #TypeError: Strings must be encoded before hashing
                  data["userid"], tenenvId[0]
                )
        ).one()
    except NoResultFound:
        return JSONResponse(
            {
                "message":
                    """User with hash {0} doesn't exist at metrics"""
                .format(data["userid"])
            }
        )

    # Check if IdP exists
    try:
        idpId = session.exec(
          """
          SELECT id FROM identityprovidersmap
          WHERE entityid = '{0}' AND tenenv_id={1}
          """.format(
              data["entityid"], tenenvId[0]
          )
        ).one()
    except NoResultFound:
        idpId = session.exec(
            """
            INSERT INTO identityprovidersmap (entityid, name, tenenv_id)
            VALUES  ('{0}', '{1}', {2})
            RETURNING id;
            """.format(
                data["entityid"], data["idpName"], tenenvId[0]
            )
        ).one()
    print(idpId)
    # Check if Sp exists
    try:
        spId = session.exec(
            """
            SELECT * FROM serviceprovidersmap
            WHERE identifier = '{0}' AND tenenv_id={1}
            """.format(
                  data["identifier"], tenenvId[0]
            )
        ).one()
    except NoResultFound:
        # If Sp not exists then add it to database
        spId = session.exec(
            """
            INSERT INTO serviceprovidersmap (identifier, name, tenenv_id)
            SELECT '{0}', '{1}', {2}
            WHERE NOT EXISTS (
                SELECT 1 FROM serviceprovidersmap
                WHERE identifier = '{0}'
            )
            RETURNING id;
            """.format(data["identifier"], data["spName"], tenenvId[0])
            ).one()

    # handler for ip databases
    ipDatabaseHandler = geoip2Database()
    # get country code/ name
    countryData = ipDatabaseHandler.getCountryFromIp(data["ipAddress"])
    if (countryData[0] is None):
        countryData[0] = 'UN'
        countryData[1] = 'Unknown'
        # self.logger.warning("ip {0} not found at database".format(ipaddr))
    print(countryData)
    # Save country if not exists
    try:
        countryId = session.exec(
            """
            SELECT id FROM country_codes
            WHERE countrycode = '{0}'
            """.format(
                countryData[0]
            )
        ).one()
    except NoResultFound:
        countryId = session.exec(
          """
          INSERT INTO country_codes (countrycode, country)
          SELECT '{0}', '{1}'
          WHERE NOT EXISTS (
              SELECT 1 FROM country_codes
              WHERE countrycode = '{0}'
          )
          RETURNING id;
          """.format(countryData[0], countryData[1])
        ).one()
    if data["failedLogin"] is False:
        session.exec(
            """
            INSERT INTO statistics_country_hashed(date, hasheduserid, sourceidpid, serviceid, countryid, count, tenenv_id) 
            VALUES ('{0}', '{1}', {2}, {3}, {4}, {5}, {6})
            ON CONFLICT (date, hasheduserid, sourceidpid, serviceid, countryid, tenenv_id)
            DO UPDATE SET count = statistics_country_hashed.count + 1
            """.format(
                data["date"], hasheduserid[0], idpId[0], spId[0], countryId[0], 1, tenenvId[0]
            )
        )
        session.commit()
    # Return a JSON response
    return JSONResponse({"message": "Endpoint called successfully"})
