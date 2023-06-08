import {client as apiClient} from '../api';
import axios from "axios";

// Tenenv
export const getTenenv = async ({queryKey}) => {
  const [_, params] = queryKey
  const response = await apiClient.get("tenenv/" + params.tenantId + "/" + params.environment)
  return response.data
}

// Logins
export const getLoginsPerSP = async ({queryKey}) => {
  const [_, params] = queryKey
  const response = await apiClient.get("logins_per_sp", params)
  return response.data
}

export const getLoginsPerIdp = async ({queryKey}) => {
  const [_, params] = queryKey
  const response = await apiClient.get("logins_per_idp", params)
  return response.data
}

export const getLoginsPerCountry = async ({queryKey}) => {
  const [_, params] = queryKey
  const response = await apiClient.get("logins_per_country", params)
  return response.data
}

export const getLoginsGroupByDay = async ({queryKey}) => {
  const [_, params] = queryKey
  const response = await apiClient.get("logins_groupby/day", params)
  return response.data
}

export const getLoginsCountBy = async ({queryKey}) => {
  const [_, params] = queryKey
  const response = await apiClient.get("logins_countby", params)
  return response.data
}

// Get Idps, Sps
export const getIdps = async ({queryKey}) => {
  const [_, params] = queryKey
  const response = await apiClient.get("idps", params)
  return response.data
}

export const getSps = async ({queryKey}) => {
  const [_, params] = queryKey
  const response = await apiClient.get("sps", params)
  return response.data
}

// Users
export const getRegisteredUsersCountby = async ({queryKey}) => {
  const [_, params] = queryKey
  const response = await apiClient.get("registered_users_countby", params)
  return response.data
}

export const getRegisteredUsersByCountry = async ({queryKey}) => {
  const [_, params] = queryKey
  const response = await apiClient.get("registered_users_country", params)
  return response.data
}

// Communities
export const getCommunities = async ({queryKey}) => {
  const [_, params] = queryKey
  const response = await apiClient.get("communities", params)
  return response.data
}

export const getCommunityMembersByStatus = async ({queryKey}) => {
  const [_, params] = queryKey
  const response = await apiClient.get("members_bystatus", params)
  return response.data
}

export const getCountryStatsByVo = async ({queryKey}) => {
  const [_, params] = queryKey
  const response = await apiClient.get(`country_stats_by_vo/${params.countryId}`, params)
  return response.data
}

export const getCommunitiesGroupBy = async ({queryKey}) => {
  const [_, params] = queryKey
  const response = await apiClient.get(
    `communities_groupby${(params.groupBy != undefined && params.groupBy != "") ? "/" + params.groupBy : ""}`
    , params.params)
  return response.data
}

export const getRegisteredUsersPerCountryGroupBy = async ({queryKey}) => {
  const [_, params] = queryKey
  const response = await apiClient.get(
    `registered_users_country_group_by${(params.groupBy != undefined && params.groupBy != "") ? "/" + params.groupBy : ""}`
    , params.params)
  return response.data
}

export const getRegisteredUsersGroupBy = async ({queryKey}) => {
  const [_, params] = queryKey
  const response = await apiClient.get(
    `registered_users_groupby${(params.groupBy != undefined && params.groupBy != "") ? "/" + params.groupBy : ""}`
    , params.params)
  return response.data
}