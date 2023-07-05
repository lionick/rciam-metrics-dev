import {getSps} from "../../utils/queries";
import {spsKey} from "../../utils/queryKeys";
import {useQuery} from "react-query";
import Spinner from "./spinner";
import React from "react";

const EntityInfoSp = ({
                        tenenvId,
                        spId
                      }) => {
  const spEntities =
    useQuery([spsKey, {
        params: {
          'tenenv_id': tenenvId,
          'spId': spId
        }
      }], getSps,
      {
        enabled: !!spId
      })

  if (spEntities.isLoading
      || spEntities.isFetching) {
    return (<Spinner/>)
  }

  if (spEntities?.data?.length == 0) {
    return null
  }

  return (
    <h3>{spEntities.data?.[0]?.name} ({spEntities.data?.[0]?.identifier})</h3>
  )
}

export default EntityInfoSp