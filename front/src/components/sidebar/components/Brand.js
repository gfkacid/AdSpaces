import React from "react";

// Chakra imports
import {Image, Flex, useColorModeValue } from "@chakra-ui/react";

// Custom components
import AdSpacesLogo  from "../../../assets/img/layout/AdSpacesLogo.png";
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      <Image src={AdSpacesLogo} className='adspaces-logo' />
      <HSeparator mt='20px' mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
