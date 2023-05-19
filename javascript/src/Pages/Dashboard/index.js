import {useState, useEffect, useContext} from "react";
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {envContext, projectContext} from "../../Context/context";
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
import {tenantKey} from "../../utils/queryKeys";
import {getTenant} from "../../utils/queries";

const Dashboard = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [uniqueLogins, setUniqueLogins] = useState(false);
  const [tenantId, setTenantId] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const {project, environment} = useParams();
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
    if (provider == "sp") {
      var path = "/" + project + "/" + environment + "/services/" + id;
    } else {
      var path = "/" + project + "/" + environment + "/identity-providers/" + id;
    }
    navigate(path);
  }

  if (tenantId == undefined || tenantId == 0 || tenantId == "") return

  return (
    <Container>
      <Header></Header>
      <Row>
        <Col className="title-container" md={12}>
          <Col md={6}><h2>Dashboard</h2></Col>
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
      <LoginLineChart tenantId={tenantId}
                      uniqueLogins={uniqueLogins}/>
      <LoginIdpPieChart tenantId={tenantId}
                        setShowModalHandler={setShowModal}
                        uniqueLogins={uniqueLogins}
                        goToSpecificProviderHandler={goToSpecificProvider}/>
      <LoginSpPieChart tenantId={tenantId}
                       setShowModalHandler={setShowModal}
                       uniqueLogins={uniqueLogins}
                       goToSpecificProviderHandler={goToSpecificProvider}/>
      <LoginDataTable startDateHandler={setStartDate}
                      endDateHandler={setEndDate}
                      tenantId={tenantId}
                      uniqueLogins={uniqueLogins}/>
      <LoginsMap startDate={startDate}
                 endDate={endDate}
                 tenantId={tenantId}
                 uniqueLogins={uniqueLogins}/>
      <Footer></Footer>
    </Container>
  )

}
export default Dashboard;
