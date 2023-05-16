import {useState, useContext, useEffect} from "react";
import {useParams} from "react-router-dom";
import {useQuery} from 'react-query';
import {envContext, projectContext} from "../../Context/context";
import Container from "react-bootstrap/Container";
import CommunitiesChart from "../../components/Communities/communitiesChart";
import CommunitiesDataTable from "../../components/Communities/communitiesDataTable";
import CommunitiesMap from "../../components/Communities/communitiesMap";
import Header from "../../components/Common/header";
import Footer from "../../components/Common/footer";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {tenantKey} from '../../utils/queryKeys'
import {getTenant} from '../../utils/queries'

const Communities = () => {
  const {project, environment} = useParams();
  const [tenantId, setTenantId] = useState(0);
  const [projectCon, setProjectCon] = useContext(projectContext);
  const [envCon, setEnvCon] = useContext(envContext)

  const tenant = useQuery(
    [tenantKey, {projectId: project, environment: environment}],
    getTenant, {
      retry: 0,
    })

  console.log('tenant', tenant)


  useEffect(() => {
    setProjectCon(project)
    setEnvCon(environment)
    setTenantId(tenant?.data?.data?.id)
  }, [!tenant.isLoading
           && tenant.isSuccess
           && !tenant.isFetching])

  if (tenantId == 0) return

  return (
    <Container>
      <Header></Header>
      <Row>
        <Col className="title-container" md={12}>
          <Col md={6}><h2>Communities</h2></Col>
        </Col>
      </Row>
      <CommunitiesChart tenantId={tenantId}></CommunitiesChart>
      <CommunitiesDataTable tenantId={tenantId}></CommunitiesDataTable>
      <CommunitiesMap tenantId={tenantId}></CommunitiesMap>
      <Footer></Footer>
    </Container>)

}
export default Communities;
