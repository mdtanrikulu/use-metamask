import React                                   from "react";
import { renderHook, act, cleanup }            from "@testing-library/react-hooks";
import useMetamask                             from "../src/useMetamask";
import { MetamaskStateProvider, typeStateMap } from "../src/store";

const toHex = (num) => num.toString(16).toUpperCase();

describe("When Metamask Available", () => {
  const Web3Interface = jest.fn();
  let wrapper, _request = jest.fn(), _on = jest.fn();

  const modifyRequest = (chainId = 1, accounts = ["0xSomething"]) => {
    window.ethereum.request.mockImplementation(({ method, _ }) => {
      if (method === "eth_chainId"){
        if (chainId instanceof Error) throw chainId;
        return chainId.toString();
      }
      if (method === "eth_requestAccounts") {
        if (accounts instanceof Error) throw accounts;
        return accounts;
      }
      console.log("method", method);
      if (method === "eth_accounts") {
        if (accounts instanceof Error) throw accounts;
        accounts = ["0xSomethingWithoutPermission"]
        return accounts;
      }
    })
  }
  const modifyListener = (chainId = 1, accounts = ["0xSomething"]) => {
    window.ethereum.on.mockImplementation((eventName, callback) => {
      if (eventName === "chainChanged")    callback(toHex(chainId));
      if (eventName === "accountsChanged") callback(accounts);
    });
  }
  
  beforeAll(() => {
    global.window = Object.create(window);
    window.ethereum = {
      request: _request,
      on: _on
    };
    jest.spyOn(console, "warn").mockImplementation(() => {});
    wrapper = ({ children }) => (
      <MetamaskStateProvider>{children}</MetamaskStateProvider>
    );
  });

  beforeEach(() => {
    Object.defineProperty(typeStateMap, "SET_ACCOUNT", {
      get: jest.fn(() => "account"),
    });
    modifyRequest();
    modifyListener();
  });

  afterAll(() => cleanup())

  test("isConnected should be false", () => {
    const { result } = renderHook(() => useMetamask(), { wrapper });
    expect(result.current.metaState.isConnected).toBe(false);
  });

  test("should connect", async () => {
    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.connect(Web3Interface);
    });
    expect(result.current.metaState.isConnected).toBe(true);
  });

  test("should return address", async () => {
    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.connect(Web3Interface);
    });
    expect(result.current.metaState.account).toContain("0xSomething");
  });

  test("should return chainId", async () => {
    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.connect(Web3Interface);
    });
    expect(result.current.metaState.chain.id).toBe("1");
  });

  test("should return local chainId", async () => {
    modifyListener(1000000000);

    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.connect(Web3Interface);
    });
    expect(result.current.metaState.chain.id).toBe("1000000000");
  });

  test("should return ropsten chainName", async () => {
    modifyListener(3);

    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.connect(Web3Interface);
    });
    expect(result.current.metaState.chain.name).toBe("ropsten");
  });

  test("should return rinkeby chainName", async () => {
    modifyListener(4);

    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.connect(Web3Interface);
    });
    expect(result.current.metaState.chain.name).toBe("rinkeby");
  });

  test("should return goerli chainName", async () => {
    modifyListener(5);

    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.connect(Web3Interface);
    });
    expect(result.current.metaState.chain.name).toBe("goerli");
  });

  test("should return kovan chainName", async () => {
    modifyListener(42);

    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.connect(Web3Interface);
    });
    expect(result.current.metaState.chain.name).toBe("kovan");
  });

  test("should return unknown chainName", async () => {
    modifyListener(999);

    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.connect(Web3Interface);
    });
    expect(result.current.metaState.chain.name).toBe("unknown");
  });

  test("should not change any state, if action type is unknown", async () => {
    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.connect(Web3Interface);
    });
    expect(result.current.metaState.chain.id).toBe("1");
  });

  test("should throw error on getNetwork", async () => {
    modifyRequest(Error("unexpected error"));

    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      try {
        await result.current.connect(Web3Interface);
      } catch (error) {
        expect(error.message).toEqual("Error: unexpected error");
      }
    });
  });

  test("should throw error on getAccount", async () => {
    modifyRequest(1, Error("unexpected error"));

    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      try {
        await result.current.connect(Web3Interface);
      } catch (error) {
        expect(error.message).toEqual("Error: unexpected error");
      }
    });
  });

  test("should throw error for missing Web3Interface", async () => {
    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      try {
        await result.current.connect();
      } catch (error) {
        expect(error.message).toEqual(
          "Web3 Provider is required. You can use either ethers.js or web3.js."
        );
      }
    });
  });

  test("should be able to accept web3Interface options", async () => {
    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.connect(Web3Interface, { test: "" });
      expect(result.current.metaState.isConnected).toBe(true);
    });
  });

  test("should not connect if there is no account available", async () => {
    modifyRequest(1, []);
    modifyListener(1, []);
    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.connect(Web3Interface);
      expect(result.current.metaState.isConnected).toBe(false);
    });
  });

  test("should change connect status if account disconnected", async () => {
    modifyRequest(1, ["0xSomething"]);
    modifyListener(1, []);
    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.connect(Web3Interface);
      expect(result.current.metaState.isConnected).toBe(false);
    });
  });

  test("should raise warning if given action is null/undefined", async () => {
    // store.js
    Object.defineProperty(typeStateMap, "SET_ACCOUNT", {
      get: jest.fn(() => null),
    });

    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.connect(Web3Interface);
      expect(result.current.metaState.isConnected).toBe(true);
    });
  });

  test("should raise error if connect method re-called before the one resolved", async () => {
    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      try {
        result.current.connect(Web3Interface);
        await result.current.connect(Web3Interface);
      } catch (error) {
        expect(error.message).toEqual("Connect method already called.");
      }
    });
  });

  test("should raise an error if component unmounted earlier", async () => {
    jest.spyOn(React, "useRef").mockReturnValue({
      current: false,
    });
    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      try {
        await result.current.connect(Web3Interface);
      } catch (error) {
        expect(error.message).toEqual("Component is not mounted.");
      }
    });
  });

  test("getAccounts should call the account without Metamask permission", async () => {
    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.getAccounts();
      expect(result.current.metaState.isConnected).toBe(true);
      expect(result.current.metaState.account).toEqual(["0xSomethingWithoutPermission"]);
    });
  });

  test("getChain should return current chain information", async () => {
    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.getChain();
      expect(result.current.metaState.chain).toEqual({id: "1", name: "mainnet"});
    });
  });
});

describe("When Metamask is not Available", () => {
  const Web3Interface = jest.fn();
  let wrapper;
  
  beforeAll(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
    window.ethereum = undefined;
    wrapper = ({ children }) => (
      <MetamaskStateProvider>{children}</MetamaskStateProvider>
    );
  });
  test("isAvailable should be false", () => {
    const { result } = renderHook(() => useMetamask(), { wrapper });
    expect(result.current.metaState.isAvailable).toBe(false);
  });

  test("should raise error when connect", async () => {
    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      try {
        await result.current.connect(Web3Interface);
      } catch (error) {
        expect(error.message).toEqual("Metamask is not available.");
      }
    });
  });

  test("getAccounts should return with a warning", async () => {
    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.getAccounts();
      expect(result.current.metaState.account).toEqual([]);
    });
  });

  test("getChain should return empty chain information", async () => {
    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.getChain();
      expect(result.current.metaState.chain).toEqual({id: null, name: ""});
    });
  });
});
