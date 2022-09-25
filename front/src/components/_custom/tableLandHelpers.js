export function getTableLandConfig() {
  return {
    testnet: "testnet",
    chain: "optimism-goerli",
    chainId: "420",
  };
}

export function fetchTablelandTables() {
  let TablelandTables = { AdSpaces: null, Campaigns: null, Deals: null };
  const dataObject = [
    {
      controller: "0x76CD15F1A985447C564a3E7E8282F390c8Dc3241",
      name: "AdSpaces_420_141",
      structure:
        "a6e5a9c970903d99b0c0fe6d989df3019fc0e0354506a8f3a9a73a29d66dc327",
    },
    {
      controller: "0x76CD15F1A985447C564a3E7E8282F390c8Dc3241",
      name: "Campaigns_420_142",
      structure:
        "11d657a4420986121da8843dcd7552e252b4052279e518a49b323027b4332d78",
    },
    {
      controller: "0x76CD15F1A985447C564a3E7E8282F390c8Dc3241",
      name: "Deals_420_143",
      structure:
        "ec5b9c8623df9ad9b162ca20a8aedb12c6b80f6466f9a1c8ad7b1d0acb46eddc",
    },
  ];

  TablelandTables.AdSpaces = dataObject[0].name;
  TablelandTables.Campaigns = dataObject[1].name;
  TablelandTables.Deals = dataObject[2].name;
  return TablelandTables;
}

export function formatPrice(price) {
  return (price / 100).toFixed(2);
}
export function formatDealPrice(price) {
  return (price / 10 ** 18).toFixed(2);
}
