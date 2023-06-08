import {getIdps, getSps} from "../../utils/queries";
import {idpsKey, spsKey} from "../../utils/queryKeys";
import {useQuery} from "react-query";

const EntityInfoIdp = ({
                         tenenvId,
                         idpId
                       }) => {
  const idpEntities =
    useQuery(
      [idpsKey, {
        params: {
          'tenenv_id': tenenvId,
          'idpId': idpId
        }
      }],
      getIdps,
      {
        enabled: !!idpId
      })

  if (idpEntities.isLoading
    || idpEntities.isFetching
    || idpEntities?.data?.length == 0) {
    return null
  }

  return (
    <h3>{idpEntities.data?.[0]?.name} ({idpEntities.data?.[0]?.entityid})</h3>
  )
}

export default EntityInfoIdp