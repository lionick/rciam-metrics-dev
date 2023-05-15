import {useState, useContext, useEffect} from "react";
import {client} from '../../utils/api';
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import Datatable from "../datatable";
import dateFormat from 'dateformat';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import Dropdown from 'react-dropdown';
import {ToastContainer, toast} from 'react-toastify';
import {convertDateByGroup, getWeekNumber} from "../Common/utils";
import 'react-toastify/dist/ReactToastify.css';
import 'react-dropdown/style.css';
import "react-datepicker/dist/react-datepicker.css";

const dropdownOptions = [

  {value: 'day', label: 'Daily Basis', className: 'myOptionClassName'},
  {value: 'week', label: 'Weekly Basis', className: 'myOptionClassName'},
  {value: 'month', label: 'Monthly Basis'},
  {value: 'year', label: 'Yearly Basis'},
]

const LoginDataTable = ({startDateHandler, endDateHandler, tenantId, uniqueLogins}) => {
  const [loginsPerCountryPerPeriod, setLoginsPerCountryPerPeriod] = useState();
  var loginsPerCountryPerPeriodArray = [];
  const [minDate, setMinDate] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  useEffect(() => {
    client.get("logins_per_country/", {
      params: {
        'group_by': 'month',
        'tenant_id': tenantId,
        'unique_logins': uniqueLogins
      }
    }).then(response => {
      var minDateFromData = ""
      response["data"].forEach(element => {

        var range_date = new Date(element.range_date);
        if (minDateFromData == "") {
          minDateFromData = new Date(element.min_date)
        }
        var perPeriod = {
          "Date": dateFormat(range_date, "yyyy-mm"),
          "Number of Logins": element.count,
          "Number of Logins per Country": element.countries
        }
        loginsPerCountryPerPeriodArray.push(perPeriod)

      });
      setMinDate(minDateFromData)
      $("#table-login").DataTable().destroy()
      setLoginsPerCountryPerPeriod(loginsPerCountryPerPeriodArray)
    })
    //

  }, [uniqueLogins])

  const handleChange = event => {
    console.log(event.value);
    loginsPerCountryPerPeriodArray = []
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
    // set parent states
    startDateHandler(startDate)
    endDateHandler(endDate)
    client.get("logins_per_country/",
      {
        params: {
          'group_by': event.value,
          'startDate': startDate,
          'endDate': endDate,
          'tenant_id': tenantId,
          'unique_logins': uniqueLogins
        }
      }).then(response => {
      //console.log(response);
      response["data"].forEach(element => {

        var range_date = new Date(element.range_date);

        var perPeriod = {
          "Date": convertDateByGroup(range_date, event.value),
          "Number of Logins": element.count,
          "Number of Logins per Country": element.countries
        }
        loginsPerCountryPerPeriodArray.push(perPeriod)

      });
      // This is essential: We must destroy the datatable in order to be refreshed with the new data
      $("#table-login").DataTable().destroy()
      setLoginsPerCountryPerPeriod(loginsPerCountryPerPeriodArray)

    })
    //setSelected(event.value);
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
      <Datatable dataTableId="table-login" items={loginsPerCountryPerPeriod}
                 columnSep="Number of Logins per Country"></Datatable>
    </Col>
  </Row>


}

export default LoginDataTable