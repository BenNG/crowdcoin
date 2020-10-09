import {Table, Button} from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import useAccounts from "../../hooks/useAccounts";
import campaignAbi from "../../ethereum/campaign";

const {Row, Cell} = Table;

const RequestRow = ({id, request, address, requestsCount, approversCount}) => {
  console.log("request", request);
  const accounts = useAccounts();
  const campaign = campaignAbi(address);
  const readyToFinalize =
    Number(request.approvalsCount) >= Number(approversCount) / 2;

  const onApprove = async () => {
    await campaign.methods.approveRequest(id).send({from: accounts[0]});
  };

  const onFinalize = async () => {
    await campaign.methods.finalizeRequest(id).send({from: accounts[0]});
  };

  return (
    <Row
      disabled={request.completed}
      positive={readyToFinalize && !request.completed}
    >
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>{`${request.approvalsCount}/${approversCount}`}</Cell>
      {request.completed ? null : (
        <>
          <Cell>
            <Button onClick={onApprove} color="green" basic>
              Approve
            </Button>
          </Cell>
        </>
      )}
      {request.completed ? null : (
        <>
          <Cell>
            <Button onClick={onFinalize} color="teal" basic>
              Finalize
            </Button>
          </Cell>
        </>
      )}
    </Row>
  );
};

export default RequestRow;
