export interface LoginResponse {
  access_token: string;
  expires: Date;
}

export interface RegisterRequest {
  email: string;
  password: string;
  phone_number: string;
}

export interface Movie {
  id: string;
  title: string;
  poster_url: string;
  showings_start: string;
}

export interface MovieShowing {
  start_date: Date;
  end_date: Date;
  show_times: string[];
  showing_id: string;
  price: number;
}
export interface MovieReview {
  published: Date;
  rating: number;
  text: string;
}

export interface MovieInformation {
  id: string;
  title: string;
  description: string;
  rating: number;
  runtime: string;
  cast: string;
  release_date: Date;
  poster_url: string;
  reviews: MovieReview[];
  did_review: boolean;
  showing: MovieShowing;
}

export interface AdminShowing {
  movie: {
    title: string;
    poster_url: string;
  };
  id: string;
  release_date: Date;
  price: number;
}

export interface Booking {
  id: string;
  cost: number;
  movie: {
    title: string;
    poster_url: string;
    id: string;
  };
  seats: number;
  date: Date;
  time: string;
  theater: string;
}

export interface Ticket {
  id: string;
  date: Date;
  time: string;
  seats: number;
  theater: string;
  cost: number;
  movie: {
    title: string;
    poster_url: string;
    id: string;
  };
}

export interface CreateBookingResponse {
  success: boolean;
  charge: string;
  id: string;
}

export interface CreateBookingRequest {
  showing_id: string;
  booking_date: Date;
  seats: number;
  theater: string;
}

export interface CreateMovieReviewRequest {
  movie_id: string;
  rating: number;
  content: string;
}

export interface AdminCreateShowingRequest {
  title: string;
  description: string;
  cast: string;
  runtime: string;
  release_date: Date;
  showing_start: Date;
  showing_end: Date;
  price: number;
  poster_url: string;
  times: string[];
}

export interface AdminUpdateShowingRequest {
  id: string;
  title?: string;
  description?: string;
  cast?: string;
  runtime?: string;
  release_date?: Date;
  showing_start?: Date;
  showing_end?: Date;
  price?: number;
  poster_url?: string;
  times?: string[];
}
