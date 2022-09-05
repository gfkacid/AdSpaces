import React from "react";

// Chakra imports
import { Flex, useColorModeValue } from "@chakra-ui/react";

// Custom components
import { AdSpacesLogo } from "components/icons/Icons";
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      {/* <AdSpacesLogo h='26px' w='175px' my='32px' color={logoColor} /> */}
      AdSpaces
      <HSeparator mt='20px' mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
