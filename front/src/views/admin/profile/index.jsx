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
import { Box, Grid } from "@chakra-ui/react";

// Custom components
import Banner from "views/admin/profile/components/Banner";
import General from "views/admin/profile/components/General";
import General2 from "views/admin/profile/components/Generaltwo";
import General3 from "views/admin/profile/components/Generalthree";
import Projects from "views/admin/profile/components/Projects";

// Assets
import banner from "assets/img/auth/banner.png";
import avatar from "assets/img/avatars/avatar4.png";
import React from "react";
import { useState, useEffect } from "react";

export default function Overview() {
  const [totalAdSpaces,setTotalAdSpaces] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [uniqueUsers, setUniqueUsers] = useState(0)

  const adspacesCountURL = 'https://testnets.tableland.network/query?s=SELECT%20count(adspace_id)%20as%20total_adspaces%20FROM%20AdSpaces_420_141';
  const totalRevenueURL = 'https://testnets.tableland.network/query?s=SELECT%20sum(price)%20as%20total_revenue%20FROM%20Deals_420_143%20WHERE%20end_at%20%3C%201664114431';
  const uniqueUsersURL = 'https://testnets.tableland.network/query?s=SELECT%20count(DISTINCT(AdSpaces_420_141.owner))%20as%20unique_owners%20,count(DISTINCT(Campaigns_420_142.owner))%20as%20campaign_owners%20FROM%20AdSpaces_420_141%20JOIN%20Campaigns_420_142'

  useEffect(() => {
    fetch(adspacesCountURL)
    .then(res => res.json())
    .then((out) => {
      setTotalAdSpaces(out[0].total_adspaces)
    })  
    fetch(totalRevenueURL)
    .then(res => res.json())
    .then((out) => {
      setTotalRevenue((out[0].total_revenue / 10 ** 18).toFixed(2))
    })  
    fetch(uniqueUsersURL)
    .then(res => res.json())
    .then((out) => {
      setUniqueUsers(out[0].campaign_owners + out[0].unique_owners)
    })  
    
  }, []);
  

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "1.34fr 1.62fr 1fr",
        }}
        templateRows={{
          base: "repeat(3, 1fr)",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}>
        <Banner
          gridArea='1 / 1 / 2 / '
          banner={banner}
          name='AdSpaces Platform Stats'
          posts={totalAdSpaces}
          followers={totalRevenue+' DAI'}
          following={uniqueUsers}
        />
        <General2
          gridArea={{ base: "1 / 1 / 1 / 1", lg: "1 / 4 / 1 / 2" }}
          minH='100px'
          pe='20px'
        />
      </Grid>
      <Grid
        mb='20px'
        templateColumns={{
          base: "1fr",
          lg: "repeat(2, 1fr)",
          "2xl": "1.34fr 1.62fr 1fr",
        }}
        templateRows={{
          base: "1fr",
          lg: "repeat(2, 1fr)",
          "2xl": "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}>
        <Projects
          gridArea='1 / 2 / 2 / 2'
          banner={banner}
          avatar={avatar}
          name='Adela Parkson'
          job='Product Designer'
          posts='17'
          followers='9.7k'
          following='274'
        />
        <General
          gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
          minH='365px'
          pe='20px'
        />
          <General3
          gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 4 / 2 / 3" }}
          minH='365px'
          pe='20px'
        />
      </Grid>
      <Grid>
      </Grid>
    </Box>
  );
}
