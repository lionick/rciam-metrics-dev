import {useState, useEffect} from "react";
import {Chart} from "react-google-charts";
import {useCookies} from "react-cookie";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import {loginsPerSpKey} from "../../utils/queryKeys";
import {getLoginsPerSP} from "../../utils/queries";
import {useQuery} from "react-query";

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
  tooltip: {isHtml: true, trigger: "selection"}
};

var spsArray = [];

const LoginSpPieChart = ({
                           setShowModalHandler,
                           idpId,
                           tenenvId,
                           uniqueLogins,
                           goToSpecificProviderHandler
                         }) => {
  let spsChartArray = [["Service Provider", "Logins"]];
  const [sps, setSps] = useState(spsChartArray);

  const params = {
    params:
      {
        tenenv_id: tenenvId,
        unique_logins: uniqueLogins,
        idp: idpId
      }
  }

  const [cookies, setCookie] = useCookies();

  const loginsPerSp = useQuery(
    [loginsPerSpKey, params],
    getLoginsPerSP,
    {
      refetchOnWindowFocus: false,
      enabled: false
    }
  )

  useEffect(() => {
    loginsPerSp.refetch()
      .then(response => {
        response?.data.forEach(element => {
          spsChartArray.push([element.name, element.count])
          spsArray.push([element.id, element.name, element.identifier])
        })
        setSps(spsChartArray)
      })
  }, [uniqueLogins])

  if (loginsPerSp.isLoading
      || loginsPerSp.isFetching
      || sps.length === 1) {
    return null
  }

  return (
    <Row>
      <Col md={12} className="box">
        <div className="box-header with-border">
          <h3 className="box-title">Overall number of logins per SP</h3>
        </div>
        <Chart
          chartType="PieChart"
          data={sps ?? []}
          options={options}
          width={"100%"}
          height={"400px"}
          className="pieChart"
          chartEvents={[
            {
              eventName: "ready",
              callback: ({chartWrapper, google}) => {
                const chart = chartWrapper.getChart();

                if (cookies.userinfo != undefined) {
                  google.visualization.events.addListener(chart, 'click', selectHandler);
                }
                google.visualization.events.addListener(chart, 'onmouseover', showTooltip);
                google.visualization.events.addListener(chart, 'onmouseout', hideTooltip);

                function showTooltip(entry) {

                  chart.setSelection([{row: entry.row}]);
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