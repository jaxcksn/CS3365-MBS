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
import type { MovieCardProps } from "../../components/movieCarousel/MovieCard";
import { useDebouncedCallback, useMediaQuery } from "@mantine/hooks";
import setBodyColor from "../../utils/helpers";
import { useMBS } from "../../hooks/ProviderHooks";
import { AppHeader } from "../../components/layout/AppHeader";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/apiService";
import mockService from "../../services/mockService";

function Home() {
  const mbs = useMBS();
  localStorage.removeItem("mbs_ipBooking");

  const [moviesCurrent, setMoviesCurrent] = useState<MovieCardProps[]>([]);
  const [currentLoading, setCurrentLoading] = useState(true);
  const [moviesUpcoming, setMoviesUpcoming] = useState<MovieCardProps[]>([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  const theme = useMantineTheme();
  setBodyColor({ color: "var(--mantine-color-body)" });
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const navigate = useNavigate();

  useEffect(() => {
    mbs.setLoading(false);
    const fetchMovies = async () => {
      try {
        const data = mbs.isMockMode
          ? await mockService.getMovies()
          : await apiService.getMovies();

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
      } catch (err) {
        console.error(err);
        setMoviesCurrent([]);
        setMoviesUpcoming([]);
      } finally {
        setCurrentLoading(false);
        setUpcomingLoading(false);
      }
    };

    fetchMovies();
  }, []);

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

  const handleMovieClick = (movieId: string) => {
    navigate("/movie/" + movieId);
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
          onMovieClick={(id) => handleMovieClick(id)}
        />
        <Title order={3} pl="md" pt="sm" pb="sm">
          Upcoming
        </Title>
        <MovieCarousel
          data={filteredUpcomingMovies}
          loading={upcomingLoading}
        />
      </Container>
    </AppShell>
  );
}

export default Home;
