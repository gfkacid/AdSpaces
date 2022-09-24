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
import { fetchTablelandTables ,getTableLandConfig} from "../../../components/_custom/tableLandHelpers";
import { connect, resultsToObjects } from "@tableland/sdk";
import { ethers, BigNumber } from "ethers";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import DAIicon from "components/domain/DAIicon";
import DAItokenABI from "../../../variables/DaiTokenABI.json";

export default function AdSpaceListing() {
  
  // AdSpace
  const { adspaceId } = useParams();
  const [AdSpace, setAdSpace] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const { address } = useAccount();

  // modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  // styling
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  
  // Wagmi

  // const { config: newAdSpaceConfig } = usePrepareContractWrite({
  //   addressOrName: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
  //   contractInterface: DAItokenABI,
  //   functionName: "approve",
  //   args: ['', 0],
  // });
  // const {
  //   data: writeData,
  //   isLoading,
  //   isSuccess,
  //   write: approveDai,
  // } = useContractWrite(newAdSpaceConfig);
  // console.log(isConnected);
  // console.log(isSuccess);


  // QuickNode Approve Dai function call

  // const approve = async () => {
  //     const abi = [
  //       {
  //         constant: false,
  //         inputs: [
  //           { internalType: "address", name: "spender", type: "address" },
  //           { internalType: "uint256", name: "value", type: "uint256" }
  //         ],
  //         name: "approve",
  //         outputs: [{ "internalType": "bool", "name": "", "type": "bool"  }],
  //         payable: false,
  //         stateMutability: "nonpayable",
  //         type: "function",
  //       }];
  //       console.log(abi);
  //     const provider = new ethers.providers.JsonRpcProvider("https://damp-tiniest-night.optimism-goerli.discover.quiknode.pro/7635709edb15d49d5a4d5bdf19649792a8805f41/");
  //     console.log(provider);
  //     const account = new ethers.Wallet("", provider);
  //     console.log(account);
  //     const provider = new ethers.providers.JsonRpcProvider("https://damp-tiniest-night.optimism-goerli.discover.quiknode.pro/7635709edb15d49d5a4d5bdf19649792a8805f41/");
  //     const contract = new ethers.Contract(
  //       "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
  //       abi,
  //       account
  //     );
  //     console.log(contract);
  //     const response = await contract.functions.approve(
  //       adSpaceContract, ethers.utils.parseEther("1000")
  //     );
  //     console.log(response);
  // }

  // TableLand
  const TablelandTables = fetchTablelandTables();
  const networkConfig = getTableLandConfig();
  const adspaceTable = TablelandTables["AdSpaces"]
  const campaignsTable = TablelandTables["Campaigns"]
  
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
    console.log(result[0]);
    return result[0];
  }

  async function fetchUserCampaigns() {
    const tablelandConnection = await connect({
      network: networkConfig.testnet,
      chain: networkConfig.chain,
    });

    const fetchUserCampaignsQuery = await tablelandConnection.read(
      `SELECT * FROM ${campaignsTable} WHERE ${campaignsTable}.owner like '${address}';`
    );
    console.log(fetchUserCampaignsQuery);
    const result = await resultsToObjects(fetchUserCampaignsQuery);
    console.log('User Campaigns')
    console.log(result);
    return result;
  }

  async function checkDAIApproved(){
      const provider = new ethers.providers.JsonRpcProvider("https://damp-tiniest-night.optimism-goerli.discover.quiknode.pro/7635709edb15d49d5a4d5bdf19649792a8805f41/");
      const DAIcontract = new ethers.Contract(
        "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
        DAItokenABI,
        provider
      );
      console.log(DAIcontract);
      const response = await DAIcontract.functions.allowance(
        address,AdSpace.contract
      );
      return (response[0].toNumber() > 0) ? true : false;
 
  }

  useEffect(() => {
    fetchAdSpace()
      .then((res) => {
        console.log(res);
        setAdSpace(res);
        fetchUserCampaigns().
        then( (res) => {
          setUserCampaigns(res);
        }).then(
          checkDAIApproved().then( (res) => {
            console.log(res)
            // setIsApproved(true)
          })
        )
        //Here we can read DAI contract whether the user has allowed the DAI already or not for AdSpace contract
        // If the allowance is set we can set the variable to true for example
      })
      .catch((e) => {
        console.log(e.message);
      });

      
  }, [adspaceId]);

  // New Deal form
  const [newDealDuration, setNewDealDuration] = React.useState("1");
  const [userCampaigns, setUserCampaigns] = useState([]);

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
                  {userCampaigns.map((campaign, index) => {
                    <option value={campaign.campaign_id} key={index}>{campaign.name}</option>
                  })}
                  </Select>
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Total cost</FormLabel>
                  <Text>
                    <DAIicon /> {newDealDuration * AdSpace.asking_price}
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
                <Button
                  colorScheme="brand"
                  variant="solid"
                  onClick={() => {}
                  // approveDai?.
                  //   ({recklesslySetUnpreparedArgs: [AdSpace.contract, ethers.utils.parseEther((2**256 - 1))]})
                      // [AdSpace.contract, ethers.utils.parseEther((2**256 - 1))]
                  }
                >
                  Approve DAI
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
