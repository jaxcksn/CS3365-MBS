import { BACKEND_URL } from "../main";

class ApiService {
  async login(email: string, password: string) {
    const response = await fetch(BACKEND_URL + "/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: email, password }),
      credentials: "include",
    });
    return response.json();
  }

  async refreshToken() {
    const response = await fetch(BACKEND_URL + "/user/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "{}",
      credentials: "include",
    });

    return response.json();
  }

  async logout(accessToken: string) {
    const response = await fetch(
      BACKEND_URL + "http://localhost:5050/user/logout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: "{}",
        credentials: "include",
      }
    );
    if (response.status == 200) {
      return true;
    }
    return false;
  }
}

export default new ApiService();
