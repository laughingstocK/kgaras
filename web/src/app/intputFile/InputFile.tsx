import React, { useState, ChangeEvent } from 'react';
import { useGlobalContext } from '@/app/contexts/file'

interface InputFileProps {
  inputName: string;
}

const InputFile: React.FC<InputFileProps> = ({ inputName }) => {
  const { data, setData } = useGlobalContext();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];

    if (inputName == "OntologyID 1:") {
      setData({ ...data, ontology1: selectedFile || null })
    }
    else if (inputName == "OntologyID 2:") {
      setData({ ...data, ontology2: selectedFile || null })
    }
    else if (inputName == "Reference ID:") {
      setData({ ...data, refId: selectedFile || null })
    }
    else if (inputName == "Alignment ID:") {
      setData({ ...data, alignId: selectedFile || null })
    }
  };

  return (<div className="mb-8">
    <label htmlFor="ontology_id_1" className="block text-sm font-medium text-gray-600">
      {inputName}
    </label>
    <label className="block mb-2 text-sm font-medium" htmlFor="file_input">
    </label>
    <div className="flex items-center">
      <input
        className="block w-full text-sm text-slate-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-blue-50 file:text-blue-700
        hover:file:bg-blue-100"
        aria-describedby="file_input_help"
        id="file_input"
        type="file"
        onChange={handleFileChange}
      />
    </div>
  </div>)

}

export default InputFile;