/* eslint-disable complexity */
import { FormEvent, useEffect, useState } from "react";
import { useMBS } from "../../hooks/ProviderHooks";
import mockService from "../../services/mockService";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../../services/apiService";
import { MovieInformation } from "../../types/api.model";
import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  NumberInput,
  Paper,
  Pill,
  Textarea,
  TextInput,
  Title,
  Text,
} from "@mantine/core";
import setBodyColor from "../../utils/helpers";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import { useMap } from "@mantine/hooks";
import { useForm } from "@mantine/form";

interface AdminAddEditProps {
  mode: "add" | "edit";
}

const parseRuntimeString = (runtime: string) => {
  const runtimeArr = runtime.split("h");
  const hours = parseInt(runtimeArr[0], 10);
  const minutes = parseInt(runtimeArr[1].replace("m", ""), 10);
  return hours * 60 + minutes;
};

const SelectShowtimes = ({ times }: { times: Map<string, boolean> }) => {
  const TimeSelects = () => {
    return Array.from(times.keys()).map((time) => (
      <Box
        key={time}
        display="flex"
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pill
          size="md"
          bg={times.get(time) ? "myColor" : ""}
          c={times.get(time) ? "white" : ""}
          onClick={() => times.set(time, !times.get(time))}
          style={{
            width: "92px",
            cursor: "pointer",
          }}
        >
          {time}
        </Pill>
      </Box>
    ));
  };

  return (
    <Paper
      radius="0.25rem"
      p="xs"
      shadow="none"
      withBorder
      style={{
        borderColor: "#ced4da",
      }}
    >
      <Flex gap="sm" wrap="wrap" justify="flex-start">
        <TimeSelects />
      </Flex>
    </Paper>
  );
};

