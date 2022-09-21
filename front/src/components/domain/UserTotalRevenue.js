import MiniStatistics from "components/card/MiniStatistics";
import { MdBarChart } from "react-icons/md";
import { Icon } from "@chakra-ui/react";
import IconBox from "components/icons/IconBox";
import { useState, useEffect } from "react";

export default function UserAdspacesTotalRevenue(props) {
  const { brandColor, boxBg } = props;
  const [totalRevenue, setTotalRevenue] = useState(0);

  // fetch all event logs for PaymentReceived event, where the recipient is user's address, and sum up the amounts
  async function getTotalAdSpaceRevenue() {}
  useEffect(() => {
    getTotalAdSpaceRevenue()
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
          w="56px"
          h="56px"
          bg={boxBg}
          icon={<Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />}
        />
      }
      name="My Total Revenue"
      value={"$" + totalRevenue}
    />
  );
}
