/*eslint-disable*/
import React from "react";
import {
  Flex,
  Link,
  List,
  ListItem,
  Text,
  Button,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Footer() {
  const textColor = useColorModeValue("gray.400", "white");
  const { toggleColorMode } = useColorMode();
  return (
    <Flex
      zIndex='3'
      flexDirection={{
        base: "column",
        xl: "row",
      }}
      alignItems={{
        base: "center",
        xl: "start",
      }}
      justifyContent='space-between'
      px={{ base: "30px", md: "50px" }}
      pb='30px'>
      <Text
        color={textColor}
        textAlign={{
          base: "center",
          xl: "start",
        }}
        mb={{ base: "20px", xl: "0px" }}>
        {" "}
        &copy; {1900 + new Date().getYear()}
        <Text as='span' fontWeight='500' ms='4px'>
          AdSpaces. All Rights Reserved. Made with love by
          <Link
            mx='3px'
            color={textColor}
            href='https://ethglobal.com/showcase/adspaces-vn1bg'
            target='_blank'
            fontWeight='700'>
            4D
          </Link>
        </Text>
      </Text>
      <List display='flex'>
        <ListItem>
          <Link
            fontWeight='500'
            color={textColor}
            target='_blank'
            href='https://www.notion.so/AdSpaces-9db1b62ab599480a9cef8c6cab633592'>
            Notion
          </Link>
        </ListItem>
      </List>
    </Flex>
  );
}
