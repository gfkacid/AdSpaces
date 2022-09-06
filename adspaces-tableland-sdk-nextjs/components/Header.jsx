import { ConnectButton } from "@web3uikit/web3";
import { CryptoLogos } from "@web3uikit/core";

export default function Header() {
  return (
    <div className="p-5 border-b-2 flex flex-row">
      <CryptoLogos chain="ethereum" size="48px" />
      <h1 className="py-4 px-4 ml-auto font-blog text-3xl">
        Welcome to the Tableland testgui!
      </h1>
      <div className="ml-auto py-2 px-4">
        <ConnectButton moralisAuth={false} />
      </div>
    </div>
  );
}
