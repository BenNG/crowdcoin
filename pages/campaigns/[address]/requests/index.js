import Link from "next/link";
import {Button, Table} from "semantic-ui-react";
import Layout from "../../../../components/layout";
import RequestRow from "../../../../components/RequestsRow";
import campaignAbi from "../../../../ethereum/campaign";

const RequestIndex = ({
  address,
  stringifiedRequests,
  requestsCount,
  approversCount,
}) => {
  const requests = JSON.parse(stringifiedRequests);
  const {Header, Row, HeaderCell, Body} = Table;

  const renderRow = () => {
    return requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={address}
          requestsCount={requestsCount}
          approversCount={approversCount}
        />
      );
    });
  };

  return (
    <Layout>
      <h3>Requests </h3>
      <Link href={`/campaigns/${address}/requests/new`}>
        <a>
          <Button primary> add request</Button>
        </a>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>Id</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>recipient</HeaderCell>
            <HeaderCell>Approve Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRow()}</Body>
      </Table>
      {`Found ${requests.length} request(s)`}
    </Layout>
  );
};

export default RequestIndex;

export const getServerSideProps = async (props) => {
  console.log("getServerSideProps");
  const {address} = props.query;
  const campaign = campaignAbi(address);
  const approversCount = await campaign.methods.approversCount().call();
  const requestsCount = await campaign.methods.getRequestsCount().call();
  const requests = await Promise.all(
    Array(parseInt(requestsCount))
      .fill()
      .map((req, index) => campaign.methods.requests(index).call())
  );

  console.log("requests", requests.length);

  return {
    props: {
      address,
      stringifiedRequests: JSON.stringify(requests),
      requestsCount,
      approversCount,
    },
  };
};