const AdminAddEdit = ({ mode }: AdminAddEditProps) => {
  setBodyColor({ color: "var(--mantine-body-color)" });
  const navigate = useNavigate();

  const mbs = useMBS();
  const { id } = useParams();

  const [movieInfo, setMovieInfo] = useState<MovieInformation | null>(null);
  const showtimes = useMap<string, boolean>([
    ["9:00 AM", false],
    ["10:00AM", false],
    ["11:00AM", false],
    ["12:00PM", false],
    ["1:00PM", false],
    ["2:00PM", false],
    ["3:00PM", false],
    ["4:00PM", false],
    ["5:00PM", false],
    ["6:00PM", false],
    ["7:00PM", false],
    ["8:00PM", false],
    ["9:00PM", false],
    ["10:00PM", false],
    ["11:00PM", false],
  ]);

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      runtime: 0,
      cast: "",
      price: 0,
      release_date: dayjs().utc().toDate(),
      date_range: [
        dayjs().utc().toDate(),
        dayjs().utc().add(1, "month").toDate(),
      ],
      poster_url: "",
      mobile_poster_url: "",
    },
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const values = form.getValues();
    const showTimes = Array.from(showtimes.entries())
      .filter((time) => time[1])
      .map((time) => time[0]);
    const runtime = `${Math.floor(values.runtime / 60)}h${
      values.runtime % 60
    }m`;

    mbs.setLoading(true);
    try {
      if (mode === "add") {
        await apiService.adminCreateShowing({
          title: values.title,
          description: values.description,
          runtime,
          cast: values.cast,
          release_date: values.release_date,
          poster_url: values.poster_url,
          mobile_poster_url: values.mobile_poster_url,
          price: values.price,
          times: showTimes,
          showing_start: values.date_range[0],
          showing_end: values.date_range[1],
        });
      } else {
        if (id) {
          await apiService.adminUpdateShowing({
            id: id,
            title: values.title,
            description: values.description,
            runtime,
            cast: values.cast,
            release_date: values.release_date,
            poster_url: values.poster_url,
            mobile_poster_url: values.mobile_poster_url,
            price: values.price,
            times: showTimes,
            showing_start: values.date_range[0],
            showing_end: values.date_range[1],
          });
        }
      }
      mbs.setLoading(false);
      navigate("/admin", { replace: true });
    } catch {
      mbs.setLoading(false);
      console.error("Failed to create or update movie");
    }
  };

  useEffect(() => {
    const fetchMovieInfo = async () => {
      if (mbs.isMockMode && id) {
        const movie = await mockService.getMovie(id);
        for (const time of movie.showing.show_times) {
          showtimes.set(time, true);
        }
        setMovieInfo(movie);
        form.setValues({
          title: movie.title,
          description: movie.description,
          runtime: parseRuntimeString(movie.runtime),
          cast: movie.cast,
          price: movie.showing.price,
          release_date: movie.release_date,
          date_range: [movie.showing.start_date, movie.showing.end_date],
          poster_url: movie.poster_url,
          mobile_poster_url: movie.mobile_poster_url,
        });
      } else if (id) {
        const movie = await apiService.getMovie(id);
        console.log(movie);
        for (const time of movie.showing.show_times) {
          showtimes.set(time, true);
        }
        setMovieInfo(movie);
        form.setValues({
          title: movie.title,
          description: movie.description,
          runtime: Number(movie.runtime),
          cast: movie.cast,
          price: movie.showing.price,
          release_date: new Date(movie.release_date),
          date_range: [
            new Date(movie.showing.start_date),
            new Date(movie.showing.end_date),
          ],
          poster_url: movie.poster_url,
          mobile_poster_url: movie.mobile_poster_url,
        });
      }
    };
    if (mode === "edit") {
      fetchMovieInfo();
    }
  }, []);

  return (
    <Container mt="md" pb="md">
      <Flex columnGap="md">
        <Paper radius="md" shadow="xs" withBorder flex={3} p="sm">
          <form onSubmit={onSubmit}>
            <Title order={1}>
              {mode === "edit" && movieInfo ? "Edit Existing" : "Add New"} Movie
            </Title>
            <Text fs="italic" mb="sm">
              All fields are required for this form.
            </Text>
            <TextInput
              label="Title"
              placeholder="Offical title of the movie"
              key={form.key("title")}
              {...form.getInputProps("title")}
            />
            <Textarea
              label="Description"
              autosize
              minRows={3}
              maxRows={5}
              placeholder="A brief blurb or synopsis of the movie."
              key={form.key("description")}
              {...form.getInputProps("description")}
            />
            <Flex columnGap="sm">
              <TextInput
                label="Movie Cast"
                flex={3}
                placeholder="List of starring actors"
                key={form.key("cast")}
                {...form.getInputProps("cast")}
              />
              <NumberInput
                label="Runtime"
                decimalScale={0}
                allowDecimal={false}
                fixedDecimalScale
                hideControls
                suffix=" mins"
                placeholder="Runtime in Minutes"
                allowLeadingZeros={false}
                allowNegative={false}
                flex={1}
                key={form.key("runtime")}
                {...form.getInputProps("runtime")}
              />
            </Flex>
            <Flex align="center" justify="space-between" columnGap="sm">
              <NumberInput
                label="Ticket Price"
                decimalScale={2}
                fixedDecimalScale
                hideControls
                prefix="$"
                placeholder="Amount in Dollars"
                allowLeadingZeros={false}
                allowNegative={false}
                flex={1}
                key={form.key("price")}
                {...form.getInputProps("price")}
              />
              <DatePickerInput
                label="Release Date"
                flex={1}
                valueFormat="MM/DD/YYYY"
                key={form.key("release_date")}
                {...form.getInputProps("release_date")}
              />
            </Flex>
            <DatePickerInput
              label="Available From"
              type="range"
              valueFormat="MM/DD/YYYY"
              key={form.key("date_range")}
              {...form.getInputProps("date_range")}
            />
            <TextInput
              label="Poster URL"
              placeholder="This will be shown everywhere"
              key={form.key("poster_url")}
              {...form.getInputProps("poster_url")}
            />
            <TextInput
              label="Mobile Poster URL"
              placeholder="This will be shown in mobile view"
              key={form.key("mobile_poster_url")}
              {...form.getInputProps("mobile_poster_url")}
            />
            <Input.Label required>Show Times</Input.Label>
            <SelectShowtimes times={showtimes} />
            <Button fullWidth mt="md" type="submit">
              {mode === "edit" ? "Save Changes" : "Create Movie"}
            </Button>
          </form>
        </Paper>
      </Flex>
    </Container>
  );
};

export default AdminAddEdit;
