import { useContext, useEffect, useState, useRef } from "react";
import { MetaStateContext, MetaDispatchContext } from "./store";

const chains = (chainId) => {
  if (!!Number(chainId) && chainId.length > 9) {
    return "local";
  }
  switch (chainId) {
    case "1":
      return "mainnet";
    case "3":
      return "ropsten";
    case "4":
      return "rinkeby";
    case "5":
      return "goerli";
    case "42":
      return "kovan";
    default:
      return `unknown`;
  }
};

const useMetamask = () => {
  const state = useContext(MetaStateContext);
  if (!("window" in globalThis)) {
    return {
      metaState: { ...state, isAvailable: false },
    };
  }

  const dispatch = useContext(MetaDispatchContext);
  const _isMounted = useRef(true);
  const _isConnectCalled = useRef(false);
  const [provider] = useState(window.ethereum);
  useEffect(() => {
    return () => {
      _isMounted.current = false;
    };
  }, []);

  const connect = async (Web3Interface, settings = {}) => {
    if (!provider) throw Error("Metamask is not available.");
    if (!Web3Interface)
      throw Error(
        "Web3 Provider is required. You can use either ethers.js or web3.js."
      );
    if (!_isMounted.current) throw Error("Component is not mounted.");
    if (_isConnectCalled.current) throw Error("Connect method already called.");
    _isConnectCalled.current = true;

    const _web3 = new Web3Interface(
      ...(Object.keys(settings).length ? [provider, settings] : [provider])
    );
    dispatch({ type: "SET_WEB3", payload: _web3 });

    await getAccounts({ requestPermission: true });
    await getChain();

    window.ethereum.on("accountsChanged", (accounts) => {
      if (!accounts.length) dispatch({ type: "SET_CONNECTED", payload: false });
      dispatch({ type: "SET_ACCOUNT", payload: accounts });
    });

    window.ethereum.on("chainChanged", (chainId) => {
      const _chainId = parseInt(chainId, 16).toString();
      const _chainInfo = { id: _chainId, name: chains(_chainId) };
      dispatch({ type: "SET_CHAIN", payload: _chainInfo });
    });

    _isConnectCalled.current = false;
  };

  const getAccounts = async (
    { requestPermission } = { requestPermission: false }
  ) => {
    if (!provider) {
      console.warn("Metamask is not available.");
      return;
    }
    try {
      const accounts = await provider.request({
        method: requestPermission ? "eth_requestAccounts" : "eth_accounts",
        params: [],
      });
      if (accounts.length) {
        dispatch({ type: "SET_CONNECTED", payload: true });
        dispatch({ type: "SET_ACCOUNT", payload: accounts });
      }
      return accounts;
    } catch (error) {
      throw Error(error);
    }
  };

  const getChain = async () => {
    if (!provider) {
      console.warn("Metamask is not available.");
      return;
    }
    try {
      const chainId = await provider.request({
        method: "net_version",
        params: [],
      });
      const _chainInfo = { id: chainId, name: chains(chainId) };
      dispatch({
        type: "SET_CHAIN",
        payload: _chainInfo,
      });
      return _chainInfo;
    } catch (error) {
      throw Error(error);
    }
  };

  return {
    connect,
    getAccounts,
    getChain,
    metaState: { ...state, isAvailable: !!provider },
  };
};

export default useMetamask;
