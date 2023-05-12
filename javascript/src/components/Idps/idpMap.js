import {useState, useContext, useEffect} from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import {client} from '../../utils/api';
import $, {map} from "jquery";
import {calculateLegends, setMapConfiguration, setLegend} from "../Common/utils";
import 'jquery-mapael';
import 'jquery-mapael/js/maps/world_countries_mercator.js';


const IdpMap = ({startDate, endDate, tenantId, uniqueLogins, idpId}) => {

  useEffect(() => {
    client.get("logins_per_country",
      {
        params: {
          'startDate': startDate,
          'endDate': endDate,
          'tenant_id': tenantId,
          'unique_logins': uniqueLogins,
          'idpId': idpId
        }
      }).then(response => {
      createMap("idpMapDraw", response["data"])
    })
  }, [startDate, endDate, uniqueLogins])

  const createMap = (id, mapData, tooltipLabel = "Logins", legendLabel = 'Logins per country') => {
    var areas = {};
    var i = 1;
    var maxSum = 0;
    mapData.forEach(function (mapRow) {

      var contentTooltip = "<span style=\"font-weight:bold;\">" + mapRow.country + "</span><br />" + tooltipLabel + " : " + mapRow.sum

      //contentTooltip += mapRow.additional_text !== undefined ? '<hr style="border-color:#fff; margin:5px 0px"/>' + mapRow.additional_text : '';
      areas[mapRow.countrycode] = {
        value: mapRow.sum,
        tooltip: {content: contentTooltip}
      }
      if (mapRow.sum > maxSum) {
        maxSum = mapRow.sum;
      }
      i++;
    })
    // Calculate Legends
    var legends = calculateLegends(maxSum)
    $(".areaLegend").show()
    $("#" + id).mapael({
      map: setMapConfiguration(),
      legend: setLegend(legendLabel, legends),
      areas: areas
    })

  }

  return (
    <Row className="loginsByCountry">

      <Col md={12} className="box">
        <div className="box-header with-border">
          <h3 className="box-title">Logins Per Country</h3>
        </div>
        <div className="container_map" id="idpMapDraw">
          <div className="map"></div>
          <div className="areaLegend"></div>
        </div>
      </Col>

    </Row>
  )
}

export default IdpMap;