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
                How decentralized is AdSpaces?
            </Text>
            <Text color={textColorSecondary} fontSize='md' me='26px' mb='40px'>
                Most components of AdSpaces platform are decentralized using Tableland, Optimism Blockchain, IPFS and other web3 technologies. The only part that is centralized is the verification system for “New AdSpaces”, practically verifying that an AdSpace Listing owner has indeed access to that website’s code and has integrated our javscript library. We’re planning to decentralize this
                in the future by utilizing Akosh and oracles.
            </Text>
            <Text color={textColorPrimary}
                fontWeight='bold'
                fontSize='2xl'
                mt='10px'
                mb='4px'>
                Who owns the data?
            </Text>
            <Text color={textColorSecondary} fontSize='md' me='26px' mb='40px'>
            All data (AdSpace listings, campaigns, deals, files) is public and available on-chain or IPFS. 
            </Text>
            {/* <SimpleGrid columns='2' gap='20px'>
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
            </SimpleGrid> */}
        </Card>
    );
}
