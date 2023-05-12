import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from '../../utils/api';
import { envContext, projectContext } from "../../Context/context";
import Container from "react-bootstrap/Container";
import CommunitiesChart from "../../components/Communities/communitiesChart";
import CommunitiesDataTable from "../../components/Communities/communitiesDataTable";
import CommunitiesMap from "../../components/Communities/communitiesMap";
import Header from "../../components/Common/header";
import Footer from "../../components/Common/footer";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const Communities = () => {
    const { project, environment } = useParams();
    const [tenantId, setTenantId] = useState(0);
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

    if (tenantId == 0) return
    else return (
        <Container>
            <Header></Header>
            <Row>
                <Col className="title-container" md={12}>
                    <Col md={6}><h2>Communities</h2></Col>
                </Col>
            </Row>
            <CommunitiesChart tenantId={tenantId}></CommunitiesChart>
            <CommunitiesDataTable tenantId={tenantId}></CommunitiesDataTable>
            <CommunitiesMap tenantId={tenantId}></CommunitiesMap>
            <Footer></Footer>
        </Container>)

}
export default Communities;
