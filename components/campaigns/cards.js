import {Card} from "semantic-ui-react";
import web3 from "../../ethereum/web3";

const Cards = ({
  manager,
  minimumContribution,
  requests,
  approversCount,
  balance,
}) => {
  const items = [
    {
      header: manager,
      description:
        "The manager created this campaign and can create request to withdraw money",
      meta: "Address of manager",
      style: {
        overflowWrap: "break-word",
      },
    },
    {
      header: minimumContribution,
      description: "you must provide this much wei to be an approvers",
      meta: "minimum contribution (wei)",
    },
    {
      header: requests,
      description:
        "A request tries to withdeaw money from the contract. Request must be approved by approvers",
      meta: "Number of request",
    },
    {
      header: approversCount,
      description: "Number of people who have already donated to the campaign",
      meta: "Number of approvers",
    },
    {
      header: web3.utils.fromWei(balance, "ether"),
      description:
        "This balance is how much money this campaign has left to spend.",
      meta: "Campaign balance (ether)",
    },
  ];
  return <Card.Group items={items}></Card.Group>;
};

export default Cards;
