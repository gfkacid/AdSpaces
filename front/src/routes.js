import React from "react";

import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdFileUpload,
  MdOutlineShoppingCart,
} from "react-icons/md";

// Admin Imports
import MainDashboard from "views/admin/default";
import Home from "views/admin/home";
import Profile from "views/admin/profile";
import IPFSPage from "views/admin/default/components/IPFSPage";
import AdSpace from "views/admin/adspace"

const routes = [
  {
    name: "AdSpaces",
    layout: "/admin",
    path: "/home",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: Home,
    display: true
  },
  {
    name: "My Dashboard",
    layout: "/admin",
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: "/dashboard",
    component: MainDashboard,
    display: true
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "/profile",
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: Profile,
    display: true
  },
  {
    name: "IPFS upload",
    layout: "/admin",
    path: "/ipfs",
    icon: <Icon as={MdFileUpload} width="20px" height="20px" color="inherit" />,
    component: IPFSPage,
    display: true
  },
  {
    name: "AdSpace",
    layout: "/admin",
    path: "/adspace/:adspaceId",
    icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
    component: AdSpace,
    display: false,
    withParams: true
  }
];

export default routes;
