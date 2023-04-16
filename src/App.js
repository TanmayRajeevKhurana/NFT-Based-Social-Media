import React, { useState, useEffect } from "react";
import Web3 from "web3";
import NFTContract from "./contracts/NFT.json";
import Navbar from "./components/Navbar";

function App() {
  const [nftName, setNftName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [nftImage, setNftImage] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [nft, setNft] = useState({});

  useEffect(() => {
    loadBlockchainData();
  }, []);

  async function loadBlockchainData() {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = NFTContract.networks[networkId];
        const nftInstance = new web3.eth.Contract(
          NFTContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        const balanceOf = await nftInstance.methods.balanceOf(accounts[0]).call();
        setTokenId(balanceOf);
        const nft = await nftInstance.methods.getNFT(balanceOf).call();
        setNft(nft);
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function createNFT() {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = NFTContract.networks[networkId];
        const nftInstance = new web3.eth.Contract(
          NFTContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        await nftInstance.methods
          .createNFT(nftName, nftDescription, nftImage)
          .send({ from: accounts[0] });
        const balanceOf = await nftInstance.methods.balanceOf(accounts[0]).call();
        setTokenId(balanceOf);
        const nft = await nftInstance.methods.getNFT(balanceOf).call();
        setNft(nft);
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <>
    <Navbar/>
    
    <div>
      <h1>Create NFT</h1>
      <form onSubmit={(e) => { e.preventDefault(); createNFT(); }}>
        <label>Name:</label>
        <input type="text" value={nftName} onChange={(e) => setNftName(e.target.value)} />
        <label>Description:</label>
        <input type="text" value={nftDescription} onChange={(e) => setNftDescription(e.target.value)} />
        <label>Image:</label>
        <input type="text" value={nftImage} onChange={(e) => setNftImage(e.target.value)} />
        <button type="submit">Create NFT</button>
      </form>
      <div>
        <h2>NFT Info</h2>
        <p>Token ID: {tokenId}</p>
        <p>Name: {nft.name}</p>
        <p>Description: {nft.description}</p>
        <p>Image: {nft.image}</p>
      </div>
    </div>
    </>
  );
}

export default App;