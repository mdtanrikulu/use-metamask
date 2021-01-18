[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
[![Codecov][codecov-shield]][codecov-url]



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/mdtanrikulu/use-metamask">
    <img src="example/public/logo512.png" alt="Logo" width="250" height="250">
  </a>

  <h3 align="center">useMetamask React Hook</h3>

  <p align="center">
    An awesome React Hook to jumpstart your projects!
    <br />
    <a href="https://github.com/mdtanrikulu/use-metamask"><strong>Explore the docs » (Not ready yet)</strong></a>
    <br />
    <br />
    <a href="https://mdtanrikulu.github.io/use-metamask">View Demo</a>
    ·
    <a href="https://github.com/mdtanrikulu/use-metamask/issues">Report Bug</a>
    ·
    <a href="https://github.com/mdtanrikulu/use-metamask/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]]()

There are many great Web3 tools available on GitHub, however, I didn't find one that really suit my needs, so I created this simple React Hook. I want to connect to the Metamask as quick as possible from any component, without rewriting all network and account change logic. -- I think this is it.

Here's why:
* Your time should be focused on creating your project. A project that solves a problem and helps others
* You shouldn't be implementing the same logic over and over from scratch
* You shouldn't need enormous tool boxes when you only want is connection to the wallet.

Of course, no one hook will serve all projects since your needs may be different. So I'll be adding more in the near future. You may also suggest changes by forking this repo and creating a pull request or opening an issue. Thanks in advance to all the people who wants put more into the project!


<!-- GETTING STARTED -->
## Getting Started

### Install via npmjs

Easiest option is installing the package from npm with;
```bash
# via npm
npm i use-metamask
# or via yarn
yarn add use-metamask
```

But if you would like to build a package locally, follow the below;

### Build from source

You'll need some prerequisites in order to be able build the package.
* npm > 12.13.0 _(best installing via nvm)_
  ```sh
  npm install npm@latest -g
  ```
* yarn _(optional)_
  ```sh
  https://classic.yarnpkg.com/en/docs/install
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/mdtanrikulu/use-metamask.git
   ```
2. Install NPM packages
   ```sh
   # via npm
   npm install
   # via yarn
   yarn
   ```
3. Build the Package
   ```sh
   # via npm
   npm run build
   # via yarn
   yarn build
   ```
4. Prepare Tar Package
   ```sh
   npm pack
   # now the package is ready to use, you can simply do "npm i ./pathoftarfile/use-metamask-1.0.0.tgz" in your project
   ```



<!-- USAGE EXAMPLES -->
## Usage

1. Wrap your App component with MetamaskStateProvider
```JS
import React                     from 'react';
import ReactDOM                  from 'react-dom';
import { MetamaskStateProvider } from "use-metamask";
import App                       from './App';

ReactDOM.render(
    <MetamaskStateProvider>
      <App />
    </MetamaskStateProvider>
  document.getElementById('root')
);
```

2. import your hook to your App component
```JS
import { useEffect, useState } from "react";
import { useMetamask }         from "use-metamask";
// you can use any web3 interface
// import { ethers }           from "ethers";
// import Web3                 from "web3";

function App() {
  const { connect, metaState } = useMetamask();
  //...
```

3. call `connect` async method with your favorite Web3Interface library

```JS
//...
function App() {
  const { connect, metaState } = useMetamask();

  // instead of calling it from useEffect, you can also call connect method from button click handler
  useEffect(() => {
    if (!metaState.isConnected) {
      (async () => {
        try {
          await connect(Web3);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, []);

```

4. Now you can reach all information under `metaState` object; _(they will be updated in case of any change in metamask)_
```JS
// all connected Metamask accounts 
// account: Array [ "0x68bbaeb98ac22e9e6516fb35c8d27ded05bc0607" ]

// current connected chain id and name 
// chain: Object { id: "4", name: "rinkeby" }

// shows if Metamask Extension is whether exist or not in the user's browser
// isAvailable: true

// shows if connection is established with at least one metamask account
// isConnected: true

// web3 instance of Web3 interface you provided
// web3: Object { _isProvider: true, anyNetwork: true, _maxInternalBlockNumber: -1024, … }
```

**Note:** If you would like to check if Metamask is whether already connected to your dapp or not, you can call `getAccounts` method beforehand.

You can also get chain information by calling `getChain` method, without a need of calling `connect` method.

```js
const { connect, getAccounts, getChain, metaState } = useMetamask();

useEffect(() => {
    if (metaState.isAvailable) {
      (async () => {
        try {
          /* you can get the information directly 
           * by assigning them to a variable, 
           * or from metaState.account and metaState.chain 
          */
          let account = await getAccounts();
          let chain = await getChain();
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, []);
```

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/mdtanrikulu/use-metamask/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Muhammed Tanrikulu - [@tanrikuIu](https://twitter.com/tanrikuIu) - md.tanrikulu@gmail.com

Project Link: [https://github.com/mdtanrikulu/use-metamask](https://github.com/mdtanrikulu/use-metamask)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [Metamask](https://metamask.io/)
* [Img Shields](https://shields.io)
* [Choose an Open Source License](https://choosealicense.com)
* [GitHub Pages](https://pages.github.com)





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/mdtanrikulu/use-metamask.svg?style=for-the-badge
[contributors-url]: https://github.com/mdtanrikulu/use-metamask/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/mdtanrikulu/use-metamask.svg?style=for-the-badge
[forks-url]: https://github.com/mdtanrikulu/use-metamask/network/members
[stars-shield]: https://img.shields.io/github/stars/mdtanrikulu/use-metamask.svg?style=for-the-badge
[stars-url]: https://github.com/mdtanrikulu/use-metamask/stargazers
[issues-shield]: https://img.shields.io/github/issues/mdtanrikulu/use-metamask.svg?style=for-the-badge
[issues-url]: https://github.com/mdtanrikulu/use-metamask/issues
[license-shield]: https://img.shields.io/github/license/mdtanrikulu/use-metamask.svg?style=for-the-badge
[license-url]: https://github.com/mdtanrikulu/use-metamask/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/mdtanrikulu
[codecov-shield]: https://img.shields.io/codecov/c/github/mdtanrikulu/use-metamask/main?style=for-the-badge
[codecov-url]: https://codecov.io/gh/mdtanrikulu/use-metamask/
[product-screenshot]: example/public/screenshot.png
