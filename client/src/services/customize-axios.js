import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API,
  timeout: 3000,
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // console.log(response);
    return response.data;
  },
  function (error) {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
  }
);

export default instance;
