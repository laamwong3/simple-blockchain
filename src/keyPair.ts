import { ec } from "elliptic";
import fs from "fs";
import key from "./keyPair.json";

const ecObject = new ec("secp256k1");
let keyPair: {
  public: string;
  private: string;
}[] = [];

for (let i = 0; i < 10; i++) {
  const key = ecObject.genKeyPair();

  keyPair.push({
    public: key.getPublic("hex"),
    private: key.getPrivate("hex"),
  });

  //   const publicKey = key.getPublic("hex");
  //   const privateKey = key.getPrivate("hex");

  //   console.log(`public key is ${publicKey}`);
  //   console.log(`private key is ${privateKey}`);
}
fs.writeFileSync("./keyPair.json", JSON.stringify(keyPair, null, 2));
