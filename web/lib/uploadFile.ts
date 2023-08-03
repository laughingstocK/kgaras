import axios, { AxiosResponse } from 'axios';

export default async function uploadFile(file: File): Promise<AxiosResponse<any>> {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axios.post('http://localhost:3001/upload', formData)
    return response
  } catch (error) {
    throw new Error('Upload error:' + error)
  }
}
