"use client";

import React, { useState } from 'react';

const SignupPage = () => {
  const [parameter, setParameter] = useState('');
  const [filePath, setFilePath] = useState('');
  const [downloadReqId, setDownloadReqId] = useState('');
  const [ontologyId1, setOntologyId1] = useState('');
  const [ontologyId2, setOntologyId2] = useState('');
  const [alignId, setAlignId] = useState('');
  const [refId, setRefId] = useState('');
  const [service, setService] = useState('');

  const handleUpload = () => {
    if (!filePath) {
      alert('Please enter a file path');
      return;
    }

    const formData = new FormData();
    formData.append('file', filePath);

    fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Upload response:', data);
        // Process the upload response here
      })
      .catch((error) => {
        console.error('Upload error:', error);
      });
  };

  const handleDownload = () => {
    if (!downloadReqId) {
      alert('Please enter a download request ID');
      return;
    }

    const downloadData = JSON.stringify({
      requestId: downloadReqId,
    });

    fetch('http://localhost:3000/download', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: downloadData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create a temporary URL for the downloaded file
        const downloadUrl = URL.createObjectURL(blob);
        console.log('Download URL:', downloadUrl);
        // Process the download URL here or trigger a download
      })
      .catch((error) => {
        console.error('Download error:', error);
      });
  };

  const handleRepair = () => {
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

    fetch('http://localhost:3000/repair', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: repairData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Repair response:', data);
        // Process the repair response here
      })
      .catch((error) => {
        console.error('Repair error:', error);
      });
  };

  return (
    <div>
      <h1>API Integration</h1>

      <div>
        <h2>Upload</h2>
        <input type="text" value={filePath} onChange={(e) => setFilePath(e.target.value)} placeholder="File Path" />
        <button onClick={handleUpload}>Upload</button>
      </div>

      <div>
        <h2>Download</h2>
        <input
          type="text"
          value={downloadReqId}
          onChange={(e) => setDownloadReqId(e.target.value)}
          placeholder="Download Request ID"
        />
        <button onClick={handleDownload}>Download</button>
      </div>

      <div>
        <h2>Repair</h2>
        <input
          type="text"
          value={ontologyId1}
          onChange={(e) => setOntologyId1(e.target.value)}
          placeholder="Ontology ID 1"
        />
        <input
          type="text"
          value={ontologyId2}
          onChange={(e) => setOntologyId2(e.target.value)}
          placeholder="Ontology ID 2"
        />
        <input type="text" value={alignId} onChange={(e) => setAlignId(e.target.value)} placeholder="Align ID" />
        <input type="text" value={refId} onChange={(e) => setRefId(e.target.value)} placeholder="Ref ID" />
        <input type="text" value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" />
        <button onClick={handleRepair}>Repair</button>
      </div>
    </div>
  );
};

export default SignupPage;