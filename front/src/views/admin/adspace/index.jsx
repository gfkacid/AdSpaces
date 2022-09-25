/* eslint-disable react-hooks/exhaustive-deps */
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
  Table,
  TableContainer,
  TableCaption,
  Td,
  Tr,
  Thead,
  Th,
  Tbody,
  Tfoot,
} from "@chakra-ui/react";

import Card from "components/card/Card.js";
import Information from "views/admin/profile/components/Information";
import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchTablelandTables,
  getTableLandConfig,
} from "../../../components/_custom/tableLandHelpers";
import { connect, resultsToObjects } from "@tableland/sdk";
import { ethers, BigNumber } from "ethers";
import { useAccount, useSigner } from "wagmi";
import DAIicon from "components/domain/DAIicon";
import DAItokenABI from "../../../variables/DaiTokenABI.json";
import AdSpaceJson from "../../../variables/AdSpace.json";
import { WalletIcon } from "components/icons/Icons";

export default function AdSpaceListing() {
  // AdSpace
  const { adspaceId } = useParams();
  const [AdSpace, setAdSpace] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const { address } = useAccount();
  const { data: signer, isError, isLoading } = useSigner();

  const [newDealDuration, setNewDealDuration] = React.useState("1");
  const [userCampaigns, setUserCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [tokenOwners, setTokenOwners] = useState([]);

  const DAIcontract = new ethers.Contract(
    "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    DAItokenABI,
    signer
  );

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
  const TablelandTables = fetchTablelandTables();
  const networkConfig = getTableLandConfig();
  const adspaceTable = TablelandTables["AdSpaces"];
  const campaignsTable = TablelandTables["Campaigns"];

  // Loads the AdSpace
  async function fetchAdSpace() {
    const tablelandConnection = await connect({
      network: networkConfig.testnet,
      chain: networkConfig.chain,
    });

    const fetchAdSpaceQuery = await tablelandConnection.read(
      `SELECT * FROM ${adspaceTable} WHERE ${adspaceTable}.adspace_id = ${adspaceId};`
    );
    const result = await resultsToObjects(fetchAdSpaceQuery);
    return result[0];
  }

  // Loads user's Campaigns
  async function fetchUserCampaigns() {
    const tablelandConnection = await connect({
      network: networkConfig.testnet,
      chain: networkConfig.chain,
    });

    const fetchUserCampaignsQuery = await tablelandConnection.read(
      `SELECT * FROM ${campaignsTable} WHERE ${campaignsTable}.owner like '${address}';`
    );
    const result = await resultsToObjects(fetchUserCampaignsQuery);

    return result;
  }

  // Checks if user has approved this AdSpace's contract to transfer DAI on this behalf
  const checkDAIApproved = async (_contractAddress) => {
    const response = await DAIcontract.allowance(address, _contractAddress);
    const allowance = BigNumber.from(response.toString());
    const bool = allowance.gt(0);
    console.log(bool);
    return bool;
  };

  // Prompts user to approve this AdSpace's contract to transfer DAI on this behalf
  const approveDAI = async () => {
    const num = ethers.utils.parseEther("100000");
    const response = await DAIcontract.approve(AdSpace.contract, num);
    console.log(response);
  };

  // Create a Deal on this AdSpace for a Campaign owned by user
  const createDeal = async () => {
    const AdSpaceContract = new ethers.Contract(
      AdSpace.contract,
      AdSpaceJson.abi,
      signer
    );

    const amountTotal = ethers.utils.parseEther(
      (newDealDuration * AdSpace.asking_price).toString()
    );
    //console.log(amountTotal);
    const response = await AdSpaceContract.createDeal(
      amountTotal,
      newDealDuration,
      selectedCampaign
    );
    //console.log(response);
  };

  const fetchTokenOwners = async () => {
    const AdSpaceContract = new ethers.Contract(
      AdSpace.contract,
      AdSpaceJson.abi,
      signer
    );
    const tempArr = [];
    const numNFTs = await AdSpaceContract.totalSupply();

    for (let i = 1; i <= numNFTs; i++) {
      const tempAddr = await AdSpaceContract.ownerOf(i);
      if (tempAddr) {
        tempArr.push(tempAddr);
      }
    }
    return tempArr;
  };

  // populate this page's AdSpace
  useEffect(() => {
    fetchAdSpace()
      .then((AdSpaceRes) => {
        AdSpaceRes.asking_price = (AdSpaceRes.asking_price / 100).toFixed(2);
        setAdSpace(AdSpaceRes);

        // fetch user's campaigns to populate the [ Create Deal ] Modal
        fetchUserCampaigns().then((CampaignsRes) => {
          //console.log(CampaignsRes);
          setUserCampaigns(CampaignsRes);
        });
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);

  //Here we can read DAI contract whether the user has allowed the AdSpace contract to spend user's DAI
  useEffect(() => {
    if (AdSpace?.contract) {
      checkDAIApproved(AdSpace.contract).then((bool) => {
        setIsApproved(bool);
      });
    }
  }, [AdSpace]);

  // After loading AdSpace Data, get the NFT owners on the contract
  useEffect(() => {
    if (AdSpace?.contract) {
      fetchTokenOwners().then((data) => {
        setTokenOwners(data);
      });
    }
  }, [AdSpace]);

  // helper for select input
  let optionTemplate = userCampaigns.map((v, index) => (
    <option value={v.campaign_id} key={index}>
      {v.name}
    </option>
  ));
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
                    isRequired={true}
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
                  <Select
                    placeholder="Select campaign"
                    isRequired={true}
                    onChange={(e) => {
                      setSelectedCampaign(e.target.value);
                    }}
                  >
                    {optionTemplate}
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
                {isApproved ? (
                  <Button
                    colorScheme="brand"
                    variant="solid"
                    onClick={() => {
                      createDeal();
                    }}
                  >
                    Seal the Deal
                  </Button>
                ) : (
                  <Button
                    colorScheme="brand"
                    variant="solid"
                    onClick={() => {
                      approveDAI();
                    }}
                  >
                    Approve DAI
                  </Button>
                )}
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Card>
      ) : (
        <Text>AdSpace #{adspaceId} not found.</Text>
      )}
      <Card
        mb={{ base: "0px", "2xl": "20px" }}
        mt={{ base: "20px", "2xl": "20px" }}
      >
        <Text
          color={textColorPrimary}
          fontWeight="bold"
          fontSize="xl"
          mt="10px"
          mb="4px"
        >
          NFT Holders of {AdSpace?.name} (Total: {tokenOwners?.length})
        </Text>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Address</Th>
                <Th isNumeric>Equity</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tokenOwners.map((val) => {
                return (
                  <Tr>
                    {val === address ? (
                      <Td fontWeight="bold" color={"#3311DB"}>
                        {val} <WalletIcon />
                      </Td>
                    ) : (
                      <Td>{val}</Td>
                    )}
                    {val === address ? (
                      <Td isNumeric fontWeight="bold" color={"#3311DB"}>
                        {(100 / tokenOwners.length).toFixed(2)}%
                      </Td>
                    ) : (
                      <Td isNumeric>
                        {(100 / tokenOwners.length).toFixed(2)}%
                      </Td>
                    )}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
