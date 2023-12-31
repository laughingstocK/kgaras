import axios, { AxiosResponse } from 'axios';

export default async function checkStatus(requestId: string): Promise<AxiosResponse<any>> {
  try {
    const response = await axios.get('http://16.171.137.217:3001/check-status/' + requestId)
    return response
  } catch (error) {
    throw new Error('Upload error:' + error)
  }
}


