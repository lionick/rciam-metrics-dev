import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import { loginsCountByKey } from "../../utils/queryKeys";
import { getLoginsCountBy } from "../../utils/queries";

const LoginTiles = (parameters) => {
  const [tiles, setTiles] = useState({});

  const generateQueryKey = (params) => {
    return [loginsCountByKey, { params }];
  };

  const { refetch: getAllLoginsCount } = useQuery(
    generateQueryKey({
      'tenenv_id': parameters['tenenvId'],
      'unique_logins': parameters['uniqueLogins'],
      'idpId': parameters['idpId'] !== undefined ? parameters['idpId'] : null,
      'spId': parameters['spId'] !== undefined ? parameters['spId'] : null
    }),
    getLoginsCountBy,
    { enabled: false, refetchOnWindowFocus: false }
  );

  const { refetch: getLastYearLoginsCount } = useQuery(
    generateQueryKey({ 
      'interval': 'year',
      'count_interval': '1',
      'tenenv_id': parameters['tenenvId'],
      'unique_logins': parameters['uniqueLogins'],
      'idpId': parameters['idpId'] !== undefined ? parameters['idpId'] : null,
      'spId': parameters['spId'] !== undefined ? parameters['spId'] : null
    }),
    getLoginsCountBy,
    { enabled: false, refetchOnWindowFocus: false }
  );

  const { refetch: getLastMonthLoginsCount } = useQuery(
    generateQueryKey({
      'interval': 'days',
      'count_interval': '30',
      'tenenv_id': parameters['tenenvId'],
      'unique_logins': parameters['uniqueLogins'],
      'idpId': parameters['idpId'] !== undefined ? parameters['idpId'] : null,
      'spId': parameters['spId'] !== undefined ? parameters['spId'] : null
    }),
    getLoginsCountBy,
    { enabled: false, refetchOnWindowFocus: false }
  );

  const { refetch: getLastWeekLoginsCount } = useQuery(
    generateQueryKey({
      'interval': 'days',
      'count_interval': '7',
      'tenenv_id': parameters['tenenvId'],
      'unique_logins': parameters['uniqueLogins'],
      'idpId': parameters['idpId'] !== undefined ? parameters['idpId'] : null,
      'spId': parameters['spId'] !== undefined ? parameters['spId'] : null
    }),
    getLoginsCountBy,
    { enabled: false, refetchOnWindowFocus: false }
  );

  const { refetch: getYesterdayLoginsCount } = useQuery(
    generateQueryKey({ 
      'interval': 'days',
      'count_interval': '1',
      'tenenv_id': parameters['tenenvId'],
      'unique_logins': parameters['uniqueLogins'],
      'idpId': parameters['idpId'] !== undefined ? parameters['idpId'] : null,
      'spId': parameters['spId'] !== undefined ? parameters['spId'] : null
    }),
    getLoginsCountBy,
    { enabled: false, refetchOnWindowFocus: false }
  );


  useEffect(() => {
    const handleRefetch = async () => {

      const results = await Promise.all([
        
        getLastYearLoginsCount()
          .then((response) =>
          ({
            response, params:
            {
              'interval': 'year',
              'count_interval': '1',
              'tenenv_id': parameters['tenenvId'],
              'unique_logins': parameters['uniqueLogins'],
              'idpId': parameters['idpId'] !== undefined ? parameters['idpId'] : null,
              'spId': parameters['spId'] !== undefined ? parameters['spId'] : null
            }
          })
          ),
        getLastMonthLoginsCount()
          .then((response) =>
          ({
            response, params:
            {
              'interval': 'days',
              'count_interval': '30',
              'tenenv_id': parameters['tenenvId'],
              'unique_logins': parameters['uniqueLogins'],
              'idpId': parameters['idpId'] !== undefined ? parameters['idpId'] : null,
              'spId': parameters['spId'] !== undefined ? parameters['spId'] : null
            }
          })
          ),
        getLastWeekLoginsCount()
          .then((response) =>
          ({
            response, params:
            {
              'interval': 'days',
              'count_interval': '7',
              'tenenv_id': parameters['tenenvId'],
              'unique_logins': parameters['uniqueLogins'],
              'idpId': parameters['idpId'] !== undefined ? parameters['idpId'] : null,
              'spId': parameters['spId'] !== undefined ? parameters['spId'] : null
            }
          })
          ),
          getYesterdayLoginsCount()
          .then((response) =>
          ({
            response, params:
            {
              'interval': 'days',
              'count_interval': '1',
              'tenenv_id': parameters['tenenvId'],
              'unique_logins': parameters['uniqueLogins'],
              'idpId': parameters['idpId'] !== undefined ? parameters['idpId'] : null,
              'spId': parameters['spId'] !== undefined ? parameters['spId'] : null
            }
          })
          )
      ])

      // Log the data to the console
      // You would do something with both sets of data here
      var tilesArray = {}
      results.forEach(({ response, params }, index) => {
        const { data } = response;
        
        data.forEach(element => {
          if (params["interval"]) {
            var name = params["interval"] + "_" + params["count_interval"]
            tilesArray[[name]] = (element["count"] != null) ? element["count"] : 0
          }
          else {
            tilesArray["overall"] = (element["count"] != null) ? element["count"] : 0
          }

        })
      });
      setTiles(tilesArray)

    }
    handleRefetch()

  }, [parameters["uniqueLogins"]])

  return (

    <Row>
      <Col md={12} className="tiles-container">
        
        <Col lg={3} xs={6}>
          <div className="small-box bg-green">
            <div className="inner">
              <h3>{tiles["year_1"]}</h3>
              <p>Last Year Logins</p>
            </div>
          </div>
        </Col>
        <Col lg={3} xs={6}>
          <div className="small-box bg-yellow">
            <div className="inner">
              <h3>{tiles["days_30"]}</h3>
              <p>Last 30 days Logins</p>
            </div>
          </div>
        </Col>
        <Col lg={3} xs={6}>
          <div className="small-box bg-red">
            <div className="inner">
              <h3>{tiles["days_7"]}</h3>
              <p>Last 7 days Logins</p>
            </div>
          </div>
        </Col>
        <Col lg={3} xs={6}>
          <div className="small-box bg-aqua">
            <div className="inner">
              <h3>{tiles["days_1"]}</h3>
              <p>Last 1 day Logins</p>
            </div>
          </div>
        </Col>
      </Col>
    </Row>
  )
}

export default LoginTiles