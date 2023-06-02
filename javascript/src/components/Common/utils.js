import $ from "jquery";
import {options} from "../../utils/helpers/enums";

export function convertDateByGroup(jsDate, groupBy) {
  var month = (jsDate.getMonth() + 1).toString()
  if (month.length < 2) {
    month = '0' + month;
  }
  var day = jsDate.getDate().toString()
  if (day.length < 2) {
    day = '0' + day;
  }
  if (groupBy == 'day') {
    var showDate = jsDate.getFullYear() + '-' + month + '-' + day;
  } else if (groupBy == 'week') {
    var showDate = jsDate.getFullYear() + '-' + month + '-' + day;
    var nextWeek = new Date(jsDate.setDate(jsDate.getDate() + 6));
    month = (nextWeek.getMonth() + 1).toString()
    if (month.length < 2) {
      month = '0' + month;
    }
    day = nextWeek.getDate().toString()
    if (day.length < 2) {
      day = '0' + day;
    }
    showDate += " to " + nextWeek.getFullYear() + '-' + month + '-' + day;
  } else if (groupBy == 'month') {
    var showDate = jsDate.getFullYear() + '-' + month;
  } else if (groupBy == 'year') {
    var showDate = jsDate.getFullYear();
  }
  return showDate;
}

export function getWeekNumber(d) {

  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  // Return array of year and week number
  return weekNo + ' (' + d.getUTCFullYear() + ')';
}

// Sort data and convert them to html list
export function convertToList(data, seperator) {
  var lis = ''
  data.split(seperator).sort(function (a, b) {
    var nameA = a.toUpperCase(); // ignore upper and lowercase
    var nameB = b.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be equal
    return 0;

  }).forEach(function (value) {
    lis += '<li>' + value.trim() + '</li>'
  })
  return lis
}

// Calculate Legends Area for Map
export function calculateLegends(maxSum) {
  // Set Number of Legends
  var numLegends = maxSum < 5 ? maxSum : 5;
  var spaces = Math.round(maxSum / numLegends);
  var legends = [];
  var fill = ["#09EBEE", "#19CEEB", "#28ACEA", "#388EE9", "#3D76E0"];
  for (var i = 0; i < numLegends; i++) {
    var maxValue = ((i + 1) != numLegends ? ((i + 1) * spaces) : maxSum);
    var legend = {
      min: i * spaces,
      max: maxValue,
      attrs: {
        fill: fill[i]
      },
      label: i * spaces + "-" + maxValue
    }
    legends.push(legend)
  }
  return legends;
}

export function setMapConfiguration() {
  return {
    name: "world_countries_mercator",
    zoom: {
      enabled: true,
      maxLevel: 15,
      init: {
        latitude: 38.938048,
        longitude: -2.924315,
        level: 5
      }
    },
    defaultArea: {
      attrs: {
        fill: "#ccc", // my function for color i want to define
        stroke: "#5d5d5d",
        "stroke-width": 0.2,
        "stroke-linejoin": "round",

      },
      attrsHover: {
        fill: "#E98300",
        animDuration: 300
      },

    },
  }
}

export function setLegend(legendLabel, legends) {
  return {
    area: {
      title: legendLabel,
      titleAttrs: {"font": "unset", "font-size": "12px", "font-weight": "bold"},
      slices: legends
    }
  }
}

// Find the min and max values at an Array
export function calculateMinMax(dataArray) {
  let min = dataArray[0][0]['min'], max = dataArray[0][0]['max']
  for (let i = 1; i < dataArray.length; i++) {
    let minValue = dataArray[i][0]['min']
    let maxValue = dataArray[i][0]['max']
    min = (minValue < min) ? minValue : min
    max = (maxValue > max) ? maxValue : max
  }
  return [min, max]
}

export const createAnchorElement = (title, link) => {
  const anchor = document.createElement('a');
  const linkText = document.createTextNode(title);
  anchor.appendChild(linkText);
  anchor.title = title;
  anchor.href = link;

  // FIXME:
  // Trying to pass an object directly to the datatable will fail. We need to
  // get the HTML string from the element. This causes inconsistent behavior
  // which we need to solve. For now we leave it as is.
  return anchor.outerHTML;
  // return anchor;
}

export const axisChartOptions = (title, hAxisFormat, hAxisTicks) => {
  return (
    {
      title: title,
      backgroundColor: {fill: 'transparent'},
      vAxis: {
        format: '0'
      },
      hAxis: {
        format: hAxisFormat,
        maxTextLines: 2,
        textStyle: {fontSize: 15},
        ticks: hAxisTicks,
      },
      tooltip: {isHtml: true},
      width: '100%',
      height: '350',
      bar: {groupWidth: "92%"},
      legend: {position: "none"},
    }
  )
}

export function sortByNamePropertyCallback(a, b) {
  const nameA = a.name.toUpperCase(); // ignore upper and lowercase
  const nameB = b.name.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  // names must be equal
  return 0;
}