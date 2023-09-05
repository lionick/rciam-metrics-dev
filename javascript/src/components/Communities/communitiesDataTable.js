import React, {useState, useEffect, useRef} from "react";
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import Datatable from "../../components/datatable";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import Dropdown from 'react-dropdown';
import {toast} from 'react-toastify';
import {convertDateByGroup, formatStartDate, formatEndDate} from "../Common/utils";
import 'react-toastify/dist/ReactToastify.css';
import 'react-dropdown/style.css';
import "react-datepicker/dist/react-datepicker.css";
import {dropdownOptions} from "../../utils/helpers/enums";
import {useQuery, useQueryClient} from "react-query";
import {communitiesGroupByKey, minDateCommunitiesKey} from "../../utils/queryKeys";
import {getCommunitiesGroupBy, getMinDateCommunities} from "../../utils/queries";
import Spinner from "../Common/spinner";
import {format} from "date-fns";

const CommunitiesDataTable = ({tenenvId}) => {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  formatStartDate(oneYearAgo)

  const today = new Date();
  today.setDate(today.getDate() - 1);
  formatEndDate(today)
  const dropdownRef = useRef(null);
  const [communitiesPerPeriod, setCommunitiesPerPeriod] = useState([]);
  const [minDate, setMinDate] = useState(null);
  const [endDate, setEndDate] = useState(today);
  const [startDate, setStartDate] = useState(oneYearAgo);
  const [dropdownOptionsState, setDropdownOptions] = useState(dropdownOptions);
  const [groupBy, setGroupBy] = useState("month")
  const controller = new AbortController


  const queryClient = useQueryClient();

  let params = {
    params: {
      'startDate': !startDate ? oneYearAgo : format(startDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      'endDate': !endDate ? today : format(endDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      'tenenv_id': tenenvId
    },
    signal: controller.signal
  }

  const communitiesGroupBy = useQuery(
    [communitiesGroupByKey, {groupBy: groupBy, params: params}],
    getCommunitiesGroupBy,
    {
      enabled: false,
      refetchOnWindowFocus: false
    }
  )

  const minDateCommunities = useQuery(
    [minDateCommunitiesKey, params],
    getMinDateCommunities,
    {
      enabled: false,
      refetchOnWindowFocus: false
    }
  )

  useEffect(() => {
    params = {
      params: {
        'startDate': !startDate ? oneYearAgo : format(startDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        'endDate': !endDate ? today : format(endDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        'tenenv_id': tenenvId
      },
      signal: controller.signal
    }

    try {
      const response = queryClient.refetchQueries([communitiesGroupByKey, {groupBy: groupBy, params: params}])
      queryClient.refetchQueries([minDateCommunitiesKey, {params:{tenenv_id: tenenvId}}])
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
    if(groupBy == "") {
      return;
    }
    const communitiesGroupByPerPeriodArray = !communitiesGroupBy.isLoading
      && !communitiesGroupBy.isFetching
      && communitiesGroupBy.isSuccess
      && communitiesGroupBy?.data?.map(element => ({
        "Date": convertDateByGroup(new Date(element?.range_date), groupBy),
        "Number of Communities": element?.count,
        "Names": element?.names
      }))

    if (!!communitiesGroupBy?.data
      && !!communitiesGroupByPerPeriodArray) {
      // We only keep the first date because the backend returns the dataset sorted and we only care about the
      // min of the min dates.
      if (minDate == undefined || minDate == "") {
        console.log(minDateCommunities?.data?.min_date)
        setMinDate(!!minDateCommunities?.data?.min_date ? new Date(minDateCommunities?.data?.min_date) : null)
      }
      $("#table-community").DataTable().destroy()
      setCommunitiesPerPeriod(communitiesGroupByPerPeriodArray)
    }
  }, [communitiesGroupBy.isSuccess && minDateCommunities.isSuccess, groupBy])

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



  return <Row className="box">
    <Col md={12}>
      <div className="box-header with-border">
        <h3 className="box-title">Number of communities</h3>
      </div>
    </Col>
    <Col lg={12} className="range_inputs">

      From: <DatePicker selected={startDate}
                        minDate={minDate}
                        dateFormat="dd/MM/yyyy"
                        onChange={handleStartDateChange}
    />
      To: <DatePicker selected={endDate}
                      minDate={minDate}
                      dateFormat="dd/MM/yyyy"
                      onChange={handleEndDateChange}
    />
      <Dropdown placeholder='Filter'
                options={dropdownOptions}
                onChange={handleChange}
                ref={dropdownRef}/>
    </Col>
    <Col lg={12}>
      {
        
          <Datatable dataTableId="table-community"
                     items={communitiesPerPeriod}
                     columnSep="Names"/>
      }
    </Col>
  </Row>


}

export default CommunitiesDataTable