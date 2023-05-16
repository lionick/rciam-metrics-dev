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
  projectContext,
  envContext,
  userinfoContext
} from "./Context/context";
import Layout from "./components/Common/layout";
import SideNav from "./components/Common/sideNav";
import Main from "./components/Common/main";
import {ToastContainer} from "react-toastify";
import ErrorPage from "./Pages/Error";
import {useCookies} from 'react-cookie';
import {toast} from 'react-toastify';


function App() {
  const [language, setLanguage] = useState('en')
  const [projectCon, setProjectCon] = useState(null)
  const [envCon, setEnvCon] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [cookies, setCookie] = useCookies();


  useEffect(() => {
    if (cookies.userinfo != undefined) {
      setUserInfo(jwt_decode(cookies.userinfo))
    }
  }, [cookies])

  useEffect(() => {
    if (userInfo != undefined) {
      toast.info(`Welcome ${userInfo.name}`)
    }
  }, [userInfo])

  return (
    <languageContext.Provider value={[language, setLanguage]}>
      <projectContext.Provider value={[projectCon, setProjectCon]}>
        <envContext.Provider value={[envCon, setEnvCon]}>
          <userinfoContext.Provider value={[userInfo, setUserInfo]}>
            <Layout>
              <SideNav></SideNav>
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
        </envContext.Provider>
      </projectContext.Provider>
    </languageContext.Provider>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/:project/:environment" element={<Dashboard/>}/>
      <Route path="/:project/:environment/communities" element={<Communities/>}/>
      <Route path="/:project/:environment/users" element={<Users/>}/>
      <Route path="/:project/:environment/identity-providers" element={<Idps/>}/>
      <Route path="/:project/:environment/services" element={<Sps/>}/>
      <Route path="/:project/:environment/identity-providers/:id" element={<Idp/>}/>
      <Route path="/:project/:environment/services/:id" element={<Sp/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="*" element={<ErrorPage/>}/>
    </Routes>
  )
}

export default App;