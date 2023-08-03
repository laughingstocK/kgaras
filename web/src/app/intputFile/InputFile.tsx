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
    <label htmlFor="ontology_id_1" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {inputName}
    </label>
    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">
    </label>
    <div className="flex items-center">
      <input
        className="block w-3/4 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        aria-describedby="file_input_help"
        id="file_input"
        type="file"
        onChange={handleFileChange}
      />
      {/* <p className="ml-4 mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">
  OWL or RDF files.
</p> */}
    </div>
  </div>)

}

export default InputFile;