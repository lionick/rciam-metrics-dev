import React, {useEffect} from "react";
import {sortByNamePropertyCallback} from "../Common/utils"
import ReactTooltip from "react-tooltip";
import Spinner from "../Common/spinner";

const ListCommunities = ({communities}) => {
  useEffect(() => {
    ReactTooltip.rebuild();
  }, [communities])


  if (communities.isLoading
    || communities.isFetching
    || communities?.data == undefined) {
        return (<Spinner />)
  }

  const communitiesList = communities?.data.map((element) => {
    // Construct the list with COUs
    const createdDate = element?.created_date?.split(", ")
    const description = element?.description?.split("|| ")
    return element?.names?.split("|| ").map((name, index) => ({
        name: name,
        description: `${description[index]}<br/>Created Date: ${createdDate[index]}`
      })
    )
  })

  if (communitiesList?.length == 0) {
    return null
  }

  return (
    <ul className="couNames columnList">
      {
        communitiesList
          .flat()
          .sort(sortByNamePropertyCallback)
          .map((cou, index) => (
            <li key={index}
                className="rowList"
                data-tip={cou['description']}>
              {cou["name"]}
            </li>
          ))
      }
      <ReactTooltip className={"tooltip"} multiline={true} place="top"/>
    </ul>
  )
}

export default ListCommunities
