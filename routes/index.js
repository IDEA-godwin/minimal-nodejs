const express = require('express');
const path = require('path');
const router = express.Router();

// Serve the index.html file for the root route
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/contracts/:txId', async (req, res) => {
  const txId = req.params.txId
  res.send({ message: "hello world, I see you want state of txId " + txId})
})

module.exports = router;
