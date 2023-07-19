"use client";
import React, { useState, ChangeEvent } from 'react';
import NewWindow from 'react-new-window';
import axios from 'axios';

const Home: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [downloadReqId, setDownloadReqId] = useState<string>('');
  const [ontologyId1, setOntologyId1] = useState<string>('');
  const [ontologyId2, setOntologyId2] = useState<string>('');
  const [alignId, setAlignId] = useState<string>('');
  const [refId, setRefId] = useState<string>('');
  const [service, setService] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const [downloadError, setDownloadError] = useState<string>('');
  const [repairError, setRepairError] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    setFile(selectedFile || null);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError('Please select a file');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post('http://localhost:3001/upload', formData);
      console.log('Upload response:', response.data);
      // Process the upload response here
    } catch (error) {
      console.error('Upload error:', error);
    }
  };
  
  const handleDownload = async () => {
    if (!downloadReqId) {
      alert('Please enter a download request ID');
      return;
    }
 
    const downloadData = JSON.stringify({
      requestId: downloadReqId,
    });
    
    try {
      const response = await axios.post('http://localhost:3001/download', downloadData, {
        headers: {
          'Content-Type': 'application/json'
        },
        maxBodyLength: Infinity,
        responseType: 'blob',
      });
      const downloadUrl = URL.createObjectURL(response.data);
      console.log('Download URL:', downloadUrl);
      // Process the download URL here or trigger a download
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download =  downloadReqId + '.zip'; // Specify the desired file name
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink); 
    } catch (error) {
      console.error('Download error:', error);
    }
  };
  
  const handleRepair = async () => {
    if (!ontologyId1 || !ontologyId2 || !alignId || !refId || !service) {
      alert('Please enter all repair parameters');
      return;
    }
  
    const repairData = JSON.stringify({
      ontologyId1,
      ontologyId2,
      alignId,
      refId,
      service,
    });
  
    try {
      const response = await axios.post('http://localhost:3001/repair', repairData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Repair response:', response.data);
      // Process the repair response here
    } catch (error) {
      console.error('Repair error:', error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div><h1 className="text-3xl font-bold mb-10">
        Knowledge Graph Alignment Repair As A Service
      </h1></div>
      {/* <div className='center items-center justify-center min-h-screen'> */}
      <div className="w3-container"
      style={{
        backgroundColor: '#232023',
        padding:'25px',
        borderRadius: '25px'
      }}>
        
      <div className="mb-8">
        <h5 className="text-2xl font-bold dark:text-white">Upload file</h5>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">
        </label>
        <div className="flex items-center">
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            aria-describedby="file_input_help"
            id="file_input"
            type="file"
            onChange={handleFileChange}
          />
          <p className="ml-4 mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">
            OWL or RDF files.
          </p>
          <button
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>
      </div>

      <div>
        <h5 className="text-2xl font-bold dark:text-white">Repair</h5>
        <div className='flex items-center'>
          <div className="mb-4">
            <label htmlFor="ontology_id_1" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              OntologyID 1:
            </label>
            <input
              type="text"
              id="ontology_id_1"
              value={ontologyId1}
              onChange={(e) => setOntologyId1(e.target.value)}
              placeholder="OntologyID 1"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          <div className="mb-4 ml-4">
            <label htmlFor="ontology_id_2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              OntologyID 2:
            </label>
            <input
              type="text"
              id="ontology_id_2"
              value={ontologyId2}
              onChange={(e) => setOntologyId2(e.target.value)}
              placeholder="OntologyID 2"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        </div>

        <div className='flex items-center'>
          <div className="mb-4">
            <label htmlFor="align_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              AlignID:
            </label>
            <input
              type="text"
              id="align_id"
              value={alignId}
              onChange={(e) => setAlignId(e.target.value)}
              placeholder="AlignID"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          <div className="mb-4 ml-4">
            <label htmlFor="reference_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              ReferenceID:
            </label>
            <input
              type="text"
              id="reference_id"
              value={refId}
              onChange={(e) => setRefId(e.target.value)}
              placeholder="ReferenceID"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
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
          </div>
        </div>

      </div>

      <div className="mb-8 mt-16">
        <h5 className="text-2xl font-bold dark:text-white mb-2 ">Download</h5>
        <input
          type="text"
          value={downloadReqId}
          onChange={(e) => setDownloadReqId(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          // className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Download Request ID"
        />
        <button
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          onClick={handleDownload}
        >
          Download
        </button>
      </div>
    </div>
    </div>
  );
};

export default Home;
