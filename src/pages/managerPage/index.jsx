import React, { useEffect } from "react";
import {
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
} from "@chakra-ui/react";

import TableEmpresas from "../../components/table/empresas";
import TableFornecedores from "../../components/table/fornecedores";

import { useEmpresa } from "../../contexts/empresas.context";
import { useFornecedor } from "../../contexts/fornecedores.context";

function Manager() {
  const { empresas, findEmpresas } = useEmpresa();
  const { fornecedores, findFornecedores } = useFornecedor();

  useEffect(() => {
    handleEmpresas();
    handleFornecedores();
  }, []);

  const handleEmpresas = async () => {
    if (!empresas?.length) await findEmpresas();
  };

  const handleFornecedores = async () => {
    if (!fornecedores?.length) await findFornecedores();
  };

  return (
    <>
      <Container
        maxW={"full"}
        bg={useColorModeValue("white", "gray.900")}
        rounded={"lg"}
        dropShadow={"xl"}
        py={5}
      >
        <Tabs colorScheme="green">
          <TabList>
            <Tab>Empresas</Tab>
            <Tab>Fornecedores</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              <TableEmpresas empresas={empresas} />
            </TabPanel>
            <TabPanel px={0}>
              <TableFornecedores fornecedores={fornecedores} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  );
};

export default Manager;
