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
import abi from "../variables/AdSpaceFactory.json";
import DAIicon from "components/domain/DAIicon";
import { useEffect } from "react";
import moment from "moment";

// Assets
export default function UserAdSpaces(props) {
  // Table
  const { columnsData } = props;
  const [tableData, setTableData] = useState([]);

  const tableInstance = useTable(
    {
      columns: columnsData,
      data: tableData,
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
  const campaignTable = TablelandTables["Campaigns"];
  const dealTable = TablelandTables["Deals"];

  async function getUserAdSpaces() {
    const tablelandConnection = await connect({
      network: networkConfig.testnet,
      chain: networkConfig.chain,
    });

    const totalDealQuery = await tablelandConnection.read(
      `SELECT ${adspaceTable}.adspace_id as adspace_id, ${adspaceTable}.name as adspace_name, ${dealTable}.price as deal_price,${dealTable}.started_at as deal_start, ${dealTable}.end_at as deal_end,${campaignTable}.campaign_id as campaign_id, ${campaignTable}.name as campaign_name, ${campaignTable}.cid as file FROM ${adspaceTable} INNER JOIN ${dealTable}  INNER JOIN ${campaignTable} WHERE adspace_id = adspace_id_fk AND campaign_id = campaign_id_fk;`
    );

    const userDeals = resultsToObjects(totalDealQuery);
      console.log(userDeals)
    return userDeals;
  }

  useEffect(() => {
    getUserAdSpaces()
      .then((res) => {
        setTableData(res);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);

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
          DEALS
        </Text>
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
                  console.log(cell)
                  let data = "";
                  if (cell.column.id === "adspace_name") {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        <Link href={"/#/admin/adspace/" + row.original.adspace_id}>
                          {cell.value}
                        </Link>
                      </Text>
                    );
                  } else if (cell.column.id === "size") {
                    data = <SizeIcon size={cell.value} />;
                  } else if (cell.column.id === "deal_price") {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        <DAIicon/> {cell.value}
                      </Text>
                    );
                  } else if (cell.column.id === "campaign_name") {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        <Link href={"/#/admin/campaign/" + row.original.campaign_id}>
                          {cell.value}
                        </Link>
                      </Text>
                    );
                  } else if (cell.column.id === "deal_start") {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        {moment.unix(cell.value).format('lll')}
                      </Text>
                    );
                  } else if (cell.column.id === "deal_end") {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        {moment.unix(cell.value).format('lll')}
                      </Text>
                    );
                  } else if (cell.column.id === "file") {
                    data = <Image src={`https://ipfs.io/ipfs/${cell.value}`} className="table-image"/>;
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
    </Card>
  );
}
