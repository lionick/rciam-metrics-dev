import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'jquery-mapael';
import 'jquery-mapael/js/maps/world_countries_mercator.js';
import {useQuery, useQueryClient} from "react-query";
import {loginsPerCountryKey} from "../../utils/queryKeys";
import {getLoginsPerCountry} from "../../utils/queries";
import EarthMap from "../Common/earthMap";
import Spinner from "../Common/spinner";
import React from "react";
import {format} from "date-fns";

const LoginsMap = ({
                     startDate,
                     endDate,
                     tenenvId,
                     uniqueLogins
                   }) => {

  let params = {
    params: {
      'startDate': !startDate ? null : format(startDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      'endDate': !endDate ? null : format(endDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      'tenenv_id': tenenvId,
      'unique_logins': uniqueLogins
    }
  }

  const loginsPerCountry = useQuery(
    [loginsPerCountryKey, params],
    getLoginsPerCountry,
    {
      enabled: false,
      refetchOnWindowFocus: false
    }
  )

  if (loginsPerCountry.isLoading
    || loginsPerCountry.isFetching) {
    return (<Spinner/>)
  }

  if(loginsPerCountry.length === 0) {
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

export default LoginsMap;