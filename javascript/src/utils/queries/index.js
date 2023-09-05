import {
  client as apiClient,
  deleteCookie,
  handleError
} from '../api';


// Tenenv
export const getTenenv = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("tenenv/" + params.tenantId + "/" + params.environment)
    return response.data
  } catch (error) {
    console.log('error', error)
    handleError(error)
    return error.response
  }
}

// Logins
export const getLoginsPerSP = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("logins_per_sp", params)
    return response.data
  } catch (error) {
    console.log('error', error)
    handleError(error)
    return error.response
  }
}

export const getLoginsPerIdp = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("logins_per_idp", params)
    return response.data
  } catch (error) {
    console.log('error', error)
    handleError(error)
    return error.response
  }
}

export const getLoginsPerCountry = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("logins_per_country", params)
    return response.data
  } catch (error) {
    console.log('error', error)
    handleError(error)
    return error.response
  }
}

export const getMinDateLogins = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("min_date_logins", params)
    return response.data
  } catch (error) {
    console.log('error', error)
    handleError(error)
    return error.response
  }
}

export const getMinDateCommunities = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("min_date_communities", params)
    return response.data
  } catch (error) {
    console.log('error', error)
    handleError(error)
    return error.response
  }
}

export const getMinDateRegisteredUsers = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("min_date_registered_users", params)
    return response.data
  } catch (error) {
    console.log('error', error)
    handleError(error)
    return error.response
  }
}

export const getLoginsGroupByDay = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("logins_groupby/day", params)
    return response.data
  } catch (error) {
    console.log('error', error)
    handleError(error)
    return error.response
  }
}

export const getLoginsCountBy = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("logins_countby", params)
    return response.data
  } catch (error) {
    console.log('error', error)
    handleError(error)
    return error.response
  }
}

// Get Idps, Sps
export const getIdps = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("idps", params)
    return response.data
  } catch (error) {
    console.log('error', error)
    handleError(error)
    return error.response
  }
}

export const getSps = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("sps", params)
    return response.data
  } catch (error) {
    console.log('error', error)
    handleError(error)
    return error.response
  }
}

// Users
export const getRegisteredUsersCountby = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("registered_users_countby", params)
    return response.data
  } catch (error) {
    console.log('error', error)
    handleError(error)
    return error.response
  }
}

export const getRegisteredUsersByCountry = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("registered_users_country", params)
    return response.data
  } catch (error) {
    console.log('error', error)
    handleError(error)
    return error.response
  }
}

// Communities
export const getCommunities = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("communities", params)
    return response.data
  } catch (error) {
    console.log('error', error)
    handleError(error)
    return error.response
  }
}

export const getCommunityMembersByStatus = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get("members_bystatus", params)
    return response.data
  } catch (error) {
    console.log('error', error)
    handleError(error)
    return error.response
  }
}

export const getCountryStatsByVo = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get(`country_stats_by_vo/${params.countryId}`, params)
    return response.data
  } catch (error) {
    console.log('error', error)
    handleError(error)
    return error.response
  }
}

export const getCommunitiesGroupBy = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get(
      `communities_groupby${(params.groupBy != undefined && params.groupBy != "") ? "/" + params.groupBy : ""}`
      , params.params)
    return response.data
  } catch (error) {
    console.log('error', error)
    handleError(error)
    return error.response
  }
}

export const getRegisteredUsersPerCountryGroupBy = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get(
      `registered_users_country_group_by${(params.groupBy != undefined && params.groupBy != "") ? "/" + params.groupBy : ""}`
      , params.params)
    return response.data
  } catch (error) {
    console.log('error', error)
    handleError(error)
    return error.response
  }
}

export const getRegisteredUsersGroupBy = async ({queryKey}) => {
  const [_, params] = queryKey
  try {
    const response = await apiClient.get(
      `registered_users_groupby${(params.groupBy != undefined && params.groupBy != "") ? "/" + params.groupBy : ""}`
      , params.params)
    return response.data
  } catch (error) {
    console.log('error', error)
    handleError(error)
    return error.response
  }
}