import {useState, useRef} from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import 'jquery-mapael';
import 'jquery-mapael/js/maps/world_countries_mercator.js';
import {useQuery, useQueryClient} from "react-query";
import {
  communitiesKey,
  countryStatsByVoKey
} from "../../utils/queryKeys";
import {getCommunities, getCountryStatsByVo} from "../../utils/queries";
import EarthMap from "../Common/earthMap";
import MemberStatusReport from "./memberStatusReport";

const CommunitiesMap = ({tenenvId}) => {
  const [selectedCommunity, setSelectedCommunity] = useState({});
  const communityId = useRef(null)

  const queryClient = useQueryClient();

  let params = {
    params: {
      'tenenv_id': tenenvId
    }
  }

  const communitiesQuery = useQuery(
    [communitiesKey, params],
    getCommunities
  )

  const countryStatsQuery = useQuery(
    [countryStatsByVoKey, {countryId: communityId.current, params: params}],
    getCountryStatsByVo, {
      enabled: !!communityId?.current
    }
  )


  // Create the option list
  const communitiesOptionsList = !communitiesQuery.isLoading
    && communitiesQuery.isSuccess
    && communitiesQuery.isFetched
    && communitiesQuery.data.length > 0
    && communitiesQuery?.data?.map((elem) => ({
      label: elem.name,
      value: elem.id
    }))

  const handleChange = (event) => {
    communityId.current = event.value;

    const filteredCommunity = !communitiesQuery.isLoading
      && communitiesQuery.isSuccess
      && communitiesQuery.isFetched
      && communitiesQuery.data.length > 0
      && communitiesQuery?.data?.filter((elem) => elem.id == event.value)

    setSelectedCommunity(filteredCommunity.pop())

    try {
      const response = queryClient.refetchQueries([countryStatsByVoKey, {
        countryId: communityId.current,
        params: params
      }])
    } catch (error) {
      // todo: Here we can handle any authentication or authorization errors
      console.log(error)
    }
  }

  return (
    <Row className="box communityMembersByCountry">
      <Col lg={12}>
        <div className="box-header with-border">
          <h3 className="box-title">Statistics Per Community</h3>
        </div>
      </Col>
      <Col lg={3}>
        <Select className="select-community"
                options={communitiesOptionsList}
                onChange={handleChange}/>
        {
          !!selectedCommunity?.name &&
          <Row>
            <Col lg={12}>{selectedCommunity?.name}</Col>
            <Col lg={12}>{selectedCommunity?.description}</Col>
          </Row>
        }
      </Col>
      <Col lg={7}>
        <EarthMap datasetQuery={countryStatsQuery}
                  tooltipLabel="Users"
                  legendLabel="User Per Country"/>
      </Col>
      <MemberStatusReport tenenvId={tenenvId}
                          communityId={communityId?.current}/>
    </Row>
  )
}

export default CommunitiesMap;