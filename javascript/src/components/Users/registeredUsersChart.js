import { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { client } from '../../utils/api';
import { convertDateByGroup, getWeekNumber } from "../Common/utils";
import Select from 'react-select';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';

const options = {
    year: {
        title: "Number of Registered Users per year",
        hAxis: {
            format: 'Y',
        }
    },
    month: {
        title: "Number of Registered Users per month",
        hAxis: {
            format: 'YYYY-MM',
        }
    },
    week: {
        title: "Number of Registered Users per week",
        hAxis: {
            format: '',
        }
    }
};

const options_group_by = [
    { value: 'year', label: 'yearly' },
    { value: 'month', label: 'monthly' },
    { value: 'week', label: 'weekly' },
];

const RegisteredUsersChart = (parameters) => {
    const [selected, setSelected] = useState(options_group_by[0].value);
    const [registeredUsers, setRegisteredUsers] = useState();
    var registeredUsersArray = [["Date", "Registered Users"]];
    const [global_options, setGlobalOptions] = useState();

    useEffect(() => {

        var hticksArray = [];
        var fValues = [['Date', 'Count', { 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } }]]
        // Get data for the last 4 years
        // TODO: change it to last 1 year
        client.get("registered_users_groupby/" + selected,
            {
                params: {
                    'interval': 'year',
                    'count_interval': '8',
                    'tenant_id': parameters['tenantId']
                }
            }).then(response => {

                response["data"].forEach(element => {
                    //var community = {"created":element.created, "name":element.community_info.name}
                    var range_date = new Date(element.range_date);
                    var usersByRange = [range_date, element.count]
                    registeredUsersArray.push(usersByRange)

                    if (selected === "week") {
                        hticksArray.push({ v: range_date, f: getWeekNumber(range_date) })
                    }
                    else {
                        hticksArray.push({ v: range_date, f: range_date })
                    }

                    // Construct element & tooltip
                    var temp = [];
                    temp.push(range_date);
                    temp.push(parseInt(element['count']));
                    temp.push('<div style="padding:5px 5px 5px 5px;">'
                        + convertDateByGroup(range_date, selected)
                        + '<br/>Registered Users'
                        + ": " + parseInt(element['count']) + '</div>');
                    fValues.push(temp);
                });

                setRegisteredUsers(fValues)

                setGlobalOptions({
                    title: options[selected]["title"],
                    backgroundColor: { fill: 'transparent' },
                    vAxis: {
                        //title: vAxisTitle[tab],
                        format: '0'
                    },
                    hAxis: {
                        format: options[selected]["hAxis"]["format"],
                        maxTextLines: 2,
                        //title: registeredUsersBy[type], // globar variable found at index.ctp
                        textStyle: { fontSize: 15 },
                        ticks: hticksArray,
                        //showTextEvery: 5
                    },
                    tooltip: { isHtml: true },
                    width: '100%',
                    height: '350',
                    bar: { groupWidth: "92%" },
                    legend: { position: "none" },
                })

            })

    }, [selected])

    const handleChange = event => {
        setSelected(event.value);
    };

    return <Row className="box">
        <div className="box-header with-border">
            <h3 className="box-title">Number of Registered Users</h3>
        </div>
        <Col lg={12}>Select Period:
            <Select options={options_group_by} onChange={handleChange} ></Select>
        </Col>
        <Col lg={12}>
            <Chart chartType="ColumnChart" width="100%" height="400px" data={registeredUsers}
                options={global_options} />
        </Col>
    </Row>
}

export default RegisteredUsersChart