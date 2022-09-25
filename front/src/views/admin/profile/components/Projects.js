// Chakra imports
import { Text, useColorModeValue } from "@chakra-ui/react";
// Assets
import Project1 from "assets/img/profile/Project1.png";
import Project2 from "assets/img/profile/Project2.png";
import Project3 from "assets/img/profile/Project3.png";
// Custom components
import Card from "components/card/Card.js";
import React from "react";
import Project from "views/admin/profile/components/Project";

export default function Projects(props) {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  return (
    <Card mb={{ base: "0px", "2xl": "20px" }}>
      <Text
        color={textColorPrimary}
        fontWeight='bold'
        fontSize='2xl'
        mt='10px'
        mb='4px'>
        How AdSpace works?
      </Text>
      <Text color={textColorSecondary} fontSize='md' me='26px' mb='40px'>
        Here you can find the steps how you can create an AdSpace
      </Text>
      <Project
        boxShadow={cardShadow}
        title='1. You must have a webpage you want to advertise'
        mb='20px'
      />
      <Project
        boxShadow={cardShadow}
        mb='20px'
        image={Project2}
        ranking='2'
        link='#'
        title='2. You will need to verify that webspace'
      />
      <Project
        boxShadow={cardShadow}
        image={Project3}
        mb='20px'
        ranking='3'
        link='#'
        title='3. Request a teal to be made for advertising'
      />
      <Project
        boxShadow={cardShadow}
        image={Project3}
        mb='20px'
        ranking='3'
        link='#'
        title='4. Wait for the deal to be approved'
      />
      <Project
        boxShadow={cardShadow}
        image={Project3}
        mb='20px'
        ranking='3'
        link='#'
        title='5. You are ready to go!'
      />
    </Card>
  );
}
