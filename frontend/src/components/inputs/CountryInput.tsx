import { Group, Select, SelectProps, Text } from "@mantine/core";
import Flag from "react-flagkit";
import { countries } from "../../constants/Constants";

const optionRenderer: SelectProps["renderOption"] = ({ option }) => {
  return (
    <Group>
      <Flag country={option.value} size={16} />{" "}
      <Text>{countries[option.value]}</Text>
    </Group>
  );
};

export default function CountryInput(props: SelectProps) {
  return (
    <Select
      {...props}
      data={Object.keys(countries).map((code: string) => ({
        value: code,
        label: countries[code],
      }))}
      onChange={(value, option) => {
        if (props.onChange) props.onChange(value, option);
      }}
      searchable
      renderOption={optionRenderer}
      leftSection={
        props.value && props.value !== "" ? (
          <Flag country={props.value} size={16} />
        ) : null
      }
    />
  );
}
