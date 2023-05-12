import {useState, useContext, useEffect} from "react";
import {client} from '../../utils/api';
import Container from 'react-bootstrap/Container';
import Select from 'react-select';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {convertDateByGroup, getWeekNumber} from "../Common/utils";
import 'bootstrap/dist/css/bootstrap.min.css';

const EntityInfo = (parameters) => {
  const [idp, setIdp] = useState([])
  const [sp, setSp] = useState([])
  useEffect(() => {
    if (parameters['idpId']) {
      client.get("idps", {
        params: {
          'tenant_id': parameters['tenantId'],
          'idpId': parameters['idpId']
        }
      }).then(idp_response => {
        setIdp(idp_response["data"][0])
      })
    } else if (parameters['spId']) {
      client.get("sps", {
        params: {
          'tenant_id': parameters['tenantId'],
          'spId': parameters['spId']
        }
      }).then(sp_response => {
        setSp(sp_response["data"][0])
      })
    }
  }, [])
  if (idp.name) {
    return (
      <h3>{idp.name} ({idp.entityid})</h3>
    )
  } else if (sp.name) {
    return (
      <h3>{sp.name} ({sp.identifier})</h3>
    )
  }
}

export default EntityInfo