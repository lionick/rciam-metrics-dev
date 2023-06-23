import React, {useState, useEffect} from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import $ from "jquery";
import "jquery/dist/jquery.min.js";
import Datatable from "../datatable";
import 'jquery-mapael';
import 'jquery-mapael/js/maps/world_countries_mercator.js';
import {useQuery, useQueryClient} from "react-query";
import {loginsPerCountryKey} from "../../utils/queryKeys";
import {getLoginsPerCountry} from "../../utils/queries";


const IdpMapToDataTable = ({
                             startDate,
                             endDate,
                             tenenvId,
                             uniqueLogins,
                             idpId
                           }) => {
  const [loginsPerCountryData, setLoginsPerCountryData] = useState([]);
  const queryClient = useQueryClient();


  let params = {
    params: {
      'startDate': startDate,
      'endDate': endDate,
      'tenenv_id': tenenvId,
      'unique_logins': uniqueLogins,
      'idpId': idpId
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

  useEffect(() => {
    params = {
      params: {
        'startDate': startDate,
        'endDate': endDate,
        'tenenv_id': tenenvId,
        'unique_logins': uniqueLogins,
        'idpId': idpId
      }
    }

    try {
      const response = queryClient.refetchQueries([loginsPerCountryKey, params])
    } catch (error) {
      // todo: Here we can handle any authentication or authorization errors
      console.log(error)
    }

  }, [uniqueLogins])

  // Construct the data required for the datatable
  useEffect(() => {
    const loginsPerCountryArray = !loginsPerCountry.isLoading
      && !loginsPerCountry.isFetching
      && loginsPerCountry.isSuccess
      && loginsPerCountry?.data?.map(element => ({
        "Countries": element.country,
        "Number of Logins": element.sum
      }))

    if (!!loginsPerCountry?.data && !!loginsPerCountryArray) {
      $("#table-idp").DataTable().destroy()
      setLoginsPerCountryData(loginsPerCountryArray)
    }
  }, [!loginsPerCountry.isLoading
  && !loginsPerCountry.isFetching
  && loginsPerCountry.isSuccess])

  if (loginsPerCountry.isLoading
    || loginsPerCountry.isFetching
    || loginsPerCountryData.length === 0) {
    return null
  }

  return (
    <Row className="loginsByCountry">
      <Col md={12} className="box">
        <div className="box-header with-border">
          <h3 className="box-title">Logins Per Country</h3>
        </div>
        <Datatable dataTableId="table-idp"
                   items={loginsPerCountryData}/>
      </Col>
    </Row>
  )
}

export default IdpMapToDataTable;