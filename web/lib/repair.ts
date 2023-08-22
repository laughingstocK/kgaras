import axios, { AxiosResponse } from 'axios';

export type RepairRequest = {
  ontologyId1: string,
  ontologyId2: string,
  alignId: string,
  refId: string,
  service: string,
  email?: string,
}

export default async function repair({
  ontologyId1,
  ontologyId2,
  alignId,
  refId,
  service,
  email,
}: RepairRequest): Promise<AxiosResponse<any>> {
  try {
    const repairData = JSON.stringify({
      ontologyId1,
      ontologyId2,
      alignId,
      refId,
      service,
      email
    })


    const response = await axios.post('http://16.171.137.217:3001/repair', repairData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Repair response:', response.data);
    return response
  } catch (error) {
    throw new Error('Repair error:' + error)
  }
}