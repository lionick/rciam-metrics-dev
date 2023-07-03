from app.logger import log
from ..database import get_session
from app.utils.ipDatabase import geoip2Database
from sqlalchemy.exc import NoResultFound
from .utilsIngester import utilsIngester


class LoginDataIngester:
    logger = log.get_logger("LoginDataIngester")

    @classmethod
    def getIdpId(cls, entityid, idpName, tenenvId, session):
        # Check if IdP exists
        try:
            idpId = session.exec(
              """
              SELECT id, name FROM identityprovidersmap
              WHERE entityid = '{0}' AND tenenv_id={1}
              """.format(
                  entityid, tenenvId
              )
            ).one()
            # Update idpName with the latest
            if (idpId[0] is not None and idpName is not None and idpName != ''
                    and idpId[1] != idpName):
                session.exec(
                    """
                    UPDATE identityprovidersmap SET name = '{0}'
                    WHERE id = {1}
                    """.format(idpName, idpId[0])
                )
        except NoResultFound:
            cls.logger.info("""Idp with name {0} and entityid {1}
                               will be created for
                               tenenvId {2}""".format(idpName,
                                                      entityid,
                                                      tenenvId))
            idpId = session.exec(
                """
                INSERT INTO identityprovidersmap (entityid, name, tenenv_id)
                VALUES  ('{0}', '{1}', {2})
                RETURNING id;
                """.format(
                    entityid, idpName, tenenvId
                )
            ).one()
        return idpId

    @classmethod
    def getSpId(cls, identifier, spName, tenenvId, session):
        # Check if Sp exists
        try:
            spId = session.exec(
                """
                SELECT id, name FROM serviceprovidersmap
                WHERE identifier = '{0}' AND tenenv_id={1}
                """.format(
                      identifier, tenenvId
                )
            ).one()
            # Update spName with the latest
            if (spId[0] is not None and spName is not None and spName != ''
                    and spId[1] != spName):
                session.exec(
                    """
                    UPDATE serviceprovidersmap SET name = '{0}'
                    WHERE id = {1}
                    """.format(spName, spId[0])
                )
        except NoResultFound:
            # If Sp not exists then add it to database
            cls.logger.info("""Sp with name {0} and identifier {1}
                               will be created for
                               tenenvId {2}""".format(spName,
                                                      identifier,
                                                      tenenvId))
            spId = session.exec(
                """
                INSERT INTO serviceprovidersmap (identifier, name, tenenv_id)
                SELECT '{0}', '{1}', {2}
                WHERE NOT EXISTS (
                    SELECT 1 FROM serviceprovidersmap
                    WHERE identifier = '{0}'
                )
                RETURNING id;
                """.format(identifier, spName, tenenvId)
                ).one()
        return spId

    @classmethod
    def getCountryFromIP(cls, ipAddress, session):
        # handler for ip databases
        ipDatabaseHandler = geoip2Database()
        # get country code/ name
        countryData = ipDatabaseHandler.getCountryFromIp(ipAddress)
        if (countryData[0] is None):
            countryData[0] = 'UN'
            countryData[1] = 'Unknown'
            cls.logger.warning("""
                ip {0} not found at database""".format(ipAddress))

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
            cls.logger.info("""Country with name {0}
                               will be created""".format(countryData[1]))
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
        return countryId

    @classmethod
    def ingestLoginDataPerTenenv(cls, tenenvId, session):

        # get dates not mapped for logi5ns data
        datesNotMapped = utilsIngester.getDatesNotMapped(
            "statistics_country_hashed",
            "date",
            tenenvId,
            session)
        between = ""
        if datesNotMapped[0] is not None:
            between = " AND (date BETWEEN '{0}' AND '{1}')".format(
                datesNotMapped[0], datesNotMapped[1])
        elif datesNotMapped[1] is not None:
            between = " AND date <= '{0}'".format(
                datesNotMapped[1]
            )
        cls.logger.info("""
            {0}  logins """.format(between))
        loginsNotMapped = session.exec("""
            SELECT jsondata FROM statistics_raw WHERE type='login'
                AND tenenv_id={0} {1}
        """.format(tenenvId, between)).all()
        loginMappedItems = 0
        for login in loginsNotMapped:
            if (not login[0]['failedLogin']
                and utilsIngester.validateTenenv(login[0]['tenenvId'], session)
                and utilsIngester.validateHashedUser(login[0]['voPersonId'],
                                                  login[0]['tenenvId'],
                                                  session)):

                # Set the to None if they don't have value
                login[0]['idpName'] = '' if not login[0].get('idpName') else login[0]['idpName']
                login[0]['spName'] = '' if not login[0].get('spName') else login[0]['spName']

                # check if idp exists in our database otherwise create it
                idpId = LoginDataIngester.getIdpId(login[0]['entityId'],
                                            login[0]['idpName'],
                                            login[0]['tenenvId'],
                                            session)
                # check if sp exists in our database otherwise create it
                spId = LoginDataIngester.getSpId(login[0]['identifier'],
                                          login[0]['spName'],
                                          login[0]['tenenvId'],
                                          session)
                countryId = LoginDataIngester.getCountryFromIP(login[0]['ipAddress'],
                                                               session)
                # store information at statistics_country_hashed
                session.exec(
                    """
                    INSERT INTO statistics_country_hashed(date, hasheduserid, sourceidpid, serviceid, countryid, count, tenenv_id)
                    VALUES ('{0}', '{1}', {2}, {3}, {4}, {5}, {6})
                    ON CONFLICT (date, hasheduserid, sourceidpid, serviceid, countryid, tenenv_id)
                    DO UPDATE SET count = statistics_country_hashed.count + 1
                    """.format(
                        login[0]["date"], login[0]['voPersonId'], idpId[0], spId[0], countryId[0], 1, login[0]['tenenvId']
                    )
                )
                session.commit()
                loginMappedItems += 1

        cls.logger.info("""
            {0} new logins ingested""".format(loginMappedItems))

    @classmethod
    def ingestLoginData(cls):
        session_generator = get_session()
        session = next(session_generator)
        tenenvIds = session.exec("""SELECT id FROM tenenv_info""").all()
        for tenenvId in tenenvIds:
            LoginDataIngester.ingestLoginDataPerTenenv(tenenvId[0], session)
