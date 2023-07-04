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
import {loginsPerIdpKey} from "../../utils/queryKeys";
import {getLoginsPerIdp} from "../../utils/queries";
import {useCookies} from "react-cookie";
import {createAnchorElement} from "../Common/utils";
import {toast} from "react-toastify";
import Spinner from "../Common/spinner";

const IdpsDataTable = ({
                         spId,
                         dataTableId = "table-idp",
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

  const [idpsLogins, setIdpsLogins] = useState([]);
  const [minDate, setMinDate] = useState("");
  const [btnPressed, setBtnPressed] = useState(false);
  const queryClient = useQueryClient();

  let params = {
    params: {
      'startDate': startDate,
      'endDate': endDate,
      'sp': spId,
      'tenenv_id': tenenvId,
      'unique_logins': uniqueLogins
    }
  }

  const loginsPerIpd = useQuery(
    [loginsPerIdpKey, params],
    getLoginsPerIdp,
    {
      enabled: false
    }
  )

  useEffect(() => {
    params = {
      params: {
        'startDate': startDate,
        'endDate': endDate,
        'sp': spId,
        'tenenv_id': tenenvId,
        'unique_logins': uniqueLogins
      }
    }

    try {
      const response = queryClient.refetchQueries([loginsPerIdpKey, params])
    } catch (error) {
      // todo: Here we can handle any authentication or authorization errors
      console.log(error)
    }

  }, [uniqueLogins, btnPressed])

  // Construct the data required for the datatable
  useEffect(() => {
    const perIdp = !loginsPerIpd.isLoading
      && !loginsPerIpd.isFetching
      && loginsPerIpd.isFetched
      && loginsPerIpd.isSuccess
      && loginsPerIpd?.data?.map(idp => ({
        "Identity Provider Name": (cookies.userinfo == undefined && !!permissions?.actions?.identity_providers?.['view']) ? idp.name : createAnchorElement(idp.name, `/${tenant}/${environment}/identity-providers/${idp.id}`),
        "Identity Provider Identifier": idp.entityid,
        "Number of Logins": idp.count
      }))

    if (!!loginsPerIpd?.data && !!perIdp) {
      // This is essential: We must destroy the datatable in order to be refreshed with the new data
      $("#" + dataTableId).DataTable().destroy()
      setIdpsLogins(perIdp)
    }
  }, [!loginsPerIpd.isLoading
  && !loginsPerIpd.isFetching
  && loginsPerIpd.isSuccess])

  const handleBtnclick = () => {
    if (!startDate || !endDate) {
      toast.warning("You have to fill both startDate and endDate")
      return
    }
    setBtnPressed((prev) => !prev)
  }

  if (loginsPerIpd.isLoading
    || loginsPerIpd.isFetching
    || idpsLogins.length === 0) {
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
                          onChange={(date) => setStartDate(date)}/>
        To: <DatePicker selected={endDate}
                        minDate={minDate}
                        dateFormat="dd/MM/yyyy"
                        onChange={(date) => setEndDate(date)}/>
        {/* Probably add a tooltip here that both fields are required */}
        <Button variant="light"
                disabled={startDate == undefined || endDate == undefined}
                onClick={handleBtnclick}>
          Filter
        </Button>
      </Col>
      <Col lg={12}>
        <Datatable items={idpsLogins}
                   dataTableId={dataTableId}/>
      </Col>
    </Row>
  )

}

export default IdpsDataTable