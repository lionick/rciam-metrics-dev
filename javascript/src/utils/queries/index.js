import { client as apiClient } from '../api';

// Users

// GET Users
export const getUsers = async ({queryKey}) => {
    const [_, params] = queryKey
    const response = await apiClient.get('/users')
    return response.data
}
// GET User
export const getUser = async({queryKey}) => {
    const [_, params] = queryKey
    const response = await apiClient.get('/users/' + params.userId)
    return response.data
}
// Delete User
export const delUser = async({queryKey}) => {
    const [_, params] = queryKey
    const response = await apiClient.delete('/users/' + params.userId)
    return response.data
}

// Tenant
export const getTenant = async({queryKey}) => {
    const [_, params] = queryKey
    const response  = await apiClient.get("tenant/" + params.projectId + "/" + params.environment)
    return response.data
}