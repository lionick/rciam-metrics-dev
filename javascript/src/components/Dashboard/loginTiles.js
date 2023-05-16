import { useState, useContext, useEffect } from "react";
import { client } from '../../utils/api';
import Container from 'react-bootstrap/Container';
import Select from 'react-select';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { convertDateByGroup, getWeekNumber } from "../Common/utils";
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginTiles = (parameters) => {
    const [tiles, setTiles] = useState({});
    useEffect(() => {
        Promise.all([
            client.get("logins_countby",
                { params: { 'tenant_id': parameters['tenantId'], 'unique_logins': parameters['uniqueLogins'], 
                    'idpId': parameters['idpId'] !== undefined ? parameters['idpId'] : null, 
                    'spId': parameters['spId'] !== undefined ? parameters['spId'] : null } 
                }),
            client.get("logins_countby",
                { params: { 'interval': 'year', 'count_interval': '1', 'tenant_id': parameters['tenantId'], 'unique_logins': parameters['uniqueLogins'], 
                    'idpId': parameters['idpId'] !== undefined ? parameters['idpId'] : null, 
                    'spId': parameters['spId'] !== undefined ? parameters['spId'] : null } 
                }),
            client.get("logins_countby",
                { params: { 'interval': 'days', 'count_interval': '30', 'tenant_id': parameters['tenantId'], 'unique_logins': parameters['uniqueLogins'], 
                    'idpId': parameters['idpId'] !== undefined ? parameters['idpId'] : null, 
                    'spId': parameters['spId'] !== undefined ? parameters['spId'] : null } 
                }),
            client.get("logins_countby",
                { params: { 'interval': 'days', 'count_interval': '7', 'tenant_id': parameters['tenantId'], 'unique_logins': parameters['uniqueLogins'], 
                    'idpId': parameters['idpId'] !== undefined ? parameters['idpId'] : null, 
                    'spId': parameters['spId'] !== undefined ? parameters['spId'] : null } 
                })
        ]).then(function (responses) {
            // Get a JSON object from each of the responses
            return Promise.all(responses.map(function (response) {
                return response;
            }));
        }).then(function (data) {
            // Log the data to the console
            // You would do something with both sets of data here
            var tilesArray = {}
            data.forEach(element => {

                if (element["config"]["params"]["interval"]) {
                    var name = element["config"]["params"]["interval"] + "_" + element["config"]["params"]["count_interval"]
                    tilesArray[[name]] = (element["data"][0]["count"] != null) ? element["data"][0]["count"] : 0
                }
                else {
                    tilesArray["overall"] = (element["data"][0]["count"] != null) ? element["data"][0]["count"] : 0
                }

            })
            setTiles(tilesArray)

        }).catch(function (error) {
            // if there's an error, log it
            console.log(error);
        });


    }, [parameters["uniqueLogins"]])

    return (

        <Row>
            <Col md={12} className="tiles-container">
                <Col lg={3} xs={6}>
                    <div className="small-box bg-aqua">
                        <div className="inner">
                            <h3>{tiles["overall"]}</h3>
                            <p>Total Logins</p>
                        </div>
                    </div>
                </Col>
                <Col lg={3} xs={6}>
                    <div className="small-box bg-green">
                        <div className="inner">
                            <h3>{tiles["year_1"]}</h3>
                            <p>Last Year Logins</p>
                        </div>
                    </div>
                </Col>
                <Col lg={3} xs={6}>
                    <div className="small-box bg-yellow">
                        <div className="inner">
                            <h3>{tiles["days_30"]}</h3>
                            <p>Last 30 days Logins</p>
                        </div>
                    </div>
                </Col>
                <Col lg={3} xs={6}>
                    <div className="small-box bg-red">
                        <div className="inner">
                            <h3>{tiles["days_7"]}</h3>
                            <p>Last 7 days Logins</p>
                        </div>
                    </div>
                </Col>
            </Col>
        </Row>
    )
}

export default LoginTiles