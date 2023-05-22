import {useCallback, useEffect, useRef} from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {createMap} from "../Common/utils";
import {calculateLegends, setMapConfiguration, setLegend} from "../Common/utils";
import 'jquery-mapael';
import 'jquery-mapael/js/maps/world_countries_mercator.js';
import {loginsPerCountryKey, loginsPerIdpKey} from "../../utils/queryKeys";
import {getLoginsPerCountry} from "../../utils/queries";
import {useQuery, useQueryClient} from "react-query";


const SpMap = ({
                 startDate,
                 endDate,
                 tenantId,
                 uniqueLogins,
                 spId
               }) => {
  const spmap = useRef(null)
  const areaLegendRef = useRef(null)
  const queryClient = useQueryClient();

  let params = {
    params: {
      'startDate': startDate,
      'endDate': endDate,
      'tenant_id': tenantId,
      'unique_logins': uniqueLogins,
      'spId': spId
    }
  }
  const loginsPerCountry = useQuery(
    [loginsPerCountryKey, params],
    getLoginsPerCountry,
    {
      enabled: false
    }
  )

  useEffect(() => {
    params = {
      params: {
        'startDate': startDate,
        'endDate': endDate,
        'spId': spId,
        'tenant_id': tenantId,
        'unique_logins': uniqueLogins
      }
    }

    try {
      const response = queryClient.refetchQueries([loginsPerCountryKey, params])
    } catch (error) {
      // todo: Here we can handle any authentication or authorization errors
      console.log(error)
    }
  }, [startDate, endDate, uniqueLogins])

  const spMapDrawRef = useCallback(node => {
    if (loginsPerCountry?.data != undefined && node != undefined) {
      createMap(node, areaLegendRef, loginsPerCountry?.data)
    }
  }, [!loginsPerCountry.isLoading && loginsPerCountry.isSuccess && loginsPerCountry?.data])

  if (loginsPerCountry.isLoading
    || loginsPerCountry.isFetching
    || loginsPerCountry.length === 0) {
    return null
  }

  return (
    <Row className="loginsByCountry">
      <Col md={12} className="box">
        <div className="box-header with-border">
          <h3 className="box-title">Logins Per Country</h3>
        </div>
        <div className="container_map"
             ref={spMapDrawRef}
             id="spMapDraw">
          <div className="map"></div>
          <div ref={areaLegendRef}
               className="areaLegend"></div>
        </div>
      </Col>
    </Row>
  )
}

export default SpMap;