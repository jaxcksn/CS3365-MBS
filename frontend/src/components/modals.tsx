import { Title, Text, Button } from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";

export interface ErrorModalProps {
  errorMessage: string;
}

export const ErrorModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<ErrorModalProps>) => {
  return (
    <>
      <Title order={3}>An Error Occured</Title>
      <Text>{innerProps.errorMessage}</Text>
      <Button
        fullWidth
        mt="md"
        color="myColor"
        onClick={() => context.closeModal(id)}
      >
        Close
      </Button>
    </>
  );
};
