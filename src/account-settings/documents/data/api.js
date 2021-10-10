import axios from "axios";
import TokenService from "./token";

const instance = axios.create({
  baseURL: "http://api.local.knotta.ru:8010/api/v1",
  headers: {
    //"Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  config => {
    console.log('COOP API AUTH - request')
    const token = TokenService.getLocalAccessToken();
    console.log('COOP API AUTH - request at', token);
    if (token) {
      config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
      //config.headers["x-access-token"] = token; // for Node.js Express back-end
    }
    return config;
  },
  error => {
    console.log('COOP API AUTH - request error', error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use((response) => {
    return response
  },
  async function (err) {
    const originalConfig = err.config;

    if (err.response) {
      // Access Token was expired
      if (err.response.status === 403 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
            const formData = new FormData();
            formData.append('refresh', TokenService.getLocalRefreshToken())
            const { data } = await instance.post("/token/refresh/", formData);
            TokenService.updateLocalAccessToken(data.access);

            return instance(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  }
);

export default instance;