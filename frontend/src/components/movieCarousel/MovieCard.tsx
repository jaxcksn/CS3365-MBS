import { Group, Text, Paper, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Movie } from "../../types/api.model";

export interface MovieCardProps {
  movie: Movie;
  width?: number;
  onClick?: () => void;
}

export default function MovieCard(props: MovieCardProps) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return (
    <Paper
      className="movie-card"
      shadow="sm"
      radius="md"
      withBorder
      onClick={props.onClick}
      style={{
        backgroundImage: `url(${
          props.movie.poster_url ?? "https://source.unsplash.com/random/414x620"
        })`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      h={isMobile ? "35svh" : "35vh"}
      w="100%"
    >
      <Group align="flex-end" h="100%">
        <Text fw="900" lh={1.2} fz="1.5rem" c="white" p="sm">
          {props.movie.title}
        </Text>
      </Group>
    </Paper>
  );
}
