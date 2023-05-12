import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from '../../utils/api';
import { useNavigate } from "react-router-dom";
import { envContext, projectContext } from "../../Context/context";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import LoginIdpPieChart from "../../components/Dashboard/loginIdpPieChart";
import LoginTiles from "../../components/Dashboard/loginTiles";
import IdpsDataTable from "../../components/Idps/idpsDataTable";
import IdpModal from "./idpModal";
import Header from "../../components/Common/header";

const Idps = () => {

    const [uniqueLogins, setUniqueLogins] = useState(false);
    const { project, environment } = useParams();
    const [tenantId, setTenantId] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [projectCon, setProjectCon] = useContext(projectContext);
    const [envCon, setEnvCon] = useContext(envContext)

    useEffect(() => {
        setProjectCon(project)
        setEnvCon(environment)
        client.get("tenant/" + project + "/" + environment).then(response => {
                setTenantId(response["data"][0]["id"])
            })
    }, [])
    const handleChange = event => {
        setUniqueLogins(event.target.checked);
        console.log(uniqueLogins)
    }
    let navigate = useNavigate();
    const goToSpecificProvider = (id, provider) => {
        var path = ""
        if (provider === "sp") {
            path = "/" + project + "/" + environment + "/services/" + id;
        }
        else {
            path = "/" + project + "/" + environment + "/identity-providers/" + id;
        }
        navigate(path);
    }

    if (tenantId === 0)
        return
    else return (
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

            <LoginTiles tenantId={tenantId} uniqueLogins={uniqueLogins}></LoginTiles>
            <LoginIdpPieChart tenantId={tenantId} uniqueLogins={uniqueLogins} setShowModalHandler={setShowModal} goToSpecificProviderHandler={goToSpecificProvider}></LoginIdpPieChart>
            <IdpsDataTable tenantId={tenantId} uniqueLogins={uniqueLogins}></IdpsDataTable>
            <IdpModal tenantId={tenantId} showModal={showModal} setShowModalHandler={setShowModal}></IdpModal>
        </Container>)

}
export default Idps;
