/* eslint-disable react-hooks/exhaustive-deps */
import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  Progress,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import {
  fetchTablelandTables,
  getTableLandConfig,
  formatPrice,
} from "../../../../components/_custom/tableLandHelpers";
import DAIicon from "components/domain/DAIicon";
import { SearchIcon } from "@chakra-ui/icons";

import { connect, resultsToObjects } from "@tableland/sdk";

export default function TopAdSpacesTable(props) {
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

  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    tableInstance;

  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");

  const TablelandTables = fetchTablelandTables();
  const networkConfig = getTableLandConfig();
  const dealTable = TablelandTables["Deals"];
  const adspaceTable = TablelandTables["AdSpaces"];

  async function getTopAdSpaces() {
    const tablelandConnection = await connect({
      network: networkConfig.testnet,
      chain: networkConfig.chain,
    });

    const queryResult = await tablelandConnection.read(
      `SELECT ${adspaceTable}.adspace_id as adspace_id, ${adspaceTable}.name as name, sum(${dealTable}.price) as total_revenue, count(${dealTable}.deal_id) as count_deals
       FROM ${dealTable}
       INNER JOIN ${adspaceTable} 
       WHERE ${adspaceTable}.adspace_id = ${dealTable}.adspace_id_fk 
        GROUP BY ${dealTable}.adspace_id_fk;`
    );

    const data = await resultsToObjects(queryResult);
    return data;
  }

  useEffect(() => {
    getTopAdSpaces().then((data) => {
      console.log(data);
      setTableData(data);
    });
  }, []);

  return (
    <>
      <Flex
        direction="column"
        w="100%"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Flex
          align={{ sm: "flex-start", lg: "center" }}
          justify="space-between"
          w="100%"
          px="22px"
          pb="20px"
          mb="10px"
          boxShadow="0px 40px 58px -20px rgba(112, 144, 176, 0.26)"
        >
          <Text color={textColor} fontSize="xl" fontWeight="600">
            Top AdSpaces
          </Text>
        </Flex>
        <Table {...getTableProps()} variant="simple" color="gray.500">
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    pe="10px"
                    key={index}
                    borderColor="transparent"
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
                            <SearchIcon />
                            {cell.value}
                          </Link>
                        </Text>
                      );
                    } else if (cell.column.id === "count_deals") {
                      data = (
                        <Text
                          color={textColorSecondary}
                          fontSize="sm"
                          fontWeight="500"
                        >
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.id === "total_revenue") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          <DAIicon /> {formatPrice(cell.value)}
                        </Text>
                      );
                    }
                    return (
                      <Td
                        {...cell.getCellProps()}
                        key={index}
                        fontSize={{ sm: "14px" }}
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
      </Flex>
    </>
  );
}
