import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from '../../utils/api';
import { envContext, projectContext } from "../../Context/context";
import Container from "react-bootstrap/Container";
import RegisteredUsersChart from "../../components/Users/registeredUsersChart";
import RegisteredUsersDataTable from "../../components/Users/registeredUsersDataTable";
import RegisteredUsersMap from "../../components/Users/registeredUsersMap";
import RegisteredUsersTiles from "../../components/Users/registeredUsersTiles";
import Header from "../../components/Common/header";
import Footer from "../../components/Common/footer";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const Users = () => {
    const { project, environment } = useParams();
    const [tenantId, setTenantId] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [projectCon, setProjectCon] = useContext(projectContext);
    const [envCon, setEnvCon] = useContext(envContext)

    useEffect(() => {
        setProjectCon(project)
        setEnvCon(environment)
        client.get("tenant/" + project + "/" + environment).then(response => {
                setTenantId(response["data"][0]["id"])
            })
    }, [])

    if (tenantId === 0) return
    else return (
        <Container>
            <Header></Header>
            <Row>
                <Col className="title-container" md={12}>
                    <Col md={6}><h2>Users</h2></Col>
                </Col>
            </Row>
            <RegisteredUsersTiles tenantId={tenantId}></RegisteredUsersTiles>
            <RegisteredUsersChart tenantId={tenantId}></RegisteredUsersChart>
            <RegisteredUsersDataTable tenantId={tenantId} startDateHandler={setStartDate} endDateHandler={setEndDate}></RegisteredUsersDataTable>
            <RegisteredUsersMap tenantId={tenantId} startDate={startDate} endDate={endDate}></RegisteredUsersMap>
            <Footer></Footer>
        </Container>)

}
export default Users;
