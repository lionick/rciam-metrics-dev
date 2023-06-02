import {useState, useContext, useEffect} from "react";
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {envContext, projectContext} from "../../Context/context";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import LoginSpPieChart from "../../components/Dashboard/loginSpPieChart";
import LoginTiles from "../../components/Dashboard/loginTiles";
import SpsDataTable from "../../components/Sps/spsDataTable";
import Header from "../../components/Common/header";
import {useQuery} from "react-query";
import {tenantKey} from "../../utils/queryKeys";
import {getTenant} from "../../utils/queries";

const Sps = () => {

  const [uniqueLogins, setUniqueLogins] = useState(false);
  const {project, environment} = useParams();
  const [tenantId, setTenantId] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [projectCon, setProjectCon] = useContext(projectContext);
  const [envCon, setEnvCon] = useContext(envContext)

  const tenant = useQuery(
    [tenantKey, {projectId: project, environment: environment}],
    getTenant, {
      retry: 0,
    })

  useEffect(() => {
    setProjectCon(project)
    setEnvCon(environment)
    setTenantId(tenant?.data?.[0]?.id)
  }, [!tenant.isLoading
  && tenant.isSuccess
  && !tenant.isFetching])

  const handleChange = event => {
    setUniqueLogins(event.target.checked);
  }
  let navigate = useNavigate();
  const goToSpecificProvider = (id, provider) => {
    var path = ""
    if (provider === "sp") {
      path = "/" + project + "/" + environment + "/services/" + id;
    } else {
      path = "/" + project + "/" + environment + "/identity-providers/" + id;
    }
    navigate(path);
  }
  if (tenantId == undefined || tenantId == 0 || tenantId == "") return

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
      <LoginTiles tenantId={tenantId}
                  uniqueLogins={uniqueLogins}/>
      <LoginSpPieChart tenantId={tenantId}
                       uniqueLogins={uniqueLogins}
                       setShowModalHandler={setShowModal}
                       goToSpecificProviderHandler={goToSpecificProvider}/>
      <SpsDataTable tenantId={tenantId}
                    uniqueLogins={uniqueLogins}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    startDate={startDate}
                    endDate={endDate}/>
    </Container>)

}
export default Sps;
