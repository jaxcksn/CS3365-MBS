import { useEffect, useState } from "react";
import "./Home.css";
import "@mantine/core/styles.css";
import {
  AppShell,
  Container,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import MovieCarousel from "../../components/movieCarousel/MovieCarousel";
import type {
  Movie,
  MovieCardProps,
} from "../../components/movieCarousel/MovieCard";
import { useDebouncedCallback, useMediaQuery } from "@mantine/hooks";
import setBodyColor from "../../utils/helpers";
import { useAuth, useMBS } from "../../hooks/ProviderHooks";
import { AppHeader } from "../../components/layout/AppHeader";
import { BACKEND_URL } from "../../constants/Constants";
import { useNavigate } from "react-router-dom";

function Home() {
  const [moviesCurrent, setMoviesCurrent] = useState<MovieCardProps[]>([]);
  const [currentLoading, setCurrentLoading] = useState(true);
  const [moviesUpcoming, setMoviesUpcoming] = useState<MovieCardProps[]>([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  const auth = useAuth();
  const theme = useMantineTheme();
  setBodyColor({ color: "var(--mantine-color-body)" });
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await fetch(`${BACKEND_URL}/movies`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
        credentials: "include",
      });
      const data = (await response.json()) as Movie[];

      setMoviesCurrent(
        data
          .filter((movie) => {
            return new Date(movie.showings_start) <= new Date();
          })
          .map((movie) => {
            return {
              movie: movie,
            } satisfies MovieCardProps;
          })
      );

      setMoviesUpcoming(
        data
          .filter((movie) => {
            return new Date(movie.showings_start) > new Date();
          })
          .map((movie) => {
            return {
              movie: movie,
            } satisfies MovieCardProps;
          })
      );

      setCurrentLoading(false);
      setUpcomingLoading(false);
    };

    fetchMovies();
  }, [auth]);

  const setValue = async (value: string) => {
    setInputValue(value);
    handleSearch(value);
  };

  const handleSearch = useDebouncedCallback(async (query) => {
    setCurrentLoading(true);
    setUpcomingLoading(true);
    setSearchQuery(query);
    setCurrentLoading(false);
    setUpcomingLoading(false);
  }, 200);

  const filteredCurrentMovies = moviesCurrent.filter((a) =>
    a.movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredUpcomingMovies = moviesUpcoming.filter((a) =>
    a.movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mbsContext = useMBS();

  const handleMovieClick = (movieId: string, current: boolean) => {
    let movie: MovieCardProps | undefined;
    if (current) {
      movie = moviesCurrent.find((movie) => movie.movie.id === movieId);
    } else {
      movie = moviesUpcoming.find((movie) => movie.movie.id === movieId);
    }

    if (!movie) {
      return;
    } else {
      mbsContext.updateIpBooking({
        movieId: movie.movie.id,
        movieName: movie.movie.title,
        theater: "LUB",
        time: "10:00AM",
        date: "2024/10/30",
        quantity: 2,
        price: 20,
      });
    }

    navigate("/checkout");
  };

  return (
    <AppShell header={{ height: 60 }} style={{ width: "100%" }}>
      <AppHeader showSearch inputValue={inputValue} setValue={setValue} />
      <Container fluid p={0} pb={isMobile ? "md" : 0} h="100%">
        {isMobile && (
          <TextInput
            w="100%"
            placeholder="Search for a movie"
            leftSection={<i className="bi bi-search" />}
            value={inputValue}
            onChange={(event) => setValue(event.currentTarget.value)}
            size="md"
            p="md"
            variant="filled"
            pb={0}
          />
        )}
        <Title order={3} pl="md" pt="sm" pb="sm">
          Now Playing
        </Title>
        <MovieCarousel
          data={filteredCurrentMovies}
          loading={currentLoading}
          onMovieClick={(id) => handleMovieClick(id, true)}
        />
        <Title order={3} pl="md" pt="sm" pb="sm">
          Upcoming
        </Title>
        <MovieCarousel
          data={filteredUpcomingMovies}
          loading={upcomingLoading}
          onMovieClick={(id) => handleMovieClick(id, false)}
        />
      </Container>
    </AppShell>
  );
}

export default Home;
