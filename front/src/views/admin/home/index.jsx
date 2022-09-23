/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React from "react";

// Chakra imports
import {
  Box,
  Flex,
  Grid,
  useColorModeValue,
} from "@chakra-ui/react";

// Custom components
import Banner from "views/admin/home/components/Banner";
import TableTopAdSpaces from "views/admin/home/components/TableTopAdSpaces";
import Card from "components/card/Card.js";

// Assets
import tableDataTopAdSpaces from "views/admin/home/variables/tableDataTopAdSpaces.json";
import { tableColumnsTopAdSpaces } from "views/admin/home/variables/tableColumnsTopAdSpaces";

import TablelandTable from "./components/TablelandTable";
import LatestDeals from "components/domain/LatestDeals";

export default function Home() {
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.500", "white");
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        mb="20px"
        gridTemplateColumns={{ xl: "repeat(3, 1fr)", "2xl": "1fr 0.46fr" }}
        gap={{ base: "20px", xl: "20px" }}
        display={{ base: "block", xl: "grid" }}
      >
        <Flex
          flexDirection="column"
          gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}
        >
          <Banner />
          <Flex direction="column">
            <Flex mt="45px"></Flex>
            <TablelandTable mt="45px" tablePrefix="AdSpaces" />
          </Flex>
        </Flex>
        <Flex
          flexDirection="column"
          gridArea={{ xl: "1 / 3 / 2 / 4", "2xl": "1 / 2 / 2 / 3" }}
        >
          <Card px="0px" mb="20px">
            <TableTopAdSpaces
              tableData={tableDataTopAdSpaces}
              columnsData={tableColumnsTopAdSpaces}
            />
          </Card>
          <LatestDeals textColor={textColor} title="Latest Deals"/>
        </Flex>
      </Grid>
    </Box>
  );
}
