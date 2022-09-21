import { useAccount, useEnsAvatar } from "wagmi";

export default function ENSAvatar() {
  const { address: userAddress, isConnected } = useAccount();

  const { data, isError, isLoading } = useEnsAvatar({
    addressOrName: userAddress,
  });

  return data;
}
