import {useState, useContext, useEffect} from "react";
import Button from 'react-bootstrap/Button';
import Modal from "react-bootstrap/Modal";
import LoginLineChart from "../../components/Dashboard/loginLineChart";
import LoginTiles from "../../components/Dashboard/loginTiles";
import IdpsDataTable from "../../components/Idps/idpsDataTable";
import LoginIdpPieChart from "../../components/Dashboard/loginIdpPieChart";

const SpModal = ({showModal, setShowModalHandler, tenenvId}) => {


  const handleClose = () => setShowModalHandler(false);

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <LoginTiles tenenvId={tenenvId}/>
        <LoginLineChart tenenvId={tenenvId}
                        type="sp"
                        identifier="77bb2e22-6a97-4c92-8aec-a3c99284b4ae"/>
        <LoginIdpPieChart tenenvId={tenenvId}
                          spIdentifier="77bb2e22-6a97-4c92-8aec-a3c99284b4ae"/>
        <IdpsDataTable tenenvId={tenenvId}
                       identifier="77bb2e22-6a97-4c92-8aec-a3c99284b4ae"
                       dataTableId="tableIdps"/>
        Woohoo, you're reading this text in a modal!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>

      </Modal.Footer>
    </Modal>
  )
}

export default SpModal