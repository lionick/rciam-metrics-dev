import React from 'react'
import Communities from "../../Pages/Communities";
import Users from "../../Pages/Users";
import Dashboard from "../../Pages/Dashboard";
import Idps from "../../Pages/Idps";
import Sps from "../../Pages/Sps";
import Sp from "../../Pages/Sps/sp";
import Idp from "../../Pages/Idps/idp";
import Login from "../../Pages/Authentication/Login";
import ErrorPage from "../../Pages/Error";
import {useParams} from "react-router-dom";
import {useCookies} from "react-cookie";

const Middleware = ({elementName}) => {
  const {tenant, environment} = useParams();
  const [cookies, setCookie] = useCookies();

    // XXX We set the environment and tenant globally
  window.environment = environment
  window.tenant = tenant

  const Component = elementName
  return (
   <Component />
  )
}

export default Middleware