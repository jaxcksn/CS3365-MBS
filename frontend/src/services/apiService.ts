import { APP_MODE, BACKEND_URL } from "../constants/Constants";
import axios, { AxiosInstance } from "axios";
import {
  AdminCreateShowingRequest,
  AdminShowing,
  AdminUpdateShowingRequest,
  Booking,
  CreateMovieReviewRequest,
  LoginResponse,
  Movie,
  MovieInformation,
  RegisterRequest,
  Ticket,
} from "../types/api.model";
import { notifications } from "@mantine/notifications";
import { InProgressBooking } from "../contexts/MBSContext";

class ApiService {
  public isDebug: boolean = APP_MODE === "DEV";

  private api: AxiosInstance;
  private accessToken: string | null = null;

  public constructor() {
    this.api = axios.create({
      baseURL: BACKEND_URL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    this.api.interceptors.request.use(
      (config) => {
        if (this.accessToken && !config.skipAuth) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (this.isDebug) {
          notifications.show({
            title: `API DEBUG: Request to ${error.config.url} failed.`,
            message: `Error ${error.status}: ${error.response?.data.detail || "An error occurred"}`,
            color: "red",
            autoClose: 5000,
            withBorder: true,
          });
        }
        return Promise.reject(error);
      }
    );
  }

  public setAccessToken(token: string | null): void {
    this.accessToken = token;
  }

  // SECTION Authentication Calls

  public async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>(
      "/user/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
        skipAuth: true,
      }
    );

    return {
      access_token: response.data.access_token,
      expires: new Date(response.data.expires),
      role: response.data.role,
    };
  }

  public async register(params: RegisterRequest): Promise<number> {
    const response = await this.api.post("/user/register", params);
    return response.status;
  }

  public async refresh(): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>(
      "/user/refresh",
      {},
      {
        skipAuth: true,
      }
    );
    return response.data;
  }

  public async logout(): Promise<void> {
    await this.api.post("/user/logout", {});
  }

  // !SECTION
  // SECTION Fetch Calls

  public async getMovies(): Promise<Movie[]> {
    const response = await this.api.get<Movie[]>("/movies", {});
    return response.data;
  }

  public async getMovie(id: string): Promise<MovieInformation> {
    const response = await this.api.get<MovieInformation>(`/movie/${id}`, {});
    return response.data;
  }

  public async getUserBookings(): Promise<Ticket[]> {
    const response = await this.api.get<Ticket[]>("/user/bookings", {});
    return response.data;
  }

  public async getBooking(id: string): Promise<Booking> {
    const response = await this.api.get<Booking>(`/booking`, {
      params: {
        id,
      },
    });
    return response.data;
  }

  public async getHealth(): Promise<{
    backend: boolean;
    database: boolean;
  }> {
    const response = await this.api.get("/health", {});
    return response.data;
  }

  public async adminGetShowings(): Promise<AdminShowing[]> {
    const response = await this.api.get<AdminShowing[]>("/admin/showings", {});
    return response.data;
  }

  // !SECTION
  // SECTION Modifying Calls

  public async createMovieReview(
    params: CreateMovieReviewRequest
  ): Promise<void> {
    await this.api.post("/movie/review", params);
  }

  public async adminCreateShowing(
    params: AdminCreateShowingRequest
  ): Promise<void> {
    await this.api.post("/admin/showing", params);
  }

  public async adminDeleteShowing(id: string): Promise<void> {
    await this.api.delete(`/admin/showing`, {
      params: {
        id,
      },
    });
  }

  public async adminUpdateShowing(
    params: AdminUpdateShowingRequest
  ): Promise<void> {
    await this.api.put(`/admin/showing`, params, {
      params: {
        id: params.id,
      },
    });
  }

  // !SECTION

  public async getPaymentIntent(
    order: InProgressBooking
  ): Promise<{ client_secret: string }> {
    const response = await this.api.post<{ client_secret: string }>(
      "/payment/intent",
      order
    );
    return response.data;
  }
}

export default new ApiService();
