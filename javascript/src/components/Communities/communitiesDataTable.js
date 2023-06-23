import React, {useState, useEffect} from "react";
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import Datatable from "../../components/datatable";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import Dropdown from 'react-dropdown';
import {toast} from 'react-toastify';
import {convertDateByGroup} from "../Common/utils";
import 'react-toastify/dist/ReactToastify.css';
import 'react-dropdown/style.css';
import "react-datepicker/dist/react-datepicker.css";
import {dropdownOptions} from "../../utils/helpers/enums";
import {useQuery, useQueryClient} from "react-query";
import {communitiesGroupByKey} from "../../utils/queryKeys";
import {getCommunitiesGroupBy} from "../../utils/queries";

const CommunitiesDataTable = ({tenenvId}) => {
  const [communitiesPerPeriod, setCommunitiesPerPeriod] = useState([]);
  const [minDate, setMinDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [groupBy, setGroupBy] = useState("month")

  const queryClient = useQueryClient();

  let params = {
    params: {
      'startDate': startDate,
      'endDate': endDate,
      'tenenv_id': tenenvId
    }
  }

  const communitiesGroupBy = useQuery(
    [communitiesGroupByKey, {groupBy: groupBy, params: params}],
    getCommunitiesGroupBy,
    {
      enabled: false
    }
  )

  useEffect(() => {
    params = {
      params: {
        'startDate': startDate,
        'endDate': endDate,
        'tenenv_id': tenenvId
      }
    }

    try {
      const response = queryClient.refetchQueries([communitiesGroupByKey, {groupBy: groupBy, params: params}])
    } catch (error) {
      // todo: Here we can handle any authentication or authorization errors
      console.log(error)
    }

  }, [groupBy])


  // Construct the data required for the datatable
  useEffect(() => {
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
        setMinDate(!!communitiesGroupBy?.data?.[0]?.min_date ? new Date(communitiesGroupBy?.data?.[0]?.min_date) : null)
      }
      $("#table-community").DataTable().destroy()
      setCommunitiesPerPeriod(communitiesGroupByPerPeriodArray)
    }
  }, [!communitiesGroupBy.isLoading
  && !communitiesGroupBy.isFetching
  && communitiesGroupBy.isSuccess])

  const handleChange = (event) => {
    if (!startDate || !endDate) {
      toast.warning("You have to fill both startDate and endDate")
      return
    }
    setGroupBy(event.value)
  };

  if (communitiesGroupBy.isLoading
    || communitiesGroupBy.isFetching
    || minDate == undefined) {
    return null
  }

  return <Row className="box">
    <Col md={12}>
      <div className="box-header with-border">
        <h3 className="box-title">Number of logins</h3>
      </div>
    </Col>
    <Col lg={12} className="range_inputs">

      From: <DatePicker selected={startDate}
                        minDate={minDate}
                        dateFormat="dd/MM/yyyy"
                        onChange={(date) => setStartDate(date)}/>
      To: <DatePicker selected={endDate}
                      minDate={minDate}
                      dateFormat="dd/MM/yyyy"
                      onChange={(date) => setEndDate(date)}/>
      <Dropdown placeholder='Filter'
                options={dropdownOptions}
                onChange={handleChange}/>
    </Col>
    <Col lg={12}>
      {
        communitiesPerPeriod.length !== 0 ?
          <Datatable dataTableId="table-community"
                     items={communitiesPerPeriod}
                     columnSep="Names"/> : null
      }
    </Col>
  </Row>


}

export default CommunitiesDataTable