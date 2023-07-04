import React, {useState, useContext, useEffect} from "react";
import {useQuery} from 'react-query';
import Container from "react-bootstrap/Container";
import CommunitiesChart from "../../components/Communities/communitiesChart";
import CommunitiesDataTable from "../../components/Communities/communitiesDataTable";
import CommunitiesMap from "../../components/Communities/communitiesMap";
import Header from "../../components/Common/header";
import Footer from "../../components/Common/footer";
import Spinner from "../../components/Common/spinner"
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {tenenvKey} from '../../utils/queryKeys'
import {getTenenv} from '../../utils/queries'

const Communities = () => {
  const [tenenvId, setTenenvId] = useState(0);

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

  if (tenenvId == undefined || tenenvId == 0 || tenenvId == "") {
    return (<Spinner />)
  }

  return (
    <Container>
      <Header/>
      <Row>
        <Col className="title-container" md={12}>
          <Col md={6}><h2>Communities</h2></Col>
        </Col>
      </Row>
      <CommunitiesChart tenenvId={tenenvId}/>
      <CommunitiesDataTable tenenvId={tenenvId}/>
      <CommunitiesMap tenenvId={tenenvId}/>
      <Footer/>
    </Container>)

}
export default Communities;
