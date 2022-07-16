import { ec } from "elliptic";
import SHA256 from "crypto-js/sha256";

const ecObject = new ec("secp256k1");

class Transaction {
  fromAddress: string | null;
  toAddress: string;
  amount: number;
  signature: string | null = null;

  constructor(fromAddress: string | null, toAddress: string, amount: number) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  calculateHash = () =>
    SHA256(this.fromAddress + this.toAddress + this.amount).toString();

  signTransaction = (signingKey: ec.KeyPair) => {
    if (signingKey.getPublic("hex") !== this.fromAddress) {
      throw new Error("Has to be signed by address owner");
    }
    const tx = this.calculateHash();
    const signature = signingKey.sign(tx, "base64");
    this.signature = signature.toDER("hex");
  };

  validateSignature = () => {
    if (this.fromAddress === null) return true;
    if (this.signature === null || this.signature.length === 0) {
      throw new Error("No signature");
    }

    const publicKey = ecObject.keyFromPublic(this.fromAddress, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  };
}

class Block {
  timestamp: string;
  transaction: Transaction[];
  previousHash: string;
  currentHash: string;
  nonce: number;

  constructor(
    timestamp: string,
    transaction: Transaction[],
    previousHash: string = ""
  ) {
    this.timestamp = timestamp;
    this.transaction = transaction;
    this.previousHash = previousHash;
    this.currentHash = this.calculateHash();
    this.nonce = 0;
  }

  validateTransaction = () => {
    for (const tx of this.transaction) {
      if (!tx.validateSignature()) {
        return false;
      }
    }
    return true;
  };

  calculateHash = () =>
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
      // console.log(this.currentHash);
    }
    // console.log(`Block mined at ${this.currentHash}`);
  };
}

class Blockchain {
  chain: Block[];
  difficulty: number;
  pendingTransaction: Transaction[];
  miningReward: number;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransaction = [];
    this.miningReward = 100;
  }

  createGenesisBlock = () =>
    new Block(
      new Date().toString(),
      Array<Transaction>(new Transaction(null, "0", 0))
    );

  getLatestBlock = () => this.chain[this.chain.length - 1];

  minePendingTransaction = (miningRewardAddress: string) => {
    this.pendingTransaction.push(
      new Transaction(null, miningRewardAddress, this.miningReward)
    );
    let block = new Block(new Date().toString(), this.pendingTransaction);

    block.previousHash = this.getLatestBlock().currentHash;
    block.mine(this.difficulty);
    this.chain.push(block);
    this.pendingTransaction = [];
  };

  addTransaction = (transaction: Transaction) => {
    if (!transaction.fromAddress || !transaction.toAddress)
      throw new Error("No address is given");

    if (!transaction.validateSignature())
      throw new Error("Invalid transaction");

    this.pendingTransaction.push(transaction);
  };

  getBalanceOfAddress = (address: string) => {
    let balance = 0;

    for (const block of this.chain) {
      for (const transaction of block.transaction) {
        if (transaction.fromAddress === address) {
          balance -= transaction.amount;
        }
        if (transaction.toAddress === address) {
          balance += transaction.amount;
        }
      }
    }
    return balance;
  };

  // addBlock = (newBlock: Block) => {
  //   newBlock.previousHash = this.getLatestBlock().currentHash;
  //   newBlock.mine(this.difficulty);
  //   // newBlock.currentHash = newBlock.calculateHash();
  //   this.chain.push(newBlock);
  // };

  validateChain = () => {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (!currentBlock.validateTransaction()) return false;

      if (currentBlock.currentHash !== currentBlock.calculateHash())
        return false;

      if (currentBlock.previousHash !== previousBlock.currentHash) return false;
    }
    return true;
  };
}

export { Block, Blockchain, Transaction };
