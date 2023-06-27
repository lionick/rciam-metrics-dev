import React, {useCallback, useRef} from "react";
import {
  calculateLegends,
  setLegend,
  setMapConfiguration
} from "./utils";
import {StatusEnumeration} from "../../utils/helpers/enums";
import $ from "jquery";

const EarthMap = ({
                    datasetQuery,
                    tooltipLabel,
                    legendLabel
                  }) => {
  const areaLegendRef = useRef(null)

  const mapDrawRef = useCallback(node => {
    if (datasetQuery?.data !== undefined
      && node !== undefined) {
      createMap(node, areaLegendRef, datasetQuery?.data)
    }
  }, [!datasetQuery.isLoading && datasetQuery.isSuccess && datasetQuery?.data])

  // mapData need to be only one table. Not multiple ones.
  const createMap = (node,
                     areaLegendRef,
                     mapData,
                     tooltipLabel,
                     legendLabel) => {
    // Calculate tooltip
    let areas = {};
    let i = 1;
    let maxSum = 0;

    const mapStatsData = mapData?.stats ?? mapData
    const mapStatusData = mapData?.status


    mapStatsData?.forEach(function (mapRow) {
      let contentTooltip = `<span style="font-weight:bold;">${mapRow.country}</span><br />${tooltipLabel} : ${mapRow.sum}`

      // Handle status
      let other_status = 0;
      !!mapStatusData
      && mapStatusData.forEach(function (status_elem) {
        if (status_elem.country === mapRow.country) {
          if (status_elem.status !== 'A' && status_elem.status !== 'GP') {
            other_status += status_elem.sum
          } else {
            contentTooltip += StatusEnumeration[status_elem.status] + ": " + status_elem.sum + "<br/>"
          }
        }

      })
      if (other_status > 0) {
        contentTooltip += StatusEnumeration['O'] + ": " + other_status
      }


      areas[mapRow.countrycode] = {
        value: mapRow.sum,
        tooltip: {content: contentTooltip}
      }
      if (mapRow.sum > maxSum) {
        maxSum = mapRow.sum;
      }
      i++;
    })


    // Calculate Legends
    const legends = calculateLegends(maxSum)
    $(areaLegendRef.current).show()
    $(node).mapael({
      map: setMapConfiguration(),
      legend: setLegend(legendLabel, legends),
      areas: areas
    })
  }

  return (
    <div className="container_map"
         ref={mapDrawRef}>
      <div className="map"></div>
      <div ref={areaLegendRef}
           className="areaLegend"></div>
    </div>
  )
}

export default EarthMap