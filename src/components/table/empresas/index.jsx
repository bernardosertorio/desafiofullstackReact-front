import React, { useCallback, useEffect, useState } from "react";
import {
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Text,
    useDisclosure,
    Box,
    InputGroup,
    InputLeftElement,
    Input,
    Stack,
    Button,
    Switch,
    FormControl,
    FormLabel,
    FormErrorMessage,
    AvatarGroup,
    Avatar,
    Menu,
    MenuButton,
    IconButton,
    MenuList,
    MenuItem,
    TableContainer,
} from "@chakra-ui/react";
import { FiSearch, FiPlus, FiMenu } from "react-icons/fi";
import _ from "lodash";
import { useForm } from "react-hook-form";

import SkeletonComponent from "../../loading/skeleton";
import ModalComponent from "../../modal";

import { useEmpresa } from "../../../contexts/empresas.context";


const TableEmpresa = ({ empresas }) => {
    const { createEmpresa, findEmpresas, updateEmpresa } = useEmpresa();

    const modalCreateEmpresaDisclousure = useDisclosure();
    const modalUpdateEmpresaDisclousure = useDisclosure();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    // const {
    //     register: regisUpdate,
    //     handleSubmit: handleSubmitUpdate,
    //     formState: { errors: errorUpdate, isSubmitting: isSubmittingUpdate },
    //     reset: resetUpdate,
    //   } = useForm();

    const [searchEmpresas, setSearchEmpresas] = useState("");
    const [empresasList, setEmpresasList] = useState(empresas);

    useEffect(() => setEmpresasList(empresas), [empresas]);
    useEffect(() => console.log(errors), [errors]);
    const handleSearch = (value) => setSearchEmpresas(value);
    
    const filterEmpresas =
        searchEmpresas.length > 0
            ? empresasList?.filter((empresa) =>
                empresa.nomeFantasia.toLowerCase().includes(searchEmpresas)
            )
            : [];

    const renderEmpresasList = () => {
        let dataList = [];

        if (filterEmpresas && filterEmpresas?.length > 0)
            dataList = filterEmpresas;
        else dataList = empresasList;

        return (
            <>
                {dataList?.map((empresas, index) => (
                    <Tr key={`empresas_${index}`}>
                        <Td>
                            <Text>{empresas.nomeFantasia}</Text>
                        </Td>
                        <Td>
                            <Text>{empresas.cnpj}</Text>
                        </Td>
                        <Td>
                            <Text>{empresas.cep}</Text>
                        </Td>
                        <Td>
                            <Menu>
                                <MenuButton
                                    as={IconButton}
                                    aria-label="Options"
                                    icon={<FiMenu />}
                                    variant="outline"
                                />
                                <MenuList>
                                    <MenuItem
                                        onClick={() => {
                                            setValueForm(empresas);
                                            modalUpdateEmpresaDisclousure.onToggle();
                                        }}
                                    >
                                        Alterar Campanha
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            setValueForm(fornecedores);
                                        }}
                                    >
                                        Excluir Empresa
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </Td>
                    </Tr>
                ))}
            </>
        );
    };

    const handleCreateEmpresa = async (data) => { 
        try {
            if (data) {
                await createEmpresa(data);
                await findEmpresas();
            }
            modalCreateEmpresaDisclousure.onClose();
            reset();
        } catch (error) {
            console.log(error);
        }
    };

    const debounceFieldChangeValue = useCallback(
        _.debounce(
            (id, empresaData) =>
                updateEmpresa(id, empresaData),
            1000
        ),
        []
    );

    const handleUpdateEmpresa = async ({
        id,
        field,
        value,
      }) => {
        const empresasClone = _.cloneDeep(empresasList);
        const newEmpresa = empresasClone?.map((item) => {
          if (item._id === id) {
            if (field === "active") {
              item.active = !!value;
            }
          }
          return item;
        });
    
        if (newEmpresa) setCampaignsList(newEmpresa);
        resetUpdate()
        debounceFieldChangeValue(id, { [field]: value });
      };

    return (
        <>
            <Box py={5} display={"flex"} flexDirection={"row"} gap={3} mb={5}>
                <InputGroup>
                    <InputLeftElement
                        pointerEvents="none"
                        children={<FiSearch color="gray.300" />}
                    />
                    <Input
                        type="search"
                        variant={"filled"}
                        placeholder="Digite para buscar a empresa..."
                        onChange={({ currentTarget: { value } }) => handleSearch(value)}
                    />
                </InputGroup>

                <Stack direction="row" spacing={4}>
                    <Button
                        leftIcon={<FiPlus />}
                        colorScheme="green"
                        variant="solid"
                        onClick={modalCreateEmpresaDisclousure.onToggle}
                    >
                        Nova Empresa
                    </Button>
                </Stack>
            </Box>
            <TableContainer>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Nome Fantasia</Th>
                            <Th>CNPJ</Th>
                            <Th>CEP</Th>
                        </Tr>
                    </Thead>
                    <Tbody>{renderEmpresasList()}</Tbody>
                </Table>
            </TableContainer>

            <form>
                <ModalComponent
                    title="Nova Empresa"
                    showCloseButton
                    success={{
                        text: "Salvar",
                        isSubmitting,
                        callback: handleSubmit(handleCreateEmpresa),
                    }}
                    {...modalCreateEmpresaDisclousure}
                >
                    <FormControl mb={3} isInvalid={!!errors.nomeFantasia?.message}>
                        <FormLabel>Nome fantasia da Empresa</FormLabel>
                        <Input
                            {...register("nomeFantasia", { required: "Digite o nome da empresa" })}
                            variant="outline"
                            placeholder="Digite o Nome Fantasia"
                            isInvalid={!!errors.nomeFantasia?.message}
                            w={"full"}
                            autoFocus
                        />
                        {errors.nomeFantasia && (
                            <FormErrorMessage>{errors.nomeFantasia.message}</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl mb={3}>
                        <FormLabel>CNPJ</FormLabel>
                        <Input
                            {...register("cnpj", {
                                required: "Digite o CNPJ",
                            })}
                            variant="outline"
                            placeholder="Digite o CNPJ"
                            isInvalid={!!errors.cnpj?.message}
                            w={"full"}
                            type="text"
                            inputMode="numeric"
                        />
                        {errors.cnpj && (
                            <FormErrorMessage>{errors.cnpj.message}</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl mb={3}>
                        <FormLabel>CEP</FormLabel>
                        <Input
                            {...register("cep", {
                                required: "Digite o CEP",
                            })}
                            variant="outline"
                            placeholder="Digite o CEP"
                            isInvalid={!!errors.cep?.message}
                            w={"full"}
                            type="text"
                            inputMode="numeric"
                        />
                        {errors.cep && (
                            <FormErrorMessage>{errors.cep.message}</FormErrorMessage>
                        )}
                    </FormControl>
                </ModalComponent>
            </form>
            {/* <form >
                <ModalComponent
                    title="Editar Empresa"
                    showCloseButton
                    success={{
                        text: "Salvar",
                        isSubmittingUpdate,
                        callback: handleSubmitUpdate(handleUpdateEmpresa),
                    }}
                    {...modalUpdateEmpresaDisclousure}
                >
                    <FormControl mb={3} isInvalid={!!errorUpdate.nameFantasia?.message}>
                        <FormLabel>Nome fantasia da Empresa</FormLabel>
                        <Input
                            {...regisUpdate("name", {
                                required: "Digite o nome da Empresa",
                            })}
                            variant="outline"
                            isInvalid={!!errorUpdate.name?.message}
                            w={"full"}
                            autoFocus
                        />
                        {errorUpdate.name && (
                            <FormErrorMessage>{errorUpdate.name?.message}</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl mb={3}>
                        <FormLabel>CNPJ</FormLabel>
                        <Input
                            {...register("limit", {
                                required: "Digite o CNPJ",
                            })}
                            variant="outline"
                            placeholder=""
                            isInvalid={!!errors.limit?.message}
                            w={"full"}
                            type={`number`}
                            inputMode="numeric"
                        />
                        {errors.limit && (
                            <FormErrorMessage>{errors.limit.message}</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl mb={3}>
                        <FormLabel>CEP</FormLabel>
                        <Input
                            {...register("limit", {
                                required: "Digite o CEP",
                            })}
                            variant="outline"
                            placeholder=""
                            isInvalid={!!errors.limit?.message}
                            w={"full"}
                            type={`number`}
                            inputMode="numeric"
                        />
                        {errors.limit && (
                            <FormErrorMessage>{errors.limit.message}</FormErrorMessage>
                        )}
                    </FormControl>
                </ModalComponent>
            </form> */}
        </>
    );
};

export default TableEmpresa;
