"use client";
import React, { useState, useRef } from 'react';
import Modal from './components/Modal';
import Modal2 from './components/Modal2';
import uploadFile from '../../lib/uploadFile';
import download from '../../lib/download';
import checkStatus from '../../lib/checkstatus';
import repair, { RepairRequest } from '../../lib/repair';
import { AxiosResponse } from 'axios';
import InputFile from '@/app/intputFile/InputFile'
import { useGlobalContext } from '@/app/contexts/file'

const Home: React.FC = () => {
  const [service, setService] = useState<string>('alcomo');
  const [checkStatusError, setCheckStatusError] = useState<string>('');
  const [downloadError, setDownloadError] = useState<string>('');
  const [repairError, setRepairError] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [repairResponse, setRepairResponse] = useState<any>(null);
  const [checkstatusResponse, setCheckstatusResponse] = useState('');
  const [repairId, setRepairId] = useState('');
  const [repairId2, setRepairId2] = useState('');
  const [email, setEmail] = useState('');

  const intervalIdRef = useRef<NodeJS.Timer | null>(null);
  const { data } = useGlobalContext();

  const closeModal = () => {
    setShowModal(false);
    clearInterval(intervalIdRef.current!)
  };

  const closeModal2 = () => {
    setShowModal2(false);
  };

  const fetchData = async (requestId: string) => {
    const response = await fetch('http://16.171.137.217:3001/check-status/' + requestId)
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

  const handleCheckStatus = async (event: any) => {
    event.preventDefault();

    setCheckStatusError('');

    if (!repairId) {
      setCheckStatusError('Please enter a Repair ID.');
      return;
    }

    const res = await checkStatus(repairId)
    setCheckstatusResponse(res.data);

    setShowModal2(true);
  };

  const handleDownload = async (event: any) => {
    event.preventDefault();

    setDownloadError('');

    if (!repairId2) {
      setDownloadError('Please enter a Repair ID.');
      return;
    }

    const response = await download(repairId2)

    const downloadUrl = URL.createObjectURL(response.data);
      console.log('Download URL:', downloadUrl);

      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = repairId2 + '.zip';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
  }

  const handleRepair = async () => {

    if (service == 'logmap') {
      if (!data.ontology1 || !data.ontology2 || !data.alignId || !email) {
        setRepairError('Please fill all required fields');
        return;
      }
      try {
        const fileUploadPromises: Promise<AxiosResponse<any>>[] = [];
  
  
        fileUploadPromises.push(uploadFile(data.ontology1));
        fileUploadPromises.push(uploadFile(data.ontology2));
        fileUploadPromises.push(uploadFile(data.alignId));
  
        const [ontology1Result, ontology2Result, alignIdResult] = await Promise.all(fileUploadPromises);
  
        const repairData: RepairRequest = {
          ontologyId1: ontology1Result.data.fileName,
          ontologyId2: ontology2Result.data.fileName,
          alignId: alignIdResult.data.fileName,
          refId: '',
          service: service,
          email: email
        }
  
        const resRepair = await repair(repairData);
  
        setRepairResponse(resRepair.data);
        setShowModal(true)
        intervalIdRef.current = setInterval(() => fetchData(resRepair.data.requestId), 2000);
      } catch (err) {
        console.log(err);
        setRepairError('Something went wrong');
      }

    } else {

      if (!data.ontology1 || !data.ontology2 || !data.alignId || !data.refId || !email) {
        setRepairError('Please fill all required fields');
        return;
      }

      try {
        const fileUploadPromises: Promise<AxiosResponse<any>>[] = [];
        fileUploadPromises.push(uploadFile(data.ontology1));
        fileUploadPromises.push(uploadFile(data.ontology2));
        fileUploadPromises.push(uploadFile(data.alignId));
        fileUploadPromises.push(uploadFile(data.refId));

        const [ontology1Result, ontology2Result, alignIdResult, refIdResult] = await Promise.all(fileUploadPromises);
  
        const repairData: RepairRequest = {
          ontologyId1: ontology1Result.data.fileName,
          ontologyId2: ontology2Result.data.fileName,
          alignId: alignIdResult.data.fileName,
          refId: refIdResult.data.fileName || '',
          service: service,
          email: email
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


    
  }

  return (
    <>
      <div className="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal mt-6 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Knowledge Graph Alignment Repair As A Service
        </h1>
      </div>


      <div className='flex flex-col items-center min-h-screen'>
        <div className="bg-white p-8 rounded shadow-md">
          <h5 className="text-2xl font-bold">Repair</h5>
          <div className='flex items-center '>
            <InputFile inputName={"OntologyID 1:"} />
            <InputFile inputName={"OntologyID 2:"} />
            <InputFile inputName={"Alignment ID:"} />
          </div>

          <h5 className="text-base font-bold text-gray-700">Optional</h5>
          <div className='flex items-center'>
            <InputFile inputName={"Reference ID:"} />
          </div>


        <div className='flex flex-wrap'>
        <div className="mt-6 basis-1/4">
              <label htmlFor="service" className="block text-sm font-semibold text-gray-600">
                Service
              </label>
            
          <div className='basis-1/4 flex items-stretch space-x-4 mt-1 self-center'>
            <div>
              <select
                id="service"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="text-blue-700 bg-blue-50 hover:bg-blue-50 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-50 dark:hover:bg-blue-100 dark:focus:ring-blue-200"
              >
                <option value="logmap">Logmap</option>
                <option value="alcomo">Alcomo</option>
              </select>
            </div>
          </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-600">Email</label>
            <input
                  type="email"
                  className="mt-1 px-8 py-1 border rounded-md mb-1"
                  placeholder="example@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
            <p className='text-xs text-gray-600'>Please enter your email address in the field below to receive the results. <br></br>We will send the outcome directly to your provided email.</p>
          </div>

          </div>

          <div className='grid justify-items-center mt-10'>
            <button
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 ml-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              onClick={handleRepair}>
              Repair
            </button>
            {repairError &&  <p className="block text-sm font-semibold mt-2 text-red-600">{repairError}</p>}

            {showModal && (
              <Modal showModal={showModal} onClose={closeModal} response={repairResponse}>
                {repairResponse}
                <button onClick={closeModal}>Close</button>
              </Modal>
            )}
          </div>
          <div className="border-t border-gray-300 my-8"></div>

          <div className="mt-6">
            <h5 className="text-xl font-bold">Checking status</h5>
            <div className="flex items-stretch space-x-4 mt-1">
              <div className="self-center">
                <label htmlFor="service" className="block text-sm font-semibold text-gray-600">
                  Repair ID
                </label>
              </div>
              <form>
                <input
                  type="text"
                  className="mt-1 px-8 py-1 border rounded-md mb-1"
                  placeholder="103a0c7b-29fb-454e-9278-d6181f43ee83"
                  value={repairId}
                  onChange={(e) => setRepairId(e.target.value)}
                />
                <button
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 ml-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                  onClick={handleCheckStatus}
                >
                  Check
                </button>
                {checkStatusError && <p className="block text-sm font-semibold text-red-600">{checkStatusError}</p>}

                {showModal2 && (
                  <Modal2 showModal={showModal2} onClose={closeModal2} response={checkstatusResponse}>
                    {checkstatusResponse}
                    <button onClick={closeModal2}>Close</button>
                  </Modal2>
                )}
              </form>
            </div>
          </div>

          <div className="border-t border-gray-300 my-8"></div>

          <div className="mt-6">
            <h5 className="text-xl font-bold">Download</h5>
            <div className='flex items-stretch space-x-4 mt-1'>

              <div className='self-center'>
                <label htmlFor="service" className="block text-sm font-semibold text-gray-600">
                  Repair ID
                </label>
              </div>
              <form>
                <input
                  type="text"
                  className="mt-1 px-8 py-1 border rounded-md mb-1"
                  placeholder="103a0c7b-29fb-454e-9278-d6181f43ee83"
                  value={repairId2}
                  onChange={(e) => setRepairId2(e.target.value)}
                />
                <button
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 ml-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                  onClick={handleDownload}
                >
                  Download
                </button>
                {downloadError && <p className="block text-sm font-semibold text-red-600">{downloadError}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
