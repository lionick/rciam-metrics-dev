import React, {useState, useEffect} from "react";
import {Route, Routes} from 'react-router-dom'
import Communities from "./Pages/Communities";
import Users from "./Pages/Users";
import Dashboard from "./Pages/Dashboard";
import Idps from "./Pages/Idps";
import Sps from "./Pages/Sps";
import Sp from "./Pages/Sps/sp";
import Idp from "./Pages/Idps/idp";
import Login from "./Pages/Authentication/Login";
import "./app.css";
import "./style.scss";
import 'react-toastify/dist/ReactToastify.css';
import jwt_decode from "jwt-decode";
import {
  languageContext,
  userinfoContext
} from "./Context/context";
import Layout from "./components/Common/layout";
import SideNav from "./components/Common/sideNav";
import Main from "./components/Common/main";
import {ToastContainer} from "react-toastify";
import ErrorPage from "./Pages/Error";
import {useCookies} from 'react-cookie';
import {toast} from 'react-toastify';
import Middleware from "./components/Common/middleware"


function App() {
  const [language, setLanguage] = useState('en')
  const [userInfo, setUserInfo] = useState(null)
  const [permissions, setPermissions] = useState(null)
  const [cookies, setCookie] = useCookies();


  useEffect(() => {
    if (cookies.userinfo != undefined) {
      setUserInfo(jwt_decode(cookies.userinfo))
    }
    if (cookies.permissions != undefined) {
      // The backend will send an encoded permissions while
      // the frontend adds a simple json value
      try {
        setPermissions(jwt_decode(cookies.permissions))
      } catch (error) {
        setPermissions(cookies.permissions)
      }
    }
  }, [cookies.userinfo, cookies.permissions])

  useEffect(() => {
    if (userInfo != undefined) {
      toast.info(`Welcome ${userInfo.name}`)
    }
  }, [userInfo])

  return (
    <languageContext.Provider value={[language, setLanguage]}>
      <userinfoContext.Provider value={[userInfo, setUserInfo]}>
        <Layout>
          <SideNav userInfo={userInfo}
                   permissions={permissions}/>
          <Main>
            <AppRoutes/>
          </Main>
          <ToastContainer
            position="bottom-left"
            autoClose={false}
            closeOnClick
            rtl={false}
            pauseOnHover
          />
        </Layout>
      </userinfoContext.Provider>
    </languageContext.Provider>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Middleware elementName={Dashboard}/>}/>
      <Route path="/communities" element={<Middleware elementName={Communities}/>}/>
      <Route path="/users" element={<Middleware elementName={Users}/>}/>
      <Route path="/identity-providers" element={<Middleware elementName={Idps}/>}/>
      <Route path="/services" element={<Middleware elementName={Sps}/>}/>
      <Route path="/identity-providers/:id" element={<Middleware elementName={Idp}/>}/>
      <Route path="/services/:id" element={<Middleware elementName={Sp}/>}/>
      <Route path="/login" element={<Middleware elementName={Login}/>}/>
      <Route path="*" element={<Middleware elementName={ErrorPage}/>}/>
    </Routes>
  )
}

export default App;