/* eslint-disable react-hooks/exhaustive-deps */
// Chakra imports
import {
  Box,
  SimpleGrid,
  Text,
  useColorModeValue,
  Image,
  Link,
} from "@chakra-ui/react";

import Card from "components/card/Card.js";
import Information from "views/admin/profile/components/Information";
import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchTablelandTables,
  getTableLandConfig,
} from "../../../components/_custom/tableLandHelpers";
import { connect, resultsToObjects } from "@tableland/sdk";

export default function CampaignListing() {
  //network

  // Campaign
  const { campaignId } = useParams();
  const [Campaign, setCampaign] = useState(null);

  // styling
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  //const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );

  // TableLand
  const TablelandTables = fetchTablelandTables();
  const networkConfig = getTableLandConfig();
  const campaignsTable = TablelandTables["Campaigns"];

  // Loads the Campaign
  async function fetchCampaign() {
    const tablelandConnection = await connect({
      network: networkConfig.testnet,
      chain: networkConfig.chain,
    });

    const fetchCampaignQuery = await tablelandConnection.read(
      `SELECT * FROM ${campaignsTable} WHERE ${campaignsTable}.campaign_id = ${campaignId};`
    );
    const result = await resultsToObjects(fetchCampaignQuery);
    return result[0];
  }

  // populate this page's Campaign
  useEffect(() => {
    fetchCampaign()
      .then((CampaignRes) => {
        setCampaign(CampaignRes);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {Campaign ? (
        <Card mb={{ base: "0px", "2xl": "20px" }}>
          <Text
            color={textColorPrimary}
            fontWeight="bold"
            fontSize="2xl"
            mt="10px"
            mb="4px"
          >
            {Campaign.name}
          </Text>
          <SimpleGrid columns="2" gap="20px">
            <Image
              boxShadow={cardShadow}
              borderRadius={5}
              margin={"auto"}
              maxH="400px"
              src={"https://ipfs.io/ipfs/" + Campaign.cid}
            />
            <Information
              boxShadow={cardShadow}
              title="CID / File"
              value={Campaign.cid}
            />
            <Information
              boxShadow={cardShadow}
              title="Size"
              value={Campaign.size}
            />
            <Link href={"https://" + Campaign.link} target="_blank">
              <Information
                boxShadow={cardShadow}
                title="Link"
                value={Campaign.link}
              />{" "}
            </Link>
          </SimpleGrid>
        </Card>
      ) : (
        <Text>Campaign #{campaignId} not found.</Text>
      )}
    </Box>
  );
}
