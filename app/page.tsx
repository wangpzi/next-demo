"use client";
import React, { useState } from "react";
import { ethers } from "ethers";
import './pages/index.css'

const contractABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "string", name: "name", type: "string" },
      { indexed: false, internalType: "uint256", name: "age", type: "uint256" }
    ],
    name: "Instructor",
    type: "event"
  },
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "uint256", name: "_age", type: "uint256" }
    ],
    name: "setInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "sayHi",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [],
    name: "getInfo",
    outputs: [
      { internalType: "string", name: "", type: "string" },
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  }
];

type ContractInstance = ethers.Contract | null;

type WalletInfo = {
  address: string;
  balance: string;
};

const InfoContract: React.FC = () => {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [contract, setContract] = useState<ContractInstance>(null);
  const [contractAddress, setContractAddress] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [info, setInfo] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const showStatus = (message: string) => {
    setStatus(message);
    setTimeout(() => setStatus(""), 3000);
  };

  const connectWallet = async () => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      console.error("MetaMask 未安装");
    }

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balance = ethers.formatEther(await provider.getBalance(address));

      setWallet({ address, balance: `${balance} ETH` });
    } catch (error) {
      showStatus("连接失败");
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    setContract(null);
  };

  const initializeContract = async () => {
    if (!ethers.isAddress(contractAddress)) {
      showStatus("请输入有效的合约地址");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const instance = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(instance);
      showStatus("合约初始化成功！");
    } catch (error) {
      showStatus("合约初始化失败");
    }
  };

  const setInfoHandler = async () => {
    if (!contract) {
      showStatus("请先初始化合约");
      return;
    }
    try {
      const tx = await contract.setInfo(name, Number(age));
      await tx.wait();
      showStatus("信息设置成功！");
    } catch (error) {
      showStatus("设置信息失败");
    }
  };

  const getInfoHandler = async () => {
    if (!contract) {
      showStatus("请先初始化合约");
      return;
    }
    try {
      const [name, age] = await contract.getInfo();
      setInfo(`名字: ${name}, 年龄: ${age}`);
    } catch (error) {
      showStatus("获取信息失败");
    }
  };

  return (
    <div className="container">
      <button onClick={wallet ? disconnectWallet : connectWallet}>
        {wallet ? "断开连接" : "连接 MetaMask"}
      </button>

      {wallet && (
        <div>
          <p>钱包地址: {wallet.address}</p>
          <p>余额: {wallet.balance}</p>
        </div>
      )}

      <input
        type="text"
        placeholder="输入合约地址"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
      />
      <button onClick={initializeContract}>初始化合约</button>

      {contract && (
        <div>
          <input
            type="text"
            placeholder="名字"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="年龄"
            value={age}
            onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
          />
          <button onClick={setInfoHandler}>设置信息</button>
          <button onClick={getInfoHandler}>获取信息</button>
          {info && <p>{info}</p>}
        </div>
      )}
      {status && <p>{status}</p>}
    </div>
  );
};

export default InfoContract;
