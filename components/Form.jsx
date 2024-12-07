import { ethers } from 'ethers';
import { WrapperBuilder } from '@redstone-finance/evm-connector';
const contractABI = require('../contract-abi.json');
const amznContractABI = require('../amzn-contract-abi.json');
const nasdaqContractABI = require('../nasdaq-contract-abi.json');
const spyContractABI = require('../spy-contract-abi.json');
const usdtContractABI = require("../usdt-contract-abi.json");

const usdtContractAddress = '0x2728DD8B45B788e26d12B13Db5A244e5403e7eda';

import React, { useState, useEffect } from 'react';

let provider;
let signer;

const Form = () => {
  const [usdtAmount, setUsdtAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [selectedStock, setSelectedStock] = useState('');
  const [stockAmount, setStockAmount] = useState('');

  const stocks = ['AAPL', 'NASDAQ'];

  // Mapping stock symbols to their respective contract addresses and ABIs
  const stockContracts = {
    AAPL: { address: "0x06e692951f08031423344228FF52b7544248b188", abi: contractABI },
    AMZN: { address: "0x1E30638373f2d76cA5AC17e58f08f03A6C1E9744", abi: amznContractABI },
    NASDAQ: { address: "0xA870c6739fC08dF98E2cB9F587a42C9347B83509", abi: nasdaqContractABI },
    SPY: { address: "0xc74E6d979CE9004FF8D92f6F0ea0654dF2E52e42", abi: spyContractABI },
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum && selectedStock) {
      const selectedStockContract = stockContracts[selectedStock];
      if (selectedStockContract) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        window.contract = new ethers.Contract(selectedStockContract.address, selectedStockContract.abi, signer);
        getUsdtBalance();
      } else {
        console.error('Selected stock does not have a corresponding contract.');
      }
    }
  }, [selectedStock]); // Re-run this effect when selectedStock changes
  

  const handleUsdtChange = (event) => {
    setUsdtAmount(event.target.value);
  };

  const handleStockChange = (event) => {
    setSelectedStock(event.target.value);
  };

  const handleStockAmountChange = (event) => {
    setStockAmount(event.target.value);
  };

  const approveUSDT = async () => {
    try {
      const usdtContract = new ethers.Contract(usdtContractAddress, usdtContractABI, signer);
      const tx = await usdtContract.approve(stockContracts[selectedStock]?.address, usdtAmount);
      await tx.wait();
      console.log('Approval transaction hash:', tx.hash);
    } catch (error) {
      console.log(error);
    }
  };

  const getUsdtBalance = async () => {
    try {
      const balance = await window.contract.s_USDTBalance(await signer.getAddress());
      setBalance(balance.toString());
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeposit = async () => {
    try {
      await approveUSDT();
      const tx = await window.contract.depositUSDT(usdtAmount);
      await tx.wait();
      await getUsdtBalance();
    } catch (error) {
      console.log(error);
    }
  };

  const handleWithdraw = async () => {
    try {
      const tx = await window.contract.withdrawUSDT(usdtAmount);
      await tx.wait();
      await getUsdtBalance();
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuy = async () => {
    try {
      const wrappedContract = WrapperBuilder.wrap(window.contract).usingDataService({
        dataFeeds: [selectedStock, "USDT"],
      });
      const tx = await wrappedContract.buyRStock(stockAmount);
      await tx.wait();
      await getUsdtBalance();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSell = async () => {
    try {
      const wrappedContract = WrapperBuilder.wrap(window.contract).usingDataService({
        dataFeeds: [selectedStock, "USDT"],
      });
      const tx = await wrappedContract.sellRStock(stockAmount);
      await tx.wait();
      await getUsdtBalance();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className='mx-10'>
      <div className='bg-blue-gradient w-full h-full rounded-md p-0.5 mt-10 relative'>
        <div className='absolute -top-4 -left-10 w-72 h-72 bg-[#33bbcf] rounded-full animate-blob1 filter blur-2xl opacity-[17%] animation-delay-4' />
        <div className='absolute top-10 -right-20 w-72 h-72 bg-[#9dedf0] rounded-full animate-blob2 filter blur-2xl opacity-[17%]' />
        <div className='absolute -bottom-8 left-10 w-72 h-72 bg-[#def9fa] rounded-full animate-blob3 filter blur-2xl opacity-[17%] animation-delay-2' />
        <div className='bg-black rounded-md text-white grid grid-rows-8 place-items-center p-[30px]' >

          <div className='flex mt-10 mb-2'>
            <label htmlFor="usdt" className='font-poppins text-[28px]'>USDT Amount:</label>
          </div>
          <div>
            <input type="text" id="usdt" value={usdtAmount} onChange={handleUsdtChange} required className='bg-gray-800 text-gray-300 placeholder-gray-500 border-gray-600 focus:ring-gray-400 focus:border-gray-400 rounded-md py-2 px-4 font-poppins w-full md:w-[35vw]' />
          </div>
          <div className='flex gap-6 mt-6'>
            <button type="button" onClick={handleDeposit} className='bg-blue-gradient px-4 py-2 rounded-md text-black ml-2 w-32'>Deposit</button>
            <button type="button" onClick={handleWithdraw} className='bg-blue-gradient px-4 py-2 rounded-md text-black ml-2 w-32'>Withdraw</button>
          </div>
          <div className='flex mt-10 mb-2'>
            <label className='font-poppins text-[28px]'>Balance: {balance} USDT</label>
          </div>

          <div className='flex mt-10 mb-2'>
            <label htmlFor="stocks" className='font-poppins text-xl'>Select Stock to buy:</label>
          </div>
          <div className='w-full flex justify-center'>
            <select id="stocks" value={selectedStock} onChange={handleStockChange} required className='bg-gray-800 text-gray-300 placeholder-gray-500 border-gray-600 focus:ring-gray-400 focus:border-gray-400 rounded-md py-2 px-4 font-poppins w-full md:w-[35vw]'>
              {stocks.map(stock => (
                <option key={stock} value={stock}>{stock}</option>
              ))}
            </select>
          </div>

          <div className='flex mt-10 mb-2'>
            <label htmlFor="stockAmount" className='font-poppins text-xl'>Stock Amount:</label>
          </div>
          <div className='w-full flex justify-center'>
            <input type="number" id="stockAmount" value={stockAmount} onChange={handleStockAmountChange} required className='bg-gray-800 text-gray-300 placeholder-gray-500 border-gray-600 focus:ring-gray-400 focus:border-gray-400 rounded-md py-2 px-4 font-poppins w-full md:w-[35vw]' />
          </div>

          <div className='flex mt-10'>
            <button type="button" onClick={handleBuy} className='bg-blue-gradient px-4 py-2 rounded-md text-black ml-2 w-32'>Buy</button>
            <button type="button" onClick={handleSell} className='bg-blue-gradient px-4 py-2 rounded-md text-black ml-2 w-32'>Sell</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Form;
