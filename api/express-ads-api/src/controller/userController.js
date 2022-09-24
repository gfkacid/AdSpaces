const tableland = require("@tableland/sdk");
const tableToRead = "AdSpaces_420_107";
const { ethers, network } = require("ethers");
const { Wallet } = require("ethers");
const { ChainName, connect, Connection } = require("@tableland/sdk");
const abi = require("../ABI/AdSpaceFactory.json");
const psl = require('psl');

exports.insert = async (req, res) => {
  const adSpaceId = req.query.adspace_id;
  const networkConfig = {
    testnet: "testnet",
    chain: "optimism-goerli",
    chainId: "420",
  };

  const provider = new ethers.providers.JsonRpcProvider(
    "https://flashy-omniscient-slug.optimism-goerli.discover.quiknode.pro/7a2fdffa24bf4fd891bd9c77fdaa6325b0041dbb/"
  ); 

  const ABI = abi.abi;
  const ADDRESS = abi.address;

  const account = new Wallet(
    "0x4c46ef7b1011c8d1fab3470659ecafeda9c3e966fc757b6a6c373c37f577a423",
    provider
  );

  const AdSpaceFactory = new ethers.Contract(ADDRESS, ABI, account);

  console.log(account);

const tablelandConnection = await tableland.connect(networkConfig);
const readQueryResult = await tablelandConnection.read(
    //`SELECT count(campaign_id) as countID FROM ${tableToRead};`
    `SELECT * FROM ${tableToRead} WHERE adspace_id = '${adSpaceId}';`
  );
  const { columns, rows } = readQueryResult;
  const adSpace = tableland.resultsToObjects(readQueryResult);
  if(adSpace[0].verified == 1){
    return res.send(adSpace[0]);
  }
  else {
    var host = req.get('host');
    console.log("host is", host);
    const websiteRoot = psl.get(adSpace[0].website);
    console.log("Website root is: ", websiteRoot);
    if(host == websiteRoot){
      const tx = await AdSpaceFactory.verifyAdSpace(adSpaceId);
      adSpace[0].verified = 1;
      return res.send(adSpace[0]);
    }
    else {
      return res.send(403);
    }
  }
};