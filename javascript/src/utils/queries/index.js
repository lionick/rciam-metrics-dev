import { client as apiClient } from '../api';

// Tenant
export const getTenant = async({queryKey}) => {
    const [_, params] = queryKey
    const response  = await apiClient.get("tenant/" + params.projectId + "/" + params.environment)
    return response.data
}

// Logins
export const getLoginsPerSP = async({queryKey}) => {
    const [_, params] = queryKey
    const response  = await apiClient.get("logins_per_sp", params)
    return response.data
}
