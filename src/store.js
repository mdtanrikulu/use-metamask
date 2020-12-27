import React, { createContext, useReducer } from "react";

const typeStateMap = {
  SET_ACCOUNT  : "account",
  SET_CHAIN    : "chain",
  SET_CONNECTED: "isConnected",
  SET_WEB3     : "web3",
};
const initialState = {
  account    : [],
  chain      : { id: null, name: "" },
  isConnected: false,
  web3       : null,
};
const reducer = (state, action) => {
  const stateName = typeStateMap[action.type];
  if (!stateName) {
    console.warn(`Unkown action type: ${action.type}`);
    return state;
  }
  return { ...state, [stateName]: action.payload };
}

const MetaStateContext      = createContext(initialState);
const MetaDispatchContext   = createContext();
const MetamaskStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <MetaDispatchContext.Provider value={dispatch}>
        <MetaStateContext.Provider value={state}>
            {children}
        </MetaStateContext.Provider>
    </MetaDispatchContext.Provider>
  );
};

export {
  typeStateMap,
  MetaStateContext,
  MetaDispatchContext,
  MetamaskStateProvider
}
