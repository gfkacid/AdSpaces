import { Buffer } from "buffer";
import * as IPFS from "ipfs-core";
import { useState, useEffect } from "react";
import Card from "components/card/Card";
import { Text, Button, Flex,SimpleGrid, Box, useColorModeValue } from "@chakra-ui/react";


export default function IPFSPage() {
  
  const [file, setFile] = useState(null);
  const [urlArray, setUrlArray] = useState([]);
  const [ipfs,setIpfs] = useState(null);
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  //Use following command to create a random file: head -c 1M </dev/urandom >myfile2

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);

    reader.onloadend = () => {
      setFile(Buffer(reader.result));
    };

    e.preventDefault();
  };

  const uploadFile = async (e) => {
    e.preventDefault();

    try {
      const created = await ipfs.add(file);
      const cid = created.path;
      console.log("New file cid:", cid );

      setUrlArray((prev) => [...prev, cid]);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(async() => {
    await IPFS.create()
      .then((res) => {
        setIpfs(res)
        console.log('ipfs ready')
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);
  

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <SimpleGrid columns="2" gap="20px">
        <Card px="24px" mb="20px">
          <Text
            color={textColorPrimary}
            fontWeight="bold"
            fontSize="2xl"
            mt="10px"
            mb="4px"
          >
            File Uploader
          </Text>
            <div className="main mt-100">
              <form onSubmit={uploadFile}>
                <input type="file" onChange={retrieveFile} />
                <Button
                  onClick={uploadFile}
                  colorScheme="brand"
                  variant="solid"
                >
                  Upload File
                </Button>
              </form>
            </div>
          </Card>
          <Card px="24px" mb="20px">
            <div className="display">
            <Text
              color={textColorPrimary}
              fontWeight="bold"
              fontSize="2xl"
              mt="10px"
              mb="4px"
            >
              Preview Files
            </Text>
              {urlArray.length !== 0 ? (
                urlArray.map((cid, i) => (
                  <Text>
                    <a href={`https://ipfs.io/ipfs/${cid}`} key={i} alt="link" target="_blank">
                      {cid}
                    </a>
                  </Text>
                ))
              ) : (
                <h3>No files uploaded yet.</h3>
              )}
            </div>
          </Card>
      </SimpleGrid>
    </Box>
  );
}
