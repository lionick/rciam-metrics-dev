import {useState, useEffect, useContext} from "react";
import {useParams} from "react-router-dom";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {useNavigate} from "react-router-dom";
import {envContext, projectContext} from "../../Context/context";
import LoginLineChart from "../../components/Dashboard/loginLineChart";
import LoginTiles from "../../components/Dashboard/loginTiles";
import Form from 'react-bootstrap/Form';
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import EntityInfoSp from "../../components/Common/entityInfoSp";
import LoginIdpPieChart from "../../components/Dashboard/loginIdpPieChart";
import IdpsDataTable from "../../components/Idps/idpsDataTable";
import SpMap from "../../components/Sps/spMap";
import SpMapToDataTable from "../../components/Sps/spMapToDataTable";
import Header from "../../components/Common/header";
import 'react-tabs/style/react-tabs.css';
import {useQuery} from "react-query";
import {tenantKey} from "../../utils/queryKeys";
import {getTenant} from "../../utils/queries";


const Sp = () => {
  const {project, environment, id} = useParams();
  const [tenantId, setTenantId] = useState(0);
  const [uniqueLogins, setUniqueLogins] = useState(false);
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


  if (tenantId == undefined || tenantId == 0 || tenantId == "") return;


  return (
    <Container>
      <Header></Header>
      <Row>
        <Col className="title-container" md={12}>
          <Col md={6}>
            <EntityInfoSp tenantId={tenantId}
                                    spId={id}/>
          </Col>
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
      <LoginTiles tenantId={tenantId} uniqueLogins={uniqueLogins} spId={id}></LoginTiles>
      <LoginLineChart tenantId={tenantId} type="sp" id={id} uniqueLogins={uniqueLogins}></LoginLineChart>
      <LoginIdpPieChart tenantId={tenantId} spId={id} uniqueLogins={uniqueLogins}
                        goToSpecificProviderHandler={goToSpecificProvider}></LoginIdpPieChart>
      <IdpsDataTable tenantId={tenantId} spId={id} dataTableId="tableSps" uniqueLogins={uniqueLogins}></IdpsDataTable>
      <Tabs>
        <TabList>
          <Tab>Map</Tab>
          <Tab>Datatable</Tab>
        </TabList>

        <TabPanel>
          <SpMap tenantId={tenantId} spId={id} uniqueLogins={uniqueLogins}></SpMap>
        </TabPanel>
        <TabPanel>
          <SpMapToDataTable tenantId={tenantId} spId={id} uniqueLogins={uniqueLogins}></SpMapToDataTable>
        </TabPanel>
      </Tabs>
    </Container>
  )
}

export default Sp