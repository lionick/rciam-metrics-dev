import axios from "axios"
import {useCookies} from 'react-cookie';
import config from "./../../config_react.json";
const getConfig = key => config["configReact"][key]

const getCookie = (name) => {
    var pattern = RegExp(name + "=.[^;]*")
    var matched = document.cookie.match(pattern)
    if(matched){
        var cookie = matched[0].split('=')
        return cookie[1]
    }
    return false
}

const client = axios.create({
  baseURL: getConfig('apiUrl'),
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-type": "application/json",
    'x-access-token': `${getCookie('atoken')}`
  },
  transformResponse: [function (data) {
    try {
      // todo: Check for errors returned by the server
      return  JSON.parse(data)
    } catch (err) {
      return err
    }
  }],
})


export {
  client
}
