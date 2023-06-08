import {useState, useContext, useEffect} from "react";
import Button from 'react-bootstrap/Button';
import Modal from "react-bootstrap/Modal";
import LoginLineChart from "../../components/Dashboard/loginLineChart";
import LoginSpPieChart from "../../components/Dashboard/loginSpPieChart";
import LoginTiles from "../../components/Dashboard/loginTiles";
import SpsDataTable from "../../components/Sps/spsDataTable";

const IdpModal = ({showModal, setShowModalHandler, tenenvId}) => {
  const handleClose = () => setShowModalHandler(false);

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <LoginTiles tenenvId={tenenvId}></LoginTiles>
        <LoginLineChart tenenvId={tenenvId} type="idp" identifier="https://www.egi.eu/idp/shibboleth"></LoginLineChart>
        <LoginSpPieChart tenenvId={tenenvId} idpEntityId="https://www.egi.eu/idp/shibboleth"></LoginSpPieChart>
        <SpsDataTable tenenvId={tenenvId}
                      idpEntityId="https://www.egi.eu/idp/shibboleth"
                      dataTableId="tableSps">
        </SpsDataTable>
        Woohoo, you're reading this text in a modal!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>

      </Modal.Footer>
    </Modal>
  )
}

export default IdpModal