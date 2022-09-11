export async function fetchTablelandTable(props) {
  const tableland = require("@tableland/sdk");
  const fs = require("fs");
  const { tablePrefix } = props;

  const tableDirectory = JSON.parse(
    fs.readFileSync("constants/deployedTables.json")
  );

  const networkConfig = {
    testnet: "testnet",
    chain: "optimism-goerli",
    chainId: "420",
  };

  const tableToRead = tableDirectory[networkConfig.chainId].find(
    (elem) => elem.prefix === tablePrefix
  ).name;

  console.log(tableToRead);

  const tablelandConnection = await tableland.connect({
    network: "testnet",
    chain: "optimism-kovan",
  });

  const { columns, rows } = await tablelandConnection.read(
    `SELECT * FROM ${tableToRead};`
  );

  return { columns, rows };
}
