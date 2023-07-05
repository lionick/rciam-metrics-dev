import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'jquery-mapael';
import 'jquery-mapael/js/maps/world_countries_mercator.js';
import {loginsPerCountryKey, loginsPerIdpKey} from "../../utils/queryKeys";
import {getLoginsPerCountry} from "../../utils/queries";
import {useQuery, useQueryClient} from "react-query";
import EarthMap from "../Common/earthMap";
import Spinner from "../Common/spinner";
import React from "react";


const SpMap = ({
                 startDate,
                 endDate,
                 tenenvId,
                 uniqueLogins,
                 spId
               }) => {
  let params = {
    params: {
      'startDate': startDate,
      'endDate': endDate,
      'tenenv_id': tenenvId,
      'unique_logins': uniqueLogins,
      'spId': spId
    }
  }
  const loginsPerCountry = useQuery(
    [loginsPerCountryKey, params],
    getLoginsPerCountry
  )

  if (loginsPerCountry.isLoading
      || loginsPerCountry.isFetching) {
    return (<Spinner/>)
  }

  if (loginsPerCountry.length === 0) {
    return null
  }

  return (
    <Row className="loginsByCountry">
      <Col md={12} className="box">
        <div className="box-header with-border">
          <h3 className="box-title">Logins Per Country</h3>
        </div>
        <EarthMap datasetQuery={loginsPerCountry}
                  tooltipLabel="Logins"
                  legendLabel="Logins per country"/>
      </Col>
    </Row>
  )
}

export default SpMap;