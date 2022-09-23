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
import React, { useMemo } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import Card from "components/card/Card";
import SizeIcon from "components/domain/SizeIcon";
import { fetchTablelandTables ,getTableLandConfig} from "../../../../components/_custom/tableLandHelpers";
import { connect, resultsToObjects } from "@tableland/sdk";
import { useState, useEffect } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";

// Assets
export default function UserCampaigns(props) {
  const { columnsData } = props;
  const [tableData,setTableData] = useState([]);
  const { address } = useAccount();
  
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
  // load from TableLand
  const TablelandTables = fetchTablelandTables();
  const networkConfig = getTableLandConfig();
  const campaignTable = TablelandTables["AdSpaces"];
  async function getUserCampaigns() {
    const tablelandConnection = await connect({
      network: networkConfig.testnet,
      chain: networkConfig.chain,
    });

    const totalCampaignsQuery = await tablelandConnection.read(
      `SELECT * FROM ${campaignTable} WHERE ${campaignTable}.owner = '${address}';`
    );
    const result = await resultsToObjects(totalCampaignsQuery);
    
    return result;
  }

  useEffect(() => {
    getUserCampaigns()
      .then((res) => {
        setTableData(res);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);
  
  // styling
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
          My Campaigns
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
                        <Link href={"/#/admin/campaign/" + row.original.id}>
                          {cell.value}
                        </Link>
                      </Text>
                    );
                  } else if (cell.column.id === "size") {
                    data = <SizeIcon size={cell.value} />;
                  } else if (cell.column.id === "file") {
                    data = (
                      <Link
                        href={"https://ipfs.io/ipfs/" + cell.value}
                        target="_blank"
                      >
                        <Image
                          className="table-image"
                          src={
                            "https://ipfs.io/ipfs/" + cell.value
                          }
                        />
                      </Link>
                    );
                  } else if (cell.column.id === "link") {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        <Link href={cell.value} target="_blank">
                          {cell.value}
                        </Link>
                      </Text>
                    );
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
          <ModalHeader>New Campaign</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Banner Size</FormLabel>
              <Select placeholder="Select size">
                <option value="wide">Wide | 728 x 90 px</option>
                <option value="skyscraper">Skyscraper | 160 x 600 px</option>
                <option value="square">Campaign 3 | 200 x 200 px</option>
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Target link</FormLabel>
              <Input type="url" placeholder="https://myshop.com"></Input>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Banner file CID</FormLabel>
              <Input placeholder="IPFS CID"></Input>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="brand" variant="solid">
              Upload to IPFS
            </Button>
            <Button colorScheme="brand" variant="solid">
              Create Campaign
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
