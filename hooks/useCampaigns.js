import { useEffect, useState } from 'react';
import factory from '../ethereum/factory';
const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState(null);
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setCampaigns(await factory.methods.getDeployedCampaigns().call());
      } catch (e) {
        console.log('something wrong when fetching campaigns');
      }
    };
    fetchCampaigns();
  }, []);

  return campaigns;
};

export default useCampaigns;
