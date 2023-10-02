import React, {useState, useEffect} from "react";
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
import {useNavigate} from "react-router-dom";
import { formatEndDate, formatStartDate } from "../../components/Common/utils";
import {useCookies} from "react-cookie";

const Dashboard = () => {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  formatStartDate(oneYearAgo)

  const today = new Date();
  today.setDate(today.getDate() - 1);
  formatEndDate(today)

  const [startDate, setStartDate] = useState(oneYearAgo);
  const [endDate, setEndDate] = useState(today);
  const [minDate, setMinDate] = useState(null);
  const [uniqueLogins, setUniqueLogins] = useState(false);
  const [tenenvId, setTenenvId] = useState(0);
  const [cookies, setCookie] = useCookies();
  const tenant = cookies['x-tenant']
  const environment = cookies['x-environment']

  const tenenv = useQuery(
    [tenenvKey, {tenantId: tenant, environment: environment}],
    getTenenv, {
      retry: 0,
      refetchOnWindowFocus: false
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
                      minDateHandler={setMinDate}
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
