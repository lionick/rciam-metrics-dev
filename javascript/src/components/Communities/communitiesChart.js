import {useState, useEffect} from "react";
import {Chart} from "react-google-charts";
import {client} from '../../utils/api';
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

const CommunitiesChart = ({tenantId}) => {

  const [selected, setSelected] = useState(options_group_by[0].value);
  const [communities, setCommunities] = useState();
  const [communitiesList, setcommunitiesList] = useState([]);
  var communitiesArray = [["Date", "Communities"]];
  const [global_options, setGlobalOptions] = useState();

  useEffect(() => {
    var communitiesListArray = [];
    var hticksArray = [];
    var fValues = [['Date', 'Count', {'type': 'string', 'role': 'tooltip', 'p': {'html': true}}]]
    // Get data for the last 4 years

    client.get("communities_groupby/" + selected,
      {
        params:
          {
            'interval': selected,
            'count_interval': options[selected]["count_interval"],
            'tenant_id': tenantId,
          }
      }).then(response => {
      response["data"].forEach(element => {
        //var community = {"created":element.created, "name":element.community_info.name}
        var range_date = new Date(element.range_date);
        var community = [range_date, element.count]
        communitiesArray.push(community)

        // Construct the list with COUs
        var createdDate = element.created_date.split(", ")
        var description = element.description.split("|| ")
        element.names.split("|| ").forEach(function (name, index) {
          communitiesListArray.push({
            name: name,
            created: createdDate[index],
            description: description[index] + '<br/>Created Date: ' + createdDate[index]
          })
        })

        if (selected === "week") {
          hticksArray.push({v: range_date, f: getWeekNumber(range_date)})
        } else {
          hticksArray.push({v: range_date, f: range_date})
        }

        // Construct element & tooltip
        var temp = [];
        temp.push(range_date);
        temp.push(parseInt(element['count']));
        temp.push('<div style="padding:5px 5px 5px 5px;">'
          + convertDateByGroup(range_date, selected)
          + '<br/>Communities'
          + ": " + parseInt(element['count']) + '</div>');
        fValues.push(temp);
      });

      // sort by value
      communitiesListArray = communitiesListArray.sort(function (a, b) {
        var nameA = a.name.toUpperCase(); // ignore upper and lowercase
        var nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      });
      setcommunitiesList(communitiesListArray)
      setCommunities(fValues)


      setGlobalOptions(axisChartOptions(options[selected]["title"],
                                        options[selected]["hAxis"]["format"],
                                        hticksArray))

    })

  }, [selected, tenantId])


  return (
    <Row className="box">
      <Col md={12}>
        <div className="box-header with-border">
          <h3 className="box-title">Number of Communities created
          </h3>
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
              <ListCommunities communitiesList={communitiesList}/>
            </Col>
          </Row>
        </Container>
      </Col>
    </Row>
  )
}

export default CommunitiesChart