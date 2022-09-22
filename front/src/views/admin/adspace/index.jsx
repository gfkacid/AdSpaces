// Chakra imports
import {
  Box,
  Button,
  SimpleGrid,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";

import Card from "components/card/Card.js";
import Information from "views/admin/profile/components/Information";
import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import deployedTables from "../home/variables/deployedTables.json"
import { connect, resultsToObjects } from "@tableland/sdk";
import DAIicon from "components/domain/DAIicon";


export default function AdSpaceListing() {
  // AdSpace
  const { adspaceId } = useParams();
  const [AdSpace, setAdSpace] = useState(null);

  // modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  // styling
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );

  // TableLand
  const networkConfig = {
    testnet: "testnet",
    chain: "optimism-goerli",
    chainId: "420",
  };

  const adspaceTable = deployedTables[0][networkConfig.chainId].find(
    (elem) => elem.prefix === 'AdSpaces'
  ).name;

  async function fetchAdSpace() {
    const tablelandConnection = await connect({
      network: networkConfig.testnet,
      chain: networkConfig.chain,
    });

    const fetchAdSpaceQuery = await tablelandConnection.read(
      `SELECT * FROM ${adspaceTable} WHERE ${adspaceTable}.adspace_id = ${adspaceId};`
    );
    console.log(fetchAdSpaceQuery);
    const result = await resultsToObjects(fetchAdSpaceQuery);
      console.log(result[0])
    return result[0];
  }
  useEffect(() => {
    fetchAdSpace().then((res) => {
      console.log(res)
      setAdSpace(res)
    })
    .catch((e) => {
      console.log(e.message);
    });
  }, [adspaceId]);

  // New Deal form
  const [newDealDuration, setNewDealDuration] = React.useState("1");

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {AdSpace ? (
        <Card mb={{ base: "0px", "2xl": "20px" }}>
          <Text
            color={textColorPrimary}
            fontWeight="bold"
            fontSize="2xl"
            mt="10px"
            mb="4px"
          >
            {AdSpace.name}
          </Text>
          <SimpleGrid columns="2" gap="20px">
            <Information
              boxShadow={cardShadow}
              title="Website"
              value={AdSpace.website}
            />
            <Information
              boxShadow={cardShadow}
              title="Owner"
              value={AdSpace.owner}
            />
            <Information
              boxShadow={cardShadow}
              title="Size"
              value={AdSpace.size}
            />
            <Information
              boxShadow={cardShadow}
              title="Hourly Rate"
              value={AdSpace.asking_price}
              prependDAI={true}
            />
            <Information
              boxShadow={cardShadow}
              title="Status"
              value={AdSpace.status}
            />
            {/* {AdSpace?.status == "Available" && ( */}
              <Button
                colorScheme="brand"
                variant="solid"
                onClick={onOpen}
                style={{
                  boxSizing: "content-box",
                  lineHeight: "2em",
                  padding: "20px",
                }}
              >
                Advertise here
              </Button>
            {/* )} */}
          </SimpleGrid>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>New Deal</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl isRequired>
                  <FormLabel>Duration (hours)</FormLabel>
                  <NumberInput
                    onChange={(valueString) => setNewDealDuration(valueString)}
                    value={newDealDuration}
                    step={1}
                    min={1}
                    max={240}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl isRequired mt={4}>
                  <FormLabel>Campaign</FormLabel>
                  <Select placeholder="Select campaign">
                    <option value="1">Campaign 1</option>
                    <option value="2">Campaign 2</option>
                    <option value="3">Campaign 3</option>
                  </Select>
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Total cost</FormLabel>
                  <Text>
                    <DAIicon/> {newDealDuration * AdSpace.asking_price}
                  </Text>
                  <Text fontSize="sm" as="i">
                    total cost = [duration] * [asking price]
                  </Text>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button colorScheme="brand" variant="solid">
                  Seal the Deal
                </Button>
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
