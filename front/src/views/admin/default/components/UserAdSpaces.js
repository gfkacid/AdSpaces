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

import { useForm } from "react-hook-form";

// Custom components
import { isNumeric } from "@chakra-ui/utils";

// Custom components
import Card from "components/card/Card";
import SizeIcon from "components/domain/SizeIcon";
import AdSpaceStatus from "components/domain/AdSpaceStatus";
import VerifiedStatusIcon from "components/domain/VerifiedStatusIcon";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import {
  fetchTablelandTables,
  getTableLandConfig,
} from "../../../../components/_custom/tableLandHelpers";
import { connect, resultsToObjects } from "@tableland/sdk";
import abi from "../../../../variables/AdSpaceFactory.json";
// here we need the AdSpace ABI + we need the DaIContract ABI
import DAIicon from "components/domain/DAIicon";
import { useEffect } from "react";

// Assets
export default function UserAdSpaces(props) {
  // Table
  const { columnsData } = props;
  const [tableData, setTableData] = useState([]);

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

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
  } = tableInstance;
  initialState.pageSize = 5;
  // load from TableLand
  const TablelandTables = fetchTablelandTables();
  const networkConfig = getTableLandConfig();
  const adspaceTable = TablelandTables["AdSpaces"];
  async function getUserAdSpaces() {
    const tablelandConnection = await connect({
      network: networkConfig.testnet,
      chain: networkConfig.chain,
    });

    const totalAdSpacesQuery = await tablelandConnection.read(
      `SELECT * FROM ${adspaceTable} WHERE ${adspaceTable}.owner like '${address}';`
    );
    const result = await resultsToObjects(totalAdSpacesQuery);

    return result;
  }

  // modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  // New AdSpace form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [NumNFTs, setNumNFTs] = React.useState("10");
  const [price, setPrice] = React.useState("0.55");

  // submit New AdSpace
  const contractABI = abi.abi;
  const contractAddress = abi.address;
  const { address } = useAccount();
  const { config: newAdSpaceConfig } = usePrepareContractWrite({
    addressOrName: contractAddress,
    contractInterface: contractABI,
    functionName: "createAdSpace",
    args: [
      "name-not-set",
      "website-not-set",
      parseInt("0.00").toString(),
      BigNumber.from(NumNFTs),
      "size-not-set",
    ],
  });
  const {
    data: writeData,
    isLoading,
    isSuccess,
    write: newAdSpace,
  } = useContractWrite(newAdSpaceConfig);

  // submit New AdSpace Form
  const onSubmit = (data) => {
    newAdSpace({
      recklesslySetUnpreparedArgs: [
        data.name,
        data.website,
        parseInt(data.price * 100).toString(),
        BigNumber.from(data.numNFTs),
        data.size,
      ],
    });
  };

  useEffect(() => {
    getUserAdSpaces()
      .then((res) => {
        setTableData(res);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, [onSubmit]);

  const validateNumNFTs = (num) => {
    if (!isNumeric(num)) return 1;
    return num >= 1 && num <= 20 ? num : NumNFTs;
  };

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
                        <Link
                          href={"/#/admin/adspace/" + row.original.adspace_id}
                        >
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
          <form>
            <ModalBody>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder="mysite.com | footer"
                  {...register("name")}
                ></Input>
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Website</FormLabel>
                <Input
                  type="url"
                  placeholder="https://myshop.com"
                  {...register("website")}
                ></Input>
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Banner Size</FormLabel>
                <Select placeholder="Select size" {...register("size")}>
                  <option value="wide">Wide | 728 x 90 px</option>
                  <option value="skyscraper">Skyscraper | 160 x 600 px</option>
                  <option value="square">Campaign 3 | 200 x 200 px</option>
                </Select>
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>
                  Asking Price / hour - $ <DAIicon />{" "}
                </FormLabel>
                <NumberInput
                  {...register("price")}
                  onChange={(valueString) => setPrice(valueString)}
                  value={price}
                  step={0.01}
                  min={0.01}
                  max={420}
                >
                  <NumberInputField />
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
                <NumberInput
                  {...register("numNFTs")}
                  onChange={(valueString) =>
                    setNumNFTs(validateNumNFTs(valueString))
                  }
                  value={NumNFTs}
                  step={1}
                  min={1}
                  max={20}
                >
                  <NumberInputField />
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
                onClick={handleSubmit(onSubmit)}
                colorScheme="brand"
                variant="solid"
                disabled={isLoading}
              >
                {isLoading ? "Check wallet..." : "Submit AdSpace"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Card>
  );
}
