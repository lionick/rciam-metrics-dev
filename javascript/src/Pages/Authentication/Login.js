import React from "react";
import Button from "react-bootstrap/Button";
import {useTranslation} from "react-i18next";
import config from "../../config_react.json";
import {useCookies} from 'react-cookie';

function Login() {
  const {t, i18n} = useTranslation();
  const [cookies, setCookie] = useCookies(['login_start']);
  const tenant = window.tenant
  const environment = window.environment
  const getConfig = key => config[tenant][environment][key]

  const handleLoginClick = () => {
    // Set a cookie with the current location so the backend knows where to go
    setCookie('login_start', window.location.href, {path: '/'});
    // Redirect to the login endpoint
    window.location.href = getConfig("config")["login_url"]
  }

  return (
    <Button className="log-button"
            onClick={handleLoginClick}
            variant="outline-primary">{t('login')}</Button>
  )
}

export default Login