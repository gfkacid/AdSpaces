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

// Assets
export default function UserAdSpaces() {
  // Table
  const [columnData, setColumnData] = useState([]);
  const [tableData, setTableData] = useState([]);

  const tableInstance = useTable(
    {
      columns: columnData,
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
      `SELECT ${adspaceTable}.name as adspacename, ${dealTable}.price,${dealTable}.started_at, ${dealTable}.end_at,${campaignTable}.name as campaignname, ${campaignTable}.cid FROM ${adspaceTable} INNER JOIN ${dealTable}  INNER JOIN ${campaignTable} WHERE adspace_id = adspace_id_fk AND campaign_id = campaign_id_fk;`
    );

    const { columns: colFromQuery } = totalDealQuery;
    const dataArr = resultsToObjects(totalDealQuery);

    const colArr = [];

    for (let i = 0; i < colFromQuery.length; i++) {
      colArr.push({
        Header: colFromQuery[i].name.toUpperCase(),
        accessor: colFromQuery[i].name,
      });
    }
    return { dataArr, colArr };
  }

  useEffect(() => {
    getUserAdSpaces()
      .then((res) => {
        console.log(res.colArr);
        console.log(res.dataArr);
        setColumnData(res.colArr);
        setTableData(res.dataArr);
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
    </Card>
  );
}
