import {useState, useContext, useEffect} from "react";
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {envContext, tenantContext} from "../../Context/context";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import LoginIdpPieChart from "../../components/Dashboard/loginIdpPieChart";
import LoginTiles from "../../components/Dashboard/loginTiles";
import IdpsDataTable from "../../components/Idps/idpsDataTable";
import IdpModal from "./idpModal";
import Header from "../../components/Common/header";
import {useQuery} from "react-query";
import {tenenvKey} from "../../utils/queryKeys";
import {getTenenv} from "../../utils/queries";

const Idps = () => {

  const [uniqueLogins, setUniqueLogins] = useState(false);
  const {tenant, environment} = useParams();
  const [tenenvId, setTenenvId] = useState(0);
  const [showModal, setShowModal] = useState(false);
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
    setTenantCon(tenant)
    setEnvCon(environment)
    setTenenvId(tenenv?.data?.[0]?.id)
  }, [!tenenv.isLoading
  && tenenv.isSuccess
  && !tenenv.isFetching])

  const handleChange = event => {
    setUniqueLogins(event.target.checked);
  }
  let navigate = useNavigate();
  const goToSpecificProvider = (id, provider) => {
    var path = ""
    if (provider === "sp") {
      path = "/" + tenant + "/" + environment + "/services/" + id;
    } else {
      path = "/" + tenant + "/" + environment + "/identity-providers/" + id;
    }
    navigate(path);
  }

  if (tenenvId == undefined || tenenvId == 0 || tenenvId == "") return

  return (
    <Container>
      <Header></Header>
      <Row>
        <Col className="title-container" md={12}>
          <Col md={6}><h2>Identity Providers Logins</h2></Col>
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
                  uniqueLogins={uniqueLogins}/>
      <LoginIdpPieChart tenenvId={tenenvId}
                        uniqueLogins={uniqueLogins}
                        setShowModalHandler={setShowModal}
                        goToSpecificProviderHandler={goToSpecificProvider}/>
      <IdpsDataTable tenenvId={tenenvId}
                     uniqueLogins={uniqueLogins}
                     setStartDate={setStartDate}
                     setEndDate={setEndDate}
                     startDate={startDate}
                     endDate={endDate}/>
      <IdpModal tenenvId={tenenvId}
                showModal={showModal}
                setShowModalHandler={setShowModal}/>
    </Container>)

}
export default Idps;
