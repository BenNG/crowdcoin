import web3 from "./web3";
import compiledFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(compiledFactory.interface),
  "0xD1aE4a093c57741931Fecb7fA74347e96D5a4dDf"
);

export default instance;
