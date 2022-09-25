import MiniStatistics from "components/card/MiniStatistics";
import { MdBarChart } from "react-icons/md";
import { Icon } from "@chakra-ui/react";
import IconBox from "components/icons/IconBox";
import { useState, useEffect } from "react";
// import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import {ethers, BigNumber, utils} from 'ethers';
import { hexZeroPad } from "ethers/lib/utils";

export default function UserAdspacesTotalRevenue(props) {
  const { brandColor, boxBg } = props;
  const [totalRevenue, setTotalRevenue] = useState(0);

  // fetch all event logs for PaymentReceived event, where the recipient is user's address, and sum up the amounts
  async function getTotalAdSpaceRevenue() {

    //Ethers part

    // const adSpacesContractAddress = "0x24222B72E52C690A42Da6cE4575D9D8260680bb8";
    // const adSpaceABI = [
    //   {
		// 		"anonymous": false,
		// 		"inputs": [
		// 			{
		// 				"indexed": true,
		// 				"internalType": "address",
		// 				"name": "recipient",
		// 				"type": "address"
		// 			},
		// 			{
		// 				"indexed": false,
		// 				"internalType": "uint256",
		// 				"name": "amount",
		// 				"type": "uint256"
		// 			},
		// 			{
		// 				"indexed": true,
		// 				"internalType": "uint256",
		// 				"name": "adspace_id",
		// 				"type": "uint256"
		// 			}
		// 		],
		// 		"name": "RevenueWithdraw",
		// 		"type": "event"
		// 	},
    //   {
		// 		"anonymous": false,
		// 		"inputs": [
		// 			{
		// 				"indexed": true,
		// 				"internalType": "address",
		// 				"name": "from",
		// 				"type": "address"
		// 			},
		// 			{
		// 				"indexed": true,
		// 				"internalType": "address",
		// 				"name": "to",
		// 				"type": "address"
		// 			},
		// 			{
		// 				"indexed": true,
		// 				"internalType": "uint256",
		// 				"name": "tokenId",
		// 				"type": "uint256"
		// 			}
		// 		],
		// 		"name": "Transfer",
		// 		"type": "event"
		// 	}
    // ]
    // const provider = new ethers.providers.WebSocketProvider(
    //   `wss://opt-goerli.g.alchemy.com/v2/cMQkfBvN28ymGaSTenWXBn5M0MwDW-Pf/${'cMQkfBvN28ymGaSTenWXBn5M0MwDW-Pf'}`
    // );

    //  const contract = new ethers.Contract(adSpacesContractAddress, adSpaceABI, provider);
    //  console.log(contract.filters.RevenueWithdraw("0xE395793777e5619296b804b29b1E7f4E81524e0b"));
    //  const filter = {
    //   address: adSpacesContractAddress,
    //   topics: [
    //     utils.id("RevenueWithdraw(address,uint256,uint256)"),
    //     hexZeroPad("0xE395793777e5619296b804b29b1E7f4E81524e0b", 32)
    //   ]
    //  }
    //  console.log(filter);// This gets back the same thing that we have in row 77
    // // console.log(contract.queryFilter(1431087, 1431097))
    // //  // Retrieving the current Block number
    // //  const currentBlock = await provider.getBlockNumber();
    // //  console.log(currentBlock);

    // contract.on("RevenueWithdraw"())
     
   }

  useEffect(() => {
    getTotalAdSpaceRevenue()
      .then((res) => {
        // setTotalRevenue(res.data);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);



  return (
    <MiniStatistics
      startContent={
        <IconBox
          w="56px"
          h="56px"
          bg={boxBg}
          icon={<Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />}
        />
      }
      name="My Total Revenue"
      value={"$" + totalRevenue}
    />
  );
}