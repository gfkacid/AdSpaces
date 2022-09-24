<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/gfkacid/AdSpaces">
    <img src="img/AdSpacesIcon.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">AdSpaces</h3>

  <p align="center">
    A p2p crypto-native advertising platform | ETHOnline 2022 entry
    <br />
    ·
    <a href="https://github.com/gfkacid/AdSpaces/issues">Report Bug</a>
    ·
    <a href="https://github.com/gfkacid/AdSpaces/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#content">Content</a>
      <ul>
        <li><a href="#contracts">Contracts</a></li>
        <li><a href="#frontend">Frontend</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]]()

Our goal is to create a crypto-native web traffic monetization platform, honoring the principles of web3: decentralization, self-custody & composability. Thus we develop a web3 dapp with as many components completely decentralized as possible, keeping rewards functionality on-chain to enable interoperability.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

We are using the following tools:

- [Solidity](https://soliditylang.org/)
- [Hardhat](https://hardhat.org/)
- [ReactJS](https://reactjs.org/)
- [IPFS](https://ipfs.tech/)
- [Tableland](https://tableland.xyz)
- [Optimism](https://optimism.io)
- [Superfluid](https://superfluid.finance/)
- [Chakra UI](https://chakra-ui.com/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTENT -->

## Content

This project consists in general of two components: The smart contracts and the frontend.

### Contracts

All the contracts used for this project can be found in the [/contracts](https://github.com/gfkacid/AdSpaces/contracts) folder. We have made two contracts: The AdSpaceFactory and the AdSpace contract itself. The AdSpaces will be deployed only by the Factory on user request.
An example of a deployed AdSpaceFactory can be found on Optimism Goerli at [0x2e9...8B4DB](https://goerli-optimism.etherscan.io/address/0x2e9d515864d86b4462211531e9462ceba138b4db), the ABI for contract interaction at [/front/src/variables/AdSpaceFactory.json](https://github.com/gfkacid/AdSpaces/tree/master/front/src/variables/AdSpaceFactory.json).

#### AdSpaceFactory

When the factory gets deployed it creates three tables in Tableland: AdSpaces, Campaigns and Deals. This contract handles all requests for writing into the database. Nearly every write contract function on the factory results in a INSERT or UPDATE statement on the database.
There are three main functions:

1. createAdSpace

   Deploys an AdSpace contract and writes a new entry into the AdSpace Tableland table. The constructor args for the AdSpace need to be passed.

2. createCampaign

   Writes a new entry into the Campaigns Tableland table.

3. createDeal

   Writes a new entry into the Deals Tableland table and updates the corresponding AdSpace Tableland entry.

#### AdSpace

tba

### Frontend

To set up a local version of the frontend follow this steps.

1. Clone the repo

```sh
git clone https://github.com/gfkacid/AdSpaces.git
```

2. Change directory to frontend folder

```sh
cd AdSpaces/front
```

3. Install NPM packages with NPM or Yarn

```sh
npm install
```

```sh
yarn
```

4. Start the frontend

```sh
yarn start
```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. But for the duration of the ETHOnline Hackathon '22 contributions outside of the team can not be accepted.

The members of the team for the Hackathon are:

- [acid](https://github.com/gfkacid)
- [mme](https://github.com/mme022)
- [Riki]()
- [Dysan](https://github.com/dysntr)

Any contributions you make after 28/09/2022 are **greatly appreciated**.
If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Project Link: [https://github.com/gfkacid/AdSpaces](https://github.com/gfkacid/AdSpaces)

acid:

- [@twitter?]

mme:

- twitter: [@mme022](https://twitter.com/mme022)
- discord: **mme#9065**

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/gfkacid/AdSpaces.svg?style=for-the-badge
[contributors-url]: https://github.com/gfkacid/AdSpaces/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/gfkacid/AdSpaces.svg?style=for-the-badge
[forks-url]: https://github.com/gfkacid/AdSpaces/network/members
[stars-shield]: https://img.shields.io/github/stars/gfkacid/AdSpaces.svg?style=for-the-badge
[stars-url]: https://github.com/gfkacid/AdSpaces/stargazers
[issues-shield]: https://img.shields.io/github/issues/gfkacid/AdSpaces.svg?style=for-the-badge
[issues-url]: https://github.com/gfkacid/AdSpaces/issues
[license-shield]: https://img.shields.io/github/license/gfkacid/AdSpaces.svg?style=for-the-badge
[license-url]: https://github.com/gfkacid/AdSpaces/blob/master/LICENSE.txt
[product-screenshot]: img/Screenshot.png
