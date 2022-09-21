import MiniStatistics from "components/card/MiniStatistics";
import {
    MdFileCopy,
  } from "react-icons/md";
import { Icon } from "@chakra-ui/react";
import IconBox from "components/icons/IconBox";
import { useState, useEffect } from "react";
import deployedTables from "../../views/admin/home/variables/deployedTables.json"
import { connect, resultsToObjects } from "@tableland/sdk";
import { useAccount } from "wagmi";


export default function MyCampaigns(props) {
  const { brandColor, boxBg } = props;
    const [totalCampaigns, setTotalCampaigns] = useState(0);
    const { address } = useAccount();
    // query TableLand for all deals made by the user ; the assumption that an entry in deals table = funds spent holds true
    const networkConfig = {
      testnet: "testnet",
      chain: "optimism-goerli",
      chainId: "420",
    };
  
    const campaignTable = deployedTables[0][networkConfig.chainId].find(
      (elem) => elem.prefix === 'Campaign'
    ).name;
  
    async function getTotalCampaigns() {
      const tablelandConnection = await connect({
        network: networkConfig.testnet,
        chain: networkConfig.chain,
      });
  
      const totalCampaignsQuery = await tablelandConnection.read(
        `SELECT COUNT(id) as total_adspaces FROM ${campaignTable} WHERE ${campaignTable}.owner = '${address}';`
      );
      console.log('total campaigns: '+totalCampaignsQuery);
      const result = await resultsToObjects(totalCampaignsQuery);

      return {result};
    }

    useEffect(() => {
      getTotalCampaigns()
        .then((res) => {
          setTotalCampaigns(res.result);
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
                <Icon w='32px' h='32px' as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name='My Campaigns'
          value={totalCampaigns}
        />
    )
}