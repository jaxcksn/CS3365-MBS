import {
  Container,
  Title,
  Flex,
  Paper,
  Group,
  Loader,
  Stack,
  Text,
  ActionIcon,
  Tooltip,
  Button,
  TextInput,
  //  useMantineTheme,
} from "@mantine/core";
import setBodyColor from "../../utils/helpers";
import { useEffect, useState } from "react";
import apiService from "../../services/apiService";
import { AdminShowing } from "../../types/api.model";
import { useMBS } from "../../hooks/ProviderHooks";
import mockService from "../../services/mockService";
import Dinero from "dinero.js";
import dayjs from "dayjs";
// import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { modals } from "@mantine/modals";
import { theaters } from "../../constants/Constants";

type HealthStatus = "healthy" | "error" | "unknown";

const statusMap = {
  healthy: {
    icon: "bi-check-circle-fill",
    color: "green",
  },
  error: {
    icon: "bi-x-circle-fill",
    color: "red",
  },
  unknown: {
    icon: "bi-question-circle-fill",
    color: "gray",
  },
};

const HealthCard = ({
  title,
  status,
}: {
  title: string;
  status: HealthStatus;
}) => {
  return (
    <Paper radius="md" withBorder shadow="xs" p="md" flex={1}>
      <Group align="center" gap="xs">
        {status !== "unknown" ? (
          <i
            className={"bi " + statusMap[status].icon}
            style={{ color: statusMap[status].color, fontSize: "2rem" }}
          />
        ) : (
          <Loader
            size="2rem"
            color={statusMap[status].color}
            style={{
              height: "calc(2rem * 1.55)",
              display: "flex",
              alignItems: "center",
            }}
          />
        )}
        <Title order={3}>{title}</Title>
      </Group>
    </Paper>
  );
};

interface HealthChecks {
  frontend: HealthStatus;
  backend: HealthStatus;
  database: HealthStatus;
}

