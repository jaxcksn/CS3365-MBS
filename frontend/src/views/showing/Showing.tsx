import { useEffect, useState } from "react";
import { useMBS } from "../../hooks/ProviderHooks";
import { MovieInformation } from "../../types/api.model";
import apiService from "../../services/apiService";
import { useNavigate, useParams } from "react-router-dom";
import { theaters } from "../../constants/Constants";
import { Notifications } from "@mantine/notifications";
import mockService from "../../services/mockService";
import {
  Button,
  Container,
  Flex,
  Modal,
  NumberFormatter,
  NumberInput,
  Paper,
  Select,
  Stack,
  Title,
  Group,
  Input,
  useMantineTheme,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import validator from "validator";
import { useDisclosure, useLocalStorage, useMediaQuery } from "@mantine/hooks";
import { InProgressBooking } from "../../contexts/MBSContext";
import dayjs from "dayjs";
import Dinero from "dinero.js";
import setBodyColor from "../../utils/helpers";

export default function Showing() {
  const mbs = useMBS();
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<MovieInformation | undefined>();
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalOpen, { open, close }] = useDisclosure(false);
  const [ipBooking, setIpBooking] = useLocalStorage<InProgressBooking | null>({
    key: "mbs_ipBooking",
    defaultValue: null,
  });

  const schema = z.object({
    date: z.date(),
    quantity: z
      .number({ message: "Number of Tickets is Required" })
      .min(1)
      .max(8),
    theater: z
      .string({ message: "Theater is Required" })
      .refine(
        (val) => validator.isIn(val, Object.keys(theaters)),
        "Invalid theater"
      ),
    time: z
      .string()
      .refine(
        (val) => validator.isIn(val, movie?.showing.show_times ?? []),
        "Invalid time"
      ),
  });

  const theme = useMantineTheme();
  setBodyColor({ color: "var(--mantine-color-body)" });
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const form = useForm({
    mode: "controlled",
    initialValues: {
      date: new Date(),
      quantity: 1,
      theater: "",
      time: "",
    },
    validateInputOnBlur: true,
    validate: zodResolver(schema),
  });

  useEffect(() => {
    const fetchShowing = async () => {
      try {
        if (id) {
          const result = mbs.isMockMode
            ? await mockService.getMovie(id)
            : await apiService.getMovie(id);
          setMovie(result);
          setLoading(false);
        }
      } catch {
        navigate("/");
      }
    };

    if (!movie) {
      if (mbs.cachedShowing && mbs.cachedShowing.id === id) {
        setMovie(mbs.cachedShowing);
        setLoading(false);
      } else {
        if (mbs.cachedShowing && mbs.cachedShowing.id !== id) {
          console.error(
            "Cached showing does not match the id. This is an error condition.",
            mbs.cachedShowing
          );
          if (mbs.isDebug) {
            Notifications.show({
              title: "Dev Error",
              message:
                "Cached showing does not match the route id. This is an error condition.",
              color: "red",
            });
          }
        }

        fetchShowing();
      }
    }
    mbs.setCachedShowing(undefined);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const onSubmit = () => {
    form.clearErrors();
    form.validate();

    if (!form.isValid() || !movie) {
      return;
    }

    const formValues = form.getValues();
    setIpBooking({
      date: formValues.date.toUTCString(),
      quantity: form.getValues().quantity,
      theater: theaters[form.getValues().theater],
      time: form.getValues().time,
      price: Dinero({
        amount: Math.round(movie.showing.price * 100),
        currency: "USD",
      }),
      movieId: movie.id,
      movieName: movie.title,
    });
    open();
  };

  const onConfirm = () => {
    close();
    if (ipBooking) {
      navigate("/checkout");
    }
  };

  const onCancel = () => {
    setIpBooking(null);
    close();
  };

  return (
    <Container h="100%" mt="md" pb="md">
      <Modal
        opened={modalOpen}
        onClose={close}
        centered
        size="auto"
        title="Confirm Booking?"
      >
        <Flex columnGap="md" rowGap="md" wrap="wrap" align="stretch">
          <Paper
            flex={0}
            style={{
              aspectRatio: "2 / 3",
              backgroundImage: `url(${movie?.poster_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "181px",
              height: "270px",

              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
          <Stack
            flex={2}
            gap={0}
            align="flex-start"
            style={{
              flexGrow: 1,
            }}
          >
            <Title order={3} mt="auto">
              {movie?.title}
            </Title>

            <div>{ipBooking?.quantity} ticket(s)</div>
            <div style={{ whiteSpace: "nowrap" }}>
              {ipBooking?.theater ?? "Unknown"} - {ipBooking?.time} on{" "}
              {dayjs(new Date(ipBooking?.date ?? "")).format("MM/DD/YYYY")}
            </div>
            <div>
              Pre-Tax Price:{" "}
              {Dinero({
                amount: Math.round((movie?.showing.price ?? 0) * 100),
                currency: "USD",
              })
                .multiply(ipBooking?.quantity ?? 0)
                .toFormat()}
            </div>

            <Group gap="xs" mt="auto" pt="md">
              <Button onClick={onConfirm}>Confirm</Button>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </Group>
          </Stack>
        </Flex>
      </Modal>
      <Title order={1}>Tickets for {movie?.title}</Title>
      <Title order={3}>
        Price:{" "}
        <NumberFormatter
          value={movie?.showing.price.toFixed(2)}
          prefix="$"
          decimalScale={2}
        />{" "}
        per Ticket
      </Title>
      <form>
        <Flex
          mt="md"
          columnGap="md"
          rowGap="md"
          direction={{
            base: "column",
            sm: "row",
          }}
        >
          <Stack flex={1} align="center">
            <Input.Label w="100%" required size="md">
              Showing Date
            </Input.Label>
            <Paper withBorder p="sm" shadow="xs" radius="md" w="fit-content">
              <DatePicker
                minDate={new Date()}
                maxDate={movie?.showing.end_date}
                weekendDays={[]}
                highlightToday
                size="md"
                key={form.key("date")}
                {...form.getInputProps("date")}
              />
            </Paper>
          </Stack>
          <Stack flex={2} gap="sm">
            <Select
              data={Object.keys(theaters).map((id: string) => {
                return { value: id, label: theaters[id] };
              })}
              placeholder="Select Theater"
              label="Theater"
              size="md"
              key={form.key("theater")}
              {...form.getInputProps("theater")}
              searchable
              withAsterisk
            />
            <Select
              data={movie?.showing.show_times.map((time) => {
                return { value: time, label: time };
              })}
              placeholder="Select Time"
              label="Showing Time"
              size="md"
              key={form.key("time")}
              {...form.getInputProps("time")}
              searchable
              withAsterisk
            />
            <NumberInput
              label="Number of Tickets"
              placeholder="Number of Tickets"
              min={1}
              size="md"
              max={8}
              key={form.key("quantity")}
              {...form.getInputProps("quantity")}
              withAsterisk
            />

            <Button
              mt={{
                base: "sm",
                sm: "auto",
              }}
              size={isMobile ? "md" : "sm"}
              role="submit"
              onClick={onSubmit}
            >
              Book Tickets
            </Button>
          </Stack>
        </Flex>
      </form>
    </Container>
  );
}
