/* eslint-disable jsx-a11y/alt-text */
import {Icon} from "@chakra-ui/react";
import { MdCheckCircle, MdOutlineError } from "react-icons/md";

export default function VerifiedStatusIcon({ status }) {
    return (
        <Icon
          w='24px'
          h='24px'
          color={ status ? "green.500" : "red.500" }
          as={ status ? MdCheckCircle : MdOutlineError }
        />
    );
  }