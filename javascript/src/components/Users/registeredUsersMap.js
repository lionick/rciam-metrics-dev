import React, {useEffect} from "react";
import {useQuery, useQueryClient} from "react-query";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'jquery-mapael';
import 'jquery-mapael/js/maps/world_countries_mercator.js';
import {getRegisteredUsersByCountry} from "../../utils/queries";
import {registeredUsersByCountryKey} from "../../utils/queryKeys";
import EarthMap from "../Common/earthMap";
import Spinner from "../Common/spinner";
import {format} from "date-fns";

const RegisteredUsersMap = ({
                              startDate,
                              endDate,
                              tenenvId
                            }) => {
  const queryClient = useQueryClient();
  const controller = new AbortController

  let params = {
    params: {
      'startDate': !startDate ? null : format(startDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      'endDate': !endDate ? null : format(endDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      'tenenv_id': tenenvId,
    },
    signal: controller.signal
  }

  const registeredUsersByCountry = useQuery(
    [registeredUsersByCountryKey, params],
    getRegisteredUsersByCountry,
    {
      enabled: false,
      refetchOnWindowFocus: false
    }
  )

  useEffect(() => {
    try {
      var response = queryClient.refetchQueries([registeredUsersByCountryKey, params])
    } catch (error) {
      console.log(error)
    }

    return () => {
      controller.abort()
    }
  }, [startDate, endDate, tenenvId])

  if (registeredUsersByCountry.isLoading
    || registeredUsersByCountry.isFetching
    || registeredUsersByCountry.isRefetching) {
    return (<Spinner/>)
  }

  if (registeredUsersByCountry.isIdle) {
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