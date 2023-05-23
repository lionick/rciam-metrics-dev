import {useState, useEffect, useContext, useId} from "react";
import {useParams} from "react-router-dom";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {useNavigate} from "react-router-dom";
import {envContext, projectContext} from "../../Context/context";
import LoginLineChart from "../../components/Dashboard/loginLineChart";
import LoginSpPieChart from "../../components/Dashboard/loginSpPieChart";
import LoginTiles from "../../components/Dashboard/loginTiles";
import SpsDataTable from "../../components/Sps/spsDataTable";
import Form from 'react-bootstrap/Form';
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import EntityInfoIdp from "../../components/Common/entityInfoIdp";
import IdpMap from "../../components/Idps/idpMap";
import IdpMapToDataTable from "../../components/Idps/idpMapToDataTable";
import Header from "../../components/Common/header";
import 'react-tabs/style/react-tabs.css';
import {useQuery} from "react-query";
import {tenantKey} from "../../utils/queryKeys";
import {getTenant} from "../../utils/queries";

const Idp = () => {
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
    if (!!tenant?.data?.[0]?.id) {
      setProjectCon(project)
      setEnvCon(environment)
      setTenantId(tenant?.data?.[0]?.id)
    }
  }, [!tenant.isLoading
  && tenant.isSuccess
  && !tenant.isFetching])

  const handleChange = event => {
    setUniqueLogins(event.target.checked);
  }
  let navigate = useNavigate();
  const goToSpecificProvider = (id, provider) => {
    const path = provider === "sp" ?
      `/${project}/${environment}/services/${id}` :
      `/${project}/${environment}/identity-providers/${id}`
    navigate(path);
  }

  if (tenantId == undefined || tenantId == 0 || tenantId == "") return;

  console.log('dashboard tenant Id', tenantId)

  return (
    <Container>
      <Header></Header>
      <Row>
        <Col className="title-container" md={12}>
          <Col md={6}>
            <EntityInfoIdp tenantId={tenantId}
                           idpId={id}/>
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
      <LoginTiles tenantId={tenantId}
                  uniqueLogins={uniqueLogins}
                  idpId={id}/>
      <LoginLineChart tenantId={tenantId}
                      type="idp"
                      id={id}
                      uniqueLogins={uniqueLogins}/>
      <LoginSpPieChart tenantId={tenantId}
                       idpId={id}
                       uniqueLogins={uniqueLogins}
                       goToSpecificProviderHandler={goToSpecificProvider}/>
      <SpsDataTable tenantId={tenantId}
                    idpId={id}
                    dataTableId="tableSps"
                    uniqueLogins={uniqueLogins}/>
      <Tabs>
        <TabList>
          <Tab>Map</Tab>
          <Tab>Datatable</Tab>
        </TabList>

        <TabPanel>
          <IdpMap tenantId={tenantId}
                  idpId={id}
                  uniqueLogins={uniqueLogins}/>
        </TabPanel>
        <TabPanel>
          <IdpMapToDataTable tenantId={tenantId}
                             idpId={id}
                             uniqueLogins={uniqueLogins}/>
        </TabPanel>
      </Tabs>
    </Container>
  )
}

export default Idp