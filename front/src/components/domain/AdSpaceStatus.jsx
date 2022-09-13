/* eslint-disable jsx-a11y/alt-text */
import {Flex, Icon, Text} from "@chakra-ui/react";
import { MdCheckCircle, MdCancel, MdOutlineError } from "react-icons/md";

export default function AdSpaceStatus({ status , textColor}) {
    return (
      <Flex align='center'>
        <Icon
          w='24px'
          h='24px'
          me='5px'
          color={
            status === "Available"
              ? "green.500"
              : status === "Running Ads"
              ? "orange.500"
              : "red.500"
          }
          as={
            status === "Available"
              ? MdCheckCircle
              : status === "Running Ads"
              ? MdOutlineError
              : MdCancel
          }
        />
        <Text color={textColor} fontSize='sm' fontWeight='700'>
          {status}
        </Text>
      </Flex>
    );
  }