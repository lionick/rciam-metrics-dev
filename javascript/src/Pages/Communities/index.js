import React, {useState, useEffect} from "react";
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
import {useCookies} from "react-cookie";

const Communities = () => {
  const [tenenvId, setTenenvId] = useState(0);
  const [cookies, setCookie] = useCookies();

  const tenant = cookies['x-tenant']
  const environment = cookies['x-environment']


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

  if(tenenv.isLoading
     || tenenv.isFetching) {
    return (<Spinner />)
  }

  if (tenenvId == undefined
      || tenenvId == 0
      || tenenvId == "") {
    return null
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
