import { Carousel } from "@mantine/carousel";
import MovieCard, { MovieCardProps } from "./MovieCard";
import {
  AspectRatio,
  Center,
  Skeleton,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export interface MovieCarouselProps {
  data: MovieCardProps[];
  loading: boolean;
}

export default function MovieCarousel({ data, loading }: MovieCarouselProps) {
  const theme = useMantineTheme();
  const isAboveSm = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`);

  /*
  
  */

  const slides = () => {
    return loading
      ? Array.from({ length: 6 }).map((_, i) => (
          <Carousel.Slide key={i}>
            <AspectRatio ratio={414 / 620} mx="auto">
              <Skeleton />
            </AspectRatio>
          </Carousel.Slide>
        ))
      : data.map((item) => (
          <Carousel.Slide key={item.title}>
            <MovieCard {...item} />
          </Carousel.Slide>
        ));
  };

  return data.length == 0 && !loading ? (
    <Center h={300}>
      <Text>No results found...</Text>
    </Center>
  ) : (
    <Carousel
      className="movie-list"
      slideGap="md"
      loop
      slideSize={{
        xs: `${(1 / 3) * 100}%`,
        sm: `${(1 / 6) * 100}%`,
        base: `${(1 / 2) * 100}%`,
      }}
      align="start"
      draggable={!isAboveSm ? data.length > 4 : data.length > 6}
      withControls={!isAboveSm ? data.length > 4 : data.length > 6}
      withKeyboardEvents={!isAboveSm ? data.length > 4 : data.length > 6}
    >
      {slides()}
    </Carousel>
  );
}
