import { Table, Thead, Tbody, Tr, Th, Td, Button, Flex } from '@chakra-ui/react';
import { FaTrash, FaEdit } from 'react-icons/fa';

const EmployeeTable = ({ employees, handleEdit, setToDeleteId, onDelOpen }) => {
    return (
        <Table variant="striped" mt={5} colorScheme="gray">
            <Thead>
                <Tr>
                    <Th>ID</Th>
                    <Th>Nombre</Th>
                    <Th>Apellido</Th>
                    <Th>Teléfono</Th>
                    <Th>Fecha Nac.</Th>
                    <Th>Acciones</Th>
                </Tr>
            </Thead>
            <Tbody>
                {employees.map((emp) => (
                    <Tr key={emp.id}>
                        <Td>{emp.id}</Td>
                        <Td>{emp.firstname}</Td>
                        <Td>{emp.lastname}</Td>
                        <Td>{emp.phone}</Td>
                        <Td>
                            {new Date(emp.birthdate).toLocaleDateString('es-PE', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                            })}
                        </Td>
                        <Td>
                            <Flex>
                                <Button
                                    colorScheme="blue"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(emp)}
                                    mr={2}
                                >
                                <FaEdit />
                                </Button>
                                <Button
                                    colorScheme="red"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setToDeleteId(emp.id);
                                        onDelOpen();
                                    }}
                                >
                                    <FaTrash />
                                </Button>
                            </Flex>
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
};

export default EmployeeTable;
