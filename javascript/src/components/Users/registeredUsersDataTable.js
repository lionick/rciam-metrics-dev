import React, {useState, useEffect, useRef} from "react";
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import Datatable from "../datatable";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import Dropdown from 'react-dropdown';
import {toast} from 'react-toastify';
import {dropdownOptions} from "../../utils/helpers/enums";
import 'react-toastify/dist/ReactToastify.css';
import 'react-dropdown/style.css';
import "react-datepicker/dist/react-datepicker.css";
import {useQuery, useQueryClient} from "react-query";
import {loginsPerIdpKey, minDateRegisteredUsersKey, registeredUsersPerCountryGroupByKey} from "../../utils/queryKeys";
import {getMinDateRegisteredUsers, getRegisteredUsersPerCountryGroupBy} from "../../utils/queries";
import {useCookies} from "react-cookie";
import Spinner from "../Common/spinner";
import {format} from "date-fns";
import {convertDateByGroup, formatStartDate, formatEndDate} from "../Common/utils";

const RegisteredUsersDataTable = ({
                                    tenenvId,
                                    setStartDate,
                                    setEndDate,
                                    startDate,
                                    endDate
                                  }) => {
  const dropdownRef = useRef(null);
  const [cookies, setCookie] = useCookies();
  const [usersPerCountryPerPeriod, setUsersPerCountryPerPeriod] = useState([]);
  const [dropdownOptionsState, setDropdownOptions] = useState(dropdownOptions);
  const [minDate, setMinDate] = useState("");
  const [groupBy, setGroupBy] = useState("month")
  const queryClient = useQueryClient();
  const controller = new AbortController();


  let params = {
    params: {
      'startDate': !startDate ? null : format(startDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      'endDate': !endDate ? null : format(endDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      'tenenv_id': tenenvId
    }
  }

  const registeredUsersPerCountryGroup = useQuery(
    [registeredUsersPerCountryGroupByKey, {groupBy: groupBy, params: params}],
    getRegisteredUsersPerCountryGroupBy,
    {
      /*enabled: false, this caused problems of fetching data*/ 
      refetchOnWindowFocus: false
    }
  )

  const minDateRegisteredUsers = useQuery(
    [minDateRegisteredUsersKey, params],
    getMinDateRegisteredUsers,
    {
      enabled: false,
      refetchOnWindowFocus: false
    }
  )


  useEffect(() => {
    if (groupBy == '') {
      return;
    }
    params = {
      params: {
        'startDate': !startDate ? null : format(startDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        'endDate': !endDate ? null : format(endDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        'tenenv_id': tenenvId,
        'groupBy': groupBy
      },
      signal: controller.signal
    }

    try {
      const response = queryClient.refetchQueries([registeredUsersPerCountryGroupByKey, {
        groupBy: groupBy,
        params: params
      }])
      queryClient.refetchQueries([minDateRegisteredUsersKey, {params:{tenenv_id: tenenvId}}])
      console.log(params)
    } catch (error) {
      // todo: Here we can handle any authentication or authorization errors
      console.log(error)
    }

    return () => {
      controller.abort()
    }

  }, [groupBy])

  // Construct the data required for the datatable
  useEffect(() => {
    console.log(registeredUsersPerCountryGroup)
    const perPeriod = registeredUsersPerCountryGroup?.data?.map(user => ({
        "Date": !!user?.range_date ? convertDateByGroup(new Date(user?.range_date), groupBy): null,
        "Number of Registered Users": user?.count,
        "Registered Users per country": user?.countries
      }))

    if (!!registeredUsersPerCountryGroup?.data && !!perPeriod) {
      // This is essential: We must destroy the datatable in order to be refreshed with the new data
      if (minDate == undefined || minDate == "") {
        setMinDate(!!minDateRegisteredUsers?.data?.min_date ? new Date(minDateRegisteredUsers?.data?.min_date) : null)
      }
      $("#table-users").DataTable().destroy()
      setUsersPerCountryPerPeriod(perPeriod)
    }
  }, [registeredUsersPerCountryGroup.isSuccess && minDateRegisteredUsers.isSuccess, groupBy])


  const handleAddOption = () => {
    // Create a new option dynamically
    const newOption =  {value: '', label: 'Filter'};

    // Check if the new option already exists in the options array
    if (!dropdownOptionsState.some(option => option.value === newOption.value)) {
      // If it doesn't exist, add it to the options array
      setDropdownOptions([newOption, ...dropdownOptionsState]);
    } 
  };

  const handleStartDateChange = (date) => {
    if(groupBy!=''){
      handleAddOption()
    }
    date = formatStartDate(date);
    if(date != null) {
      if(endDate!=date){
        setGroupBy("")
      }
      setStartDate(date);
      dropdownRef.current.state.selected.label = 'Filter';
    }
    
  };

  const handleEndDateChange = (date) => {
    if(groupBy!=''){
      handleAddOption()
    }
    date = formatEndDate(date);
    if(date != null) {
      if(endDate!=date){
        setGroupBy("")  
      }
      setEndDate(date);
      dropdownRef.current.state.selected.label = 'Filter';
    }
    
  };

  const handleChange = (event) => {
    if (!startDate || !endDate) {
      toast.warning("You have to fill both startDate and endDate")
      return
    }
    setGroupBy(event.value)
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
                          minDate={minDate}
                          dateFormat="dd/MM/yyyy"
                          onChange={handleStartDateChange}/>
        To: <DatePicker selected={endDate}
                        minDate={minDate}
                        dateFormat="dd/MM/yyyy"
                        onChange={handleEndDateChange}/>
        <Dropdown placeholder='Filter'
                   options={dropdownOptionsState}
                   onChange={handleChange}
                   ref={dropdownRef}/>
      </Col>
      <Col lg={12}>
        {      
            <Datatable dataTableId="table-users"
                       items={usersPerCountryPerPeriod}
                       columnSep="Registered Users per country"/>        
        }
      </Col>
    </Row>
  )
}

export default RegisteredUsersDataTable