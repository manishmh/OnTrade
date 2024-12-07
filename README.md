# RealTrade

### Directly Backed Trading On-Chain: Real Assets, Real Security

Our project addresses a crucial gap in the current landscape of real-world assets (RWAs) on the blockchain. Traditional synthetic RWAs only mint tokens based on price feeds, creating an abstraction layer that does not connect directly to the underlying assets. Our solution takes a more direct approach by enabling RWAs that are directly backed by real assets.

By utilizing Gelato functions, our platform executes stock purchases off-chain, ensuring that the tokens you hold are genuinely backed by real-world assets. This enhances trust, transparency, and the overall value proposition of RWAs on-chain, effectively bridging the gap between traditional finance and blockchain technology.

#### Currently Deployed on Lisk Sepolia and Supports the Following Stocks:
- [AAPL](https://sepolia-blockscout.lisk.com/address/0x06e692951f08031423344228FF52b7544248b188)
- [AMZN](https://sepolia-blockscout.lisk.com/address/0x1E30638373f2d76cA5AC17e58f08f03A6C1E9744)
- [NASDAQ](https://sepolia-blockscout.lisk.com/address/0xA870c6739fC08dF98E2cB9F587a42C9347B83509)
- [S&P500](https://sepolia-blockscout.lisk.com/address/0xc74E6d979CE9004FF8D92f6F0ea0654dF2E52e42)

#### The flow of the Dapp is as follows:-
- Approve and deposit the suffcient amount of USDT to the contract.
- Select the stock and the correct amount.
- Redstone's core price feed wraps the transaction with its oracle data.
- After calling the `buyRStock` function, a `BuyRequest` gets emmitted.
- The event is picked up by Gelato's web3-function, which calls the Alpaca API to buy the respective stock in the exchange.
- It then excutes the `mintRStock` function, which mints the directly backed ERC20 of the RWA on-chain.
- In a similar manner, it can be sold and the USDT can be withdrawn. 

This repository includes the contract and Web3 functions, which need to be deployed separately for testing.

### For Contract:
```
$ forge init // Move the contract to foundry directory
$ forge install redstone-finance/redstone-oracles-monorepo --no-commit
$ forge install OpenZeppelin/openzeppelin-contracts@v4.9.5 --no-commit
```

### For web3-function
```
$ git clone https://github.com/gelatodigital/web3-functions-sdk.git
// Move the stocks and updates folder to web3-function
$ npx hardhat w3f-deploy stocks // to get the typescript function IPFS CID
```

### For web-app
```
$ npm i
$ npm run dev
```


### Environment Variables:
Environment variables are needed for Web3 functions as they use the [Alpaca API](https://app.alpaca.markets/signup) for stock trading.

#### USDT Contract:
The [USDT contract](https://sepolia-blockscout.lisk.com/address/0x2728DD8B45B788e26d12B13Db5A244e5403e7eda) used in the prototype is the most utilized USDT contract on Lisk Sepolia, deployed by HUOSTATER. Obtain USDT from the [faucet](https://lisk-sepolia.huostarter.io/).

#### Gelato Deployed Functions:
- [MarketAAPL](https://app.gelato.network/functions/task/0x3a67e17be48fffd59fd9e7b4dbdfab276b2d331700ca2e95772621811a731ada:4202)
- [BuyAAPL](https://app.gelato.network/functions/task/0x7d770f030f5af725dc544634207c9af76a44403404d659f0cc73c0c286f6f39b:4202)
- [SellAAPL](https://app.gelato.network/functions/task/0xe0d1e4957fd01fa621d8876272cd612d4d3936b15e7afe7e93d8e5cf5887d721:4202)
- [MarketAMZN](https://app.gelato.network/functions/task/0x2221e57f9fcab7d45140e90569215e7cdbfea67b6d179dca1dce0e3935d4d1bf:4202)
- [BuyAMZN](https://app.gelato.network/functions/task/0x45d4698bf678f3a993059b9ae9714f853de741c6637010bdd852508b0b818693:4202)
- [SellAMZN](https://app.gelato.network/functions/task/0x157cd2bd6761a36aba91b61139e851d4a1e67b6057d8a0b087b555b69de9d977:4202)
- [MarketNASDAQ](https://app.gelato.network/functions/task/0xb41b4b935afa996a2e21ae373fd4f483b8c04af8da6b476c3d130cde9a53a8db:4202)
- [BuyNASDAQ](https://app.gelato.network/functions/task/0x0fb888bbafced9e05a57607973e42490001c3c120537ff2e30fcccb683dae5ed:4202)
- [SellNASDAQ](https://app.gelato.network/functions/task/0xd5bade2e842573b185c749b5cd65d8c4a2ead528159715b9aba78aae1845ae7d:4202)
- [MarketSPY](https://app.gelato.network/functions/task/0x591ef3a432e2c97719b0e235f4e7069e3b671c5517da7b8f53b9dd639831d77d:4202)
- [BuySPY](https://app.gelato.network/functions/task/0x5296eaa63e18ac836da6870ff3cef76cc9c93ef5e24429a251bc15824d356428:4202)
- [SellSPY](https://app.gelato.network/functions/task/0xba043d2cec0e299f74a3acdf04c7506fb29e45394e5eb5b9d544f6fdb2f4a60c:4202)

- **Market Function**: Manages pausing and unpausing of the contract based on market status.
- **Buy Function**: Listens for `BuyRequest` events, interacts with the Alpaca API to purchase stock, and mints the corresponding ERC20 token to the trader.
- **Sell Function**: Listens for `SellRequest` events, interacts with the Alpaca API to sell stock, and burns the corresponding ERC20 token from the trader.

### [Demo Video](https://youtu.be/v3Bq-6OxTW8)

## Built during [ETHSEA](https://www.ethsea.com/)
