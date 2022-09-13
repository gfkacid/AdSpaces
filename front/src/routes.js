import React from "react";

import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
} from "react-icons/md";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/dataTables";
import AdSpace from "views/admin/adspace"

const routes = [
  {
    name: "Home",
    layout: "/admin",
    path: "/home",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: NFTMarketplace,
  },
  {
    name: "Ad Marketplace",
    layout: "/admin",
    path: "/ad-marketplace",
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width='20px'
        height='20px'
        color='inherit'
      />
    ),
    component: DataTables,
    secondary: true,
  },
  {
    name: "My Dashboard",
    layout: "/admin",
    icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    path: "/dashboard",
    component: MainDashboard,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "/profile",
    icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
    component: Profile,
  },
  {
    name: "AdSpace",
    layout: "/admin",
    path: "/adspace/:adspaceId",
    icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
    component: AdSpace,
  }
];

export default routes;
