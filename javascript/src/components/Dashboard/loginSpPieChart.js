import { useState, useContext, useEffect } from "react";
import { Chart } from "react-google-charts";
import { client } from '../../utils/api';
import Select from 'react-select';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import { convertDateByGroup, getWeekNumber } from "../Common/utils";

export const options = {
    pieSliceText: 'value',
    width: '100%',
    height: '350',
    chartArea: {
        left: "3%",
        top: "3%",
        height: "94%",
        width: "94%"
    },
    sliceVisibilityThreshold: .005,
    tooltip: { isHtml: true, trigger: "selection" }
};
var spsArray = [];
const LoginSpPieChart = ({ setShowModalHandler, idpId, tenantId, uniqueLogins, goToSpecificProviderHandler }) => {
    const [sps, setSps] = useState([["Service Provider", "Logins"]]);
    var spsChartArray = [["Service Provider", "Logins"]];


    useEffect(() => {
        var params = null
        params = { params: { tenant_id: tenantId, unique_logins: uniqueLogins } }
        if (idpId) {
            params["params"]["idp"] = idpId
        }

        client.get("logins_per_sp/", params).
            then(response => {
                response["data"].forEach(element => {
                    spsChartArray.push([element.name, element.count])
                    spsArray.push([element.id, element.name, element.identifier])
                })

                setSps(spsChartArray)
            })

    }, [uniqueLogins])
    return (
        <Row>
            <Col md={12} className="box">
                <div className="box-header with-border">
                    <h3 className="box-title">Overall number of logins per SP</h3>
                </div>
                <Chart
                    chartType="PieChart"
                    data={sps}
                    options={options}
                    width={"100%"}
                    height={"400px"}
                    className="pieChart"
                    chartEvents={[
                        {
                            eventName: "ready",
                            callback: ({ chartWrapper, google }) => {
                                const chart = chartWrapper.getChart();
                                
                                google.visualization.events.addListener(chart, 'click', selectHandler);
                                google.visualization.events.addListener(chart, 'onmouseover', showTooltip);
                                google.visualization.events.addListener(chart, 'onmouseout', hideTooltip);

                                function showTooltip(entry) {

                                    chart.setSelection([{ row: entry.row }]);
                                    $('.pieChart').css('cursor', 'pointer')
                                }
                                function hideTooltip() {

                                    chart.setSelection([]);
                                    $('.pieChart').css('cursor', 'default')
                                }
                                function selectHandler() {
                                    var selection = chart.getSelection();
                                    if (selection.length) {
                                        var identifier = spsArray[selection[0].row];
                                        //var legend = data.getValue(selection[0].row, 0);
                                        // Show Modal
                                        // setShowModalHandler(true)
                                        // activeTab = $("ul.tabset_tabs li.ui-tabs-active").attr("aria-controls").replace("Tab","");
                                        // unique_logins = $("#myModal").is(':visible') ? $("#unique-logins-modal").is(":checked") : $("#unique-logins-"+activeTab).is(":checked");
                                        // goToSpecificProvider(identifier, legend, type, unique_logins);
                                        goToSpecificProviderHandler(identifier[0], "sp")
                                    }
                                }
                            }
                        }
                    ]}
                />
            </Col>
        </Row>
    );
}

export default LoginSpPieChart