/* eslint-disable complexity */
import {
  Container,
  Flex,
  Paper,
  Stack,
  Title,
  Text,
  Button,
  Textarea,
  Group,
  Rating,
  Tooltip,
  Collapse,
  Skeleton,
  useMantineTheme,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MovieInformation, MovieReview } from "../../types/api.model";
import "./Movie.css";
import dayjs from "dayjs";
import apiService from "../../services/apiService";
import { useMediaQuery } from "@mantine/hooks";
import { useMBS } from "../../hooks/ProviderHooks";
import mockService from "../../services/mockService";
import setBodyColor from "../../utils/helpers";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(timezone);

export default function Movie() {
  const mbs = useMBS();
  setBodyColor({ color: "var(--mantine-color-body)" });

  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [showReview, setShowReview] = useState(true);
  const [review, setReview] = useState("");
  const [movieData, setMovieData] = useState<MovieInformation>();
  const { id } = useParams();
  const navigate = useNavigate();

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  if (!id) {
    Notifications.show({
      title: "Error",
      message: "Movie ID not found",
      color: "red",
    });

    navigate("/");
  }

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        if (id) {
          const data = mbs.isMockMode
            ? await mockService.getMovie(id)
            : await apiService.getMovie(id);
          setMovieData(data);
          setLoading(false);
        }
      } catch {
        navigate("/");
      }
    };

    fetchMovie();
  }, []);

  const reviewList = useMemo(() => {
    if (!loading && movieData?.reviews.length === 0) {
      return (
        <Group justify="center">
          <Text>There are no reviews for this movie (yet)</Text>
        </Group>
      );
    }

    let sortedReviews = movieData?.reviews.sort((a, b) => {
      return a.published > b.published ? 1 : -1;
    });

    return sortedReviews?.map((review: MovieReview, i: number) => {
      return (
        <Paper key={i} radius="md" p="md" withBorder>
          <Group justify="space-between">
            <Title order={4}>
              {dayjs
                .utc(review.published)
                .tz(dayjs.tz.guess())
                .format("MMM D, YYYY")}
            </Title>
            <Rating
              value={review.rating}
              readOnly
              size="sm"
              color={theme.colors["myColor"][5]}
            />
          </Group>
          <Text>{review.text}</Text>
        </Paper>
      );
    });
  }, [loading, movieData]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const value = event.currentTarget.value.replace(/[\n\r]/g, " ");
    setReview(value);
  };

  const handlePaste = (
    event: React.ClipboardEvent<HTMLTextAreaElement>
  ): void => {
    event.preventDefault();
    const pasteData = event.clipboardData
      .getData("text")
      .replace(/[\n\r]/g, "");
    setReview((prev) => prev + pasteData);
  };

  const handleReviewSubmit = async () => {
    try {
      if (!movieData) return;
      await apiService.createMovieReview({
        movie_id: movieData.id,
        rating: rating,
        content: review,
      });

      Notifications.show({
        title: "Success",
        message: "Your review has been submitted!",
        color: "green",
      });

      const newReviews = [
        ...movieData.reviews,
        {
          published: new Date(),
          rating: rating,
          text: review,
        },
      ];

      setMovieData({
        ...movieData,
        did_review: true,
        reviews: newReviews,
        rating:
          newReviews.reduce((acc, review) => acc + review.rating, 0) /
          newReviews.length,
      });
      setReview("");
      setRating(0);
    } catch {
      Notifications.show({
        title: "Error",
        message: "Failed to submit review, please try again later.",
        color: "red",
      });
    }
  };

  if (loading) {
    return (
      <Container h="100%" mt="md" pb="md">
        <Stack gap="md">
          <Flex
            align="center"
            gap={30}
            justify="center"
            direction={{
              base: "column",
              sm: "row-reverse",
            }}
          >
            <div style={{ flex: 1, marginRight: "auto", marginLeft: "auto" }}>
              <Skeleton
                style={{
                  aspectRatio: "2 / 3",
                }}
                mah="50vh"
                h={{ base: "50vh", sm: "100%" }}
              />
            </div>
            <div style={{ flex: 2, height: "100%", width: "100%" }}>
              <Skeleton height="50vh" />
            </div>
          </Flex>
          <Skeleton height="20vh" />
          <Skeleton height="20vh" />
        </Stack>
      </Container>
    );
  }

  return (
    <Container h="100%" mt="md">
      <Flex
        className="main"
        gap={30}
        justify="center"
        direction={{
          base: "column",
          sm: "row-reverse",
        }}
      >
        <div
          style={{ flex: 1, marginRight: "auto", marginLeft: "auto" }}
          className="poster"
        >
          <Paper
            shadow="xs"
            radius="md"
            withBorder
            style={{
              backgroundImage: `url(${
                movieData?.poster_url ?? "https://placebear.com/414/620.jpg"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              aspectRatio: "2 / 3",
              justifySelf: "center",
            }}
            mah="50vh"
            h={{ base: "50vh", sm: "100%" }}
          />
        </div>
        <Stack
          style={{ flex: 2, height: "100%" }}
          gap={0}
          mih={{
            sm: "50vh",
          }}
          justify="center"
        >
          <Title order={1}>{movieData?.title}</Title>
          <Rating
            value={movieData?.rating ?? 0}
            fractions={2}
            onChange={setRating}
            color={theme.colors["myColor"][5]}
            readOnly
            size="1.5rem"
          />
          <Title mt="sm" order={4}>
            Description
          </Title>
          <Text pb="sm">{movieData?.description}</Text>
          <Text>
            <strong>Runtime:</strong> {movieData?.runtime} mins
          </Text>
          <Text>
            <strong>Cast:</strong> {movieData?.cast}
          </Text>
          {movieData?.showing.start_date &&
          new Date(movieData.showing.start_date) > new Date() ? (
            <Text>
              <strong>Release Date:</strong>{" "}
              {dayjs(movieData?.release_date).utc().format("MM/DD/YYYY")}
            </Text>
          ) : (
            <div>
              <Button
                fullWidth={isMobile}
                size="md"
                mt="md"
                onClick={() => {
                  if (movieData) {
                    mbs.setCachedShowing(movieData);
                    navigate("./book");
                  }
                }}
              >
                Buy Tickets
              </Button>
            </div>
          )}
        </Stack>
      </Flex>
      <Flex direction="column">
        {movieData?.showing.start_date &&
          new Date(movieData.showing.start_date) <= new Date() && (
            <>
              <Group justify="space-between" align="center" mt="md">
                <Title order={3}>Write A Review</Title>
                <Button
                  variant="transparent"
                  onClick={() => setShowReview(!showReview)}
                  size="sm"
                  p={0}
                >
                  {showReview ? "Hide" : "Show"}
                </Button>
              </Group>
              <Collapse in={showReview}>
                <Textarea
                  placeholder={
                    movieData?.did_review
                      ? "You have already submitted a review for this movie."
                      : "Write a movie review here"
                  }
                  autosize
                  minRows={2}
                  maxRows={4}
                  maxLength={250}
                  value={review}
                  onChange={handleInputChange}
                  onPaste={handlePaste}
                  descriptionProps={{ align: "right" }}
                  description={`${review.length}/250`}
                  disabled={movieData?.did_review}
                />
                <Group mt="xs" justify="flex-end">
                  <Rating
                    value={rating}
                    onChange={setRating}
                    color={theme.colors["myColor"][5]}
                    readOnly={movieData?.did_review}
                  />
                  <Tooltip
                    label="You must set a rating"
                    disabled={
                      review.trim().length === 0 ||
                      rating !== 0 ||
                      movieData?.did_review
                    }
                  >
                    <Button
                      disabled={review.trim().length === 0 || rating === 0}
                      size="md"
                      onClick={handleReviewSubmit}
                    >
                      Submit Review
                    </Button>
                  </Tooltip>
                </Group>
              </Collapse>
              <Title order={3} mt="md" mb="sm">
                User Reviews
              </Title>
              {Array.isArray(reviewList) && reviewList.length > 0 ? (
                <Stack gap={10} mb="md">
                  {reviewList}
                </Stack>
              ) : (
                <Stack align="center" gap={0} mt="2rem" mb="2rem" opacity="70%">
                  <i
                    className="bi bi-pen"
                    style={{ fontSize: "3rem", color: "var(--headingColor)" }}
                  />
                  <Title order={2}>No Reviews</Title>
                  <Text>
                    No one has left a review yet. You could be the first.
                  </Text>
                </Stack>
              )}
            </>
          )}
      </Flex>
    </Container>
  );
}
