from app.logger import log
from ..database import get_session
from sqlalchemy.exc import NoResultFound
from .utilsIngester import utilsIngester


class MembershipDataIngester:
    logger = log.get_logger("MembershipDataIngester")

    @classmethod
    def getCommunityId(cls, communityName, tenenvId, session):
        # Check if IdP exists
        try:
            communityId = session.exec(
              """
              SELECT id FROM community_info
              WHERE name = '{0}' AND tenenv_id={1}
              """.format(
                  communityName, tenenvId
              )
            ).one()
        except NoResultFound:
            cls.logger.error("""Community with name {0}
                               not found for
                               tenenvId {1}""".format(communityName,
                                                      tenenvId))
            communityId = None
        return communityId

    @classmethod
    def ingestMembershipDataPerTenenv(cls, tenenvId, session):
        # get dates not mapped for users data
        datesNotMapped = utilsIngester.getDatesNotMapped(
            "members",
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
        membershipsNotMapped = session.exec("""
            SELECT jsondata FROM statistics_raw WHERE (type='membership')
            AND tenenv_id={0} {1}
        """.format(tenenvId, between)).all()
        membershipMappedItems = 0
        for membership in membershipsNotMapped:
            communityId = MembershipDataIngester.getCommunityId(
                membership[0]['voName'], tenenvId, session)
            if (communityId is None):
                cls.logger.error("""
                    VO name '{0}' not found """.format(membership[0]['voName']))
                continue
            session.exec("""INSERT INTO members(community_id,
                hasheduserid, status, tenenv_id, created, updated)
                VALUES ('{0}','{1}','{2}', {3}, '{4}', '{4}')
                ON CONFLICT(community_id, hasheduserid, tenenv_id)
                DO UPDATE
                set status='{2}', updated='{4}'""". format(
                communityId[0], membership[0]['voPersonId'], membership[0]['status'],
                tenenvId, membership[0]['date']))
            session.commit()
            membershipMappedItems += 1
        cls.logger.info("""{0} memberships ingested or updated""".
                        format(membershipMappedItems))

    @classmethod
    def ingestMembershipData(cls):
        session_generator = get_session()
        session = next(session_generator)
        tenenvIds = session.exec("""SELECT id FROM tenenv_info""").all()
        # for each tenenv on database try to ingest UserData
        # from statistics_raw table
        for tenenvId in tenenvIds:
            MembershipDataIngester.ingestMembershipDataPerTenenv(
                tenenvId[0], session)
