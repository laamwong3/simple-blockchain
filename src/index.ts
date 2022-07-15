import SHA256 from "crypto-js/sha256";

class Transaction {
  fromAddress: string;
  toAddress: string;
  amount: number;

  constructor(fromAddress: string, toAddress: string, amount: number) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  timestamp: string;
  transaction: {};
  previousHash: string;
  currentHash: string;
  nonce: number;

  constructor(timestamp: string, transaction: {}, previousHash: string = "") {
    this.timestamp = timestamp;
    this.transaction = transaction;
    this.previousHash = previousHash;
    this.currentHash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash = (): string =>
    SHA256(
      this.previousHash + JSON.stringify(this.transaction) + this.nonce
    ).toString();

  mine = (difficulity: number) => {
    while (
      this.currentHash.substring(0, difficulity) !==
      Array(difficulity + 1).join("0")
    ) {
      this.nonce++;
      this.currentHash = this.calculateHash();
      console.log(this.currentHash);
    }
    console.log(`Block mined at ${this.currentHash}`);
  };
}

class Blockchain {
  chain: Block[];
  difficulty: number;
  pendingTransaction: {}[];
  miningReward: number;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransaction = [];
    this.miningReward = 100;
  }

  createGenesisBlock = (): Block =>
    new Block(new Date().toString(), "Genesis Block", "0");

  getLatestBlock = (): Block => this.chain[this.chain.length - 1];

  minePendingTransaction = () => {};

  // addBlock = (newBlock: Block) => {
  //   newBlock.previousHash = this.getLatestBlock().currentHash;
  //   newBlock.mine(this.difficulty);
  //   // newBlock.currentHash = newBlock.calculateHash();
  //   this.chain.push(newBlock);
  // };

  validateChain = (): boolean => {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.currentHash !== currentBlock.calculateHash())
        return false;

      if (currentBlock.previousHash !== previousBlock.currentHash) return false;
    }
    return true;
  };
}

export { Block, Blockchain };
