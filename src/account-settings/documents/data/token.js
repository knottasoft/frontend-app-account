const refreshToken = process.env.COPP_API_REFRESH_TOKEN;
//const refreshToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTYzNDc0NDcwMSwianRpIjoiYzJmZDBhYTdkNWI2NDRmNTg5MDNjMjE2ZTI2MDI2NTUiLCJ1c2VyX2lkIjoiOTRmM2MzMzUtODY4Yi00MmNlLTk1MjMtMzc1MTI5ZmMzNzk4In0.vTFFnF1BN0lfjm8NNzZ3ZGTBnSj3uRVTLqtQvqJzKpw";
//const refreshToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY0NzQ1MjYwNCwianRpIjoiNTU5OTcxNWIxZTIwNGNkNzhhMGFkZjAwNmQ4NmQ3MGYiLCJ1c2VyX2lkIjoiM2RlYjBmMWItYTNiNS00ZTNlLTk2MzktZTc4YjkwMmZiYjhlIn0.kboLHTI3xkIYtC-5quh_SAwCoroAqDL0PfSNFQDlWeU";
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
