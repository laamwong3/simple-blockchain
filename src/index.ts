import SHA256 from "crypto-js/sha256";

class Block {
  index: number;
  timestamp: string;
  data: string;
  previousHash: string;
  currentHash: string;

  constructor(
    index: number,
    timestamp: string,
    data: string,
    previousHash: string
  ) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.currentHash = this.calculateHash();
  }

  calculateHash = (): string =>
    SHA256(
      this.index.toString() + this.previousHash + JSON.stringify(this.data)
    ).toString();
}

class Blockchain {
  chain: Block[];
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock = (): Block =>
    new Block(0, new Date().toString(), "Genesis Block", "0");
}
