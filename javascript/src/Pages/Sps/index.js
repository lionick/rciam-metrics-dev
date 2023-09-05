import React, {useState, useEffect} from "react";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import LoginSpPieChart from "../../components/Dashboard/loginSpPieChart";
import LoginTiles from "../../components/Dashboard/loginTiles";
import SpsDataTable from "../../components/Sps/spsDataTable";
import Header from "../../components/Common/header";
import {useQuery} from "react-query";
import {tenenvKey} from "../../utils/queryKeys";
import {getTenenv} from "../../utils/queries";
import {useNavigate} from "react-router-dom";
import {formatStartDate, formatEndDate} from "../../components/Common/utils";

const Sps = () => {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  formatStartDate(oneYearAgo)

  const today = new Date();
  today.setDate(today.getDate() - 1);
  formatEndDate(today)
  const [uniqueLogins, setUniqueLogins] = useState(false);
  const [tenenvId, setTenenvId] = useState(0);
  const [endDate, setEndDate] = useState(today);
  const [startDate, setStartDate] = useState(oneYearAgo);

  const tenant = window.tenant
  const environment = window.environment

  const tenenv = useQuery(
    [tenenvKey, {tenantId: tenant, environment: environment}],
    getTenenv, {
      retry: 0,
    })

  useEffect(() => {
    setTenenvId(tenenv?.data?.[0]?.id)
  }, [!tenenv.isLoading
  && tenenv.isSuccess
  && !tenenv.isFetching])

  const handleChange = event => {
    setUniqueLogins(event.target.checked);
  }

  let navigate = useNavigate();

  const goToSpecificProvider = (id, provider) => {
    const path = provider === "sp" ?
      `/metrics/services/${id}` :
      `/metrics/identity-providers/${id}`
    navigate(path);
  }

  if (tenenvId == undefined || tenenvId == 0 || tenenvId == "") return

  return (
    <Container>
      <Header></Header>
      <Row>
        <Col className="title-container" md={12}>
          <Col md={6}><h2>Service Providers Logins</h2></Col>
          <Col md={6} className="unique-logins">
            <Form className="unique-logins-form">
              <Form.Check
                type="checkbox"
                id="unique-logins"
                label="Unique Logins"
                onChange={handleChange}
              />
            </Form>
          </Col>
        </Col>
      </Row>
      <LoginTiles tenenvId={tenenvId}
                  uniqueLogins={uniqueLogins}/>
      <LoginSpPieChart tenenvId={tenenvId}
                       uniqueLogins={uniqueLogins}
                       goToSpecificProviderHandler={goToSpecificProvider}/>
      <SpsDataTable tenenvId={tenenvId}
                    uniqueLogins={uniqueLogins}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    startDate={startDate}
                    endDate={endDate}/>
    </Container>)

}
export default Sps;
