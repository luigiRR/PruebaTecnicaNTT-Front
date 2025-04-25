import { Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';

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
                            <Button
                                colorScheme="blue"
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(emp)}
                                mr={2}
                            >
                                Editar
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
                                Eliminar
                            </Button>
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
};

export default EmployeeTable;
