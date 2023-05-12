import {useState, useContext, useEffect} from "react";
import {client} from '../../utils/api';
import {communitiesGroupBy} from "../../utils/queryKeys";
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import Datatable from "../../components/datatable";
import dateFormat from 'dateformat';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import Dropdown from 'react-dropdown';
import {ToastContainer, toast} from 'react-toastify';
import {convertDateByGroup} from "../Common/utils";
import 'react-toastify/dist/ReactToastify.css';
import 'react-dropdown/style.css';
import "react-datepicker/dist/react-datepicker.css";

const dropdownOptions = [

  {value: 'day', label: 'Daily Basis', className: 'myOptionClassName'},
  {value: 'week', label: 'Weekly Basis', className: 'myOptionClassName'},
  {value: 'month', label: 'Monthly Basis'},
  {value: 'year', label: 'Yearly Basis'},
]

const CommunitiesDataTable = (parameters) => {
  const [communities, setCommunities] = useState();
  var communitiesArray = [];
  const [minDate, setMinDate] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  useEffect(() => {
    client.get("communities_groupby/month",
      {
        params:
          {
            'tenant_id': parameters["tenantId"],
          }
      }).then(response => {
      var minDateFromData = ""
      response["data"].forEach(element => {

        var range_date = new Date(element.range_date);
        if (minDateFromData == "") {
          minDateFromData = new Date(element.min_date)
        }
        var community = {
          "Date": dateFormat(range_date, "yyyy-mm"),
          "Number of Communities": element.count,
          "Names": element.names
        }
        communitiesArray.push(community)

      });

      setMinDate(minDateFromData)
      setCommunities(communitiesArray)
    })

  }, [])

  const handleChange = event => {
    communitiesArray = []
    if (!startDate || !endDate) {
      toast.error('You have to fill both startDate and endDate.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return
    }
    client.get("communities_groupby/" + event.value,
      {
        params:
          {
            'startDate': startDate,
            'endDate': endDate,
            'tenant_id': parameters["tenantId"]
          }
      }).then(response => {

      response["data"].forEach(element => {
        var range_date = new Date(element.range_date);

        var community = {
          "Date": convertDateByGroup(range_date, event.value),
          "Number of Communities": element.count,
          "Names": element.names
        }
        communitiesArray.push(community)

      });
      if (communitiesArray.length == 0) {
        communitiesArray.push({"Data": "No data available."})

      }
      // This is essential: We must destroy the datatable in order to be refreshed with the new data
      $("#table").DataTable().destroy()
      setCommunities(communitiesArray)
    })
  };

  return <Row className="box">
    <Col md={12}>
      <div className="box-header with-border">
        <h3 className="box-title">Number of logins</h3>
      </div>
    </Col>
    <Col lg={12} className="range_inputs">

      From: <DatePicker selected={startDate} minDate={minDate} dateFormat="dd/MM/yyyy"
                        onChange={(date: Date) => setStartDate(date)}></DatePicker>
      To: <DatePicker selected={endDate} minDate={minDate} dateFormat="dd/MM/yyyy"
                      onChange={(date: Date) => setEndDate(date)}></DatePicker>
      <Dropdown placeholder='Filter' options={dropdownOptions} onChange={handleChange}/>
      <ToastContainer position="top-center"
                      autoClose={5000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      theme="dark"/>
    </Col>
    <Col lg={12}>
      <Datatable dataTableId="table" items={communities} columnSep="Names"></Datatable>
    </Col>
  </Row>


}

export default CommunitiesDataTable