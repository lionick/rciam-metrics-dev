import { useEffect } from "react";
import { calculateLegends, setMapConfiguration, setLegend } from "../Common/utils";
import { client } from '../../utils/api';
import $ from "jquery";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'jquery-mapael';
import 'jquery-mapael/js/maps/world_countries_mercator.js';

const RegisteredUsersMap = ({ startDate, endDate, tenantId }) => {


    useEffect(() => {
        client.get("registered_users_country",
            {
                params: {
                    'startDate': startDate,
                    'endDate': endDate,
                    'tenant_id': tenantId
                }
            }).then(response => {
                createMap("usersMap", response["data"])
            })
    }, [startDate, endDate, tenantId])

    const createMap = (id, mapData, tooltipLabel = "Users", legendLabel = 'Users per country') => {
        var areas = {};
        var maxSum = 0;
        mapData.forEach(function (mapRow) {

            var contentTooltip = "<span style=\"font-weight:bold;\">" + mapRow.country + "</span><br />" + tooltipLabel + " : " + mapRow.sum

            //contentTooltip += mapRow.additional_text !== undefined ? '<hr style="border-color:#fff; margin:5px 0px"/>' + mapRow.additional_text : '';
            areas[mapRow.countrycode] = {
                value: mapRow.sum,
                tooltip: { content: contentTooltip }
            }
            if (mapRow.sum > maxSum) {
                maxSum = mapRow.sum;
            }

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
        <Row className="box usersByCountry">
            <Col lg={12}>
                <div className="box-header with-border">
                    <h3 className="box-title">Users Per Country</h3>
                </div>
            </Col>

            <Col lg={12}>
                <div className="container_map" id="usersMap">
                    <div className="map"></div>
                    <div className="areaLegend"></div>
                </div>
            </Col>

        </Row>
    )
}

export default RegisteredUsersMap;