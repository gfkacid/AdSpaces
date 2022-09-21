import MiniStatistics from "components/card/MiniStatistics";
import { MdBarChart } from "react-icons/md";
import { Icon } from "@chakra-ui/react";
import IconBox from "components/icons/IconBox";
import { useState, useEffect } from "react";
import deployedTables from "../../views/admin/home/variables/deployedTables.json";
import { connect, resultsToObjects } from "@tableland/sdk";
import { useAccount } from "wagmi";

export default function UserAdspacesTotalRevenue(props) {
  const { brandColor, boxBg } = props;
  const [totalRevenue, setTotalRevenue] = useState(0);
  const { address } = useAccount();

  // query TableLand for all deals made with adspaces owned by the user, with end date <= now, and sum their price
  const networkConfig = {
    testnet: "testnet",
    chain: "optimism-goerli",
    chainId: "420",
  };

  const dealTable = deployedTables[0][networkConfig.chainId].find(
    (elem) => elem.prefix === "Deals"
  ).name;

  const adspaceTable = deployedTables[0][networkConfig.chainId].find(
    (elem) => elem.prefix === "AdSpaces"
  ).name;

  async function getTotalSpent() {
    const tablelandConnection = await connect({
      network: networkConfig.testnet,
      chain: networkConfig.chain,
    });

    const queryResult = await tablelandConnection.read(
      // AND ${dealTable}.end <= '${Date.now()}'
      `SELECT sum(${dealTable}.price) as total_spent FROM ${dealTable}
       INNER JOIN ${adspaceTable} 
       WHERE ${adspaceTable}.adspace_id = ${dealTable}.adspace_id_fk 
        AND ${adspaceTable}.owner = '${address}';`
    );

    const data = await resultsToObjects(queryResult);
    return data[0]?.total_spent ;
  }

  useEffect(() => {
    getTotalSpent()
      .then((res) => {
        setTotalRevenue(res === null ? 0 : res);
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
      name="My AdSpaces Revenue"
      value={"$" + totalRevenue}
    />
  );
}
