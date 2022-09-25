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
                How does Ad revenue share work?
            </Text>
            <Text color={textColorSecondary} fontSize='md' me='26px' mb='40px'>
            Each AdSpace is a separate ERC721 contract (NFT) . The NFT holders have an option of withdrawing their revenue for a specific deal after the deal has expired. After withdrawal the revenue is equally shared between the 
            NFT parties (after a 1% deduction accounted for platform fees)
            </Text>
            <Text color={textColorPrimary}
                fontWeight='bold'
                fontSize='2xl'
                mt='10px'
                mb='4px'>
                What’s the Fee structure?
            </Text>
            <Text color={textColorSecondary} fontSize='md' me='26px' mb='40px'>
            AdSpaces Platform keeps 1% of the revenue on all deals as fees for the maintenance for the overall infrastructure.  99% of the revenue is split equally between the NFT holders. 
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
