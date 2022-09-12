/* eslint-disable jsx-a11y/alt-text */

import { Image } from "@chakra-ui/react";

export default function CustomAvatar({ address, ensImage, size }) {
  return ensImage ? (
    <Image
      src={ensImage}
      width={size}
      height={size}
      style={{ borderRadius: 999 }}
    />
  ) : (
    <Image
      src="static/media/Nft1.0fea34cca5aed6cad72b.png"
      width={size}
      height={size}
      style={{ borderRadius: 999 }}
    />
  );
}
