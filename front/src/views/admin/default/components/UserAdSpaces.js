/* eslint-disable no-unused-vars */
import {
  Flex,
  Table,
  Image,
  Link,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Button,
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
import React, { useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { BigNumber } from "ethers";

// Custom components
import Card from "components/card/Card";
import SizeIcon from "components/domain/SizeIcon";
import AdSpaceStatus from "components/domain/AdSpaceStatus";
import VerifiedStatusIcon from "components/domain/VerifiedStatusIcon";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
//import { InjectedConnector } from "wagmi/connectors/injected";
import abi from "../variables/AdSpaceFactory.json";

// Assets
export default function UserAdSpaces(props) {
  const { columnsData, tableData } = props;

  // saving inputs in states for contract call
  const [name, setName] = useState("0");
  const [website, setWebsite] = useState("0");
  const [size, setSize] = useState("0");
  const [NumNFTs, setNumNFTs] = useState("1");
  const [price, setPrice] = useState("0.55");

  //wagmi stuff
  const contractABI = abi.abi;
  const contractAddress = abi.address;
  const { address: userAddress, isConnected } = useAccount();
  // AdSpaceFactory on Optimism Goerli
  const { config: newAdSpaceConfig } = usePrepareContractWrite({
    addressOrName: contractAddress,
    contractInterface: contractABI,
    functionName: "createAdSpace",
    args: [name, website, price, BigNumber.from(NumNFTs), size],
  });

  const {
    data: writeData,
    isLoading,
    isSuccess,
    write: newAdSpace,
  } = useContractWrite(newAdSpaceConfig);

  const handleName = (name) => {
    setName(name.target.value);
  };
  const handleWebsite = (website) => {
    setWebsite(website.target.value);
  };
  const handleSize = (size) => {
    setSize(size.target.value);
  };
  const handleNumNFTs = (num) => {
    setNumNFTs(num.target.value);
  };
  const handlePrice = (price) => {
    setPrice(price.target.value);
  };

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
  } = tableInstance;
  initialState.pageSize = 5;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  // modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Flex px="25px" justify="space-between" mb="10px" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          My AdSpaces
        </Text>
        <Button colorScheme="brand" variant="solid" onClick={onOpen}>
          + NEW
        </Button>
      </Flex>
      <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe="10px"
                  key={index}
                  borderColor={borderColor}
                >
                  <Flex
                    justify="space-between"
                    align="center"
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color="gray.400"
                  >
                    {column.render("Header")}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell, index) => {
                  let data = "";
                  if (cell.column.id === "name") {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        <Link href={"/#/admin/adspace/" + row.original.id}>
                          {cell.value}
                        </Link>
                      </Text>
                    );
                  } else if (cell.column.id === "size") {
                    data = <SizeIcon size={cell.value} />;
                  } else if (cell.column.id === "price") {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        ${cell.value}
                      </Text>
                    );
                  } else if (cell.column.id === "file") {
                    data = (
                      <Link
                        href={"https://gateway.pinata.cloud/ipfs/" + cell.value}
                        target="_blank"
                      >
                        <Image
                          className="table-image"
                          src={
                            "https://gateway.pinata.cloud/ipfs/" + cell.value
                          }
                        />
                      </Link>
                    );
                  } else if (cell.column.id === "website") {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        <Link href={cell.value} target="_blank">
                          {cell.value}
                        </Link>
                      </Text>
                    );
                  } else if (cell.column.id === "status") {
                    data = (
                      <AdSpaceStatus
                        status={cell.value}
                        textColor={textColor}
                      />
                    );
                  } else if (cell.column.id === "verified") {
                    data = <VerifiedStatusIcon status={cell.value} />;
                  }
                  return (
                    <Td
                      {...cell.getCellProps()}
                      key={index}
                      fontSize={{ sm: "14px" }}
                      maxH="30px !important"
                      py="8px"
                      minW={{ sm: "150px", md: "200px", lg: "auto" }}
                      borderColor="transparent"
                    >
                      {data}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New AdSpace</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="mysite.com | footer"
                onChange={handleName}
              ></Input>
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Website</FormLabel>
              <Input
                type="url"
                placeholder="https://myshop.com"
                onChange={handleWebsite}
              ></Input>
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Banner Size</FormLabel>
              <Select placeholder="Select size" onChange={handleSize}>
                <option value="wide">Wide | 728 x 90 px</option>
                <option value="skyscraper">Skyscraper | 160 x 600 px</option>
                <option value="square">Campaign 3 | 200 x 200 px</option>
              </Select>
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Asking Price / hour - $USDC</FormLabel>
              <NumberInput value={price} step={0.01} min={0.01} max={420}>
                <NumberInputField onChange={handlePrice} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Text as="i" size="sm">
                minimum: $0.01
              </Text>
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Revenue Share NFTs</FormLabel>
              <NumberInput value={NumNFTs} step={1} min={1} max={20}>
                <NumberInputField onChange={handleNumNFTs} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Text as="i" size="sm">
                20 NFTs max
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
              disabled={!isConnected}
              onClick={() => newAdSpace?.()}
            >
              Submit AdSpace
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
