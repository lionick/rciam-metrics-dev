import {useRef, useEffect} from "react";
import {useQuery, useQueryClient} from "react-query";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'jquery-mapael';
import 'jquery-mapael/js/maps/world_countries_mercator.js';
import {getRegisteredUsersByCountry} from "../../utils/queries";
import {registeredUsersByCountryKey} from "../../utils/queryKeys";
import EarthMap from "../Common/earthMap";

const RegisteredUsersMap = ({
                              startDate,
                              endDate,
                              tenenvId
                            }) => {
  const queryClient = useQueryClient();

  let params = {
    params: {
      'startDate': startDate,
      'endDate': endDate,
      'tenenv_id': tenenvId,
    }
  }

  const registeredUsersByCountry = useQuery(
    [registeredUsersByCountryKey, params],
    getRegisteredUsersByCountry,
    {
      enabled: false
    }
  )

  useEffect(() => {
    try {
      var response = queryClient.refetchQueries([registeredUsersByCountryKey, params])
    } catch (error) {
      console.log(error)
    }
  }, [startDate, endDate, tenenvId])

  if(registeredUsersByCountry.isIdle
     || registeredUsersByCountry.isLoading
     || registeredUsersByCountry.isFetching
     || registeredUsersByCountry.isRefetching) {
    return null
  }

  return (
    <Row className="box usersByCountry">
      <Col lg={12}>
        <div className="box-header with-border">
          <h3 className="box-title">Users Per Country</h3>
        </div>
      </Col>

      <Col lg={12}>
        <EarthMap datasetQuery={registeredUsersByCountry}
                  tooltipLabel="Users"
                  legendLabel="Users per country"/>
      </Col>

    </Row>
  )
}

export default RegisteredUsersMap;