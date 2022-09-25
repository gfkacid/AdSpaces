// Chakra imports
import { SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React from "react";
import Information from "views/admin/profile/components/Information";

// Assets
export default function GeneralInformation(props) {
  const { ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  return (
    <Card mb={{ base: "0px", "2xl": "20px" }} {...rest}>
      <Text
        color={textColorPrimary}
        fontWeight='bold'
        fontSize='2xl'
        mt='10px'
        mb='4px'>
        What is AdSpace?
      </Text>
      <Text color={textColorSecondary} fontSize='md' me='26px' mb='40px'>
      AdSpace is a crypto-native web traffic monetization platform, honoring the principles of web3: decentralization, self-custody & composability. 
      The platform includes a web3 dapp with as many components completely decentralized as possible, keeping rewards functionality on-chain to enable interoperability. 
      </Text>
      <Text color={textColorSecondary} fontSize='md' me='26px' mb='40px'>
        Web3 Technologies in use:
      </Text>
      <SimpleGrid columns='2' gap='20px'>
        <Information
          boxShadow={cardShadow}
          value='TableLand'
        />
        <Information
          boxShadow={cardShadow}
          value='IPFS'
        />
        <Information
          boxShadow={cardShadow}
          value='Smart Contracts'
        />
        <Information
          boxShadow={cardShadow}
          value='Optimism Blockchain'
        />
        <Information
          boxShadow={cardShadow}
          value='QuickNode'
        />
        <Information
          boxShadow={cardShadow}
          value='Ethers.js'
        />
      </SimpleGrid>
    </Card>
  );
}
