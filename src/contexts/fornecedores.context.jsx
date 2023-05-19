import { useContext, createContext, useState } from "react";
import { useToast } from "@chakra-ui/react";

import backendAPI from "../services/backendAPI";

import { errorResponseFormatter } from "../utils/error.util";

export const FornecedoresContext = createContext({});

export const FornecedoresProvider = ({ children }) => {
  const toast = useToast();

  const [fornecedores, setFornecedores] = useState([]);

  const createFornecedor = async (fornecedorData) => {
    try {
      const fornecedorCreated = await backendAPI.post(`/fornecedor/create`, fornecedorData);

      toast({
        description: "Fornecedor criado com sucesso!",
      });

      return fornecedorCreated;
    } catch (error) {
      const errorMessage = errorResponseFormatter(error);

      toast({
        description: errorMessage.message
      });

      throw errorMessage;
    }
  };

  const findFornecedorById = async (id)  => {
    try {
      const { data: fornecedor } = await backendAPI.get(`/fornecedor/get/${id}`);

      setFornecedores([fornecedor])

      return fornecedor
    } catch (error) {
      throw errorResponseFormatter(error);
    }
  };

  const findFornecedores = async () => {
    try {
      const { data: fornecedores } = await backendAPI.get("/fornecedor/all");

      setFornecedores(fornecedores);

      return fornecedores
    } catch (error) {
      throw errorResponseFormatter(error);
    }
  };

  const updateFornecedor = async (id, fornecedorData) => {
    try {
      let data = { ...fornecedorData }

      if (fornecedorData.fornecedor) {
        data = { ...data, fornecedor: fornecedorData.fornecedor };
      }

      const fornecedorUpdated = await backendAPI.put(`/fornecedor/update/${id}`, data);

      toast({
        description: "Fornecedor atualizado com sucesso!"
      });

      return fornecedorUpdated;
    } catch (error) {
      const errorMessage = errorResponseFormatter(error);

      toast({
        description: errorMessage.message
      });

      throw errorMessage;
    }
  };

  const deleteFornecedorByCNPJouCPF = async (cnpjCpf)  => {
    try {
      await backendAPI.delete(`/fornecedor/delete/${cnpjCpf}`);

      return
    } catch (error) {
      throw errorResponseFormatter(error);
    }
  };

  return (
    <FornecedoresContext.Provider
      value={{
        fornecedores,
        createFornecedor,
        findFornecedores,
        findFornecedorById,
        updateFornecedor,
        deleteFornecedorByCNPJouCPF
      }}
    >
      {children}
    </FornecedoresContext.Provider>
  );
};

export const useFornecedor = () => useContext(FornecedoresContext);
