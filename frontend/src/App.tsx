import { useEffect, useState } from "react";
import "./App.css";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import {
  AppShell,
  Button,
  Container,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import MovieCarousel from "./components/MovieCarousel";
import { MovieCardProps } from "./components/MovieCard";
import { useDebouncedCallback, useMediaQuery } from "@mantine/hooks";
import setBodyColor, { BACKEND_URL } from "./main";
import { useAuth } from "./providers/AuthContext";
import Logo from "./assets/RaiderWatchLogo.svg?react";
import MiniLogo from "./assets/MiniLogo.svg?react";

const mockData: MovieCardProps[] = [
  {
    title: "Joker: Folie à Deux",
    type: "current",
    badgeText: "Playing",
    imageSrc:
      "https://www.movieposters.com/cdn/shop/files/scan_79e10e79-5be5-487d-a01a-bf6e899bdcae_480x.progressive.jpg?v=1715268834",
  },
  {
    title: "Joker: Folie à Deux 2",
    type: "current",
    badgeText: "Playing",
    imageSrc:
      "https://www.movieposters.com/cdn/shop/files/scan_79e10e79-5be5-487d-a01a-bf6e899bdcae_480x.progressive.jpg?v=1715268834",
  },
  {
    title: "Joker: Folie à Deux 3",
    type: "current",
    badgeText: "Playing",
    imageSrc:
      "https://www.movieposters.com/cdn/shop/files/scan_79e10e79-5be5-487d-a01a-bf6e899bdcae_480x.progressive.jpg?v=1715268834",
  },
  {
    title: "Joker: Folie à Deux 4",
    type: "current",
    badgeText: "Playing",
    imageSrc:
      "https://www.movieposters.com/cdn/shop/files/scan_79e10e79-5be5-487d-a01a-bf6e899bdcae_480x.progressive.jpg?v=1715268834",
  },
  {
    title: "Joker: Folie à Deux 5",
    type: "current",
    badgeText: "Playing",
    imageSrc:
      "https://www.movieposters.com/cdn/shop/files/scan_79e10e79-5be5-487d-a01a-bf6e899bdcae_480x.progressive.jpg?v=1715268834",
  },
  {
    title: "Joker: Folie à Deux 6",
    type: "current",
    badgeText: "Playing",
    imageSrc:
      "https://www.movieposters.com/cdn/shop/files/scan_79e10e79-5be5-487d-a01a-bf6e899bdcae_480x.progressive.jpg?v=1715268834",
  },
  {
    title: "Joker: Folie à Deux 7",
    type: "current",
    badgeText: "Playing",
    imageSrc:
      "https://www.movieposters.com/cdn/shop/files/scan_79e10e79-5be5-487d-a01a-bf6e899bdcae_480x.progressive.jpg?v=1715268834",
  },
];

interface AppInfo {
  name: string;
  version: string;
  id: number;
}

function App() {
  const [moviesCurrent, setMoviesCurrent] = useState<MovieCardProps[]>([]);
  const [currentLoading, setCurrentLoading] = useState(true);
  const [moviesUpcoming, setMoviesUpcoming] = useState<MovieCardProps[]>([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [, setInfo] = useState<AppInfo | null>(null);

  const auth = useAuth();
  const theme = useMantineTheme();
  setBodyColor({ color: "var(--mantine-color-body)" });
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  useEffect(() => {
    //mock fetch
    setTimeout(() => {
      setMoviesCurrent(mockData);
      setCurrentLoading(false);
    }, 5000);

    setTimeout(() => {
      setMoviesUpcoming(mockData);
      setUpcomingLoading(false);
    }, 5600);
  }, []);

  useEffect(() => {
    fetch(BACKEND_URL + "/", {
      method: "GET",
      headers: {},
    }).then((response) => {
      response.json().then((data) => {
        setInfo(data);
      });
    });
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

  // Filter movies based on the search query
  const filteredCurrentMovies = moviesCurrent.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredUpcomingMovies = moviesUpcoming.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell header={{ height: 60 }} style={{ width: "100%" }}>
      <AppShell.Header pos={"relative"} className="header">
        <div className="app-header">
          <div className="logo">
            {isMobile ? (
              <MiniLogo fill="white" height={40} width={40} />
            ) : (
              <Logo fill="white" width={200} />
            )}
          </div>
          <div className="search">
            <TextInput
              w="100%"
              placeholder="Search for a movie"
              leftSection={<i className="bi bi-search"></i>}
              value={inputValue}
              onChange={(event) => setValue(event.currentTarget.value)}
            />
          </div>
          <div className="actions">
            <Button variant="subtle" color="white" onClick={auth.logout}>
              Logout
            </Button>
          </div>
        </div>
      </AppShell.Header>
      <Container fluid>
        <Title order={3}>Now Playing</Title>
        <MovieCarousel data={filteredCurrentMovies} loading={currentLoading} />
        <Title order={3}>Upcoming</Title>
        <MovieCarousel
          data={filteredUpcomingMovies}
          loading={upcomingLoading}
        />
      </Container>
    </AppShell>
  );
}

export default App;
