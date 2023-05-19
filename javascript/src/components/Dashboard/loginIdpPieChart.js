import {useState, useContext, useEffect} from "react";
import {Chart} from "react-google-charts";
import {client} from '../../utils/api';

import Select from 'react-select';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import {convertDateByGroup, getWeekNumber} from "../Common/utils";
import {useQuery} from "react-query";
import {loginsPerIdpKey} from "../../utils/queryKeys";
import {getLoginsPerIdp} from "../../utils/queries";

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
var idpsArray = [];
const LoginIdpPieChart = ({
                            setShowModalHandler,
                            spId,
                            tenantId,
                            uniqueLogins,
                            goToSpecificProviderHandler
                          }) => {
  let idpsChartArray = [["Identity Provider", "Logins"]];
  const [idps, setIdps] = useState(idpsChartArray);

  const params = {
    params: {
      'tenant_id': tenantId,
      'unique_logins': uniqueLogins,
      'sp': spId
    }
  }

  const loginsPerIpd = useQuery(
    [loginsPerIdpKey, params],
    getLoginsPerIdp
  )

  useEffect(() => {
    loginsPerIpd.refetch()
      .then(response => {
        response?.data.forEach(element => {
          idpsChartArray.push([element.name, element.count])
          idpsArray.push([element.id, element.name, element.identifier])
        })
        setIdps(idpsChartArray)
      })

  }, [uniqueLogins])

  if (loginsPerIpd.isLoading
    || loginsPerIpd.isFetching
    || idps.length === 1 ) {
    return null
  }

  return (
    <Row>
      <Col md={12} className="box">
        <div className="box-header with-border">
          <h3 className="box-title">Overall number of logins per IdP</h3>
        </div>
        <Chart
          chartType="PieChart"
          data={idps}
          options={options}
          width={"100%"}
          height={"400px"}
          className="pieChart"
          chartEvents={[
            {
              eventName: "ready",
              callback: ({chartWrapper, google}) => {
                const chart = chartWrapper.getChart();

                google.visualization.events.addListener(chart, 'click', selectHandler);
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
                    var identifier = idpsArray[selection[0].row];
                    goToSpecificProviderHandler(identifier[0])
                  }
                }
              }
            }
          ]}
        /></Col>
    </Row>
  );
}

export default LoginIdpPieChart