import React, { useState, useEffect, useContext } from 'react';
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import parse from 'html-react-parser';
import config from "./../../config_react.json";
import { languageContext } from './context';
import { useTranslation } from 'react-i18next';

const Footer = (props) => {
    const [language,setLanguage] = useContext(languageContext)
    const { project, environment } = useParams();
    const getConfig = key => config[project][environment][key]
    const { t, i18n } = useTranslation();
    console.log(language)
    return (
        <footer>
            <div className="container ssp-footer--container">
                <Row className="row justify-content-center">
                    <Col sm="2" className="ssp-footer__item">
                        <div className="dropup ssp-footer__item__lang">
                            <DropdownButton onSelect={(e) => { setLanguage(e); i18n.changeLanguage(e) }} 
                                className="ssp-btn btn ssp-btn__footer dropdown-toggle" 
                                id='dropdown-button-drop-up' key="up" 
                                title={<React.Fragment >
                                <span className="caret"></span>
                                     {language === 'en' ? 'English' : 'Greek'}
                                     </React.Fragment>} drop="up" variant="link">
                                <Dropdown.Item eventKey="en">English</Dropdown.Item>
                                <Dropdown.Item eventKey="gr">Greek</Dropdown.Item>
                            </DropdownButton>
                        </div>
                    </Col>
                    <Col sm="3" className="ssp-footer__item">
                        <div className="footer-logo-container">
                            <a href="https://grnet.gr/">
                                <Image className="ssp-footer__item__logo" src="https://vanilla-ui.aai-dev.grnet.gr/proxy/module.php/themevanilla/resources/images/grnet_logo_en.svg" alt="GRNET" />
                            </a>
                            <div className="ssp-footer__item__copyright">
                                Copyright ©2023
                            </div>
                        </div>
                    </Col>
                    <Col sm="3" className="ssp-footer__item">
                        <div className="footer_link_container">
                            <div className="ssp-footer__item__powered">
                                <a href={"mailto: " + (getConfig("config") && getConfig("config")["contact"])}>Contact us</a>
                            </div>
                            <div className="ssp-footer__item__powered">
                                <a href={config["configReact"]["apiUrl"]+"docs"}>API Documentation</a>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <div className='copyright-funding-footer'>
                        {getConfig("config") && getConfig("config")["footer_description"] && parse(getConfig("config")["footer_description"])} | Powered by <a href="https://rciam.github.io/rciam-docs/" target="_blank" rel="noreferrer"> RCIAM</a>
                    </div>
                </Row>
            </div>
        </footer>

    )
}

export default Footer