import MiniStatistics from "components/card/MiniStatistics";
import {
    MdBarChart,
  } from "react-icons/md";
import { Icon } from "@chakra-ui/react";
import IconBox from "components/icons/IconBox";
import { useState, useEffect } from "react";
import deployedTables from "../../views/admin/home/variables/deployedTables.json"
import { connect, resultsToObjects } from "@tableland/sdk";

export default function UserAdspacesTotalRevenue(props) {
    const { brandColor, boxBg } = props;
    const [totalRevenue, setTotalRevenue] = useState(0);

    // query TableLand for all deals made with adspaces owned by the user, with end date <= now, and sum their price
    const networkConfig = {
      testnet: "testnet",
      chain: "optimism-goerli",
      chainId: "420",
    };
  
    const dealTable = deployedTables[0][networkConfig.chainId].find(
      (elem) => elem.prefix === 'Deal'
    ).name;

    const adspaceTable = deployedTables[0][networkConfig.chainId].find(
      (elem) => elem.prefix === 'AdSpace'
    ).name;
  
    async function getTotalSpent() {
      const tablelandConnection = await connect({
        network: networkConfig.testnet,
        chain: networkConfig.chain,
      });
  
      const queryResult = await tablelandConnection.read(
        `SELECT SUM(${dealTable}.price) as total_spent FROM ${dealTable} INNER JOIN ${adspaceTable} WHERE ${adspaceTable}.id = ${dealTable}.adspace_id AND ${dealTable}.end <= '${Date.now()}';`
      );
  
      console.log(queryResult);
      const data = await resultsToObjects(queryResult);
      return {data};
    }

    useEffect(() => {
      getTotalSpent()
        .then((res) => {
          setTotalRevenue(res.data);
        })
        .catch((e) => {
          console.log(e.message);
        });
    }, []);

    return (
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
              }
            />
          }
          name='My AdSpaces Revenue'
          value={'$'+totalRevenue}
        />
    )
}