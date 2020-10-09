import Link from 'next/link';
import { Button, Card } from 'semantic-ui-react';
import Layout from '../components/layout';
import factory from '../ethereum/factory';

const Home = ({ campaigns }) => {
  Home.displayName = 'Home';
  const renderCampaigns = (campaigns) => {
    const items = campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link href={`/campaigns/${address}`}>
            <a target='blank'>View Campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });
    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <div>
        <h3>Open campaigns</h3>
        <Link href='/campaigns/new'>
          <a>
            <Button content='Create Campaign' icon='add circle' labelPosition='left' primary floated='right'></Button>
          </a>
        </Link>

        {renderCampaigns(campaigns)}
      </div>
    </Layout>
  );
};

export const getServerSideProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return { props: { campaigns } };
};

export default Home;
