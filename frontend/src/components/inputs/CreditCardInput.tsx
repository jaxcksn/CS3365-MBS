import { Flex, InputBase, InputBaseProps } from "@mantine/core";
import { IMaskInput } from "react-imask";
import Amex from "../../assets/amex.svg?react";
import Mastercard from "../../assets/mastercard.svg?react";
import Visa from "../../assets/visa.svg?react";
import Discover from "../../assets/discover.svg?react";
import UnknownCard from "../../assets/unknown.svg?react";

interface CreditCardInputProps extends InputBaseProps {
  cardtype: string;
  change?: (value: string) => void;
}

export default function CreditCardInput(props: CreditCardInputProps) {
  const cardSVG = () => {
    switch (props.cardtype) {
      case "american-express":
        return <Amex width="2rem" />;
      case "discover":
        return <Discover width="2rem" />;
      case "mastercard":
        return <Mastercard width="2rem" />;
      case "visa":
        return <Visa width="2rem" />;
      default:
        return <UnknownCard width="2rem" />;
    }
  };

  const getCardDisplay = () => {
    return (
      <Flex align="center" justify="center" mr={16}>
        {cardSVG()}
      </Flex>
    );
  };

  const cardMask =
    props.cardtype === "american-express"
      ? "0000 000000 00000" // 15-digit format for Amex
      : "0000 0000 0000 0000";

  const onPasteHandler = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const clipboardData = event.clipboardData?.getData("text/plain");
    const value = clipboardData?.replace(/[^0-9]/g, "");
    if (props.change) props.change(value);
  };

  return (
    <InputBase
      {...props}
      component={IMaskInput}
      mask={cardMask}
      unmask={true}
      rightSection={getCardDisplay()}
      onPaste={onPasteHandler}
    />
  );
}
