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
            "updated",
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
        cls.logger.info("""between {0}""".format(between))
        usersNotMapped = session.exec("""
            SELECT jsondata FROM statistics_raw WHERE (type='registration' OR type='user_status') AND tenenv_id={0} {1}
        """.format(tenenvId, between)).all()
        userMappedItems = 0
        for user in usersNotMapped:
            cls.logger.info("""hasheduserid {0}""".format(user[0]))
            if (user[0]['status'] not in ['A', 'S', 'D']):
                cls.logger.error("""
                    user status '{0}' is not valid """.format(user[0]['status']))
                continue
            session.exec("""INSERT INTO users(hasheduserid, created, updated, status, tenenv_id)
                VALUES ('{0}','{1}','{1}', '{2}', {3})
                ON CONFLICT(hasheduserid, tenenv_id)
                DO UPDATE SET status='{2}', updated='{1}'""". format(
                user[0]['voPersonId'], user[0]['date'],  user[0]['status'],
                user[0]['tenenvId']))
            session.commit()
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