import { useState, useContext, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Modal from "react-bootstrap/Modal";
import LoginLineChart from "../../components/Dashboard/loginLineChart";
import LoginSpPieChart from "../../components/Dashboard/loginSpPieChart";
import LoginTiles from "../../components/Dashboard/loginTiles";
import IdpsDataTable from "../../components/Idps/idpsDataTable";
import LoginIdpPieChart from "../../components/Dashboard/loginIdpPieChart";
const SpModal = ({showModal, setShowModalHandler, tenantId}) => {


  const handleClose = () => setShowModalHandler(false);
  //const handleShow = () => setShow(true);

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <LoginTiles tenantId={tenantId}></LoginTiles>
        <LoginLineChart tenantId={tenantId} type="sp" identifier="77bb2e22-6a97-4c92-8aec-a3c99284b4ae"></LoginLineChart>
        <LoginIdpPieChart tenantId={tenantId} spIdentifier="77bb2e22-6a97-4c92-8aec-a3c99284b4ae"></LoginIdpPieChart>
        <IdpsDataTable tenantId={tenantId} identifier="77bb2e22-6a97-4c92-8aec-a3c99284b4ae" dataTableId="tableIdps"></IdpsDataTable>
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