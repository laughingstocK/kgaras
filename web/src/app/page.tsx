"use client";
import React, { useState, useRef } from 'react';
import Modal from '../../components/modal';
import uploadFile from '../../lib/uploadFile';
import download from '../../lib/download';
import repair, { RepairRequest } from '../../lib/repair';
import { AxiosResponse } from 'axios';
import InputFile from '@/app/intputFile/InputFile'
import { useGlobalContext } from '@/app/contexts/file'

const Home: React.FC = () => {
  const [service, setService] = useState<string>('alcomo');
  const [uploadError, setUploadError] = useState<string>('');
  const [repairError, setRepairError] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [repairResponse, setRepairResponse] = useState<any>(null);

  const intervalIdRef = useRef<NodeJS.Timer | null>(null);
  const { data } = useGlobalContext();

  const closeModal = () => {
    setShowModal(false);
    clearInterval(intervalIdRef.current!)
  };

  const fetchData = async (requestId: string) => {
    const response = await fetch('http://localhost:3001/check-status/' + requestId)
    const newData = await response.json();
    if (newData.status == 'DONE') {

      clearInterval(intervalIdRef.current!)
      setShowModal(false)
      
      const resDownload = await download(requestId);

      const downloadUrl = URL.createObjectURL(resDownload.data);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = requestId + '.zip';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleRepair = async () => {
    if (!data.ontology1 || !data.ontology2 || !data.alignId) {
      setRepairError('Please select two ontologies');
      return;
    }

    try {
      const fileUploadPromises: Promise<AxiosResponse<any>>[] = [];

      fileUploadPromises.push(uploadFile(data.ontology1));
      fileUploadPromises.push(uploadFile(data.ontology2));
      fileUploadPromises.push(uploadFile(data.alignId));
      if (data.refId) fileUploadPromises.push(uploadFile(data.refId));

      const [ontology1Result, ontology2Result, alignIdResult, refIdResult] = await Promise.all(fileUploadPromises);

      const repairData: RepairRequest = {
        ontologyId1: ontology1Result.data.fileName,
        ontologyId2: ontology2Result.data.fileName,
        alignId: alignIdResult.data.fileName,
        refId: refIdResult.data.fileName || '',
        service: service
      }

      const resRepair = await repair(repairData);

      setRepairResponse(resRepair.data);
      setShowModal(true)
      intervalIdRef.current = setInterval(() => fetchData(resRepair.data.requestId), 2000);
    } catch (err) {
      console.log(err);
      setRepairError('Something went wrong');
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div><h1 className="text-3xl font-bold mb-10">
        Knowledge Graph Alignment Repair As A Service
      </h1></div>
      {/* <div className='center items-center justify-center min-h-screen'> */}
      <div className="w3-container"
        style={{
          backgroundColor: '#232023',
          padding: '25px',
          borderRadius: '25px'
        }}>

        <div>
          <h5 className="text-2xl font-bold dark:text-white">Repair</h5>
          <div className='flex items-center'>
            <InputFile inputName={"OntologyID 1:"} />
            <InputFile inputName={"OntologyID 2:"} />
          </div>

          <div className='flex items-center'>
            <InputFile inputName={"Alignment ID:"} />
            <InputFile inputName={"Reference ID:"} />
          </div>
          <div>
            <label htmlFor="service" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Service:
            </label>
          </div>
          <div className="flex items-center mb-4">

            <div className="flex items-center">
              <select
                id="service"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="logmap">Logmap</option>
                <option value="alcomo">Alcomo</option>
              </select>
              <button
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 ml-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                onClick={handleRepair}
              >
                Repair
              </button>
              {uploadError && <p>{uploadError}</p>}

              {showModal && (
                <Modal showModal={showModal} onClose={closeModal} response={repairResponse}>
                  {repairResponse}
                  <button onClick={closeModal}>Close</button>
                </Modal>

              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
