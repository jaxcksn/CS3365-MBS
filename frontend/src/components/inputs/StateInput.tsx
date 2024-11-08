import { Select, SelectProps } from "@mantine/core";
import { states } from "../../constants/Constants";

interface StateInputProps extends SelectProps {
  useShortLabelMode?: boolean;
}

export default function StateInput(props: StateInputProps) {
  const { useShortLabelMode, ...rest } = props;
  return (
    <Select
      {...rest}
      data={Object.keys(states).map((code: string) => ({
        value: code,
        label: useShortLabelMode ? code : states[code],
      }))}
      searchable
    />
  );
}
