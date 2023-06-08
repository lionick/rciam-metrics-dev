import {getIdps, getSps} from "../../utils/queries";
import {idpsKey, spsKey} from "../../utils/queryKeys";
import {useQuery} from "react-query";

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
    || spEntities.isFetching
    || spEntities?.data?.length == 0) {
    return null
  }

  return (
    <h3>{spEntities.data?.[0]?.name} ({spEntities.data?.[0]?.identifier})</h3>
  )
}

export default EntityInfoSp