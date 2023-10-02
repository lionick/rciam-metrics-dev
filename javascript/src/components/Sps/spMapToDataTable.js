import React from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import $ from "jquery";
import "jquery/dist/jquery.min.js";
import Datatable from "../datatable";
import 'jquery-mapael';
import 'jquery-mapael/js/maps/world_countries_mercator.js';
import {useQuery} from "react-query";
import {loginsPerCountryKey} from "../../utils/queryKeys";
import {getLoginsPerCountry} from "../../utils/queries";
import {format} from "date-fns";

const SpMapToDataTable = ({
                            startDate,
                            endDate,
                            tenenvId,
                            uniqueLogins,
                            spId
                          }) => {

  let params = {
    params: {
      'startDate': !startDate ? null : format(startDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      'endDate': !endDate ? null : format(endDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      'tenenv_id': tenenvId,
      'unique_logins': uniqueLogins,
      'spId': spId
    }
  }

  const loginsPerCountry = useQuery(
    [loginsPerCountryKey, params],
    getLoginsPerCountry
  )

  const loginsPerCountryArray = !loginsPerCountry.isLoading
    && !loginsPerCountry.isFetching
    && loginsPerCountry.isSuccess
    && loginsPerCountry?.data?.map(element => ({
      "Countries": element.country,
      "Number of Logins": element.sum
    }))

  if (!!loginsPerCountryArray) {
    $("#table-sp").DataTable().destroy()
  }

  return (
    <Row className="loginsByCountry">
      <Col md={12} className="box">
        <div className="box-header with-border">
          <h3 className="box-title">Logins Per Country</h3>
        </div>
        <Datatable dataTableId="table-sp"
                   items={loginsPerCountryArray}/>
      </Col>
    </Row>
  )
}

export default SpMapToDataTable;