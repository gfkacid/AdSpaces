import MiniStatistics from "components/card/MiniStatistics";
import { MdAddTask } from "react-icons/md";
import { Icon } from "@chakra-ui/react";
import IconBox from "components/icons/IconBox";
import { useState, useEffect } from "react";
import {
  fetchTablelandTables,
  getTableLandConfig,
} from "../_custom/tableLandHelpers";
import { connect, resultsToObjects } from "@tableland/sdk";
import { useAccount } from "wagmi";

export default function MyAdSpaces() {
  const [totalAdSpaces, setTotalAdSpaces] = useState(0);
  const { address } = useAccount();

  const TablelandTables = fetchTablelandTables();
  // query TableLand for all deals made by the user ; the assumption that an entry in deals table = funds spent holds true
  const networkConfig = getTableLandConfig();

  const adspaceTable = TablelandTables["AdSpaces"];

  async function getTotalAdSpaces() {
    const tablelandConnection = await connect({
      network: networkConfig.testnet,
      chain: networkConfig.chain,
    });

    const totalAdSpacesQuery = await tablelandConnection.read(
      `SELECT count(adspace_id) as total_adspaces FROM ${adspaceTable} WHERE ${adspaceTable}.owner like '${address}';`
    );
    const result = await resultsToObjects(totalAdSpacesQuery);

    return result[0].total_adspaces;
  }

  useEffect(() => {
    getTotalAdSpaces()
      .then((res) => {
        setTotalAdSpaces(res);
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
      name="My AdSpaces"
      value={totalAdSpaces}
    />
  );
}
