import Web3 from "web3";
import contract from "@truffle/contract";

import NFTContract from "./contracts/NFT.sol";

const web3 = new Web3(Web3.givenProvider);

const NFT = contract(NFTContract);
NFT.setProvider(web3.currentProvider);

export { NFT };
