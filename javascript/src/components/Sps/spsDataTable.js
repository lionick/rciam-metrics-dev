import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from '../../utils/api';
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import Datatable from "../datatable";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-dropdown/style.css';
import "react-datepicker/dist/react-datepicker.css";

const SpsDataTable = ({ startDateHandler, endDateHandler, idpId, dataTableId = "table", tenantId, uniqueLogins }) => {
    const [spsLogins, setSpsLogins] = useState();
    var spsLoginsArray = [];
    const [minDate, setMinDate] = useState("");
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const { project, environment } = useParams();

    useEffect(() => {
        var params = { params: { 'tenant_id': tenantId, 'unique_logins': uniqueLogins } }
        if (idpId)
            params["params"]["idp"] = idpId
        client.get("logins_per_sp/", params).then(response => {
                console.log(response);
                //var minDateFromData = ""
                response["data"].forEach(element => {
                    //var community = {"created":element.created, "name":element.community_info.name}

                    // var range_date = new Date(element.range_date);
                    // if (minDateFromData == "") {
                    //     minDateFromData = new Date(element.min_date)
                    // }
                    var perSp = { "Service Provider Name": '<a href="/' + project + '/' + environment + '/services/' + element.id + '">' + element.name + '</a>', "Service Provider Identifier": element.identifier, "Number of Logins": element.count }
                    spsLoginsArray.push(perSp)

                });
                // setMinDate(minDateFromData)
                $("#" + dataTableId).DataTable().destroy()
                setSpsLogins(spsLoginsArray)
            })
        // 

    }, [uniqueLogins])

    const handleChange = () => {
        spsLoginsArray = []
        if (!startDate || !endDate) {
            toast.error('You have to fill both startDate and endDate.', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return
        }
        // set parent states
        // startDateHandler(startDate)
        // endDateHandler(endDate)
        var params = {
            params: {
                'startDate': startDate,
                'endDate': endDate,
                'idp': idpId ? idpId : null,
                'tenant_id': tenantId,
                'unique_logins': uniqueLogins
            }
        }
        client.get("logins_per_sp/", params).then(response => {
                //console.log(response);
                response["data"].forEach(element => {

                    var perSp = { "Service Provider Name": element.name, "Service Provider Identifier": element.entityid, "Number of Logins": element.count }
                    spsLoginsArray.push(perSp)

                });
                // This is essential: We must destroy the datatable in order to be refreshed with the new data
                $("#" + dataTableId).DataTable().destroy()
                setSpsLogins(spsLoginsArray)

            })
        //setSelected(event.value);
    };

    return <Row className="box">
        <Col md={12}>
            <div className="box-header with-border">
                <h3 className="box-title">Number of logins</h3>
            </div>
        </Col>
        <Col lg={12} className="range_inputs">

            From: <DatePicker selected={startDate} minDate={minDate} dateFormat="dd/MM/yyyy" onChange={(date: Date) => setStartDate(date)}></DatePicker>
            To: <DatePicker selected={endDate} minDate={minDate} dateFormat="dd/MM/yyyy" onChange={(date: Date) => setEndDate(date)}></DatePicker>
            <Button variant="light" onClick={handleChange}>Filter</Button>
            <ToastContainer position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark" />
        </Col>
        <Col lg={12}>
            <Datatable items={spsLogins} dataTableId={dataTableId}></Datatable>
        </Col>
    </Row>


}

export default SpsDataTable