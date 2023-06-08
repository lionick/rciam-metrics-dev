import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { registeredUsersCountByKey } from "../../utils/queryKeys";
import { getRegisteredUsersCountby } from "../../utils/queries";



const RegisteredUsersTiles = (parameters) => {
  const [tiles, setTiles] = useState({});

  const generateQueryKey = (params) => {
    return [registeredUsersCountByKey, { params }];
  };

  const { refetch: getAllRegisteredUsersCount } = useQuery(
    generateQueryKey({ tenenv_id: parameters['tenenvId'] }),
    getRegisteredUsersCountby,
    { enabled: false, refetchOnWindowFocus: false }
  );
  const { refetch: getLastYearRegisteredUsersCount } = useQuery(
    generateQueryKey({ interval: 'year', count_interval: '1', tenenv_id: parameters['tenenvId'] }),
    getRegisteredUsersCountby,
    { enabled: false, refetchOnWindowFocus: false }
  );
  const { refetch: getLastMonthRegisteredUsersCount } = useQuery(
    generateQueryKey({ interval: 'days', count_interval: '30', tenenv_id: parameters['tenenvId'] }),
    getRegisteredUsersCountby,
    { enabled: false, refetchOnWindowFocus: false }
  );
  const { refetch: getLastWeekRegisteredUsersCount } = useQuery(
    generateQueryKey({ interval: 'days', count_interval: '7', tenenv_id: parameters['tenenvId'] }),
    getRegisteredUsersCountby,
    { enabled: false, refetchOnWindowFocus: false }
  );

  useEffect(() => {
    const handleRefetch = async () => {

      const results = await Promise.all([
        getAllRegisteredUsersCount()
          .then((response) => 
            ({ response, params: { tenenv_id: parameters['tenenvId'] } })),
        getLastYearRegisteredUsersCount()
          .then((response) => 
            ({ response, params: { interval: 'year', count_interval: '1', tenenv_id: parameters['tenenvId'] } })),
        getLastMonthRegisteredUsersCount()
          .then((response) => 
            ({ response, params: { interval: 'days', count_interval: '30', tenenv_id: parameters['tenenvId'] } })),
        getLastWeekRegisteredUsersCount()
          .then((response) => 
            ({ response, params: { interval: 'days', count_interval: '7', tenenv_id: parameters['tenenvId'] } })),
      ])

      var tilesArray = {}
      results.forEach(({ response, params }, index) => {
        const { data } = response;
        data.forEach(element => {
          if (params["interval"]) {
            var name = params["interval"] + "_" + params["count_interval"]
            tilesArray[[name]] = element["count"]
          }
          else {
            tilesArray["overall"] = element["count"]
          }

        })
      });

      setTiles(tilesArray)
    }
    handleRefetch();
  }, [])

  return (

    <Row>
      <Col md={12} className="tiles-container">
        <Col lg={3} xs={6}>
          <div className="small-box bg-aqua">
            <div className="inner">
              <h3>{tiles["overall"]}</h3>
              <p>Total Registered Users</p>
            </div>
          </div>
        </Col>
        <Col lg={3} xs={6}>
          <div className="small-box bg-aqua">
            <div className="inner">
              <h3>{tiles["year_1"]}</h3>
              <p>Last Year Registered Users</p>
            </div>
          </div>
        </Col>
        <Col lg={3} xs={6}>
          <div className="small-box bg-aqua">
            <div className="inner">
              <h3>{tiles["days_30"]}</h3>
              <p>Last 30 days Registered Users</p>
            </div>
          </div>
        </Col>
        <Col lg={3} xs={6}>
          <div className="small-box bg-aqua">
            <div className="inner">
              <h3>{tiles["days_7"]}</h3>
              <p>Last 7 days Registered Users</p>
            </div>
          </div>
        </Col>
      </Col>
    </Row>
  )
}

export default RegisteredUsersTiles