import { useEffect, useState } from "react";
import { Ticket } from "../../types/api.model";
import apiService from "../../services/apiService";
import {
  Container,
  Text,
  Paper,
  Stack,
  Flex,
  Title,
  Modal,
  LoadingOverlay,
  Group,
  Button,
} from "@mantine/core";
import { theaters } from "../../constants/Constants";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { QRCodeSVG } from "qrcode.react";
import { useDebouncedCallback, useViewportSize } from "@mantine/hooks";
import { useMBS } from "../../hooks/ProviderHooks";
import mockService from "../../services/mockService";
import "./MyTickets.css";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const MyTickets = () => {
  const mbs = useMBS();

  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [usedTickets, setUsedTickets] = useState<Ticket[]>([]);
  const [qrCodeModal, setQrCodeModal] = useState<boolean>(false);
  const [qrCodeIndex, setQrCodeIndex] = useState<number>(0);

  const { height } = useViewportSize();

  const handleRefresh = useDebouncedCallback(() => {
    fetchTickets();
  }, 500);

  const fetchTickets = async () => {
    setLoading(true);
    let result = [];
    if (!mbs.isMockMode) {
      result = await apiService.getUserBookings();
    } else {
      result = await mockService.getUserBookings();
    }

    const currentDate = dayjs();

    const [upcomingTickets, pastTickets] = result.reduce<[Ticket[], Ticket[]]>(
      (acc, ticket) => {
        const ticketDateTime = dayjs(
          `${ticket.date} ${ticket.time.replace(/^(\d:)/, "0$1")}`,
          "YYYY-MM-DD hh:mmA"
        );
        const isExpired =
          ticket.used || currentDate.isAfter(ticketDateTime.add(3, "hour"));
        if (isExpired) {
          acc[1].push(ticket);
        } else {
          acc[0].push(ticket);
        }
        return acc;
      },
      [[], []]
    );
    setTickets(upcomingTickets);
    setUsedTickets(pastTickets);
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) {
    return <LoadingOverlay visible={loading} />;
  }

  return (
    <>
      <Modal
        title="My Tickets"
        opened={qrCodeModal}
        onClose={() => {
          setQrCodeModal(false);
        }}
        size="auto"
        centered
      >
        <Title order={2} mb="md">
          Ticket QR Code
        </Title>
        <QRCodeSVG
          value={qrCodeIndex < tickets.length ? tickets[qrCodeIndex].id : ""}
          size={height * 0.4}
        />
        <Text ta="center" mt="md">
          {qrCodeIndex < tickets.length ? tickets[qrCodeIndex].id : ""}
        </Text>
      </Modal>
      <Container>
        <h1>My Tickets</h1>
        <Group justify="space-between" align="center">
          <Title order={2} mb="md">
            Upcoming
          </Title>
          <Button variant="transparent" onClick={handleRefresh}>
            Refresh
          </Button>
        </Group>

        <Stack>
          {tickets.map((ticket, index) => (
            <Paper
              key={ticket.id}
              p="sm"
              className="ticket-card"
              withBorder
              radius="md"
              shadow="xs"
              onClick={() => {
                setQrCodeIndex(index);
                setQrCodeModal(true);
              }}
              style={{ cursor: "pointer" }}
            >
              <Flex align="flex-start" gap="lg">
                <Paper
                  shadow="xs"
                  radius="md"
                  withBorder
                  style={{
                    backgroundImage: `url(${ticket.movie.poster_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    aspectRatio: "2 / 3",
                    justifySelf: "center",
                  }}
                  h="10rem"
                  m="auto"
                />
                <Stack
                  h="100%"
                  align="flex-start"
                  justify="center"
                  gap={0}
                  mt="auto"
                  mb="auto"
                  flex={1}
                >
                  <Title order={2}>
                    {ticket.seats}x {ticket.movie.title}
                  </Title>
                  <Text fw="bold">
                    {theaters[ticket.theater]} @ {ticket.time}
                  </Text>
                  <Text fw="bold">
                    {dayjs(new Date(ticket.date)).utc().format("MM/DD/YYYY")}
                  </Text>
                </Stack>
              </Flex>
            </Paper>
          ))}
        </Stack>
        <Title order={2} mt="lg" mb="md">
          Used/Expired Tickets
        </Title>
        <Stack>
          {usedTickets.map((ticket) => (
            <Paper key={ticket.id} p="sm" withBorder radius="md" shadow="xs">
              <Flex align="flex-start" gap="lg">
                <Paper
                  shadow="xs"
                  radius="md"
                  withBorder
                  style={{
                    backgroundImage: `url(${ticket.movie.poster_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    aspectRatio: "2 / 3",
                    justifySelf: "center",
                    filter: "grayscale(100%)",
                  }}
                  h="10rem"
                  m="auto"
                />
                <Stack
                  h="100%"
                  align="flex-start"
                  justify="center"
                  gap={0}
                  mt="auto"
                  mb="auto"
                  flex={1}
                >
                  <Title order={2}>
                    {ticket.seats}x {ticket.movie.title}
                  </Title>
                  <Text fw="bold">
                    {theaters[ticket.theater]} @ {ticket.time}
                  </Text>
                  <Text fw="bold">
                    {dayjs(new Date(ticket.date)).utc().format("MM/DD/YYYY")}
                  </Text>
                </Stack>
              </Flex>
            </Paper>
          ))}
        </Stack>
      </Container>
    </>
  );
};

export default MyTickets;
