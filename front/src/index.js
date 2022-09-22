import React from "react";
import ReactDOM from "react-dom";
import "assets/css/App.css";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import AuthLayout from "layouts/auth";
import AdminLayout from "layouts/admin";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/theme";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import CustomAvatar from "./components/_custom/CustomAvatar";
import { jsonRpcProvider} from "wagmi/providers/jsonRpc";

const { chains, provider } = configureChains(
  [chain.optimismGoerli],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://flashy-omniscient-slug.optimism-goerli.discover.quiknode.pro/7a2fdffa24bf4fd891bd9c77fdaa6325b0041dbb/`,
      }),
    }),
    publicProvider(),
  ]
);
const { connectors } = getDefaultWallets({
  appName: "AdSpaces",
  chains,
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

ReactDOM.render(
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider
      chains={chains}
      avatar={CustomAvatar}
      theme={lightTheme({ ...lightTheme.accentColors.purple })}
    >
      <ChakraProvider theme={theme}>
        <React.StrictMode>
          <ThemeEditorProvider>
            <HashRouter>
              <Switch>
                <Route path={`/admin`} component={AdminLayout} />
                <Redirect from="/" to="/admin" />
              </Switch>
            </HashRouter>
          </ThemeEditorProvider>
        </React.StrictMode>
      </ChakraProvider>
    </RainbowKitProvider>
  </WagmiConfig>,
  document.getElementById("root")
);
