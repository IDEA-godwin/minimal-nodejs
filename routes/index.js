const express = require('express');
const path = require('path');
const router = express.Router();

const { WarpFactory } = require("warp-contracts")
const { Ed25519Extension } = require("m3tering-ed25519")
const { EthersExtension } = require("m3tering-ethers")

const { LevelDbCache } = require("warp-contracts/web")
// LevelDB path to persist state
const dbPath = './warp-cache';


const warp = WarpFactory.forMainnet({ 
  inMemory: false, dbLocation: dbPath,
  cache: new LevelDbCache(dbPath)  
})
  .use(new Ed25519Extension())
  .use(new EthersExtension());

// Serve the index.html file for the root route
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/contracts/:txId', async (req, res) => {
  const txId = req.params.txId  
  const input = {
    payload:
      [
        "[0,218.4,0.47,0.009708]",
        "iSSc6rP+WNvA+HsMuHx4kXvb4uo4+qgsQr1txwA2ljIwmk/RHWjGN7QSw9nFGBWmdozbe9rBq5fE+UVVYjEvCg==",
        "3hJqbHdoQszEh8ilx12DHNH3kKWjDao3QIUeAgVolHw=",
      ], function: "meter"
  };

  const tags = [
    { name: "Contract-Label", value: "M3ters" },
    { name: "Contract-Use", value: "M3tering Protocol" },
    { name: "Content-Type", value: "application/json" },
  ];

  const wallet = await warp.arweave.wallets.generate();
  const contract = warp.contract(txId).connect(wallet);
  console.log(contract.evaluationOptions)
  const result = await contract.setEvaluationOptions({ ignoreExceptions: true }).dryWrite(
    input,
    undefined,
    tags
  );

  console.log(result)
  res.send({ message: "hello world, I see you want state of txId " + txId, result: JSON.stringify(result.state)})
})

module.exports = router;
