import { BACKEND_URL } from "../constants/Constants";

export interface registerInformation {
  email: string;
  password: string;
  phone_number: string;
}

class ApiService {
  public async login(email: string, password: string) {
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

  public async register(data: registerInformation) {
    const response = await fetch(BACKEND_URL + "/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return response.status;
  }

  public async refreshToken() {
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

  public async logout(accessToken: string) {
    const response = await fetch(BACKEND_URL + "/user/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: "{}",
      credentials: "include",
    });
    if (response.status === 200) {
      return true;
    }
    return false;
  }
}

export default new ApiService();
