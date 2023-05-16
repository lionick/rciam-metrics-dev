import {useState, useContext, useEffect} from "react";
import {Chart} from "react-google-charts";
import {client} from '../../utils/api';
import Select from 'react-select';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';


export const options = {
  // title: "Overall number of logins per day",
  //curveType: "function",
  legend: 'none'
};


const LoginLineChart = ({type, id, tenantId, uniqueLogins}) => {

  const [managed, setManaged] = useState(false);
  const [lineData, setLineData] = useState(["Date", "Logins"])
  useEffect(() => {
    var params = null
    params = {params: {tenant_id: tenantId, 'unique_logins': uniqueLogins}}
    if (type) {
      params["params"][[type]] = id
    }
    client.get("logins_groupby/day", params).then(response => {
      var lineDataArray = [["Date", "Logins"]];
      response["data"].forEach(element => {
        lineDataArray.push([new Date(element.date), element.count])
      })
      setLineData(lineDataArray)
    })
  }, [uniqueLogins])


  // This is for Dates with no logins, we have to set 0 for these dates
  function setZerosIfNoDate(dataTable, google) {
    var lineDataArray = [["Date", "Logins"]]
    var datePattern = 'd.M.yy';
    var formatDate = new google.visualization.DateFormat({
      pattern: datePattern
    });
    var startDate = dataTable.getColumnRange(0).min;
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
    setManaged(true);
    setLineData(lineDataArray)

    return dataTable;
  }


  return (
    <Row>
      <Col md={12} className="box">
        <div className="box-header with-border">
          <h3 className="box-title">Overall number of logins per day</h3>
        </div>
        <Chart
          chartType="LineChart"
          width="100%"
          data={lineData}
          options={options}
          chartEvents={[
            {
              eventName: "ready",
              callback: ({chartWrapper, google}) => {
                const chart = chartWrapper.getChart();
                if (!managed) {
                  setZerosIfNoDate(chartWrapper.getDataTable(), google)
                }
                google.visualization.events.addListener(chart, "click", (e) => {
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
                    chartArea: {width: "80%", height: "100%"},
                    hAxis: {baselineColor: "none"},
                  },
                },
              },
              controlPosition: "bottom",

            },
          ]}
        />
      </Col>
    </Row>
  );
}

export default LoginLineChart