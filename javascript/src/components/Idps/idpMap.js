import {useEffect, useCallback, useRef} from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {createMap} from "../Common/utils";
import 'jquery-mapael';
import 'jquery-mapael/js/maps/world_countries_mercator.js';
import {useQuery, useQueryClient} from "react-query";
import {loginsPerCountryKey} from "../../utils/queryKeys";
import {getLoginsPerCountry} from "../../utils/queries";


const IdpMap = ({
                  startDate,
                  endDate,
                  tenantId,
                  uniqueLogins,
                  idpId
                }) => {
  const idpmap = useRef(null)
  const areaLegendRef = useRef(null)
  const queryClient = useQueryClient();

  let params = {
    params: {
      'startDate': startDate,
      'endDate': endDate,
      'tenant_id': tenantId,
      'unique_logins': uniqueLogins,
      'idpId': idpId
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
        'idpId': idpId,
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

  const idpMapDrawRef = useCallback(node => {
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
             ref={idpMapDrawRef}
             id="idpMapDraw">
          <div className="map"></div>
          <div ref={areaLegendRef}
               className="areaLegend"></div>
        </div>
      </Col>
    </Row>
  )
}

export default IdpMap;