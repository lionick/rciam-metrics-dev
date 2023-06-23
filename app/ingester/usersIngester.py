from app.logger import log
from ..database import get_session
from .utilsIngester import utilsIngester


class UserDataIngester:
    logger = log.get_logger("UserDataIngester")

    @classmethod
    def ingestUserDataPerTenenv(cls, tenenvId, session):
        # get dates not mapped for users data
        datesNotMapped = utilsIngester.getDatesNotMapped(
            "users",
            "created",
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

        usersNotMapped = session.exec("""
            SELECT jsondata FROM statistics_raw WHERE (type='registration' OR type='user_status') AND tenenv_id={0} {1}
        """.format(tenenvId, between)).all()
        userMappedItems = 0
        for user in usersNotMapped:
            session.exec("""INSERT INTO users(hasheduserid, created, status, tenenv_id)
                VALUES ('{0}','{1}','{2}', {3})
                ON CONFLICT(hasheduserid, tenenv_id) DO UPDATE set status={2}""". format(
                user['userid'], user['created'], user['status'],
                user['tenenvId']))
            userMappedItems += 1
        cls.logger.info("""
                {0} users ingested or updated""".format(userMappedItems))

    @classmethod
    def ingestUserData(cls):
        session_generator = get_session()
        session = next(session_generator)
        tenenvIds = session.exec("""SELECT id FROM tenenv_info""").all()
        # for each tenenv on database try to ingest UserData
        # from statistics_raw table
        for tenenvId in tenenvIds:
            UserDataIngester.ingestUserDataPerTenenv(tenenvId[0], session)