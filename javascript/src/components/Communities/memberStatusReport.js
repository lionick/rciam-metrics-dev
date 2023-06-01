import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {useQuery} from "react-query";
import {communityMembersByStatusKey} from "../../utils/queryKeys";
import {getCommunityMembersByStatus} from "../../utils/queries";

const MemberStatusReport = ({
                              tenantId,
                              communityId
                            }) => {


  let params = {
    params: {
      'tenant_id': tenantId,
      'community_id': communityId,
    }
  }

  const communityMembersByStatusQuery = useQuery(
    [communityMembersByStatusKey, params],
    getCommunityMembersByStatus, {
      enabled: (tenantId != undefined && communityId != undefined)
    }
  )

  // Create the option list
  const {activeUsers, graceUsers, otherUsers} = !communityMembersByStatusQuery.isLoading
  && communityMembersByStatusQuery.isSuccess
  && communityMembersByStatusQuery.isFetched
  && communityMembersByStatusQuery.data.length > 0
  && communityMembersByStatusQuery?.data?.reduce((acc, member) => {
    if (member.status === 'A') {
      acc.activeUsers = member.count
    } else if (member.status === 'GP') {
      acc.graceUsers = member.count
    } else {
      acc.otherUsers += member.count
    }
    return acc
  }, {activeUsers: 0, graceUsers: 0, otherUsers: 0})

  if (tenantId == undefined
    || communityId == undefined) {
    return null
  }

  return (
    <Col lg={2}>
      <Row>
        <Col lg={12}>ACTIVE USERS</Col>
        <Col lg={12}>{activeUsers}</Col>
      </Row>
      <Row>
        <Col lg={12}>GRACE PERIOD USERS</Col>
        <Col lg={12}>{graceUsers}</Col>
      </Row>
      <Row>
        <Col lg={12}>OTHER STATUS USERS</Col>
        <Col lg={12}>{otherUsers}</Col>
      </Row>
    </Col>
  )
}

export default MemberStatusReport;