import { Flex, Text} from "@chakra-ui/react"
import HistoryItem from "views/admin/home/components/HistoryItem";
import Card from "components/card/Card.js";
import moment from "moment"

// Assets
import Nft1 from "assets/img/nfts/Nft1.png";
import Nft2 from "assets/img/nfts/Nft2.png";
import Nft3 from "assets/img/nfts/Nft3.png";
import Nft4 from "assets/img/nfts/Nft4.png";
import Nft5 from "assets/img/nfts/Nft5.png";
import Nft6 from "assets/img/nfts/Nft6.png";

export default function LatestDeals(props) {
    const {textColor, title, deals} = props;
    return (
    <Card p="0px">
        <Flex
            align={{ sm: "flex-start", lg: "center" }}
            justify="space-between"
            w="100%"
            px="22px"
            py="18px"
        >
            <Text color={textColor} fontSize="xl" fontWeight="600">
                {title}
            </Text>
            {/* <Button variant="action">See all</Button> */}
        </Flex>
        { deals && deals.map((deal, index) => {
            return (
                <HistoryItem
                    name={deal.adspace_name}
                    author={"By "+deal.campaign_owner}
                    date={moment(deal.start).fromNow()}
                    image={deal.cid}
                    price={deal.price}
                />
                
            );
        })}

    </Card>
    )
}