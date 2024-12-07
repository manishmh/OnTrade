import { useState, useEffect } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { connectWallet, getCurrentWalletConnected } from "@/utils/interact";
import Image from 'next/image'

const Connect = () => {
  const [walletAddress, setWallet] = useState("");

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);

        } else {
          setWallet("");

        }
      });
    } 
  }

  useEffect(() => {
    async function fetchData() {
      const { address } = await getCurrentWalletConnected();
      setWallet(address);

  
      addWalletListener();
    }
  
    fetchData();
  }, []);
  

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();

    setWallet(walletResponse.address);
  };

  return (
    <ConnectButton /> 
  );
};

export default Connect;