import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { client } from '../../utils/api';
import { useNavigate } from "react-router-dom";
import { envContext, projectContext } from "../../Context/context";
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
import { Container } from "react-bootstrap";

const Dashboard = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [uniqueLogins, setUniqueLogins] = useState(false);
    const [tenantId, setTenantId] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const { project, environment } = useParams();
    const [projectCon, setProjectCon] = useContext(projectContext);
    const [envCon, setEnvCon] = useContext(envContext)
    useEffect(() => {
        setProjectCon(project)
        setEnvCon(environment)
        client.get("tenant/" + project + "/" + environment).
            then(response => {

                setTenantId(response["data"][0]["id"])
            })
    }, [])

    const handleChange = event => {
        setUniqueLogins(event.target.checked);
        console.log(uniqueLogins)
    }
    let navigate = useNavigate();
    const goToSpecificProvider = (id, provider) => {
        if (provider == "sp") {
            var path = "/" + project + "/" + environment + "/services/" + id;
        }
        else {
            var path = "/" + project + "/" + environment + "/identity-providers/" + id;
        }
        navigate(path);
    }
    if (tenantId == 0)
        return
    else return (

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
            <LoginTiles tenantId={tenantId} uniqueLogins={uniqueLogins}></LoginTiles>
            <LoginLineChart tenantId={tenantId} uniqueLogins={uniqueLogins}></LoginLineChart>
            <LoginIdpPieChart tenantId={tenantId} setShowModalHandler={setShowModal} uniqueLogins={uniqueLogins} goToSpecificProviderHandler={goToSpecificProvider}></LoginIdpPieChart>
            <LoginSpPieChart tenantId={tenantId} setShowModalHandler={setShowModal} uniqueLogins={uniqueLogins} goToSpecificProviderHandler={goToSpecificProvider}></LoginSpPieChart>
            <LoginDataTable startDateHandler={setStartDate} endDateHandler={setEndDate} tenantId={tenantId} uniqueLogins={uniqueLogins}></LoginDataTable>
            <LoginsMap startDate={startDate} endDate={endDate} tenantId={tenantId} uniqueLogins={uniqueLogins}></LoginsMap>

            {/* <IdpModal tenantId={tenantId} showModal={showModal} setShowModalHandler={setShowModal}></IdpModal> */}
            <Footer></Footer>
        </Container>
    )

}
export default Dashboard;
