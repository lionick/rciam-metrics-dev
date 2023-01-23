import { useState, useContext, useEffect } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import { client } from '../../utils/api';
import $, { map } from "jquery";
import 'jquery-mapael';
import 'jquery-mapael/js/maps/world_countries_mercator.js';
import { calculateLegends, setMapConfiguration, setLegend } from "../Common/utils";


const CommunitiesMap = (parameters) => {
    const StatusEnumeration =  {
        'A' : 'Active',
        'GP': 'Grace Period',
        'O': 'Other'
    }
    
    const [communities, setCommunities] = useState();
    const [selectedCommunity, setSelectedCommunity] = useState({});
    const [membersStatus, setMembersStatus] = useState([]);
    var communitiesArray = [];
    useEffect(() => {
        client.get("communities", 
        { 
            params: 
            { 
              'tenant_id': parameters["tenantId"], 
            } 
        }).then(response => {

            response["data"].forEach(element => {
                var community = { label: element.community_info.name, value: element.community_id }
                communitiesArray.push(community)
            })
            
            setCommunities(communitiesArray)
            
        })
    }, [])

    const createMap = (id, mapData, tooltipLabel = "Users", legendLabel = 'Users per country') => {
        var areas = {};
        var i = 1;
        var maxSum = 0;
        mapData[0].forEach(function (mapRow) {
            
            var contentTooltip = "<span style=\"font-weight:bold;\">" + mapRow.country + "</span><br />" + tooltipLabel + " : " + mapRow.sum + "<hr/>"
            var other_status = 0;
            // Get statuses per country
            mapData[1].forEach(function(status_per_country) {
                if(status_per_country.country == mapRow.country) {
                    if(status_per_country.status != 'A' && status_per_country.status != 'GP'){
                        other_status += status_per_country.sum
                    }
                    else {
                        contentTooltip +=  StatusEnumeration[status_per_country.status] + ": " + status_per_country.sum + "<br/>"
                    }
                }

            })
            if(other_status > 0 ){
                contentTooltip += StatusEnumeration['O'] + ": " + other_status
            }
            //contentTooltip += mapRow.additional_text !== undefined ? '<hr style="border-color:#fff; margin:5px 0px"/>' + mapRow.additional_text : '';
            areas[mapRow.countrycode] = {
                value: mapRow.sum,
                tooltip: { content: contentTooltip }
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

    const handleChange = event => {

        var community_id = event.value;
        console.log(community_id)
        client.get("members_bystatus", { params: { 'community_id': community_id, 'tenant_id': parameters['tenantId'] } }).then(response => {
            var statuses = { 'A': 0, 'GP': 0, 'O': 0 }
            //console.log(response["data"][0])
            response["data"].forEach(function (memberStatus, index) {
                console.log(memberStatus)
                if (memberStatus['status'] == 'A' || memberStatus['status'] == 'GP') {
                    statuses[memberStatus['status']] = memberStatus['count']
                }
                else {
                    statuses['O']+= memberStatus['count']
                }
            })
            setMembersStatus(statuses)
        })
        client.get("communities/" + community_id, 
        { 
            params: { 
              'tenant_id': parameters["tenantId"], 
            } 
        }).then(result => {
            console.log(result)
            var community = result["data"]
            setSelectedCommunity({ "name": community[0]["name"], "description": community[0]["description"] })
        }
        )
        client.get("country_stats_by_vo/" + community_id, 
        { 
            params: 
            { 
              'tenant_id': parameters["tenantId"], 
            } 
        }).then(result => {
            console.log(result)
            var stats = result["data"]
            createMap("communitiesMap", stats)
        })
    }
    return (
        <Row className="communityMembersByCountry">
            <Col lg={12}><h3>Statistics Per Community</h3></Col>
            <Col lg={3}>
                <Select options={communities} onChange={handleChange}></Select>
                {selectedCommunity["name"] && <Row><Col lg={12}>{selectedCommunity["name"]}</Col>
                    <Col lg={12}>{selectedCommunity["description"]}</Col>
                </Row>

                }
            </Col>
            <Col lg={7}>
                <div className="container_map" id="communitiesMap">
                    <div className="map"></div>
                    <div className="areaLegend"></div>
                </div>
            </Col>

            {membersStatus["A"] !== undefined && <Col lg={2}>
                <Row>
                    <Col lg={12}>ACTIVE USERS</Col>
                    <Col lg={12}>{membersStatus["A"]}</Col>
                </Row>
                <Row>
                    <Col lg={12}>GRACE PERIOD USERS</Col>
                    <Col lg={12}>{membersStatus["GP"]}</Col>
                </Row>
                <Row>
                    <Col lg={12}>OTHER STATUS USERS</Col>
                    <Col lg={12}>{membersStatus["O"]}</Col>
                </Row>
            </Col>
            }


        </Row>
    )
}

export default CommunitiesMap;