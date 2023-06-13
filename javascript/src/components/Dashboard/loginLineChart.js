import {useState, useEffect} from "react";
import {Chart} from "react-google-charts";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getLoginsGroupByDay} from "../../utils/queries";
import {useQuery, useQueryClient} from "react-query";
import {loginsGroupByDayKey} from "../../utils/queryKeys";

export const options = {
  // title: "Overall number of logins per day",
  //curveType: "function",
  legend: 'none'
};


const LoginLineChart = ({
                          type,
                          id,
                          tenenvId,
                          uniqueLogins
                        }) => {
  const queryClient = useQueryClient();
  const [managed, setManaged] = useState(false);
  const [lineData, setLineData] = useState([["Date", "Logins"]])

  let params = {
    params: {
      tenenv_id: tenenvId,
      unique_logins: uniqueLogins
    }
  }

  const loginsGroupByDay = useQuery(
    [loginsGroupByDayKey, params],
    getLoginsGroupByDay,
    {
      enabled: false
    }
  )

  useEffect(() => {
    params = {
      params: {
        tenenv_id: tenenvId,
        unique_logins: uniqueLogins
      }
    }

    if (type) {
      params["params"][type] = id
    }


    try {
      const response = queryClient.refetchQueries([loginsGroupByDayKey, params])
    } catch (error) {
      // todo: Here we can handle any authentication or authorization errors
      console.log(error)
    }
  }, [uniqueLogins])

  // Construct the data required for the datatable
  useEffect(() => {
    const lineDataArray = !loginsGroupByDay.isLoading
      && !loginsGroupByDay.isFetching
      && loginsGroupByDay.isSuccess
      && loginsGroupByDay?.data?.map(element => ([new Date(element.date), element.count]))

    if (!!loginsGroupByDay?.data && !!lineDataArray) {
      lineDataArray.unshift(["Date", "Logins"])
      setLineData(lineDataArray)
      setManaged(false);
    }
  }, [!loginsGroupByDay.isLoading
  && !loginsGroupByDay.isFetching
  && loginsGroupByDay.isSuccess])


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
      var rowsData = dataTable.getFilteredRows([{
        column: 0,
        test: function (value, row, column, table) {
          var rowDate = formatDate.formatValue(table.getValue(row, column));
          var testDate = formatDate.formatValue(new Date(i));
          return (rowDate === testDate);
        }
      }]);
      if (rowsData.length === 0) {
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

  if (lineData?.length <= 1
      || loginsGroupByDay.isLoading
      || loginsGroupByDay.isFetching
  ) {
    return null
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
          data={lineData ?? []}
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