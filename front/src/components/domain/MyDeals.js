import MiniStatistics from "components/card/MiniStatistics";
import { MdAddTask } from "react-icons/md";
import { Icon } from "@chakra-ui/react";
import IconBox from "components/icons/IconBox";
import { useState, useEffect } from "react";
import deployedTables from "../../views/admin/home/variables/deployedTables.json";
import { connect, resultsToObjects } from "@tableland/sdk";
import { useAccount } from "wagmi";

export default function MyDeals() {
  const [incomingDeals, setIncomingDeals] = useState(0);
  const [outgoingDeals, setOutgoingDeals] = useState(0);
  const { address } = useAccount();
  // query TableLand for all deals made by the user ; the assumption that an entry in deals table = funds spent holds true
  const networkConfig = {
    testnet: "testnet",
    chain: "optimism-goerli",
    chainId: "420",
  };

  const dealTable = deployedTables[0][networkConfig.chainId].find(
    (elem) => elem.prefix === "Deals"
  ).name;

  const campaignTable = deployedTables[0][networkConfig.chainId].find(
    (elem) => elem.prefix === "Campaigns"
  ).name;

  const adspaceTable = deployedTables[0][networkConfig.chainId].find(
    (elem) => elem.prefix === "AdSpaces"
  ).name;

  async function getTotalDeals() {
    const tablelandConnection = await connect({
      network: networkConfig.testnet,
      chain: networkConfig.chain,
    });

    const outgoingDealsQuery = await tablelandConnection.read(
      `SELECT count(${dealTable}.deal_id) as outgoing_deals FROM ${dealTable} INNER JOIN ${campaignTable} WHERE ${campaignTable}.campaign_id = ${dealTable}.campaign_id_fk AND ${campaignTable}.owner = '${address}';`
    );
    const outgoingDeals = await resultsToObjects(outgoingDealsQuery);

    const incomingDealsQuery = await tablelandConnection.read(
      `SELECT count(${dealTable}.deal_id) as incoming_deals FROM ${dealTable} INNER JOIN ${adspaceTable} WHERE ${adspaceTable}.adspace_id = ${dealTable}.campaign_id_fk AND ${adspaceTable}.owner = '${address}';`
    );
    
    const incomingDeals = await resultsToObjects(incomingDealsQuery);
    return {incomingDeals: incomingDeals[0].incoming_deals , outgoingDeals:  outgoingDeals[0].outgoing_deals };
  }

  useEffect(() => {
    getTotalDeals()
      .then((res) => {
        setIncomingDeals(res.incomingDeals);
        setOutgoingDeals(res.outgoingDeals);
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
          bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
          icon={<Icon w="28px" h="28px" as={MdAddTask} color="white" />}
        />
      }
      name="My Deals"
      value={incomingDeals + outgoingDeals}
    />
  );
}
