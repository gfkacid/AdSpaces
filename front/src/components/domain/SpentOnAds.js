import MiniStatistics from "components/card/MiniStatistics";
import { MdAttachMoney } from "react-icons/md";
import { Icon } from "@chakra-ui/react";
import IconBox from "components/icons/IconBox";
import { useState, useEffect } from "react";
import deployedTables from "../../views/admin/home/variables/deployedTables.json";
import { connect, resultsToObjects } from "@tableland/sdk";
import { useAccount } from "wagmi";

export default function SpentOnAds(props) {
  const { brandColor, boxBg } = props;
  const [totalSpent, setTotalSpent] = useState(0);
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

  async function getTotalSpent() {
    const tablelandConnection = await connect({
      network: networkConfig.testnet,
      chain: networkConfig.chain,
    });

    const queryResult = await tablelandConnection.read(
      `SELECT sum(${dealTable}.price) as total_spent FROM ${dealTable}
       INNER JOIN ${campaignTable} WHERE ${campaignTable}.campaign_id = ${dealTable}.campaign_id_fk
       AND ${campaignTable}.owner = '${address}';`
    );

    const data = await resultsToObjects(queryResult);
    return  data[0].total_spent ;
  }

  useEffect(() => {
    getTotalSpent()
      .then((res) => {
        setTotalSpent(res == null ? 0 : res);
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
          icon={
            <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
          }
        />
      }
      name="Spent on Ads"
      value={"$" + totalSpent}
    />
  );
}
