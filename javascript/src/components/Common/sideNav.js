import React, { useContext } from 'react';
// import { useTranslation } from 'react-i18next';
import Sidebar from "react-bootstrap-sidebar-menu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen, faHome, faUser, faUsers, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { envContext, projectContext } from '../../Context/context';

const SideNav = (props) => {

    // const { t, i18n } = useTranslation();
    const [project] = useContext(projectContext);
    const [environment] = useContext(envContext);
    console.log(project)
    return (

        <Sidebar expand="sm">
            <Sidebar.Collapse>
                <Sidebar.Header>
                    {/* <Sidebar.Brand>Logo</Sidebar.Brand> */}
                    <Sidebar.Toggle />
                </Sidebar.Header>
                <Sidebar.Body>
                    <Sidebar.Nav>

                        <Sidebar.Nav.Link href={"/" + project + "/" + environment}>
                            <Sidebar.Nav.Icon><FontAwesomeIcon icon={faHome} /></Sidebar.Nav.Icon>
                            <Sidebar.Nav.Title>Home</Sidebar.Nav.Title>
                        </Sidebar.Nav.Link>
                        <Sidebar.Nav.Link href={"/" + project + "/" + environment + "/identity-providers"}>
                            <Sidebar.Nav.Icon><FontAwesomeIcon icon={faWarehouse} /></Sidebar.Nav.Icon>
                            <Sidebar.Nav.Title>Identity Providers</Sidebar.Nav.Title>
                        </Sidebar.Nav.Link>
                        <Sidebar.Nav.Link href={"/" + project + "/" + environment + "/services"}>
                            <Sidebar.Nav.Icon><FontAwesomeIcon icon={faDoorOpen} /></Sidebar.Nav.Icon>
                            <Sidebar.Nav.Title>Services</Sidebar.Nav.Title>
                        </Sidebar.Nav.Link>
                        <Sidebar.Nav.Link href={"/" + project + "/" + environment + "/users"}>
                            <Sidebar.Nav.Icon><FontAwesomeIcon icon={faUser} /></Sidebar.Nav.Icon>
                            <Sidebar.Nav.Title>Users</Sidebar.Nav.Title>
                        </Sidebar.Nav.Link>
                        <Sidebar.Nav.Link href={"/" + project + "/" + environment + "/communities"}>
                            <Sidebar.Nav.Icon><FontAwesomeIcon icon={faUsers} /></Sidebar.Nav.Icon>
                            <Sidebar.Nav.Title>Communities</Sidebar.Nav.Title>
                        </Sidebar.Nav.Link>
                        {/* <Sidebar.Sub eventKey={0}>
                                <Sidebar.Sub.Toggle>
                                    <Sidebar.Nav.Icon />
                                    <Sidebar.Nav.Title>Submenu</Sidebar.Nav.Title>
                                </Sidebar.Sub.Toggle>
                                <Sidebar.Sub.Collapse>
                                    <Sidebar.Nav>
                                        <Sidebar.Nav.Link eventKey="sum_menu_title">
                                            <Sidebar.Nav.Icon>1.1</Sidebar.Nav.Icon>
                                            <Sidebar.Nav.Title>Sub menu item</Sidebar.Nav.Title>
                                        </Sidebar.Nav.Link>
                                    </Sidebar.Nav>
                                </Sidebar.Sub.Collapse>
                            </Sidebar.Sub> */}
                    </Sidebar.Nav>
                </Sidebar.Body>
            </Sidebar.Collapse>
        </Sidebar>
    )
}
export default SideNav