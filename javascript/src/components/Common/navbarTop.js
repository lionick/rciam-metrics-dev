import React, {useContext} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser, faUserShield, faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import Navbar from 'react-bootstrap/Navbar';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import {userinfoContext} from '../../Context/context';
import {useTranslation} from 'react-i18next';
import {useCookies} from 'react-cookie';
import {useParams} from "react-router-dom";
import config from "./../../config_react.json";
import Login from "../../Pages/Authentication/Login"

const NavbarTop = (props) => {
  // eslint-disable-next-line
  const [userInfo, setUserInfo] = useContext(userinfoContext);
  // eslint-disable-next-line
  const {t, i18n} = useTranslation();
  const [cookies, setCookies] = useCookies();
  const {project, environment} = useParams();
  const getConfig = key => config[project][environment][key]

  if (!getConfig("config") || !getConfig("config")["theme_color"]) {
    return null
  }

  console.log('userinfo', userInfo)
  console.log('config', getConfig("config"))

  return (
    <Navbar className={"navbar-fixed-top"}>
      <Navbar.Collapse className="justify-content-end">
        {
          userInfo != undefined ?
            <DropdownButton
              variant="link"
              alignLeft
              className='drop-menu drop-container-header'
              title={
                <>
                  <span style={getConfig("theme_color")}>
                    {userInfo ? userInfo.name : 'login'}
                    <span>{userInfo && ' (' + userInfo.email + ')'}</span>
                  </span>
                </>
              }
              id="dropdown-menu-align-left"
            >
              <Dropdown.Item>
                {userInfo.sub} <strong>(sub)</strong>
              </Dropdown.Item>
              <Dropdown.Item onClick={() => {
                window.location.assign(getConfig("config")["logout_uri"]);
              }}>
                {t('logout')}<FontAwesomeIcon icon={faSignOutAlt}/>
              </Dropdown.Item>
            </DropdownButton>
            : <Login/>
        }
      </Navbar.Collapse>
    </Navbar>
  )
}
export default NavbarTop
  