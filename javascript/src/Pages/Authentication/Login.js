import React from "react";
import Button from "react-bootstrap/Button";
import {useTranslation} from "react-i18next";
import {useCookies} from 'react-cookie';
import config from '../../config.json'

function Login() {
  const {t, i18n} = useTranslation();
  const [cookies, setCookie] = useCookies(['login_start']);

  const handleLoginClick = () => {
    // Set a cookie with the current location so the backend knows where to go
    setCookie('login_start', window.location.href, {path: '/'});
    // This is not a request but a redirect. So i will include the x-keys here
    setCookie('x-tenant', config.tenant, {path: '/'});
    setCookie('x-environment', config.environment, {path: '/'});
    // Redirect to the login endpoint
    window.location.href = config?.login_url
  }

  return (
    <Button className="log-button"
            onClick={handleLoginClick}
            variant="outline-primary">{t('login')}</Button>
  )
}

export default Login