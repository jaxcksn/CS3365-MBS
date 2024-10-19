import { InputBase, InputBaseProps } from "@mantine/core";
import { IMaskInput } from "react-imask";

export default function ZipCodeInput(props: InputBaseProps) {
  return (
    <InputBase
      label="Zip Code"
      component={IMaskInput}
      placeholder="Zipcode"
      mask="00000"
      type="postal"
      {...props}
    />
  );
}
