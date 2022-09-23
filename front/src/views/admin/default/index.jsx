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

// Chakra imports
import { Box, Icon, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
// Assets
// Custom components
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React from "react";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from "react-icons/md";
import {
  userCampaignsColumns,
  userAdSpacesColumns,
} from "views/admin/default/variables/userDashboardColumns";
import tableDataUserCampaigns from "views/admin/default/variables/tableDataUserCampaigns.json";
import tableDataUserAdSpaces from "views/admin/default/variables/tableDataUserAdSpaces.json";
import UserCampaigns from "./components/UserCampaigns";
import UserAdSpaces from "./components/UserAdSpaces";
import UserTotalRevenue from "components/domain/UserTotalRevenue";
import UserAdspacesTotalRevenue from "components/domain/UserAdspacesTotalRevenue";
import SpentOnAds from "components/domain/SpentOnAds";
import MyDeals from "components/domain/MyDeals";
import MyAdSpaces from "components/domain/MyAdSpaces";
import MyCampaigns from "components/domain/MyCampaigns";

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap="20px"
        mb="20px"
      >
        <UserAdspacesTotalRevenue brandColor={brandColor} boxBg={boxBg} />
        <UserTotalRevenue brandColor={brandColor} boxBg={boxBg} />
        <SpentOnAds brandColor={brandColor} boxBg={boxBg} />
        <MyDeals />
        <MyAdSpaces />
        <MyCampaigns brandColor={brandColor} boxBg={boxBg} />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <UserAdSpaces columnsData={userAdSpacesColumns} />
        <UserCampaigns
          columnsData={userCampaignsColumns}
          tableData={tableDataUserCampaigns}
        />
        <MyDeals />
      </SimpleGrid>
    </Box>
  );
}
