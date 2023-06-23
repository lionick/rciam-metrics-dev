import React, {useState, useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {envContext, tenantContext} from "../../Context/context";
import Form from 'react-bootstrap/Form';
import LoginDataTable from "../../components/Dashboard/loginDataTable";
import LoginIdpPieChart from "../../components/Dashboard/loginIdpPieChart";
import LoginLineChart from "../../components/Dashboard/loginLineChart";
import LoginsMap from "../../components/Dashboard/loginsMap";
import LoginSpPieChart from "../../components/Dashboard/loginSpPieChart";
import LoginTiles from "../../components/Dashboard/loginTiles";
import Header from "../../components/Common/header";
import Footer from "../../components/Common/footer";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {Container} from "react-bootstrap";
import {useQuery} from "react-query";
import {tenenvKey} from "../../utils/queryKeys";
import {getTenenv} from "../../utils/queries";

const Dashboard = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [uniqueLogins, setUniqueLogins] = useState(false);
  const [tenenvId, setTenenvId] = useState(0);
  const [tenantCon, setTenantCon] = useContext(tenantContext);
  const [envCon, setEnvCon] = useContext(envContext)

  const tenant = window.tenant
  const environment = window.environment

  const tenenv = useQuery(
    [tenenvKey, {tenantId: tenant, environment: environment}],
    getTenenv, {
      retry: 0,
    })

  useEffect(() => {
    setTenantCon(tenant)
    setEnvCon(environment)
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
      `/${tenant}/${environment}/services/${id}` :
      `/${tenant}/${environment}/identity-providers/${id}`
    navigate(path);
  }

  if (tenenvId == undefined
    || tenenvId == 0
    || tenenvId == "") {
    return
  }

  return (
    <Container>
      <Header/>
      <Row>
        <Col className="title-container" md={12}>
          <Col md={6}><h2>Dashboard</h2></Col>
          <Col md={6} className="unique-logins">
            <Form className="unique-logins-form">
              <Form.Check type="checkbox"
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
      <LoginLineChart tenenvId={tenenvId}
                      uniqueLogins={uniqueLogins}/>
      <LoginIdpPieChart tenenvId={tenenvId}
                        uniqueLogins={uniqueLogins}
                        goToSpecificProviderHandler={goToSpecificProvider}/>
      <LoginSpPieChart tenenvId={tenenvId}
                       uniqueLogins={uniqueLogins}
                       goToSpecificProviderHandler={goToSpecificProvider}/>
      <LoginDataTable startDateHandler={setStartDate}
                      endDateHandler={setEndDate}
                      tenenvId={tenenvId}
                      uniqueLogins={uniqueLogins}/>
      <LoginsMap startDate={startDate}
                 endDate={endDate}
                 tenenvId={tenenvId}
                 uniqueLogins={uniqueLogins}/>
      <Footer/>
    </Container>
  )

}
export default Dashboard;
