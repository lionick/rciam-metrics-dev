import React, {useContext} from 'react';
import {Link} from 'react-router-dom'
import Sidebar from "react-bootstrap-sidebar-menu";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDoorOpen, faHome, faUser, faUsers, faWarehouse} from '@fortawesome/free-solid-svg-icons';
import {envContext, tenantContext} from '../../Context/context';
import {useCookies} from 'react-cookie';


const SideNav = (props) => {
  const [cookies, setCookie] = useCookies();
  const permissions = cookies.permissions

  // const { t, i18n } = useTranslation();
  const [tenant] = useContext(tenantContext);
  const [environment] = useContext(envContext);

  return (

    <Sidebar expand="sm">
      <Sidebar.Collapse>
        <Sidebar.Header>
          {/* <Sidebar.Brand>Logo</Sidebar.Brand> */}
          <Sidebar.Toggle/>
        </Sidebar.Header>
        <Sidebar.Body>
          <Sidebar.Nav>
            {/* Home */}
            <Link className="sidebar-menu-nav-link"
                  to={"/" + tenant + "/" + environment}>
              <Sidebar.Nav.Icon><FontAwesomeIcon icon={faHome}/></Sidebar.Nav.Icon>
              <Sidebar.Nav.Title>Home</Sidebar.Nav.Title>
            </Link>
            {/* Identity Providers */}
            <Link className="sidebar-menu-nav-link"
                  to={"/" + tenant + "/" + environment + "/identity-providers"}>
              <Sidebar.Nav.Icon><FontAwesomeIcon icon={faWarehouse}/></Sidebar.Nav.Icon>
              <Sidebar.Nav.Title>Identity Providers</Sidebar.Nav.Title>
            </Link>
            {/* Services */}
            <Link className="sidebar-menu-nav-link"
                  to={"/" + tenant + "/" + environment + "/services"}>
              <Sidebar.Nav.Icon><FontAwesomeIcon icon={faDoorOpen}/></Sidebar.Nav.Icon>
              <Sidebar.Nav.Title>Services</Sidebar.Nav.Title>
            </Link>
            {
              cookies.userinfo != undefined
              && !!permissions?.actions?.registered_users?.['view'] ?
                // Users
                (<Link className="sidebar-menu-nav-link"
                       to={"/" + tenant + "/" + environment + "/users"}>
                  <Sidebar.Nav.Icon><FontAwesomeIcon icon={faUser}/></Sidebar.Nav.Icon>
                  <Sidebar.Nav.Title>Users</Sidebar.Nav.Title>
                </Link>) : null
            }
            {
              cookies.userinfo != undefined
              && !!permissions?.actions?.communities?.['view'] ?
                // Communities
                (<Link className="sidebar-menu-nav-link"
                       to={"/" + tenant + "/" + environment + "/communities"}>
                  <Sidebar.Nav.Icon><FontAwesomeIcon icon={faUsers}/></Sidebar.Nav.Icon>
                  <Sidebar.Nav.Title>Communities</Sidebar.Nav.Title>
                </Link>) : null
            }
          </Sidebar.Nav>
        </Sidebar.Body>
      </Sidebar.Collapse>
    </Sidebar>
  )
}
export default SideNav