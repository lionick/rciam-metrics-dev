import { useState, useEffect } from "react";
import { client } from '../../utils/api';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const RegisteredUsersTiles = (parameters) => {
    const [tiles, setTiles] = useState({});
    useEffect(() => {
        Promise.all([
            client.get("registered_users_countby",
                { params: { 'tenant_id': parameters['tenantId'] } }),
            client.get("registered_users_countby",
                { params: { 'interval': 'year', 'count_interval': '1', 'tenant_id': parameters['tenantId'] } }),
            client.get("registered_users_countby",
                { params: { 'interval': 'days', 'count_interval': '30', 'tenant_id': parameters['tenantId'] } }),
            client.get("registered_users_countby",
                { params: { 'interval': 'days', 'count_interval': '7', 'tenant_id': parameters['tenantId'] } })
        ]).then(function (responses) {
            // Get a JSON object from each of the responses
            return Promise.all(responses.map(function (response) {
                return response;
            }));
        }).then(function (data) {
            // You would do something with both sets of data here
            var tilesArray = {}
            data.forEach(element => {
                if (element["config"]["params"]["interval"]) {
                    var name = element["config"]["params"]["interval"] + "_" + element["config"]["params"]["count_interval"]
                    tilesArray[[name]] = element["data"][0]["count"]
                }
                else {
                    tilesArray["overall"] = element["data"][0]["count"]
                }

            })
            setTiles(tilesArray)

        }).catch(function (error) {
            // if there's an error, log it
        });


    }, [])

    return (

        <Row>
            <Col md={12} className="tiles-container">
                <Col lg={3} xs={6}>
                    <div className="small-box bg-aqua">
                        <div className="inner">
                            <h3>{tiles["overall"]}</h3>
                            <p>Total Registered Users</p>
                        </div>
                    </div>
                </Col>
                <Col lg={3} xs={6}>
                    <div className="small-box bg-aqua">
                        <div className="inner">
                            <h3>{tiles["year_1"]}</h3>
                            <p>Last Year Registered Users</p>
                        </div>
                    </div>
                </Col>
                <Col lg={3} xs={6}>
                    <div className="small-box bg-aqua">
                        <div className="inner">
                            <h3>{tiles["days_30"]}</h3>
                            <p>Last 30 days Registered Users</p>
                        </div>
                    </div>
                </Col>
                <Col lg={3} xs={6}>
                    <div className="small-box bg-aqua">
                        <div className="inner">
                            <h3>{tiles["days_7"]}</h3>
                            <p>Last 7 days Registered Users</p>
                        </div>
                    </div>
                </Col>
            </Col>
        </Row>
    )
}

export default RegisteredUsersTiles