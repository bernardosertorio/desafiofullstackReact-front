import { useContext, createContext, useState } from "react";
import { useToast } from "@chakra-ui/react";

import backendAPI from "../services/backendAPI";

import { errorResponseFormatter } from "../utils/error.util";

export const EmpresasContext = createContext({});

export const EmpresasProvider = ({ children }) => {
  const toast = useToast();

  const [empresas, setEmpresas] = useState([]);

  const createEmpresa = async (empresaData) => {
    try {
      const empresaCreated = await backendAPI.post(`/empresa/create`, empresaData);

      toast({
        description: "Empresa criada com sucesso!",
      });

      return empresaCreated;
    } catch (error) {
      const errorMessage = errorResponseFormatter(error);

      toast({
        description: errorMessage.message
      });

      throw errorMessage;
    }
  };

  const findEmpresaById = async (id)  => {
    try {
      const { data: empresa } = await backendAPI.get(`/empresa/get/${id}`);

      setEmpresas([empresa])

      return empresa
    } catch (error) {
      throw errorResponseFormatter(error);
    }
  };

  const findEmpresas = async () => {
    try {
      const { data: empresas } = await backendAPI.get("/empresa/all");

      setEmpresas(empresas);

      return empresas
    } catch (error) {
      throw errorResponseFormatter(error);
    }
  };

  const updateEmpresa = async (id, empresaData) => {
    try {
      let data = { ...empresaData }

      if (empresaData.empresa) {
        data = { ...data, empresa: empresaData.empresa };
      }

      const empresaUpdated = await backendAPI.put(`/empresa/update/${id}`, data);

      toast({
        description: "Campanha atualizada com sucesso!"
      });

      return empresaUpdated;
    } catch (error) {
      const errorMessage = errorResponseFormatter(error);

      toast({
        description: errorMessage.message
      });

      throw errorMessage;
    }
  };

  const deleteEmpresaByCNPJ = async (cnpj)  => {
    try {
      await backendAPI.delete(`/empresa/delete/${cnpj}`);

      return
    } catch (error) {
      throw errorResponseFormatter(error);
    }
  };

  return (
    <EmpresasContext.Provider
      value={{
        empresas,
        createEmpresa,
        findEmpresas,
        findEmpresaById,
        updateEmpresa,
        deleteEmpresaByCNPJ
      }}
    >
      {children}
    </EmpresasContext.Provider>
  );
};

export const useEmpresa = () => useContext(EmpresasContext);
