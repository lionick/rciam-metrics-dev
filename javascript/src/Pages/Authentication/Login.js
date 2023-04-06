import React, {useState} from "react";
import {useQuery, useQueryClient} from "react-query";
import {loginQueryKey} from "../../utils/queryKeys";
import {loginQuery} from "../../utils/queries";
import Button from "react-bootstrap/Button";
import {useTranslation} from "react-i18next";


function Login() {
  const {t, i18n} = useTranslation();
  const queryClient = useQueryClient();

  const loginReq = useQuery(
    [loginQueryKey],
    loginQuery,
    {
      enabled: false
    }
  )
  const handleLoginClick = () => {
    // Make the request to login
    queryClient.refetchQueries([loginQueryKey])
  }

  return (
    <Button className="log-button"
            onClick={handleLoginClick}
            variant="outline-primary">{t('login')}</Button>
  )
}

export default Login