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

// Authorization
// Login
export const loginQuery = async ({queryKey}) => {
    const [_, params] = queryKey
    const response = await apiClient.get('/login')
    return response.data
}