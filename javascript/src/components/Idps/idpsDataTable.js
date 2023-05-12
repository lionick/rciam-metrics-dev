import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from '../../utils/api';
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import Datatable from "../datatable";
import dateFormat from 'dateformat';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import DatePicker from "react-datepicker";
import Dropdown from 'react-dropdown';
import { ToastContainer, toast } from 'react-toastify';
import { convertDateByGroup, getWeekNumber } from "../Common/utils";
import 'react-toastify/dist/ReactToastify.css';
import 'react-dropdown/style.css';
import "react-datepicker/dist/react-datepicker.css";

const dropdownOptions = [

    { value: 'day', label: 'Daily Basis', className: 'myOptionClassName' },
    { value: 'week', label: 'Weekly Basis', className: 'myOptionClassName' },
    { value: 'month', label: 'Monthly Basis' },
    { value: 'year', label: 'Yearly Basis' },
]

const IdpsDataTable = ({ startDateHandler, endDateHandle, spId, dataTableId = "table", tenantId, uniqueLogins }) => {
    const [idpsLogins, setIdpsLogins] = useState();
    var idpsLoginsArray = [];
    const [minDate, setMinDate] = useState("");
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const { project, environment } = useParams();

    useEffect(() => {
        var params = { params: { tenant_id: tenantId, 'unique_logins': uniqueLogins } }
        if (spId) {
            params["params"]["sp"] = spId
        }
        client.get("logins_per_idp/", params).
            then(response => {
                console.log(project);
                //var minDateFromData = ""
                response["data"].forEach(element => {

                    var perIdp = { "Identity Provider Name": '<a href="/' + project + '/' + environment + '/idps/' + element.id + '">' + element.name + '</a>', "Identity Provider Identifier": element.entityid, "Number of Logins": element.count }
                    idpsLoginsArray.push(perIdp)

                });
                // setMinDate(minDateFromData)
                $("#" + dataTableId).DataTable().destroy()
                setIdpsLogins(idpsLoginsArray)
            })
        // 

    }, [uniqueLogins])

    const handleChange = () => {
        //console.log(event.value);
        idpsLoginsArray = []
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
                'sp': spId ? spId : null,
                'tenant_id': tenantId,
                'unique_logins': uniqueLogins
            }
        }
        client.get("logins_per_idp/", params).
            then(response => {
                response["data"].forEach(element => {

                    var perIdp = { "Identity Provider Name": element.name, "Identity Provider Identifier": element.entityid, "Number of Logins": element.count }
                    idpsLoginsArray.push(perIdp)

                });
                // This is essential: We must destroy the datatable in order to be refreshed with the new data
                $("#" + dataTableId).DataTable().destroy()
                setIdpsLogins(idpsLoginsArray)

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
            <Datatable items={idpsLogins} dataTableId={dataTableId}></Datatable>
        </Col>
    </Row>


}

export default IdpsDataTable