import { Box, Center, Container, Title, Text, Button } from "@mantine/core";
import setBodyColor from "../../utils/helpers";
import Logo from "../../assets/RaiderWatchLogo.svg?react";
import { useNavigate } from "react-router-dom";

interface ErrorMessageProps {
  code: number;
  shortMessage: string;
  longMessage: string;
}

export default function ErrorMessage({
  code,
  shortMessage,
  longMessage,
}: ErrorMessageProps) {
  const navigate = useNavigate();
  setBodyColor({ color: "var(--mantine-color-myColor-filled)" });

  return (
    <Container>
      <Center h="90vh" style={{ display: "flex", flexDirection: "column" }}>
        <Logo fill="white" width="200px" />
        <Title c="white" order={1} mt="lg">
          Error {code}:{" "}
          <Text inherit c="white" span>
            {shortMessage}
          </Text>
        </Title>
        <Box
          mt="md"
          display="flex"
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text c="white" ta="center">
            {longMessage}
          </Text>

          <Button
            size="md"
            mt="xl"
            variant="white"
            onClick={() => navigate("/")}
          >
            Take Me to Saftey
          </Button>
        </Box>
      </Center>
    </Container>
  );
}
