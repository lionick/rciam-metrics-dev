import {useEffect} from "react";
import ReactTooltip from "react-tooltip";

const ListCommunities = ({communitiesList}) => {
  useEffect(() => {
    ReactTooltip.rebuild();
  }, [communitiesList])

  return <ul className="couNames columnList">
    {
      communitiesList.map((cou, index) => (
        <li key={index}
            className="rowList"
            data-tip={cou['description']}>
          {cou["name"]}
        </li>
      ))
    }
    <ReactTooltip className={"tooltip"} multiline={true} place="top"/>
  </ul>

}

export default ListCommunities
