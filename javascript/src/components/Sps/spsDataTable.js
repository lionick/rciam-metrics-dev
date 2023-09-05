import React, {useState, useEffect} from "react";
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
import {loginsPerSpKey, minDateLoginsKey} from "../../utils/queryKeys";
import {getLoginsPerSP, getMinDateLogins} from "../../utils/queries";
import {useCookies} from "react-cookie";
import {createAnchorElement, formatStartDate, formatEndDate} from "../Common/utils";
import Spinner from "../Common/spinner";
import {format} from "date-fns";

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
  const controller = new AbortController
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
      'startDate': !startDate ? null : format(startDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      'endDate': !endDate ? null : format(endDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      'idp': idpId,
      'tenenv_id': tenenvId,
      'unique_logins': uniqueLogins
    },
    signal: controller.signal
  }

  const loginsPerSp = useQuery(
    [loginsPerSpKey, params],
    getLoginsPerSP,
    {
      enabled: false
    }
  )

  const minDateLogins = useQuery(
    [minDateLoginsKey, params],
    getMinDateLogins,
    {
      enabled: false,
      refetchOnWindowFocus: false
    }
  )

  useEffect(() => {
    params = {
      params: {
        'startDate': !startDate ? null : format(startDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        'endDate': !endDate ? null : format(endDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        'idp': idpId,
        'tenenv_id': tenenvId,
        'unique_logins': uniqueLogins
      },
      signal: controller.signal
    }

    try {
      const response = queryClient.refetchQueries([loginsPerSpKey, params])
      queryClient.refetchQueries([minDateLoginsKey, {params:{tenenv_id: tenenvId}}])
    } catch (error) {
      // todo: Here we can handle any authentication or authorization errors
      console.log(error)
    }

    return () => {
      controller.abort()
    }

  }, [uniqueLogins, btnPressed])

  // Construct the data required for the datatable
  useEffect(() => {
    const perSp = !loginsPerSp.isLoading
      && !loginsPerSp.isFetching
      && loginsPerSp.isSuccess
      && loginsPerSp?.data?.map(sp => ({
        "Service Provider Name": (cookies.userinfo == undefined && !!permissions?.actions?.service_providers?.['view']) ? sp.name : createAnchorElement(sp.name, `/metrics/services/${sp.id}`),
        "Service Provider Identifier": sp.identifier,
        "Number of Logins": sp.count
      }))

    if (!!loginsPerSp?.data && !!perSp) {
      if (minDate == undefined || minDate == "") {
        setMinDate(!!minDateLogins?.data?.min_date ? new Date(minDateLogins?.data?.min_date) : null)
      }
      // This is essential: We must destroy the datatable in order to be refreshed with the new data
      $("#" + dataTableId).DataTable().destroy()
      setSpsLogins(perSp)
    }
  }, [loginsPerSp.isSuccess && minDateLogins.isSuccess])

  const handleStartDateChange = (date) => {

    date = formatStartDate(date);
    if (date != null) {
      setStartDate(date);
    }
  };

  const handleEndDateChange = (date) => {

    date = formatEndDate(date);
    if (date != null) {
      setEndDate(date);
    }
  };


  if (loginsPerSp.isLoading
    || loginsPerSp.isFetching) {
    return (<Spinner/>)
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
                          onChange={handleStartDateChange}
      />
        To: <DatePicker selected={endDate}
                        minDate={minDate}
                        dateFormat="dd/MM/yyyy"
                        onChange={handleEndDateChange}
      />
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