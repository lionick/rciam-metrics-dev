import { useState, useContext, useEffect } from "react";
import { Chart } from "react-google-charts";
import "../../app.css";
import { client } from '../../utils/api';
import Select from 'react-select';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';


export const options = {
    title: "Overall number of logins per day",
    //curveType: "function",
    legend: 'none'
};


const LoginLineChart = ({ type, identifier, tenantId }) => {

    const [managed, setManaged] = useState(false);
    const [lineData, setLineData] = useState(["Date", "Logins"])
    useEffect(() => {
        var params = null
        console.log(type)
        params = { params: { tenant_id: tenantId } }
        if (type) {
            params["params"][[type]]= identifier
        }
        console.log(params)
        client.get("logins_groupby/day", params).
            then(response => {
                console.log(response)
                var lineDataArray = [["Date", "Logins"]];
                response["data"].forEach(element => {
                    lineDataArray.push([new Date(element.date), element.count])
                })
                console.log(lineDataArray)
                setLineData(lineDataArray)
            })
    }, [])


    // This is for Dates with no logins, we have to set 0 for these dates
    function setZerosIfNoDate(dataTable, google) {
        var lineDataArray = [["Date", "Logins"]]
        var datePattern = 'd.M.yy';
        var formatDate = new google.visualization.DateFormat({
            pattern: datePattern
        });
        var startDate = dataTable.getColumnRange(0).min;
        console.log(startDate)
        console.log(startDate.getTime())
        var endDate = dataTable.getColumnRange(0).max;
        var oneDay = (1000 * 60 * 60 * 24);
        for (var i = startDate.getTime(); i < endDate.getTime(); i = i + oneDay) {
            var coffeeData = dataTable.getFilteredRows([{
                column: 0,
                test: function (value, row, column, table) {
                    var coffeeDate = formatDate.formatValue(table.getValue(row, column));
                    var testDate = formatDate.formatValue(new Date(i));
                    return (coffeeDate === testDate);
                }
            }]);
            if (coffeeData.length === 0) {
                dataTable.addRow([
                    new Date(i),
                    0
                ]);
            }
        }
        dataTable.sort({
            column: 0
        });
        for (var i = 0; i < dataTable.getNumberOfRows(); i++) {
            var row = [dataTable.getValue(i, 0), dataTable.getValue(i, 1)]

            lineDataArray.push([row[0], row[1]])

        }
        console.log(lineDataArray)
        setManaged(true);
        setLineData(lineDataArray)

        return dataTable;
    }


    return (
        <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            data={lineData}
            options={options}
            chartEvents={[
                {
                    eventName: "ready",
                    callback: ({ chartWrapper, google }) => {
                        const chart = chartWrapper.getChart();
                        if (!managed) {
                            console.log(managed)
                            setZerosIfNoDate(chartWrapper.getDataTable(), google)
                        }
                        google.visualization.events.addListener(chart, "click", (e) => {
                            console.log("CLICK");
                        });
                    }
                }
            ]}
            controls={[
                {

                    controlType: "ChartRangeFilter",
                    options: {
                        filterColumnIndex: 0,
                        ui: {
                            chartType: "LineChart",
                            chartOptions: {
                                chartArea: { width: "95%", height: "40%" },
                                hAxis: { baselineColor: "none" },
                            },
                        },
                    },
                    controlPosition: "bottom",

                },
            ]}
        />
    );
}

export default LoginLineChart