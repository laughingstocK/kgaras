'use client'
import { createContext, useContext, Dispatch, SetStateAction, useState } from "react";

type Repair = {
  ontology1: File | null;
  ontology2: File | null;
  refId: File | null;
  alignId: File | null;
};

const initialRepairData: Repair = {
  ontology1: null,
  ontology2: null,
  refId: null,
  alignId: null,
};

interface ContextProps {
  data: Repair;
  setData: Dispatch<SetStateAction<Repair>>;
}

const GlobalContext = createContext<ContextProps>({
  data: initialRepairData,
  setData: () => {},
});

interface GlobalContextProviderProps {
  children: React.ReactNode;
}

export const GlobalContextProvider: React.FC<GlobalContextProviderProps> = ({ children }) => {
  const [data, setData] = useState<Repair>(initialRepairData);

  return (
    <GlobalContext.Provider value={{ data, setData }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
