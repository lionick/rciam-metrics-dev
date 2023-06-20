import React from 'react';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import parse from 'html-react-parser';
import {useTranslation} from 'react-i18next';
import {constructConfiFilename} from "./utils";

const Footer = (props) => {
  const config = require(`../../${constructConfiFilename()}`)
  const {t, i18n} = useTranslation();

  return (
    <footer>
      <div className="container ssp-footer--container">
        <Row className="row justify-content-center">
          <Col sm="2" className="ssp-footer__item">
            <div className="dropup ssp-footer__item__lang">
              <DropdownButton onSelect={(e) => {
                setLanguage(e);
                i18n.changeLanguage(e)
              }}
                              className="ssp-btn btn ssp-btn__footer dropdown-toggle"
                              id='dropdown-button-drop-up' key="up"
                              title={<React.Fragment>
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
                <Image className="ssp-footer__item__logo"
                       src="https://vanilla-ui.aai-dev.grnet.gr/proxy/module.php/themevanilla/resources/images/grnet_logo_en.svg"
                       alt="GRNET"/>
              </a>
              <div className="ssp-footer__item__copyright">
                Copyright ©2023
              </div>
            </div>
          </Col>
          <Col sm="3" className="ssp-footer__item">
            <div className="footer_link_container">
              <div className="ssp-footer__item__powered">
                <a href={"mailto: " + (config && config?.contact)}>Contact us</a>
              </div>
              <div className="ssp-footer__item__powered">
                <a href={config?.config?.apiUrl + "docs"}>API Documentation</a>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <div className='copyright-funding-footer'>
            {config && config?.footer_description && parse(config?.footer_description)} |
            Powered by <a href="https://rciam.github.io/rciam-docs/" target="_blank" rel="noreferrer"> RCIAM</a>
          </div>
        </Row>
      </div>
    </footer>

  )
}

export default Footer