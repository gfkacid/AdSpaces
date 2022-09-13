/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Flex,
  Table,
  Icon,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import Card from "components/card/Card";
import Menu from "components/menu/MainMenu";
import deployedTables from "../variables/deployedTables.json";
import { connect, resultsToObjects } from "@tableland/sdk";

// Assets
import { MdCheckCircle, MdOutlineError } from "react-icons/md";

export default function ColumnsTable(props) {
  const { tablePrefix } = props;
  const [tableData, setTableData] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  //const tableland = require("@tableland/sdk");
  const networkConfig = {
    testnet: "testnet",
    chain: "optimism-goerli",
    chainId: "420",
  };

  const tableName = deployedTables[0][networkConfig.chainId].find(
    (elem) => elem.prefix === tablePrefix
  ).name;

  async function fetchTablelandTable(tableToRead) {
    const tablelandConnection = await connect({
      network: networkConfig.testnet,
      chain: networkConfig.chain,
    });

    const readQueryResult = await tablelandConnection.read(
      `SELECT * FROM ${tableToRead};`
    );

    console.log(readQueryResult);
    const data = await resultsToObjects(readQueryResult);

    const columnsFixed = readQueryResult.columns.map((elem) => {
      return { Header: elem.name, accessor: elem.name };
    });
    return { columnsFixed, data };
  }

  useEffect(() => {
    fetchTablelandTable(tableName)
      .then((res) => {
        setTableData(res.data);
        setTableColumns(res.columnsFixed);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);

  const tableInstance = useTable(
    {
      columns: tableColumns,
      data: tableData,
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

  const getDomainFromURL = (url) => {
    let domain = new URL(url);
    return domain.hostname;
  };

  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "scroll" }}
    >
      <Flex px="25px" justify="space-between" mb="20px" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Browse AdSpaces
        </Text>
        <Menu />
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
                  let align = "left";
                  if (cell.column.id === "id") {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        <a href="#">#{cell.value}</a>
                      </Text>
                    );
                  } else if (cell.column.id === "status") {
                    data = (
                      <Flex align="center">
                        <Icon
                          w="24px"
                          h="24px"
                          me="5px"
                          color={
                            cell.value === "Available"
                              ? "green.500"
                              : cell.value === "Running Ads"
                              ? "orange.500"
                              : null
                          }
                          as={
                            cell.value === "Available"
                              ? MdCheckCircle
                              : cell.value === "Running Ads"
                              ? MdOutlineError
                              : null
                          }
                        />
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      </Flex>
                    );
                  } else if (cell.column.id === "size") {
                    data = (
                      <span
                        className={"size-box size-box-" + cell.value}
                      ></span>
                    );
                    align = "center";
                  } else if (cell.column.id === "price") {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        ${cell.value}
                      </Text>
                    );
                  } else if (cell.column.id === "website") {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        <a href={cell.value} target="_blank">
                          {getDomainFromURL(cell.value)}
                        </a>
                      </Text>
                    );
                  } else {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        {cell.value}
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
                      textAlign={align}
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
