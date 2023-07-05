import React, {useState, useEffect, useContext} from "react";
import {useParams} from "react-router-dom";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {useNavigate} from "react-router-dom";
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
import {tenenvKey} from "../../utils/queryKeys";
import {getTenenv} from "../../utils/queries";
import Spinner from "../../components/Common/spinner"

const Sp = () => {
  const {id} = useParams();
  const [tenenvId, setTenenvId] = useState(0);
  const [uniqueLogins, setUniqueLogins] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const tenant = window.tenant
  const environment = window.environment

  const tenenv = useQuery(
    [tenenvKey, {tenantId: tenant, environment: environment}],
    getTenenv, {
      retry: 0,
    })


  useEffect(() => {
    if (!!tenenv?.data?.[0]?.id) {
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
      `/services/${id}` :
      `/identity-providers/${id}`
    navigate(path);
  }

  if (tenenv.isLoading
    || tenenv.isFetching) {
    return (<Spinner/>)
  }

  if (tenenvId == undefined
    || tenenvId == 0
    || tenenvId == "") {
    return null
  }


  return (
    <Container>
      <Header></Header>
      <Row>
        <Col className="title-container" md={12}>
          <Col md={6}>
            <EntityInfoSp tenenvId={tenenvId}
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
      <LoginTiles tenenvId={tenenvId}
                  uniqueLogins={uniqueLogins}
                  spId={id}/>
      <LoginLineChart tenenvId={tenenvId}
                      type="sp"
                      id={id}
                      uniqueLogins={uniqueLogins}/>
      <LoginIdpPieChart tenenvId={tenenvId}
                        spId={id}
                        uniqueLogins={uniqueLogins}
                        goToSpecificProviderHandler={goToSpecificProvider}/>
      <IdpsDataTable tenenvId={tenenvId}
                     spId={id}
                     dataTableId="tableSps"
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
          <SpMap startDate={startDate}
                 endDate={endDate}
                 tenenvId={tenenvId}
                 spId={id}
                 uniqueLogins={uniqueLogins}/>
        </TabPanel>
        <TabPanel>
          <SpMapToDataTable startDate={startDate}
                            endDate={endDate}
                            tenenvId={tenenvId}
                            spId={id}
                            uniqueLogins={uniqueLogins}/>
        </TabPanel>
      </Tabs>
    </Container>
  )
}

export default Sp