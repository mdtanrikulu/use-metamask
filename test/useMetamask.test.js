import React                                   from "react";
import { renderHook, act }                     from "@testing-library/react-hooks";
import useMetamask                             from "../src/useMetamask";
import { MetamaskStateProvider, typeStateMap } from "../src/store";

const toHex = (num) => num.toString(16).toUpperCase();

global.window = Object.create(window);
Object.defineProperty(window, "ethereum", {
  value: {
    request: ({ method, _params }) => {
      if (method === "net_version") return "1";
      if (method === "eth_requestAccounts") return ["0xSomething"];
    },
    on: (eventName, callback) => {
      if (eventName === "chainChanged") callback(toHex("1"));
      if (eventName === "accountsChanged") callback(["0xSomething"]);
    },
  },
});

describe("When Metamask Available", () => {
  const Web3Interface = jest.fn();
  let wrapper;
  
  beforeAll(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
    wrapper = ({ children }) => (
      <MetamaskStateProvider>{children}</MetamaskStateProvider>
    );
  });

  beforeEach(() => {
    Object.defineProperty(typeStateMap, "SET_ACCOUNT", {
      get: jest.fn(() => "account"),
    });
    global.window.ethereum.request = ({ method, _params }) => {
      if (method === "net_version") return "1";
      if (method === "eth_requestAccounts") return ["0xSomething"];
    };
    global.window.ethereum.on = (eventName, callback) => {
      if (eventName === "chainChanged") callback(toHex(1));
      if (eventName === "accountsChanged") callback(["0xSomething"]);
    };
  });

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
    global.window.ethereum.on = (eventName, callback) => {
      if (eventName === "chainChanged") callback(toHex(1000000000));
      if (eventName === "accountsChanged") callback(["0xSomething"]);
    };

    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.connect(Web3Interface);
    });
    expect(result.current.metaState.chain.id).toBe("1000000000");
  });

  test("should return ropsten chainName", async () => {
    global.window.ethereum.on = (eventName, callback) => {
      if (eventName === "chainChanged") callback(toHex(3));
      if (eventName === "accountsChanged") callback(["0xSomething"]);
    };

    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.connect(Web3Interface);
    });
    expect(result.current.metaState.chain.name).toBe("ropsten");
  });

  test("should return ropsten chainName", async () => {
    global.window.ethereum.on = (eventName, callback) => {
      if (eventName === "chainChanged") callback(toHex(4));
      if (eventName === "accountsChanged") callback(["0xSomething"]);
    };

    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.connect(Web3Interface);
    });
    expect(result.current.metaState.chain.name).toBe("rinkeby");
  });

  test("should return goerli chainName", async () => {
    global.window.ethereum.on = (eventName, callback) => {
      if (eventName === "chainChanged") callback(toHex(5));
      if (eventName === "accountsChanged") callback(["0xSomething"]);
    };

    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.connect(Web3Interface);
    });
    expect(result.current.metaState.chain.name).toBe("goerli");
  });

  test("should return kovan chainName", async () => {
    global.window.ethereum.on = (eventName, callback) => {
      if (eventName === "chainChanged") callback(toHex(42));
      if (eventName === "accountsChanged") callback(["0xSomething"]);
    };

    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.connect(Web3Interface);
    });
    expect(result.current.metaState.chain.name).toBe("kovan");
  });

  test("should return unknown chainName", async () => {
    global.window.ethereum.on = (eventName, callback) => {
      if (eventName === "chainChanged") callback(toHex(999));
      if (eventName === "accountsChanged") callback(["0xSomething"]);
    };

    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.connect(Web3Interface);
    });
    expect(result.current.metaState.chain.name).toBe("unknown");
  });

  test("shouldn't change any state, if action type is unknown", async () => {
    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.connect(Web3Interface);
    });
    expect(result.current.metaState.chain.id).toBe("1");
  });

  test("should throw error on getNetwork", async () => {
    global.window.ethereum.request = ({ method, _params }) => {
      if (method === "net_version") throw Error("unexpected error");
      if (method === "eth_requestAccounts") return ["0xSomething"];
    };

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
    global.window.ethereum.request = ({ method, _params }) => {
      if (method === "net_version") return "1";
      if (method === "eth_requestAccounts") throw Error("unexpected error");
    };

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
          "Web3 Provider is required. You can use either ethers.js or web3.js"
        );
      }
    });
  });

  test("should return false for isConnected if no account connected", async () => {
    global.window.ethereum.on = (eventName, callback) => {
      if (eventName === "chainChanged") callback(toHex(42));
      if (eventName === "accountsChanged") callback([]);
    };

    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.connect(Web3Interface);
    });
    expect(result.current.metaState.isConnected).toBe(false);
  });

  test("should be able to accept web3Interface options", async () => {
    const { result } = renderHook(() => useMetamask(), { wrapper });
    await act(async () => {
      await result.current.connect(Web3Interface, { test: "" });
      expect(result.current.metaState.isConnected).toBe(true);
    });
  });

  test("should not connect if there is no account available", async () => {
    global.window.ethereum.request = ({ method, _params }) => {
      if (method === "net_version") return "1";
      if (method === "eth_requestAccounts") return [];
    };
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
        expect(error.message).toEqual("Connect method already called");
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
        expect(error.message).toEqual("Component is not mounted");
      }
    });
  });
});
