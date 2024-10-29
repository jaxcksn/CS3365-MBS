import MovieCard, { MovieCardProps } from "./MovieCard";
import { Center, Skeleton, Text, useMantineTheme } from "@mantine/core";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

export interface MovieCarouselProps {
  data: MovieCardProps[];
  loading: boolean;
  onMovieClick?: (movieId: string) => void;
}

import "swiper/css";
import "swiper/css/navigation";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";

import "./movieCarousel.css";
import { useEffect, useRef } from "react";
const posterAspectRatio = 414 / 620;

export default function MovieCarousel({
  data,
  loading,
  onMovieClick,
}: MovieCarouselProps) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef<any>(null);

  const { height, width } = useViewportSize();
  const posterSize = height * 0.35 * posterAspectRatio;

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const containerWidth = width - 32;

  const slidesPerView = () => {
    if (isMobile) {
      return 1;
    }
    return Math.min(Math.floor(containerWidth / posterSize), 7);
  };

  const spaceBetween = () => {
    const maxSlides = slidesPer;
    const calculatedSpaceBetween =
      (containerWidth - maxSlides * posterSize) / (maxSlides - 1);
    return Math.min(Math.max(calculatedSpaceBetween, 10), 50);
  };

  useEffect(() => {
    if (swiperRef.current && prevRef.current && nextRef.current) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, [data]);

  const slidesPer = slidesPerView();

  const slides = () => {
    return loading
      ? Array.from({ length: slidesPer }).map((_, i) => (
          <SwiperSlide key={i}>
            <Skeleton
              height={isMobile ? "35svh" : "35vh"}
              width={isMobile ? "100%" : posterSize}
            />
          </SwiperSlide>
        ))
      : data.map((item, index) => (
          <SwiperSlide
            key={item.movie.id}
            virtualIndex={index}
            style={
              slidesPer < 2
                ? {
                    display: "flex",
                    justifyContent: "center",
                  }
                : {
                    maxWidth: posterSize,
                    width: posterSize,
                  }
            }
          >
            <MovieCard
              {...item}
              width={posterSize}
              onClick={() => {
                if (onMovieClick) onMovieClick(item.movie.id);
              }}
            />
          </SwiperSlide>
        ));
  };

  return data.length === 0 && !loading ? (
    <Center h={isMobile ? "35svh" : "35vh"}>
      <Text>No results found...</Text>
    </Center>
  ) : (
    <div style={{ position: "relative" }}>
      <Swiper
        modules={[Navigation]}
        slidesPerView={slidesPer}
        spaceBetween={spaceBetween()}
        loop={data.length > slidesPer}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        style={{ padding: "0 16px" }}
      >
        {slides()}
      </Swiper>
      {(slidesPer > 1 && isMobile) ||
        (!loading && data.length > slidesPer && (
          <>
            <button ref={prevRef} className="custom-prev" onClick={() => {}}>
              <i className="bi bi-chevron-left" />
            </button>
            <button ref={nextRef} className="custom-next" onClick={() => {}}>
              <i className="bi bi-chevron-right" />
            </button>
          </>
        ))}
    </div>
  );
}
