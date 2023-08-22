import axios, { AxiosResponse } from 'axios';

export default async function download(downloadReqId: string): Promise<AxiosResponse<any>> {
  const downloadData = JSON.stringify({
    requestId: downloadReqId,
  });
  try {
    const response = await axios.post('http://16.171.137.217:3001/download', downloadData, {
      headers: {
        'Content-Type': 'application/json'
      },
      maxBodyLength: Infinity,
      responseType: 'blob',
    });
    return response
  } catch (error) {
    throw new Error('Error downloading file' + error)
  }
}

