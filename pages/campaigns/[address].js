import Link from "next/link";
import {Button, Grid} from "semantic-ui-react";
import ContributeForm from "../../components/Form/ContributeForm";
import Layout from "../../components/layout";
import Cards from "../../components/campaigns/cards";
import campaignAbi from "../../ethereum/campaign";

const CampaignShow = ({
  address,
  minimumContribution,
  balance,
  requests,
  approversCount,
  manager,
}) => {
  const cardProps = {
    manager,
    minimumContribution,
    requests,
    approversCount,
    balance,
  };
  return (
    <Layout>
      <h3>New Campaign {address}</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Cards {...cardProps} />
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={address} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${address}/requests`}>
              <Button primary>View Requests</Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

export default CampaignShow;

// rendered each request
export const getServerSideProps = async (props) => {
  const {address} = props.query;
  const campaign = campaignAbi(address);
  const summary = await campaign.methods.getSummary().call();
  return {
    props: {
      address,
      minimumContribution: summary[0],
      balance: summary[1],
      requests: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    },
  };
};
