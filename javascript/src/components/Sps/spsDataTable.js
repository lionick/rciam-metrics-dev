import {useState, useEffect} from "react";
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import Datatable from "../datatable";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import DatePicker from "react-datepicker";
import 'react-toastify/dist/ReactToastify.css';
import 'react-dropdown/style.css';
import "react-datepicker/dist/react-datepicker.css";
import {useQuery, useQueryClient} from "react-query";
import {loginsPerSpKey} from "../../utils/queryKeys";
import {getLoginsPerSP} from "../../utils/queries";
import {useCookies} from "react-cookie";
import {createAnchorElement} from "../Common/utils";

const SpsDataTable = ({
                        idpId,
                        dataTableId = "table-sp",
                        tenenvId,
                        uniqueLogins,
                        setStartDate,
                        setEndDate,
                        startDate,
                        endDate
                      }) => {
  const [cookies, setCookie] = useCookies();
  const permissions = cookies.permissions
  const tenant = window.tenant
  const environment = window.environment

  const [spsLogins, setSpsLogins] = useState([]);
  const [minDate, setMinDate] = useState("");
  const [btnPressed, setBtnPressed] = useState(false);
  const queryClient = useQueryClient();

  let params = {
    params: {
      'startDate': startDate,
      'endDate': endDate,
      'idp': idpId,
      'tenenv_id': tenenvId,
      'unique_logins': uniqueLogins
    }
  }

  const loginsPerSp = useQuery(
    [loginsPerSpKey, params],
    getLoginsPerSP,
    {
      enabled: false
    }
  )

  useEffect(() => {
    params = {
      params: {
        'startDate': startDate,
        'endDate': endDate,
        'idp': idpId,
        'tenenv_id': tenenvId,
        'unique_logins': uniqueLogins
      }
    }

    try {
      const response = queryClient.refetchQueries([loginsPerSpKey, params])
    } catch (error) {
      // todo: Here we can handle any authentication or authorization errors
      console.log(error)
    }

  }, [uniqueLogins, btnPressed])

  // Construct the data required for the datatable
  useEffect(() => {
    const perSp = !loginsPerSp.isLoading
      && !loginsPerSp.isFetching
      && loginsPerSp.isSuccess
      && loginsPerSp?.data?.map(sp => ({
        "Service Provider Name": (cookies.userinfo == undefined && !!permissions?.actions?.service_providers?.['view']) ? sp.name : createAnchorElement(sp.name, `/${tenant}/${environment}/identity-providers/${sp.id}`),
        "Service Provider Identifier": sp.identifier,
        "Number of Logins": sp.count
      }))

    if (!!loginsPerSp?.data && !!perSp) {
      if (minDate == undefined || minDate == "") {
        setMinDate(!!loginsPerSp?.data?.[0]?.min_date ? new Date(loginsPerSp?.data?.[0]?.min_date) : null)
      }
      // This is essential: We must destroy the datatable in order to be refreshed with the new data
      $("#" + dataTableId).DataTable().destroy()
      setSpsLogins(perSp)
    }
  }, [!loginsPerSp.isLoading
  && !loginsPerSp.isFetching
  && loginsPerSp.isSuccess])

  if (loginsPerSp.isLoading
    || loginsPerSp.isFetching
    // || minDate == undefined
    || spsLogins.length === 0) {
    return null
  }

  return (
    <Row className="box">
      <Col md={12}>
        <div className="box-header with-border">
          <h3 className="box-title">Number of logins</h3>
        </div>
      </Col>
      <Col lg={12} className="range_inputs">
        From: <DatePicker selected={startDate}
                          minDate={minDate}
                          dateFormat="dd/MM/yyyy"
                          onChange={(date) => setStartDate(date)}/>
        To: <DatePicker selected={endDate}
                        minDate={minDate}
                        dateFormat="dd/MM/yyyy"
                        onChange={(date) => setEndDate(date)}/>
        {/* Probably add a tooltip here that both fields are required */}
        <Button variant="light"
                disabled={startDate == undefined || endDate == undefined}
                onClick={() => setBtnPressed((prev) => !prev)}>
          Filter
        </Button>
      </Col>
      <Col lg={12}>
        <Datatable items={spsLogins}
                   dataTableId={dataTableId}/>
      </Col>
    </Row>
  )

}

export default SpsDataTable