import React, {useState, useContext, useEffect} from "react";
import Container from "react-bootstrap/Container";
import RegisteredUsersChart from "../../components/Users/registeredUsersChart";
import RegisteredUsersDataTable from "../../components/Users/registeredUsersDataTable";
import RegisteredUsersMap from "../../components/Users/registeredUsersMap";
import RegisteredUsersTiles from "../../components/Users/registeredUsersTiles";
import Header from "../../components/Common/header";
import Footer from "../../components/Common/footer";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {useQuery} from "react-query";
import {tenenvKey} from "../../utils/queryKeys";
import {getTenenv} from "../../utils/queries";
import {formatStartDate, formatEndDate} from "../../components/Common/utils";

const Users = () => {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  formatStartDate(oneYearAgo)

  const today = new Date();
  today.setDate(today.getDate() - 1);
  formatEndDate(today)
  const [tenenvId, setTenenvId] = useState(0);
  const [startDate, setStartDate] = useState(oneYearAgo);
  const [endDate, setEndDate] = useState(today);

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


  if (tenenvId == undefined || tenenvId == 0 || tenenvId == "") return

  return (
    <Container>
      <Header/>
      <Row>
        <Col className="title-container" md={12}>
          <Col md={6}><h2>Users</h2></Col>
        </Col>
      </Row>
      <RegisteredUsersTiles tenenvId={tenenvId}/>
      <RegisteredUsersChart tenenvId={tenenvId}/>
      <RegisteredUsersDataTable tenenvId={tenenvId}
                                setStartDate={setStartDate}
                                setEndDate={setEndDate}
                                startDate={startDate}
                                endDate={endDate}/>
      <RegisteredUsersMap tenenvId={tenenvId}
                          startDate={startDate}
                          endDate={endDate}/>
      <Footer/>
    </Container>)

}
export default Users;
