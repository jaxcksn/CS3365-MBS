import { InputBase, InputBaseProps } from "@mantine/core";
import { IMaskInput } from "react-imask";

export default function PhoneNumberInput(props: InputBaseProps) {
  return (
    <InputBase
      label="Phone Number"
      component={IMaskInput}
      placeholder="Your phone number"
      mask="(000) 000-0000"
      type="tel"
      {...props}
    />
  );
}
