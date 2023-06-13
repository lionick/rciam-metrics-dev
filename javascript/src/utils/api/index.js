import axios from "axios"
import config from "./../../config_react.json";

const getConfig = key => config["configReact"][key]

const getCookie = (name) => {
  var pattern = RegExp(name + "=.[^;]*")
  var matched = document.cookie.match(pattern)
  if (matched) {
    var cookie = matched[0].split('=')
    return cookie[1]
  }
  return false
}

const deleteCookie = (name, path, domain) => {
  if (getCookie(name)) {
    document.cookie = name + "=" +
      ((path) ? ";path=" + path : "") +
      ((domain) ? ";domain=" + domain : "") +
      ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
}

const handleError = (error) => {
  console.log('errror', error)
  if (error.response.status == 401
      && error.response.headers['x-authenticated'] == "false") {
      deleteCookie('idtoken', '/', window.location.hostname)
      deleteCookie('atoken', '/', window.location.hostname)
      deleteCookie('userinfo', '/', window.location.hostname)
      // XXX it would be better if the root was / and not a path
      //     Find a way to redirect to dashboard/root
      window.location.href = `/${window.tenant}/${window.environment}`
    }
}

const client = axios.create({
  baseURL: getConfig('apiUrl'),
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-type": "application/json",
    'x-access-token': `${getCookie('atoken')}`
  },
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
  transformResponse: [function (data) {
    try {
      return JSON.parse(data)
    } catch (err) {
      return err
    }
  }],
})

client.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});


export {
  client,
  deleteCookie,
  handleError
}
