from app.logger import log
from datetime import timedelta, date
from sqlalchemy.exc import NoResultFound


class utilsIngester:
    logger = log.get_logger("utilsIngester")

    @classmethod
    def getDatesNotMapped(cls, table: str, column, tenenvId, session):
        # Logins

        maxDate = session.exec("""
          SELECT max({0}::date) FROM {1} WHERE tenenv_id={2}
        """.format(column, table, tenenvId)).one()

        dayFrom = None
        dayTo = None

        if maxDate[0] is not None:
            dayAfter = maxDate[0] + timedelta(days=1)
            dayFrom = dayAfter.strftime('%Y-%m-%d 00:00:00')

        yesterday = date.today() - timedelta(days=1)
        dayTo = yesterday.strftime('%Y-%m-%d 23:59:59')
        return [dayFrom, dayTo]

    @classmethod
    def validateTenenv(cls, tenenvId, session):
        try:
            tenenvId = session.exec(
                """
                SELECT tenenv_info.id FROM tenenv_info
                WHERE id={0}
                """.format(
                    tenenvId
                )
            ).one()
        except NoResultFound:
            # if tenenv_id doesn't exist return a relevant message
            cls.logger.info("Tenenv with id {0} not found".format(tenenvId))
            print("Tenenv not found")
            return False
        return True

    @classmethod
    def validateHashedUser(cls, hashedUser, tenenvId, session):
        # Check if userid exists
        try:
            session.exec(
                """
                  SELECT hasheduserid FROM users WHERE hasheduserid='{0}'
                  AND tenenv_id={1}
                """.format(
                      # hashlib.md5(data["userid"]).hexdigest() #TypeError:
                      # Strings must be encoded before hashing
                      hashedUser, tenenvId
                    )
            ).one()
        except NoResultFound:
            cls.logger.info("User {0} not found".format(hashedUser))
            return False
        return True
