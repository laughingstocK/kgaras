import axios, { AxiosResponse } from 'axios';

export default async function checkStatus(requestId: string): Promise<AxiosResponse<any>> {
  try {
    const response = await axios.get('http://rest-api:3001/check-status/' + requestId)
    return response
  } catch (error) {
    throw new Error('Upload error:' + error)
  }
}


