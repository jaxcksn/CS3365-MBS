import { Group, Select, SelectProps, Text } from "@mantine/core";
import { states } from "../../constants/Constants";
import { HTMLAttributes } from "react";
import Flag from "react-flagkit";

interface FlagProps extends HTMLAttributes<HTMLImageElement> {
  country?: string;
  role?: string;
  size?: number;
  alt?: string;
}

const nonStates = ["AS", "FM", "GU", "MH", "MP", "PW", "PR", "VI"];

const StateFlag = ({
  country = "US",
  role = "img",
  size = 24,
  alt,
  ...props
}: FlagProps) => {
  if (nonStates.includes(country)) {
    return <Flag size={size} country={country} {...props} />;
  }
  if (country) {
    const countryCode = country.toLowerCase();
    const jsDelivr = `http://flags.ox3.in/svg/us/${countryCode}.svg`;
    return (
      <img
        src={jsDelivr}
        role={role}
        alt={alt ?? `${countryCode} Flag`}
        width={size}
        {...props}
      />
    );
  } else {
    <span>{country}</span>;
  }
};

const optionRenderer: SelectProps["renderOption"] = ({ option }) => {
  return (
    <Group>
      <StateFlag country={option.value} size={16} />{" "}
      <Text>{states[option.value]}</Text>
    </Group>
  );
};

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
      renderOption={optionRenderer}
      leftSection={
        props.value && props.value !== "" ? (
          <StateFlag country={props.value} size={16} />
        ) : null
      }
    />
  );
}
