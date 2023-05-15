import { useState, useContext, useEffect } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import { client } from '../../utils/api';
import $, { map } from "jquery";
import "jquery/dist/jquery.min.js";
import Datatable from "../datatable";
import { calculateLegends, setMapConfiguration, setLegend } from "../Common/utils";
import 'jquery-mapael';
import 'jquery-mapael/js/maps/world_countries_mercator.js';


const IdpMapToDataTable = ({startDate, endDate, tenantId, uniqueLogins, idpId}) => {
    const [loginsPerCountry, setLoginsPerCountry] = useState();
    var loginsPerCountryArray = [];  
    useEffect(() => {
        client.get("logins_per_country", 
            {
                params: {
                    'startDate':startDate,
                    'endDate':endDate,
                    'tenant_id': tenantId,
                    'unique_logins': uniqueLogins,
                    'idpId': idpId            
                }
            }).then(response => {
                 //var community = {"created":element.created, "name":element.community_info.name}
                 console.log(response);
                 var minDateFromData = ""
                 response["data"].forEach(element => {     
                 //var range_date = new Date(element.range_date);
                //  if (minDateFromData == "") {
                //      minDateFromData = new Date(element.min_date)
                //  }
                 var perPeriod = { "Countries": element.country, "Number of Logins": element.sum}
                 loginsPerCountryArray.push(perPeriod)
                 
             });
            //  setMinDate(minDateFromData)
             $("#table-idp").DataTable().destroy()
             setLoginsPerCountry(loginsPerCountryArray)
        })
    }, [uniqueLogins])

    return (
        <Row className="loginsByCountry">
            
            <Col md={12} className="box">
                <div className="box-header with-border">
                    <h3 className="box-title">Logins Per Country</h3>
                </div>
                <Datatable dataTableId="table-idp" items={loginsPerCountry}></Datatable>
            </Col>

        </Row>
    )
}

export default IdpMapToDataTable;