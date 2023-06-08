import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Image from 'react-bootstrap/Image';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import parse from 'html-react-parser';
import config from "./../../config_react.json";
import NavbarTop from './navbarTop';


const Header = (props) => {

  const [bannerAlertInfo, setBannerAlertInfo] = useState([]);
  const {tenant, environment} = useParams();
  const getConfig = key => config[tenant][environment][key]

  useEffect(() => {
    setBannerAlertInfo(props.bannerAlertInfo);
  }, [props.bannerAlertInfo])

  return (
    <div className="header">
        <div className="tenenv_logo_container">
        {bannerAlertInfo && bannerAlertInfo[0] &&
          <div id="noty-info-bar" className={"noty-top-" + bannerAlertInfo[0].type + " noty-top-global"}>
            <div>
              {parse(bannerAlertInfo[0].alert_message)}
            </div>
            <button className="noty-top-close link-button" onClick={() => {
              setBannerAlertInfo([...bannerAlertInfo.slice(1)])
            }}>
              <FontAwesomeIcon icon={faTimes}/>
            </button>
          </div>
        }
        <NavbarTop alertBar={bannerAlertInfo && bannerAlertInfo.length > 0}/>

        <div className="text-center ssp-logo">
          <a href={getConfig("config")["website_url"]}>
            <Image src={getConfig("config")["logo_url"]} fluid/>
          </a>
        </div>
        <h1 className="text-center">
          {getConfig("config")["home_page_title"]}
        </h1>
      </div>
    </div>
  );
}

export default Header