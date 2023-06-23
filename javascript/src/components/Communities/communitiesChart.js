import React, {useState, useEffect} from "react";
import {Chart} from "react-google-charts";
import {
  convertDateByGroup,
  getWeekNumber,
  axisChartOptions
} from "../Common/utils";
import Select from 'react-select';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListCommunities from "./listCommunities";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  options,
  options_group_by
} from "../../utils/helpers/enums";
import {useQuery, useQueryClient} from "react-query";
import {communitiesGroupByKey} from "../../utils/queryKeys";
import {getCommunitiesGroupBy} from "../../utils/queries";

const CommunitiesChart = ({tenenvId}) => {

  const [selected, setSelected] = useState(options_group_by[0].value);
  const [communities, setCommunities] = useState();
  const [global_options, setGlobalOptions] = useState();
  const queryClient = useQueryClient();


  let params = {
    params: {
      'interval': selected,
      'count_interval': options[selected]["count_interval"],
      'tenenv_id': tenenvId,
    }
  }

  const communitiesGroupBy = useQuery(
    [communitiesGroupByKey, {groupBy: selected, params: params}],
    getCommunitiesGroupBy,
    {
      enabled: false
    }
  )

  useEffect(() => {
    params = {
      params: {
        'interval': selected,
        'count_interval': options[selected]["count_interval"],
        'tenenv_id': tenenvId,
      }
    }

    try {
      const response = queryClient.refetchQueries([communitiesGroupByKey, {groupBy: selected, params: params}])
    } catch (error) {
      // todo: Here we can handle any authentication or authorization errors
      console.log(error)
    }

  }, [selected, tenenvId])


  // Construct the data required for the datatable
  useEffect(() => {
    if (!communitiesGroupBy.isLoading
      && !communitiesGroupBy.isFetching
      && communitiesGroupBy.isSuccess
      && !!communitiesGroupBy.data) {

      const hticksArray = communitiesGroupBy?.data?.map(element => ({
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

      const charData = communitiesGroupBy?.data?.map(element => ([
          new Date(element?.range_date),
          parseInt(element['count']),
          `<div style="padding:5px 5px 5px 5px;">${convertDateByGroup(new Date(element?.range_date), selected)}<br/>Communities: ${parseInt(element['count'])}</div>`
        ])
      )


      setCommunities(fValues.concat(charData))
      setGlobalOptions(axisChartOptions(options[selected]["title"], options[selected]["hAxis"]["format"],
        hticksArray))
    }
  }, [!communitiesGroupBy.isLoading
  && !communitiesGroupBy.isFetching
  && communitiesGroupBy.isSuccess])

  // XXX Google Chart will not work if we return empty and then
  //     try to reload
  // if (communitiesGroupBy.isLoading
  //   || communitiesGroupBy.isFetching
  //   || communities?.length === 0) {
  //   return null
  // }

  return (
    <Row className="box">
      <Col md={12}>
        <div className="box-header with-border">
          <h3 className="box-title">Number of Communities created</h3>
        </div>
      </Col>
      <Col lg={9}>
        <Chart chartType="ColumnChart"
               width="100%"
               height="400px"
               data={communities}
               options={global_options}/>
      </Col>
      <Col lg={3}>
        <Container>
          <Row>
            <Col lg={4}>Select Period:</Col>
            <Col lg={8}>
              <Select options={options_group_by}
                      onChange={(event) => setSelected(event?.value)}/>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <ListCommunities communities={communitiesGroupBy}/>
            </Col>
          </Row>
        </Container>
      </Col>
    </Row>
  )
}

export default CommunitiesChart