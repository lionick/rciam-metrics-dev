import React, {useContext} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser, faUserShield, faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import Navbar from 'react-bootstrap/Navbar';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import {userContext} from './context';
import {useTranslation} from 'react-i18next';
import {useCookies} from 'react-cookie';
import {useParams} from "react-router-dom";
import config from "./../../config_react.json";
import Login from "../../Pages/Authentication/Login"

const NavbarTop = (props) => {
  //const history = useHistory();
  // eslint-disable-next-line

  const user = useContext(userContext);
  // eslint-disable-next-line
  const {t, i18n} = useTranslation();
  //const tenant = useContext(tenantContext);
  const [cookies] = useCookies(['metrics_logoutkey']);
  const {project, environment} = useParams();
  const getConfig = key => config[project + "_" + environment][key]
  console.log(getConfig("config")["theme_color"] + project)


  return (
    <React.Fragment>
      {getConfig("config") && getConfig("config")["theme_color"] &&
        <Navbar className={"navbar-fixed-top"}>
          <Navbar.Collapse className="justify-content-end">
            {user ?
              <DropdownButton
                variant="link"
                alignRight
                className='drop-menu drop-container-header'
                title={<React.Fragment>
                  <span style={getConfig("theme_color")}>
                  {user ? user.name : 'login'}
                    <span>{user && ' (' + user.role + ')'}</span>
                  <FontAwesomeIcon icon={user.actions.includes('review_petition') ? faUserShield : faUser}/>
                  </span>
                </React.Fragment>}
                id="dropdown-menu-align-right"
              >
                {user &&
                  <Dropdown.Item>
                    {user.sub} <strong>(sub)</strong>
                  </Dropdown.Item>
                }
                {/* <Dropdown.Item onClick={()=>{history.push('/'+(getConfig("config")&&(getConfig("config")["name"]+'/userinfo')));}}>
                {t('nav_link_userinfo')}
                </Dropdown.Item> */}
                <Dropdown.Item onClick={() => {
                  window.location.assign(getConfig("config")["logout_uri"] + "&id_token_hint=" + cookies.federation_logoutkey);
                }}>
                  {t('logout')}<FontAwesomeIcon icon={faSignOutAlt}/>
                </Dropdown.Item>
              </DropdownButton>
              : (
                <React.Fragment>
                  <Login/>
                </React.Fragment>
              )
            }
          </Navbar.Collapse>
        </Navbar>
      }
    </React.Fragment>
  )
}
export default NavbarTop
  