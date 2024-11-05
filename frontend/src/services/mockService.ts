/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AdminCreateShowingRequest,
  AdminShowing,
  AdminUpdateShowingRequest,
  Booking,
  CreateBookingRequest,
  CreateBookingResponse,
  CreateMovieReviewRequest,
  Movie,
  MovieInformation,
  Ticket,
} from "../types/api.model";

class MockService {
  // !SECTION
  // SECTION Fetch Calls

  public async getMovies(): Promise<Movie[]> {
    return [
      {
        id: "Nz5lSa46Q",
        title: "The Wild Robot",
        showings_start: "2024-09-27",
        poster_url:
          "https://m.media-amazon.com/images/M/MV5BZjM2M2E3YzAtZDJjYy00MDhkLThiYmItOGZhNzQ3NTgyZmI0XkEyXkFqcGc@._V1_FMjpg_UY5000_.jpg",
      },
      {
        id: "pP9XD1sQ2",
        title: "Joker: Folie à Deux",
        showings_start: "2024-10-01",
        poster_url:
          "https://www.movieposters.com/cdn/shop/files/scan_79e10e79-5be5-487d-a01a-bf6e899bdcae_480x.progressive.jpg?v=1715268834",
      },
      {
        id: "qPTVZciIO",
        title: "Wicked",
        showings_start: "2024-11-22",
        poster_url:
          "https://m.media-amazon.com/images/M/MV5BMzE0NjU1NjctNTY5Mi00OGE2LWJkYjktZDI0MTNjN2RhNDMwXkEyXkFqcGc@._V1_.jpg",
      },
    ];
  }

  public async getMovie(id: string): Promise<MovieInformation> {
    if (id === "pP9XD1sQ2") {
      return {
        id: "pP9XD1sQ2",
        title: "Joker: Folie à Deux",
        description:
          "Struggling with his dual identity, failed comedian Arthur Fleck meets the love of his life, Harley Quinn, while incarcerated at Arkham State Hospital.",
        rating: 0,
        runtime: "1h45m",
        cast: "Joaquin Phoenix, Lady Gaga, Brendan Gleeson",
        release_date: new Date("2024-10-01"),
        poster_url:
          "https://www.movieposters.com/cdn/shop/files/scan_79e10e79-5be5-487d-a01a-bf6e899bdcae_480x.progressive.jpg?v=1715268834",
        reviews: [],
        did_review: false,
        showing: {
          start_date: new Date("2024-10-20"),
          end_date: new Date("2024-11-20"),
          show_times: ["9:00AM", "10:00AM", "2:00PM", "5:00PM"],
          showing_id: "501nEOK16",
          price: 10.99,
        },
      };
    } else if (id === "Nz5lSa46Q") {
      return {
        id: "Nz5lSa46Q",
        title: "The Wild Robot",
        description:
          "After a shipwreck, an intelligent robot called Roz is stranded on an uninhabited island. To survive the harsh environment, Roz bonds with the island's animals and cares for an orphaned baby goose.",
        rating: 3.5,
        runtime: "1hr 35min",
        cast: "Lupita Nyong'o, Pedro Pascal, Kit Connor",
        release_date: new Date("2024-09-27"),
        poster_url:
          "https://m.media-amazon.com/images/M/MV5BZjM2M2E3YzAtZDJjYy00MDhkLThiYmItOGZhNzQ3NTgyZmI0XkEyXkFqcGc@._V1_FMjpg_UY5000_.jpg",
        reviews: [
          {
            published: new Date("2024-11-04T00:00:00"),
            rating: 3,
            text: "Some other random review text here.",
          },
          {
            published: new Date("2024-11-04T00:00:00"),
            rating: 4,
            text: "Some random review text here.",
          },
        ],
        did_review: true,
        showing: {
          start_date: new Date("2024-10-20"),
          end_date: new Date("2024-11-20"),
          show_times: ["9:00AM", "10:00AM", "2:00PM", "5:00PM"],
          showing_id: "OR9yNVBQO",
          price: 10.99,
        },
      };
    } else {
      throw new Error("Movie not found");
    }
  }

  public async getUserBookings(): Promise<Ticket[]> {
    return [
      {
        id: "c57f57a3-1892-480d-b4d1-518eb08a4fe6",
        cost: 10.99,
        seats: 1,
        date: new Date("2024-10-20"),
        time: "9:00AM",
        theater: "LUB",
        movie: {
          title: "The Wild Robot",
          poster_url:
            "https://m.media-amazon.com/images/M/MV5BZjM2M2E3YzAtZDJjYy00MDhkLThiYmItOGZhNzQ3NTgyZmI0XkEyXkFqcGc@._V1_FMjpg_UY5000_.jpg",
          id: "Nz5lSa46Q",
        },
      },
      {
        id: "0ab59006-25e0-41a5-8795-009c3a0ef532",
        cost: 10.99,
        seats: 1,
        date: new Date("2024-10-25"),
        time: "2:00PM",
        theater: "LUB",
        movie: {
          title: "Joker: Folie à Deux",
          poster_url:
            "https://www.movieposters.com/cdn/shop/files/scan_79e10e79-5be5-487d-a01a-bf6e899bdcae_480x.progressive.jpg?v=1715268834",
          id: "pP9XD1sQ2",
        },
      },
    ];
  }

  public async getBooking(id: string): Promise<Booking> {
    let options = await this.getUserBookings();
    let booking = options.find((option) => option.id === id)!;
    if (!booking) {
      throw new Error("Booking not found");
    }
    return booking;
  }

  public async adminGetShowings(): Promise<AdminShowing[]> {
    return [
      {
        movie: {
          title: "The Wild Robot",
          poster_url:
            "https://m.media-amazon.com/images/M/MV5BZjM2M2E3YzAtZDJjYy00MDhkLThiYmItOGZhNzQ3NTgyZmI0XkEyXkFqcGc@._V1_FMjpg_UY5000_.jpg",
        },
        id: "OR9yNVBQO",
        release_date: new Date("2024-09-27"),
        price: 10.99,
      },
      {
        movie: {
          title: "Joker: Folie à Deux",
          poster_url:
            "https://www.movieposters.com/cdn/shop/files/scan_79e10e79-5be5-487d-a01a-bf6e899bdcae_480x.progressive.jpg?v=1715268834",
        },
        id: "501nEOK16",
        release_date: new Date("2024-10-01"),
        price: 10.99,
      },
    ];
  }

  // !SECTION
  // SECTION Modifying Calls

  public async createBooking(
    _params: CreateBookingRequest
  ): Promise<CreateBookingResponse> {
    return {
      success: true,
      charge: "test",
      id: "test",
    };
  }

  public async createMovieReview(
    _params: CreateMovieReviewRequest
  ): Promise<void> {
    return;
  }

  public async adminCreateShowing(
    _params: AdminCreateShowingRequest
  ): Promise<void> {
    return;
  }

  public async adminDeleteShowing(_id: string): Promise<void> {
    return;
  }

  public async adminUpdateShowing(
    _params: AdminUpdateShowingRequest
  ): Promise<void> {
    return;
  }

  // !SECTION
}

export default new MockService();
