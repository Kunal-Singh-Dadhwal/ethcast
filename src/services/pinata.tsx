import axios from 'axios';

const PINATA_API_KEY = a1031e76ed87c14e58db;
const PINATA_SECRET_KEY = b3f3a73a2024740c5613a0f5a2283b89f2b99137b44721400360d82dcf409bce;
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
