import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useNavigate } from "react-router-dom";
import { client } from '../../utils/api';
import { envContext, projectContext } from "../../Context/context";
import LoginLineChart from "../../components/Dashboard/loginLineChart";
import LoginSpPieChart from "../../components/Dashboard/loginSpPieChart";
import LoginTiles from "../../components/Dashboard/loginTiles";
import SpsDataTable from "../../components/Sps/spsDataTable";
import Form from 'react-bootstrap/Form';
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import EntityInfo from "../../components/Common/entityInfo";
import IdpMap from "../../components/Idps/idpMap";
import IdpMapToDataTable from "../../components/Idps/idpMapToDataTable";
import Header from "../../components/Common/header";

import 'react-tabs/style/react-tabs.css';

const Idp = () => {
	const { project, environment, id } = useParams();
	const [tenantId, setTenantId] = useState(0);
	const [uniqueLogins, setUniqueLogins] = useState(false);
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
	if (tenantId === 0) return;
	else
		return (
			<Container>
				<Header></Header>
				<Row>
					<Col className="title-container" md={12}>
						<Col md={6}><EntityInfo tenantId={tenantId} idpId={id}></EntityInfo></Col>
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
				<LoginTiles tenantId={tenantId} uniqueLogins={uniqueLogins} idpId={id}></LoginTiles>
				<LoginLineChart tenantId={tenantId} type="idp" id={id} uniqueLogins={uniqueLogins}></LoginLineChart>
				<LoginSpPieChart tenantId={tenantId} idpId={id} uniqueLogins={uniqueLogins} goToSpecificProviderHandler={goToSpecificProvider}></LoginSpPieChart>
				<SpsDataTable tenantId={tenantId} idpId={id} dataTableId="tableSps" uniqueLogins={uniqueLogins}></SpsDataTable>
				<Tabs>
					<TabList>
						<Tab>Map</Tab>
						<Tab>Datatable</Tab>
					</TabList>

					<TabPanel>
						<IdpMap tenantId={tenantId} idpId={id} uniqueLogins={uniqueLogins}></IdpMap>
					</TabPanel>
					<TabPanel>
						<IdpMapToDataTable tenantId={tenantId} idpId={id} uniqueLogins={uniqueLogins}></IdpMapToDataTable>
					</TabPanel>
				</Tabs>
			</Container>
		)
}

export default Idp