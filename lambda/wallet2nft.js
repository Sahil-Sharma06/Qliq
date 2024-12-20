const axios = require('axios');

exports.handler = async (event) => {
    const apiKey = '';
    const baseURL = `https://eth-sepolia.g.alchemy.com/v2/${apiKey}`;

   const address = event.walletAddress;

  if (!address) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Wallet address is required.' }),
    };
  }

  const url = `${baseURL}/getNFTs/?owner=${address}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (!data.ownedNfts || data.ownedNfts.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify([]),
      };
    }

    const nfts = data.ownedNfts.map((nft) => ({
      contractAddress: nft.contract.address,
      tokenId: nft.id.tokenId,
      name: nft.metadata?.name || 'No name available',
      description: nft.metadata?.description || 'No description available',
      imageUrl: nft.metadata?.image || 'No image available',
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(nfts),
    };
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch NFTs.' }),
    };
  }
};
