import axios from 'axios';

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

export interface PostMetadata {
  title: string;
  author: string;
  walletAddress: string;
  timestamp: number;
  contentHash: string;
}

export async function pinJSONToIPFS(json: any) {
  const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
  
  const response = await axios.post(url, json, {
    headers: {
      'Content-Type': 'application/json',
      'pinata_api_key': PINATA_API_KEY,
      'pinata_secret_api_key': PINATA_SECRET_KEY,
    },
  });
  
  return response.data.IpfsHash;
}

export async function pinContentToIPFS(content: string) {
  const contentJson = { content };
  return await pinJSONToIPFS(contentJson);
}