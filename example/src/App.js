import { useEffect }           from "react";
import { useMetamask }         from "use-metamask";
import { ethers }              from "ethers";
import Web3                    from "web3";

import Balance                 from "./Balance";
import logo                    from "./assets/logo.svg";
import styles                  from "./App.module.css";

function App() {
  const { connect, metaState } = useMetamask();

  useEffect(() => {
    if (!metaState.isConnected) {
      (async () => {
        try {
          await connect(ethers.providers.Web3Provider, "any");
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, []);

  return (
    <div className={styles.App}>
      <h3>
        <code>
          const {"{"}
          <span className={styles.codeObject}>{"connect, metaState"}</span>
          {"}"} = <span className={styles.codeFunction}>useMetamask();</span>
        </code>
      </h3>
      <div className={styles.logo}>
        <img src={logo} alt="useMetamask" />
      </div>
      <div>
        {!metaState.isConnected ? (
          `Đapp haven't connected yet`
        ) : (
          <>
            <p>
              Đapp connected to the{" "}
              <b>
                <code>
                  {metaState.chain.name} - (chain id: {metaState.chain.id})
                </code>
              </b>
            </p>
            <p>
              With account{" "}
              <b>
                <code>{metaState.account[0]}</code>
              </b>
            </p>
            <Balance />
          </>
        )}
      </div>
      <div className={styles.footer}>
        I am developed by{" "}
        <code>
        <a href="https://github.com/mdtanrikulu">mdt.</a>
        </code>{" "}
        &nbsp;&nbsp;|&nbsp;&nbsp; Here is my{" "}
        <code>
          <a href="https://github.com/mdtanrikulu/use-metamask/tree/main/example">source code.</a>
        </code>
      </div>
    </div>
  );
}

export default App;
