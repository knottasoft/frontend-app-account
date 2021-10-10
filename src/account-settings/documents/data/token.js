const refreshToken = '';// тут нужен токен

class TokenService {

    getLocalRefreshToken() {
      return refreshToken;
    }
  
    getLocalAccessToken() {
      const user = JSON.parse(localStorage.getItem("copp_api_user"));
      return user?.accessToken;
    }
  
    updateLocalAccessToken(token) {
      let user = JSON.parse(localStorage.getItem("copp_api_user"));
      if (user?.accessToken) {
          user.accessToken = token;
      } else {
          user = { accessToken: token }
      }
      localStorage.setItem("copp_api_user", JSON.stringify(user));
    }
  }
  
  export default new TokenService();