/* eslint-disable react-hooks/exhaustive-deps */
import {
  Flex,
  Table,
  Image,
  Link,
  Icon,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
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
import { MdFileUpload } from "react-icons/md";
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
import {
  fetchTablelandTables,
  getTableLandConfig,
} from "../../../../components/_custom/tableLandHelpers";
import { connect, resultsToObjects } from "@tableland/sdk";
import { useState, useEffect } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { useForm } from "react-hook-form";
import abi from "../../../../variables/AdSpaceFactory.json";

// Assets
export default function UserCampaigns(props) {
  const { columnsData } = props;
  const [tableData, setTableData] = useState([]);
  const { address } = useAccount();

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const { register, handleSubmit } = useForm();

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
  const campaignTable = TablelandTables["Campaigns"];

  // get Campaigns from Tableland
  async function getUserCampaigns() {
    const tablelandConnection = await connect({
      network: networkConfig.testnet,
      chain: networkConfig.chain,
    });

    const totalCampaignsQuery = await tablelandConnection.read(
      `SELECT name, cid as file, size, link, owner FROM ${campaignTable} WHERE ${campaignTable}.owner like '${address}';`
    );
    const result = resultsToObjects(totalCampaignsQuery);
    return result;
  }

  // submit New Campaign
  const contractABI = abi.abi;
  const contractAddress = abi.address;
  const { config: newCampaignConfig } = usePrepareContractWrite({
    addressOrName: contractAddress,
    contractInterface: contractABI,
    functionName: "createCampaign",
    args: ["name-not-set", "cid-not-set", "size-not-set", "link-not-set"],
  });
  const { write: createCampaign, isLoading } =
    useContractWrite(newCampaignConfig);

  // submit New Campaign Form
  const onSubmit = (data) => {
    createCampaign({
      recklesslySetUnpreparedArgs: [data.name, data.cid, data.size, data.link],
    });
  };

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
                          src={"https://ipfs.io/ipfs/" + cell.value}
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
          <form>
            <ModalBody>
              <FormControl mt={4} isRequired>
                <FormLabel>Campaign Name</FormLabel>
                <Input
                  type="name"
                  placeholder="Hodlers Finest Campaign"
                  {...register("name")}
                ></Input>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Banner Size</FormLabel>
                <Select placeholder="Select size" {...register("size")}>
                  <option value="wide">Wide | 728 x 90 px</option>
                  <option value="skyscraper">Skyscraper | 160 x 600 px</option>
                  <option value="square">Campaign 3 | 200 x 200 px</option>
                </Select>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Target link</FormLabel>
                <Input
                  type="url"
                  placeholder="https://myshop.com"
                  {...register("link")}
                ></Input>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Banner file CID - <Text as="i">
                  <Link href="/#/admin/ipfs/" target="_blank">
                    <Icon as={MdFileUpload} width="20px" height="20px" color="inherit" /> Upload to IPFS
                    </Link>
                  </Text>
                </FormLabel>
                <Input placeholder="IPFS CID" {...register("cid")}></Input>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={onClose}>
                Close
              </Button>
              <Button
                colorScheme="brand"
                variant="solid"
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                {isLoading ? "Check wallet..." : "Create Campaign"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Card>
  );
}
