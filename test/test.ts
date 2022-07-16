import { Block, Blockchain, Transaction } from "../src/blockchain";
import { expect } from "chai";
import { ec } from "elliptic";
const ecObject = new ec("secp256k1");

//public key is 042551be94fe865edd84145b42d7b57b1a6880e7097d14cc607b6ab94a5cba7b78215e56b0b00cb2a4cf1d4fba99d9c0a19c18ec932491e3355184c1b26819c9b8
//private key is 8386c7b84c9711bb8662b4ca249f5e20fa672aab9e79c4c37c776f9b3c97dcbe

const myKey = ecObject.keyFromPrivate(
  "8386c7b84c9711bb8662b4ca249f5e20fa672aab9e79c4c37c776f9b3c97dcbe"
);
const myWalletAddress = myKey.getPublic("hex");
// console.log(my);

let myChain = new Blockchain();

const tx = new Transaction(myWalletAddress, "receiver", 50);
tx.signTransaction(myKey);
myChain.addTransaction(tx);

myChain.minePendingTransaction(myWalletAddress);
const balance = myChain.getBalanceOfAddress(myWalletAddress);

console.log(`my balance is ${balance}`);
myChain.chain[1].transaction[0].amount = 10;
console.log(`chain is ${myChain.validateChain()}`);

// describe("Testing Mocha", () => {
//   it("Should mine a block", () => {
//     let myChain = new Blockchain();
//     myChain.createTransaction(new Transaction("add1", "add2", 100));
//     myChain.createTransaction(new Transaction("add2", "add1", 50));
//     myChain.minePendingTransaction("miner");
//     myChain.minePendingTransaction("miner");
//     expect(myChain.getBalanceOfAddress("miner")).to.be.equal(100);
//   });
// });

// let myChain = new Blockchain();
// myChain.addTransaction(new Transaction("add1", "add2", 100));
// myChain.addTransaction(new Transaction("add2", "add1", 50));
// myChain.minePendingTransaction("miner");
// myChain.minePendingTransaction("miner");

// console.log(myChain.getBalanceOfAddress("add1"));
// console.log(myChain.getBalanceOfAddress("add2"));
// console.log(myChain.getBalanceOfAddress("miner"));

// myChain.addBlock(new Block(1, new Date().toString(), { hello: "hi" }));
// myChain.addBlock(new Block(2, new Date().toString(), "test"));
// console.log(myChain.validateChain());
// myChain.chain[1].data = "hey";
// myChain.chain[1].currentHash = myChain.chain[1].calculateHash();
// console.log(myChain.validateChain());
// console.log(JSON.stringify(myChain, null, 2));
// console.log(Array(5).join("0"));

// const str = "abcdef";
// console.log(str.substring(0, 4));
