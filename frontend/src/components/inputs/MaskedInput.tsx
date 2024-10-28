import { InputBase, InputBaseProps } from "@mantine/core";
import { IMaskInput } from "react-imask";

interface MaskedInputProps extends InputBaseProps {
  mask: string;
  placeholder?: string;
}

export default function MaskedInput(props: MaskedInputProps) {
  return <InputBase component={IMaskInput} {...props} />;
}
