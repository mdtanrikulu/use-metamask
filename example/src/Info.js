import React   from 'react'
import Account from "./Account";
import Balance from "./Balance";
import Chain   from "./Chain";
import Web3InterfaceSelector from "./Web3InterfaceSelector";

export default function Info({ state, web3Handler }) {
    return (
        <div>
        {!state.isConnected ? (
          `Đapp haven't connected yet`
        ) : (
          <>
            <Web3InterfaceSelector web3Handler={web3Handler}/>
            <Chain/>
            <Account/>
            <Balance />
          </>
        )}
      </div>
    )
}
