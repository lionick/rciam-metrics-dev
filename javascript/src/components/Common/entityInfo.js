import {getIdps, getSps} from "../../utils/queries";
import {idpsKey, spsKey} from "../../utils/queryKeys";
import {useQuery} from "react-query";

const EntityInfo = (parameters) => {
  const entities = parameters?.idpId ?
    useQuery(
      [idpsKey, {
        params: {
          'tenant_id': parameters?.tenantId,
          'idpId': parameters?.idpId
        }
      }],
      getIdps) :
    useQuery([spsKey, {
      params: {
        'tenant_id': parameters?.tenantId,
        'spId': parameters?.spId
      }
    }], getSps)

  if (entities.isLoading
    || entities.isFetching
    || entities?.data?.length == 0) {
    return null
  }

  return (
    <h3>{entities.data?.[0]?.name} ({!!parameters?.idpId ? entities.data?.[0]?.entityid : entities.data?.[0]?.identifier})</h3>
  )
}

export default EntityInfo