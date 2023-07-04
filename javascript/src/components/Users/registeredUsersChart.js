import React, {useState, useEffect} from "react";
import {Chart} from "react-google-charts";
import {
  axisChartOptions,
  convertDateByGroup,
  getWeekNumber
} from "../Common/utils";
import Select from 'react-select';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  regUsersOptions,
  options_group_by
} from "../../utils/helpers/enums";
import {useQuery, useQueryClient} from "react-query";
import {registeredUsersGroupByKey} from "../../utils/queryKeys";
import {getRegisteredUsersGroupBy} from "../../utils/queries";

const RegisteredUsersChart = ({
                                tenenvId
                              }) => {
  const [selected, setSelected] = useState(options_group_by[0].value);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [global_options, setGlobalOptions] = useState();
  const queryClient = useQueryClient();

  let params = {
    params: {
      'interval': selected,
      'count_interval': regUsersOptions[selected]["count_interval"],
      'tenenv_id': tenenvId
    }
  }

  const registeredUsersGroup = useQuery(
    [registeredUsersGroupByKey, {groupBy: selected, params: params}],
    getRegisteredUsersGroupBy,
    {
      enabled: false
    }
  )

  useEffect(() => {
    params = {
      params: {
        'interval': selected,
        'count_interval': regUsersOptions[selected]["count_interval"],
        'tenenv_id': tenenvId,
      }
    }

    try {
      const response = queryClient.refetchQueries([registeredUsersGroupByKey, {groupBy: selected, params: params}])
    } catch (error) {
      // todo: Here we can handle any authentication or authorization errors
      console.log(error)
    }

  }, [selected, tenenvId])


  // Construct the data required for the datatable
  useEffect(() => {
    if (!registeredUsersGroup.isLoading
      && !registeredUsersGroup.isFetching
      && registeredUsersGroup.isSuccess
      && !!registeredUsersGroup.data) {

      const hticksArray = registeredUsersGroup?.data?.map(element => ({
          v: new Date(element?.range_date),
          f: selected === "week" ? getWeekNumber(new Date(element?.range_date)) : new Date(element?.range_date)
        })
      )

      let fValues = [
        ['Date',
          'Count',
          {
            'type': 'string',
            'role': 'tooltip',
            'p': {'html': true}
          }
        ]
      ]

      const charData = registeredUsersGroup?.data?.map(element => ([
          new Date(element?.range_date),
          parseInt(element['count']),
          `<div style="padding:5px 5px 5px 5px;">${convertDateByGroup(new Date(element?.range_date), selected)}<br/>Communities: ${parseInt(element['count'])}</div>`
        ])
      )

      setRegisteredUsers(fValues.concat(charData))
      setGlobalOptions(axisChartOptions(regUsersOptions[selected]["title"],
        regUsersOptions[selected]["hAxis"]["format"],
        hticksArray))
    }
  }, [!registeredUsersGroup.isLoading
  && !registeredUsersGroup.isFetching
  && registeredUsersGroup.isSuccess])

  // XXX Google Chart will not work if we return empty and then
  //     try to reload
  // if (registeredUsersGroup.isLoading
  //   || registeredUsersGroup.isFetching
  //   || registeredUsers?.length === 0) {
  //   return null
  // }

  return <Row className="box">
    <div className="box-header with-border">
      <h3 className="box-title">Number of Registered Users</h3>
    </div>
    <Col lg={12}>Select Period:
      <Select options={options_group_by}
              onChange={(event) => setSelected(event?.value)}/>
    </Col>
    <Col lg={12}>
      <Chart chartType="ColumnChart"
             width="100%"
             height="400px"
             loader={<div>Data loading</div>}
             data={registeredUsers}
             options={global_options}/>
    </Col>
  </Row>
}

export default RegisteredUsersChart