import React, {useState, useEffect, useContext} from "react";
import {useParams} from "react-router-dom";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {useNavigate} from "react-router-dom";
import {envContext, tenantContext} from "../../Context/context";
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
import {tenenvKey} from "../../utils/queryKeys";
import {getTenenv} from "../../utils/queries";

const Idp = () => {
  const {tenant, environment, id} = useParams();
  const [tenenvId, setTenenvId] = useState(0);
  const [uniqueLogins, setUniqueLogins] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tenantCon, setTenantCon] = useContext(tenantContext);
  const [envCon, setEnvCon] = useContext(envContext)

  const tenenv = useQuery(
    [tenenvKey, {tenantId: tenant, environment: environment}],
    getTenenv, {
      retry: 0,
    })


  useEffect(() => {
    if (!!tenenv?.data?.[0]?.id) {
      setTenantCon(tenant)
      setEnvCon(environment)
      setTenenvId(tenenv?.data?.[0]?.id)
    }
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

  if (tenenvId == undefined || tenenvId == 0 || tenenvId == "") return;

  return (
    <Container>
      <Header/>
      <Row>
        <Col className="title-container" md={12}>
          <Col md={6}>
            <EntityInfoIdp tenenvId={tenenvId}
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
      <LoginTiles tenenvId={tenenvId}
                  uniqueLogins={uniqueLogins}
                  idpId={id}/>
      <LoginLineChart tenenvId={tenenvId}
                      type="idp"
                      id={id}
                      uniqueLogins={uniqueLogins}/>
      <LoginSpPieChart tenenvId={tenenvId}
                       idpId={id}
                       uniqueLogins={uniqueLogins}
                       goToSpecificProviderHandler={goToSpecificProvider}/>
      {/* TODO: MOVE THE FOLLOWING SECTION TO ITS OWN ELEMENT. IT NEEDS TO RELOAD EVERY
      TIME WE PICK A NEW DATE*/}
      <>
        <SpsDataTable idpId={id}
                      dataTableId="tableSps"
                      tenenvId={tenenvId}
                      uniqueLogins={uniqueLogins}
                      setStartDate={setStartDate}
                      setEndDate={setEndDate}
                      startDate={startDate}
                      endDate={endDate}/>
        <Tabs>
          <TabList>
            <Tab>Map</Tab>
            <Tab>Datatable</Tab>
          </TabList>

          <TabPanel>
            <IdpMap tenenvId={tenenvId}
                    idpId={id}
                    uniqueLogins={uniqueLogins}
                    startDate={startDate}
                    endDate={endDate}/>
          </TabPanel>
          <TabPanel>
            <IdpMapToDataTable startDate={startDate}
                               endDate={endDate}
                               tenenvId={tenenvId}
                               idpId={id}
                               uniqueLogins={uniqueLogins}/>
          </TabPanel>
        </Tabs>
      </>
    </Container>
  )
}

export default Idp