import {useState, useEffect} from "react";
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
import {convertDateByGroup, createAnchorElement} from "../Common/utils";
import {dropdownOptions} from "../../utils/helpers/enums";
import 'react-toastify/dist/ReactToastify.css';
import 'react-dropdown/style.css';
import "react-datepicker/dist/react-datepicker.css";
import {useQuery, useQueryClient} from "react-query";
import {loginsPerIdpKey, registeredUsersPerCountryGroupByKey} from "../../utils/queryKeys";
import {getRegisteredUsersPerCountryGroupBy} from "../../utils/queries";
import {useCookies} from "react-cookie";

const RegisteredUsersDataTable = ({
                                    tenantId,
                                    setStartDate,
                                    setEndDate,
                                    startDate,
                                    endDate
                                  }) => {
  const [cookies, setCookie] = useCookies();
  const [usersPerCountryPerPeriod, setUsersPerCountryPerPeriod] = useState([]);
  const [minDate, setMinDate] = useState("");
  const [groupBy, setGroupBy] = useState("month")
  const queryClient = useQueryClient();


  let params = {
    params: {
      'startDate': startDate,
      'endDate': endDate,
      'tenant_id': tenantId
    }
  }

  const registeredUsersPerCountryGroup = useQuery(
    [registeredUsersPerCountryGroupByKey, {groupBy: groupBy, params: params}],
    getRegisteredUsersPerCountryGroupBy,
    {
      enabled: false
    }
  )

  useEffect(() => {
    params = {
      params: {
        'startDate': startDate,
        'endDate': endDate,
        'tenant_id': tenantId
      }
    }

    try {
      const response = queryClient.refetchQueries([registeredUsersPerCountryGroupByKey, {
        groupBy: groupBy,
        params: params
      }])
    } catch (error) {
      // todo: Here we can handle any authentication or authorization errors
      console.log(error)
    }

  }, [groupBy])

  // Construct the data required for the datatable
  useEffect(() => {
    const perPeriod = !registeredUsersPerCountryGroup.isLoading
      && !registeredUsersPerCountryGroup.isFetching
      && registeredUsersPerCountryGroup.isFetched
      && registeredUsersPerCountryGroup.isSuccess
      && registeredUsersPerCountryGroup?.data?.map(user => ({
        "Date": dateFormat(new Date(user?.range_date), "yyyy-mm"),
        "Number of Registered Users": user?.count,
        "Registered Users per country": user?.countries
      }))

    if (!!registeredUsersPerCountryGroup?.data && !!perPeriod) {
      // This is essential: We must destroy the datatable in order to be refreshed with the new data
      if (minDate == undefined || minDate == "") {
        setMinDate(!!registeredUsersPerCountryGroup?.data?.[0]?.min_date ? new Date(registeredUsersPerCountryGroup?.data?.[0]?.min_date) : null)
      }
      $("#table-users").DataTable().destroy()
      setUsersPerCountryPerPeriod(perPeriod)
    }
  }, [!registeredUsersPerCountryGroup.isLoading
  && !registeredUsersPerCountryGroup.isFetching
  && registeredUsersPerCountryGroup.isSuccess])

  const handleChange = (event) => {
    if (!startDate || !endDate) {
      toast.warning("You have to fill both startDate and endDate")
      return
    }
    setGroupBy(event.value)
  };

  if (registeredUsersPerCountryGroup.isLoading
    || registeredUsersPerCountryGroup.isFetching
    || minDate == undefined) {
    return null
  }


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
          usersPerCountryPerPeriod.length !== 0 ?
            <Datatable dataTableId="table-users"
                       items={usersPerCountryPerPeriod}
                       columnSep="Registered Users per country"/>
            : null
        }
      </Col>
    </Row>
  )
}

export default RegisteredUsersDataTable