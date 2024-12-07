import {
  Web3Function,
  Web3FunctionEventContext,
} from "@gelatonetwork/web3-functions-sdk";

import { Contract } from "@ethersproject/contracts";
import { Interface } from "@ethersproject/abi";
import ky from "ky";



const abi = [
  `event BuyRequest(uint256 amountOfStocks, address trader, uint256 value)`,
  `function mintRStock(uint256 _amoutnOfStocks, address _trader, uint256 _value) external`,
  `event SellRequest(uint256 amountOfStocks, address trader, uint256 value)`,
  `function burnRStock(uint256 _amountOfStocks, address _trader, uint256 _value) external`,
];

Web3Function.onRun(async (context: Web3FunctionEventContext) => {

  interface PostResponse {
    id: string;
    filled_qty: string;
    filled_avg_price: string | null;
    status: string;
  }
  
  const { log, multiChainProvider } = context;
  const provider = multiChainProvider.default();

  const contractAddr = "0xc74E6d979CE9004FF8D92f6F0ea0654dF2E52e42";
  const rMarket = new Contract(contractAddr, abi, provider);
  const rMarketInterface = new Interface(abi);
  const alpacaKey = await context.secrets.get("ALPACA_KEYS");
  const alpacaSecret = await context.secrets.get("ALPACA_SECRET");

  const description = rMarketInterface.parseLog(log);

  const { amountOfStocks, trader, value } = description.args;

  const url = "https://paper-api.alpaca.markets/v2/orders";
  const headers = {
    accept: "application/json",
    "content-type": "application/json",
    "APCA-API-KEY-ID": alpacaKey,
    "APCA-API-SECRET-KEY": alpacaSecret,
  };

  if (description.name == "BuyRequest") {
    // buy share in Alpaca if success
    const data = {
      side: "buy",
      type: "market",
      time_in_force: "gtc",
      symbol: "SPY",
      qty: amountOfStocks.toString(),
    };

    const response = await ky
      .post(url, {
        headers: headers,
        json: data,
      })
      .json<PostResponse>();

    await sleep(1000);

    const filledResponse = await ky
      .get(url + "/" + `${response.id}`, { headers: headers })
      .json<PostResponse>();
    const amount = parseInt(filledResponse.filled_qty);
    const purchaseValue =
      parseInt(filledResponse.filled_avg_price) * amount;
    return {
      canExec: true,
      callData: [
        {
          to: contractAddr,
          data: rMarket.interface.encodeFunctionData("mintRStock", [
            amount,
            trader,
            purchaseValue,
          ]),
        },
      ],
    };
  } else if (description.name == "SellRequest") {
    // sell shares in Alpaca if success
    const data = {
      side: "sell",
      type: "market",
      time_in_force: "gtc",
      symbol: "SPY",
      qty: amountOfStocks.toString(),
    };

    const response = await ky
      .post(url, {
        headers: headers,
        json: data,
      })
      .json<PostResponse>();

    await sleep(1000);

    const filledResponse = await ky
      .get(url + "/" + `${response.id}`, { headers: headers })
      .json<PostResponse>();
    const amount = parseInt(filledResponse.filled_qty);
    const sellValue =
      parseInt(filledResponse.filled_avg_price) * amount;
    return {
      canExec: true,
      callData: [
        {
          to: contractAddr,
          data: rMarket.interface.encodeFunctionData("burnRStock", [
            amount,
            trader,
            sellValue,
          ]),
        },
      ],
    };
  } else {
    throw new Error("Unexpected");
  }
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