const AdminDashboard = () => {
  const mbs = useMBS();
  // const theme = useMantineTheme();
  const navigate = useNavigate();
  // const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  setBodyColor({ color: "var(--mantine-color-body)" });
  const [checks, setChecks] = useState<HealthChecks>({
    frontend: "unknown",
    backend: "unknown",
    database: "unknown",
  });
  const [showings, setShowings] = useState<AdminShowing[]>([]);
  const [ticketId, setTicketId] = useState("");

  useEffect(() => {
    const fetchHealth = async () => {
      setTimeout(async () => {
        try {
          const response = await apiService.getHealth();
          setChecks({
            frontend: "healthy",
            backend: response.database ? "healthy" : "error",
            database: response.database ? "healthy" : "error",
          });
        } catch {
          setChecks({
            frontend: "healthy",
            backend: "error",
            database: "error",
          });
        }
      }, 1000);
    };

    const fetchShowings = async () => {
      try {
        let response = [];
        if (mbs.isMockMode) {
          response = await mockService.adminGetShowings();
        } else {
          response = await apiService.adminGetShowings();
        }

        setShowings(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHealth();
    fetchShowings();
  }, []);

  const handleEdit = (showing: AdminShowing) => {
    navigate("/admin/showing/" + showing.id);
  };

  const handleAdd = () => {
    navigate("/admin/showing/add");
  };

  const handleDelete = (id: string) => {
    modals.openConfirmModal({
      title: "Are you sure?",
      children: (
        <Text>
          This action can&apos;t be undone, and you will lose all data, tickets,
          and reviews associated with the showing.
          <br />
          <br /> You should only do this if you are aware of the consequences.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => {},
      onConfirm: () => {
        apiService.adminDeleteShowing(id);
        setShowings(showings.filter((showing) => showing.id !== id));
      },
    });
  };

  return (
    <Container>
      <Title order={1} c="var(--headingColor)" mt="md" mb="sm">
        Admin Dashboard
      </Title>
      <Title order={2}>System Status</Title>
      <Flex
        justify={{
          base: "center",
          md: "space-between",
        }}
        direction={{
          base: "column",
          md: "row",
        }}
        gap="md"
      >
        <HealthCard title="Frontend" status={checks.frontend} />
        <HealthCard title="Backend" status={checks.backend} />
        <HealthCard title="Database" status={checks.database} />
      </Flex>

      <Title order={2} mt="md">
        Admit Ticket
      </Title>
      <Group align="end" justify="center">
        <TextInput
          label="Ticket ID"
          placeholder="Ticket ID"
          flex={1}
          value={ticketId}
          onChange={(event) => setTicketId(event.currentTarget.value)}
        />
        <Button
          variant="filled"
          onClick={async () => {
            try {
              const result = await apiService.adminUseTicket(ticketId);
              if (result) {
                if (result.valid) {
                  modals.open({
                    title: "Ticket Admitted",
                    children: (
                      <Stack gap={0} align="center" justify="center">
                        <i
                          className="bi bi-check-circle-fill"
                          style={{
                            fontSize: "3rem",
                            color: "var(--mantine-color-green-6)",
                          }}
                        />

                        <Text fw="bold" size="lg">
                          Ticket Admitted
                        </Text>
                        <Text>
                          {result.seats} Seats
                          <br />
                          Theater: {theaters[result.theater ?? ""] ??
                            "UNKNOWN"}{" "}
                          - Movie: {result.movieTitle}
                          <br />
                          Date: {dayjs(result.date)
                            .utc()
                            .format("MM/DD/YYYY")}{" "}
                          - Time: {result.time}
                        </Text>
                      </Stack>
                    ),
                  });
                } else {
                  modals.open({
                    title: "Invalid Ticket",
                    children: (
                      <Stack gap={0} align="center" justify="center">
                        <i
                          className="bi bi-x-circle-fill"
                          style={{
                            fontSize: "3rem",
                            color: "var(--mantine-color-red-6)",
                          }}
                        />

                        <Text fw="bold" size="lg">
                          Invalid Ticket
                        </Text>
                        <Text>
                          This ticket has already been used and is no longer
                          valid.
                        </Text>
                      </Stack>
                    ),
                  });
                }
              }
            } catch (error: any) {
              console.error(error);
              modals.open({
                title: "Invalid Ticket",
                children: (
                  <Stack gap={0} align="center" justify="center">
                    <i
                      className="bi bi-x-circle-fill"
                      style={{
                        fontSize: "3rem",
                        color: "var(--mantine-color-red-6)",
                      }}
                    />

                    <Text fw="bold" size="lg">
                      Invalid Ticket
                    </Text>
                    <Text>
                      {error.response.data.detail
                        ? `Error ${error.response.status}: ${error.response.data.detail}`
                        : "This ticket is invalid or could not be found."}
                    </Text>
                  </Stack>
                ),
              });
            }
          }}
        >
          Admit
        </Button>
      </Group>

      <Group align="center" justify="space-between" mt="md" mb="md">
        <Title order={2}>Manage Showings</Title>
        <Button variant="subtle" onClick={handleAdd}>
          Add Movie
        </Button>
      </Group>
      <Flex direction="column" gap="sm">
        {showings.map((showing) => (
          <Paper key={showing.id} shadow="xs" radius="md" withBorder p="sm">
            <Flex
              align="flex-start"
              rowGap={0}
              columnGap="lg"
              direction={{
                base: "column",
                sm: "row",
              }}
            >
              <Group flex={1}>
                <Paper
                  shadow="xs"
                  radius="md"
                  withBorder
                  style={{
                    backgroundImage: `url(${showing.movie.poster_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    aspectRatio: "2 / 3",
                    justifySelf: "center",
                  }}
                  h="8rem"
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
                  <Title order={2}>{showing.movie.title}</Title>
                  <Text fw="bold">
                    Release Date:{" "}
                    {dayjs(showing.release_date).utc().format("MM/DD/YYYY")}
                  </Text>
                  <Text fw="bold">
                    Price:{" "}
                    {Dinero({
                      amount: Math.round(showing.price * 100),
                      currency: "USD",
                    }).toFormat()}{" "}
                  </Text>
                </Stack>
              </Group>
              <Flex
                direction={{
                  base: "row",
                  sm: "column",
                }}
                columnGap="sm"
                rowGap="xs"
                align="center"
                justify="center"
                w={{
                  base: "100%",
                  sm: "fit-content",
                }}
              >
                <Tooltip label="View">
                  <ActionIcon
                    variant="outline"
                    size="lg"
                    aria-label="View"
                    onClick={() => navigate("/movie/" + showing.id)}
                  >
                    <i className="bi bi-box-arrow-up-right" />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Edit">
                  <ActionIcon
                    variant="outline"
                    size="lg"
                    aria-label="Edit"
                    onClick={() => handleEdit(showing)}
                  >
                    <i className="bi bi-gear-fill" />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Delete">
                  <ActionIcon
                    variant="filled"
                    size="lg"
                    aria-label="Delete"
                    onClick={() => handleDelete(showing.id)}
                  >
                    <i className="bi bi-trash" />
                  </ActionIcon>
                </Tooltip>
              </Flex>
            </Flex>
          </Paper>
        ))}
      </Flex>
    </Container>
  );
};

export default AdminDashboard;
