import React, {useState, useEffect, useCallback} from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getLoginsGroupByDay} from "../../utils/queries";
import {useQuery, useQueryClient} from "react-query";
import {loginsGroupByDayKey} from "../../utils/queryKeys";
import {Chart} from "react-google-charts";
import Spinner from "../Common/spinner"

const LoginLineChart = ({
                          type,
                          id,
                          tenenvId,
                          uniqueLogins
                        }) => {
  const queryClient = useQueryClient();
  const [lineData, setLineData] = useState([["Date", "Logins"], ['', 0]]
  )

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

  // Construct the data required for the chart
  useEffect(() => {
    const lineDataArray = !loginsGroupByDay.isLoading
      && !loginsGroupByDay.isFetching
      && loginsGroupByDay.isSuccess
      && loginsGroupByDay?.data?.map(element => ([new Date(element.date), element.count ?? 0]))

    if (!!loginsGroupByDay?.data && !!lineDataArray) {
      lineDataArray.unshift(["Date", "Logins"])
      setLineData(lineDataArray)
    }
  }, [!loginsGroupByDay.isLoading
  && !loginsGroupByDay.isFetching
  && loginsGroupByDay.isSuccess])

    // XXX Google Chart will not work if we return empty and then
    //     try to reload
    if (loginsGroupByDay.isLoading
      || loginsGroupByDay.isFetching
      || lineData?.length <= 2
    ) {
      return (<Spinner />)
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
          loader={<div>Data loading</div>}
          options={{
            legend: 'none'
          }}
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