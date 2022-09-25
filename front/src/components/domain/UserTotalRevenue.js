import MiniStatistics from "components/card/MiniStatistics";
import { MdBarChart } from "react-icons/md";
import { Icon } from "@chakra-ui/react";
import IconBox from "components/icons/IconBox";
import { useState, useEffect } from "react";
// import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import {ethers, BigNumber} from 'ethers';

export default function UserAdspacesTotalRevenue(props) {
  const { brandColor, boxBg } = props;
  const [totalRevenue, setTotalRevenue] = useState(0);

  // fetch all event logs for PaymentReceived event, where the recipient is user's address, and sum up the amounts
  async function getTotalAdSpaceRevenue() {

    //Ethers part

    // const adSpacesContractAddress = "0xC0C71F67192A25f71360412919abE88B6a864393";
    // const adSpaceABI = [
    //   {
		// 		"anonymous": false,
		// 		"inputs": [
		// 			{
		// 				"indexed": false,
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
		// 				"indexed": false,
		// 				"internalType": "uint256",
		// 				"name": "adspace_id",
		// 				"type": "uint256"
		// 			}
		// 		],
		// 		"name": "RevenueWithdraw",
		// 		"type": "event"
		// 	}
    // ]
    // const provider = new ethers.providers.WebSocketProvider(
    //   `wss://opt-goerli.g.alchemy.com/v2/cMQkfBvN28ymGaSTenWXBn5M0MwDW-Pf/${'cMQkfBvN28ymGaSTenWXBn5M0MwDW-Pf'}`
    // );

    //  const contract = new ethers.Contract(adSpacesContractAddress, adSpaceABI, provider);
    // //  const filter = contract.filters.RevenueWithdraw(null,null,null);
    //   console.log(contract.filters);
    // //  const results = await contract.queryFilter(filter)
    // //  console.log("results are: ", results);
    // //   contract.on("RevenueWithdraw", (nftOwner, DAIAmountPerNft, adspaceId, event) => {
    // //     let info = {
    // //       nftOwner: nftOwner,
    // //       DAIAmountPerNft: ethers.utils.formatUnits(DAIAmountPerNft, 18),
    // //       adspaceId: adspaceId,
    // //       data: event,
    // //     };
    // //     console.log(JSON.stringify(info, null, 4));
    // //   });
    

  // QuickNode part
  // const provider = new ethers.providers.JsonRpcProvider("https://damp-tiniest-night.optimism-goerli.discover.quiknode.pro/7635709edb15d49d5a4d5bdf19649792a8805f41");
  // const filterId =  provider.getLogs(
  //   "0x1cE69BC4F63B1288aB0b1046189df707Cf9f3212"
  // );
  // console.log("Filter id is: ", filterId);

  //     const filter = [
  //       "0x57E7546d4AdD5758a61C01b84f0858FA0752e940"
  //     ];
  //     const provider = new ethers.providers.JsonRpcProvider("https://ancient-chaotic-sky.matic.discover.quiknode.pro/f419aee5d2ca4ae1729eecb0220df23cfe06c198/");
  //     const params = filter;
  //     const result = await provider.send("eth_getFilterLogs", params);
  //     let newArray = [];
  //     for(let i = 0; i < result.length; i++){
  //       if(result[i].topics[0] == "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"){
  //         newArray.push(result[i]);
  //       }
  //     }
  //     console.log(newArray);
  //   // 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
  // }

  // QuickNode calling get function to get all revenue earnt for actual user

  const abi = [
      {
				"inputs": [],
				"name": "getyourTotalRevenue",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			}
  ];
  const provider = new ethers.providers.JsonRpcProvider("https://damp-tiniest-night.optimism-goerli.discover.quiknode.pro/7635709edb15d49d5a4d5bdf19649792a8805f41");
  const contract = new ethers.Contract(
    "0xc5f5C82A5b94F37646Fb6559007C90f75bA2b311",
    abi,
    provider
  );
  const response = await contract.functions.getyourTotalRevenue();
  console.log(response);
  const returnNumberValue = response.parseInt();
  console.log(returnNumberValue);

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