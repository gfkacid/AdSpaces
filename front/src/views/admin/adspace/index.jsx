// Chakra imports
import { Box, Button, SimpleGrid , Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton, useColorModeValue, useDisclosure} from "@chakra-ui/react";

import Card from "components/card/Card.js";
import Information from "views/admin/profile/components/Information";
import React from "react";
import { useParams } from 'react-router-dom'
import { useEffect, useState } from "react";

export default function AdSpaceListing() {
    // AdSpace
    const { adspaceId } = useParams()
    const [AdSpace, setAdSpace] = useState(null);
    
    // modal
    const { isOpen, onOpen, onClose } = useDisclosure()

    // styling
    const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
    const textColorSecondary = "gray.400";
    const cardShadow = useColorModeValue(
        "0px 18px 40px rgba(112, 144, 176, 0.12)",
        "unset"
    );
    useEffect(() => {
        console.log(adspaceId);
        if(adspaceId == 3){
            setAdSpace({
                'id': 3,
                'website': 'dummy.com'
            })
        }
        // query TableLand for AdSpace by id
        // if AdSpace exists 
        
        // else
    },[adspaceId]);

return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      
      { AdSpace ? (
        <Card mb={{ base: "0px", "2xl": "20px" }}>
        <Text
          color={textColorPrimary}
          fontWeight='bold'
          fontSize='2xl'
          mt='10px'
          mb='4px'>
          AdSpace {adspaceId}
        </Text>
        <SimpleGrid columns='2' gap='20px'>
          <Information
            boxShadow={cardShadow}
            title='Website'
            value={AdSpace.website}
          />
          <Information
            boxShadow={cardShadow}
            title='Owner'
            value={AdSpace.owner}
          />
          <Information
            boxShadow={cardShadow}
            title='Size'
            value={AdSpace.size}
          />
          <Information
            boxShadow={cardShadow}
            title='Hourly Rate'
            value={'$'+AdSpace.price}
          />
          <Information
            boxShadow={cardShadow}
            title='Status'
            value={AdSpace.status}
          />
          {(AdSpace?.status == "Available") && (
            <Button onClick={onOpen}>Advertise here</Button>
          )}
          

        </SimpleGrid>
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            -- load [Create Deal] component --
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="brand" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </Card>
      ) : (
        <Text>AdSpace #{adspaceId} not found.</Text>
      )}
    </Box>
  );
}
