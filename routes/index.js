const express = require('express');
const path = require('path');
const router = express.Router();

const { WarpFactory } = require('warp-contracts')
const { EthersExtension } = require("m3tering-ethers");
const { Ed25519Extension } = require("m3tering-ed25519");

const warp = WarpFactory.forMainnet({ inMemory: true })
  .use(new Ed25519Extension())
  .use(new EthersExtension());
const tags = [
  { name: "Contract-Label", value: "M3ters" },
  { name: "Contract-Use", value: "M3tering Protocol" },
  { name: "Content-Type", value: "application/json" },
];

// Serve the index.html file for the root route
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/contracts/:txId', async (req, res) => {
  const txId = req.params.txId  
  const wallet = await warp.arweave.wallets.generate()
  const contract = warp.contract(txId).connect(wallet);
  const interactionResult = await contract.setEvaluationOptions({ ignoreExceptions: true }).viewState(
    {
      function: "meter",
      payload: [
        "[0,218.4,0.47,0.009708]",
        "iSSc6rP+WNvA+HsMuHx4kXvb4uo4+qgsQr1txwA2ljIwmk/RHWjGN7QSw9nFGBWmdozbe9rBq5fE+UVVYjEvCg==",
        "3hJqbHdoQszEh8ilx12DHNH3kKWjDao3QIUeAgVolHw=",
      ],
    },
    { tags, inputFormatAsData: true }
  );
  console.log("result", interactionResult);

  res.send({ message: "hello world, I see you want state of txId " + txId, result: JSON.stringify(interactionResult)})
})

module.exports = router;
