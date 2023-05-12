import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { client } from '../../utils/api';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useNavigate } from "react-router-dom";
import { envContext, projectContext } from "../../Context/context";
import LoginLineChart from "../../components/Dashboard/loginLineChart";
import LoginTiles from "../../components/Dashboard/loginTiles";
import Form from 'react-bootstrap/Form';
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import EntityInfo from "../../components/Common/entityInfo";
import LoginIdpPieChart from "../../components/Dashboard/loginIdpPieChart";
import IdpsDataTable from "../../components/Idps/idpsDataTable";
import SpMap from "../../components/Sps/spMap";
import SpMapToDataTable from "../../components/Sps/spMapToDataTable";
import Header from "../../components/Common/header";

import 'react-tabs/style/react-tabs.css';


const Sp = () => {
	const { project, environment, id } = useParams();
	const [tenantId, setTenantId] = useState(0);
	const [uniqueLogins, setUniqueLogins] = useState(false);
	const [projectCon, setProjectCon] = useContext(projectContext);
	const [envCon, setEnvCon] = useContext(envContext)

	//const [identifier, setIdentifier] = useState("");
	useEffect(() => {
		setProjectCon(project)
		setEnvCon(environment)
		client.get("tenant/" + project + "/" + environment).then(response => {
				setTenantId(response["data"][0]["id"])
				console.log(tenantId)
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
	if (tenantId === 0) return;
	else
		return (
			<Container>
				<Header></Header>
				<Row>
					<Col className="title-container" md={12}>
						<Col md={6}><EntityInfo tenantId={tenantId} spId={id}></EntityInfo></Col>
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
				<LoginIdpPieChart tenantId={tenantId} spId={id} uniqueLogins={uniqueLogins} goToSpecificProviderHandler={goToSpecificProvider}></LoginIdpPieChart>
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