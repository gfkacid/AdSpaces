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
      src={require("../../assets/img/AdSpacesIcon.png")}
      width={size}
      height={size}
      style={{ borderRadius: 999 }}
    />
  );
}
