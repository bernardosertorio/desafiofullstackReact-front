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
    FormControl,
    FormLabel,
    FormErrorMessage,
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

import { useFornecedor } from "../../../contexts/fornecedores.context";

const TableFornecedor = ({ fornecedores }) => {
    const { findFornecedores, createFornecedor, deleteFornecedorById } = useFornecedor();

    const modalCreateFornecedorDisclousure = useDisclosure();
    const modalUpdateFornecedorDisclousure = useDisclosure();

    const {
        register: regisUpdate,
        register,
        handleSubmit,
        formState: { errors: errorUpdate, errors, isSubmitting },
        setValue,
        reset,
        reset: resetUpdate,
    } = useForm();

    const [searchFornecedores, setSearchFornecedores] = useState("");
    const [fornecedoresList, setFornecedoresList] = useState(fornecedores);

    useEffect(() => setFornecedoresList(fornecedores), [fornecedores]);


    const handleSearch = (value) => setSearchFornecedores(value);

    const filterFornecedores =
        searchFornecedores.length > 0
            ? fornecedoresList?.filter((fornecedor) =>
                fornecedor.nome.toLowerCase().includes(searchFornecedores)
            )
            : [];

    const handleDeleteFornecedor = async (fornecedores) => {
        debugger
        await deleteFornecedorById(fornecedores.cnpjCpf)
        await findFornecedores()
    }

    const renderFornecedoresList = () => {
        let dataList = [];

        if (filterFornecedores && filterFornecedores?.length > 0)
            dataList = filterFornecedores;
        else dataList = fornecedoresList;

        return (
            <>
                {dataList?.map((fornecedores, index) => (
                    <Tr key={`fornecedores_${index}`}>
                        <Td>
                            <Text>{fornecedores.nome}</Text>
                        </Td>
                        <Td>
                            <Text>{fornecedores.cnpjCpf}</Text>
                        </Td>
                        <Td>
                            <Text>{fornecedores.email}</Text>
                        </Td>
                        <Td>
                            <Text>{fornecedores.cep}</Text>
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
                                            modalUpdateFornecedorDisclousure.onToggle();
                                        }}
                                    >
                                        Alterar Fornecedor
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            handleDeleteFornecedor(fornecedores.id)
                                        }}
                                    >
                                        Excluir Fornecedor
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </Td>
                    </Tr>
                ))}
            </>
        );
    };

    const handleCreateFornecedor = async (data) => {
        try {
            if (data) {
                await createFornecedor(data);
                await findFornecedores();
            }
            modalCreateFornecedorDisclousure.onClose();
            reset();
        } catch (error) {
            console.log(error);
        }
    };

    // const debounceFieldChangeValue = useCallback(
    //     _.debounce(
    //         (id, fornecedorData) =>
    //             updateFornecedor(id, fornecedorData),
    //         1000
    //     ),
    //     []
    // );

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
                        placeholder="Digite para buscar a fornecedor..."
                        onChange={({ currentTarget: { value } }) => handleSearch(value)}
                    />
                </InputGroup>

                <Stack direction="row" spacing={4}>
                    <Button
                        leftIcon={<FiPlus />}
                        colorScheme="green"
                        variant="solid"
                        onClick={modalCreateFornecedorDisclousure.onToggle}
                    >
                        Novo Fornecedor
                    </Button>
                </Stack>
            </Box>
            <TableContainer>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Nome</Th>
                            <Th>CNPJ ou CPF</Th>
                            <Th>EMAIL</Th>
                            <Th>CEP</Th>
                        </Tr>
                    </Thead>
                    <Tbody>{renderFornecedoresList()}</Tbody>
                </Table>
            </TableContainer>

            <form>
                <ModalComponent
                    title="Novo Fornecedor"
                    showCloseButton
                    success={{
                        text: "Salvar",
                        isSubmitting,
                        callback: handleSubmit(handleCreateFornecedor),
                    }}
                    {...modalCreateFornecedorDisclousure}
                >
                    <FormControl mb={3} isInvalid={!!errors.nome?.message}>
                        <FormLabel>Nome do Fornecedor</FormLabel>
                        <Input
                            {...register("nome", { required: "Digite o nome do fornecedor" })}
                            variant="outline"
                            placeholder="Digite o Nome do Fornecedor"
                            isInvalid={!!errors.nome?.message}
                            w={"full"}
                            autoFocus
                        />
                        {errors.nome && (
                            <FormErrorMessage>{errors.nome.message}</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl mb={3} isInvalid={!!errors.email?.message}>
                        <FormLabel>Email do Fornecedor</FormLabel>
                        <Input
                            {...register("email", {
                                required: "Digite o email do fornecedor",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Email inválido",
                                },
                            })}
                            variant="outline"
                            placeholder="Digite o Email do Fornecedor"
                            isInvalid={!!errors.email?.message}
                            w={"full"}
                            autoFocus
                            type="email"
                        />
                        {errors.email && (
                            <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl mb={3}>
                        <FormLabel>CNPJ OU CPF</FormLabel>
                        <Input
                            {...register("cnpjCpf", {
                                required: "Digite o CNPJ ou CPF",
                            })}
                            variant="outline"
                            placeholder="Digite o CNPJ ou CPF"
                            isInvalid={!!errors.cnpjCpf?.message}
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
                    title="Editar Fornecedor"
                    showCloseButton
                    success={{
                        text: "Salvar",
                        isSubmitting,
                        // callback: handleSubmitUpdate(handleUpdateEmpresaForm),
                    }}
                    {...modalUpdateFornecedorDisclousure}
                >
                    <FormControl mb={3} isInvalid={!!errorUpdate.name?.message}>
                        <FormLabel>Nome do fornecedor</FormLabel>
                        <Input
                            {...regisUpdate("name", {
                                required: "Digite o nome do Fornecedor",
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
                    <FormControl mb={3} isInvalid={!!errors.email?.message}>
                        <FormLabel>Email do Fornecedor</FormLabel>
                        <Input
                            {...register("email", {
                                required: "Digite o email do fornecedor",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Email inválido",
                                },
                            })}
                            variant="outline"
                            placeholder="Digite o Email do Fornecedor"
                            isInvalid={!!errors.email?.message}
                            w={"full"}
                            autoFocus
                            type="email"
                        />
                        {errors.email && (
                            <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl mb={3}>
                        <FormLabel>CNPJ OU CPF</FormLabel>
                        <Input
                            {...register("cnpjCpf", {
                                required: "Digite o CNPJ ou CPF",
                            })}
                            variant="outline"
                            placeholder="Digite o CNPJ ou CPF"
                            isInvalid={!!errors.cnpjCpf?.message}
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
            </form> */}
        </>
    );
};

export default TableFornecedor;
