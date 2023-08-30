import React, {useState, useEffect, useRef} from "react";
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import Datatable from "../datatable";
import dateFormat from 'dateformat';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import Dropdown from 'react-dropdown';
import 'react-toastify/dist/ReactToastify.css';
import 'react-dropdown/style.css';
import "react-datepicker/dist/react-datepicker.css";
import {dropdownOptions} from "../../../src/utils/helpers/enums"
import {useQuery, useQueryClient} from "react-query";
import {loginsPerCountryKey} from "../../utils/queryKeys";
import {getLoginsPerCountry} from "../../utils/queries";
import {toast} from "react-toastify";
import Spinner from "../Common/spinner"
import {format} from "date-fns";
import {convertDateByGroup, formatStartDate, formatEndDate} from "../Common/utils";

const LoginDataTable = ({
                          startDateHandler,
                          endDateHandler,
                          tenenvId,
                          uniqueLogins
                        }) => {
  const [loginsPerCountryPerPeriod, setLoginsPerCountryPerPeriod] = useState([]);
  const [minDate, setMinDate] = useState(null);
  // By default we fetch by month
  const [groupBy, setGroupBy] = useState("month");
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);

  const queryClient = useQueryClient();


  let params = {
    params: {
      'group_by': groupBy,
      'startDate': !startDate ? null : format(startDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      'endDate': !endDate ? null : format(endDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      'tenenv_id': tenenvId,
      'unique_logins': uniqueLogins
    }
  }

  const loginsPerCountry = useQuery(
    [loginsPerCountryKey, params],
    getLoginsPerCountry,
    {
      enabled: false,
      refetchOnWindowFocus: false
    }
  )

  useEffect(() => {
    params = {
      params: {
        'group_by': groupBy,
        'startDate': !startDate ? null : format(startDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        'endDate': !endDate ? null : format(endDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        'tenenv_id': tenenvId,
        'unique_logins': uniqueLogins
      }
    }

    try {
      const response = queryClient.refetchQueries([loginsPerCountryKey, params])
    } catch (error) {
      // todo: Here we can handle any authentication or authorization errors
      console.log(error)
    }

  }, [uniqueLogins, groupBy])

  // Construct the data required for the datatable
  useEffect(() => {
    const loginsPerCountryPerPeriodArray = !loginsPerCountry.isLoading
      && !loginsPerCountry.isFetching
      && loginsPerCountry.isSuccess
      && loginsPerCountry?.data?.map(element => ({
        "Date": !!element?.range_date ? convertDateByGroup(new Date(element?.range_date), groupBy): null,
        "Number of Logins": element?.count,
        "Number of Logins per Country": element?.countries
      }))

    if (!!loginsPerCountry?.data && !!loginsPerCountryPerPeriodArray) {
      // We only keep the first date because the backend returns the dataset sorted and we only care about the
      // min of the min dates.
      if (minDate == undefined || minDate == "") {
        setMinDate(!!loginsPerCountry?.data?.[0]?.min_date ? new Date(loginsPerCountry?.data?.[0]?.min_date) : null)
      }
      $("#table-login").DataTable().destroy()
      setLoginsPerCountryPerPeriod(loginsPerCountryPerPeriodArray)

    }
  }, [loginsPerCountry.isSuccess])

  const handleStartDateChange = (date) => {
   
    date = formatStartDate(date);
    if(date != null) {
      setStartDate(date);
    }
  };

  const handleEndDateChange = (date) => {
   
    date = formatEndDate(date);
    if(date != null) {
      setEndDate(date);
    }
  };

  const handleChange = (event) => {
    if (!startDate || !endDate) {
      toast.warning("You have to fill both startDate and endDate")
      return
    }
    setGroupBy(event.value)
    startDateHandler(startDate)
    endDateHandler(endDate)
  };

  return (
    <Row className="box">
      <Col md={12}>
        <div className="box-header with-border">
          <h3 className="box-title">Number of logins</h3>
        </div>
      </Col>
      <Col lg={12} className="range_inputs">
        From: <DatePicker selected={startDate}
                          minDate={minDate ?? null}
                          dateFormat="dd/MM/yyyy"
                          onChange={handleStartDateChange}/>
        To: <DatePicker selected={endDate}
                        minDate={minDate ?? null}
                        dateFormat="dd/MM/yyyy"
                        onChange={handleEndDateChange}/>
        <Dropdown placeholder='Filter'
                  options={dropdownOptions}
                  onChange={handleChange}/>
      </Col>
      <Col lg={12}> 
            <Datatable dataTableId="table-login"
                       items={loginsPerCountryPerPeriod}
                       columnSep="Number of Logins per Country"/> 
      </Col>
    </Row>
  )
}

export default LoginDataTable