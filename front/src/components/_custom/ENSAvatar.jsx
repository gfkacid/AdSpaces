import { useEnsAvatar } from "wagmi";
import { Image } from "@chakra-ui/react";

export default function ENSAvatar(prop) {
  const { addressForImage } = prop;
  const { data, isError, isLoading } = useEnsAvatar({
    addressOrName: addressForImage,
  });

  return !isError ? (
    <Image src={data} style={{ borderRadius: 999 }} />
  ) : (
    <Image
      src="static/media/Nft1.0fea34cca5aed6cad72b.png"
      style={{ borderRadius: 999 }}
    />
  );
}
