import React from 'react'

export default function Web3InterfaceSelector({ web3Handler }) {
    return (
        <div>
            We use{" "}
            <select onChange={web3Handler}>
                <option value="ethers">Ethers.js</option>
                <option value="web3">Web3.js</option>
            </select> as Web3 Interface.
        </div>
    )
}
