import React           from 'react'
import { useMetamask } from "use-metamask";

export default function Account() {
    const { metaState } = useMetamask();
    return (
        <p>
            With account{" "}
            <b>
            <code>{metaState.account[0]}</code>
            </b>
        </p>
    )
}
