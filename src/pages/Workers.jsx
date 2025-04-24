// src/pages/Dashboard.jsx
import React from 'react';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOffices, saveEmployee, getEmployees, getAssignedOfficesByEmployee, deleteEmployee, updateEmployee } from '@/api/api'
import { useDisclosure } from '@chakra-ui/react'
import OfficesMultiSelect from '../components/ui/OfficesMultiSelect'
import {
  Button,
  Container,
  Heading,
  Spinner,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react'

export default function Workers() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [employeeId, setEmployeeId] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [identityNumber, setIdentityNumber] = useState('')
  const [address, setAddress] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [selectedOffices, setSelectedOffices] = useState([]);

  //PARA ELIMINACION DEL EMPLEADO
  const { isOpen: isDelOpen, onOpen: onDelOpen, onClose: onDelClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [toDeleteId, setToDeleteId] = useState(null);

  const toast = useToast();

  const [user, setUser] = useState(null)
  const [offices, setOffices] = useState([])
  const [loading, setLoading] = useState(true)
  const [action, setAction] = useState(null)
  const [employees, setEmployees] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchProfile() {
      try {
        const userLogged = JSON.parse(sessionStorage.getItem("user"))
        setUser(userLogged)
        officess(userLogged.token);
        listEmployees(userLogged.token);

      } catch (err) {
        sessionStorage.removeItem('user')
        navigate('/login', { replace: true })
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [navigate])


  const officess = async (token) => {
    const response = await getOffices(token);
    const listOffices = response.list
    setOffices(listOffices)
  }

  const listEmployees = async (token) => {
    const response = await getEmployees(token, { roleId: 3 })
    const list = response.list;
    setEmployees(list);
  }

  const handleLogout = () => {
    sessionStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  const handleSave = async () => {
    try {
      let hasError = false;

      if (!firstName.trim()) {
        toast({
          title: "Campo 'Nombre' requerido",
          description: "Por favor ingrese un nombre.",
          status: "error",
          duration: 1000,
          isClosable: true,
          position: 'top',
        });
        hasError = true;
      }
      if (!lastName.trim()) {
        toast({
          title: "Campo 'Apellido' requerido",
          description: "Por favor ingrese un apellido.",
          status: "error",
          duration: 1000,
          isClosable: true,
          position: 'top',
        });
        hasError = true;
      }
      if (!phone.trim()) {
        toast({
          title: "Campo 'Teléfono' requerido",
          description: "Por favor ingrese un número de teléfono.",
          status: "error",
          duration: 1000,
          isClosable: true,
          position: 'top',
        });
        hasError = true;
      }
      if (!identityNumber.trim()) {
        toast({
          title: "Campo 'Documento de Identidad' requerido",
          description: "Por favor ingrese su documento de identidad.",
          status: "error",
          duration: 1000,
          isClosable: true,
          position: 'top',
        });
        hasError = true;
      }
      if (!address.trim()) {
        toast({
          title: "Campo 'Dirección' requerido",
          description: "Por favor ingrese una dirección.",
          status: "error",
          duration: 1000,
          isClosable: true,
          position: 'top',
        });
        hasError = true;
      }
      if (!birthdate.trim()) {
        toast({
          title: "Campo 'Fecha de Cumpleaños' requerido",
          description: "Por favor ingrese una fecha de cumpleaños.",
          status: "error",
          duration: 1000,
          isClosable: true,
          position: 'top',
        });
        hasError = true;
      }

      if (hasError) return;

      const payload = { firstName, lastName, phone, identityNumber, address, birthdate, selectedOffices }

      if(employeeId){
        payload.id=employeeId
        await updateEmployee(payload,user.token)
      }else{
        await saveEmployee(payload, user.token)
      }
      toast({
        title: "Guardado",
        description: `Empleado ${firstName} ${lastName}`,
        status: "success",
        duration: 1000,
        isClosable: true,
        position: 'top',
      });
      onClose();
      listEmployees(user.token);
    } catch (err) {
      console.error("Error al guardar los datos:", err.message);
    }
  }

  const handleNew = () => {
    setAction('Nuevo');
    onOpen();
    setEmployeeId(null)
    setFirstName('');
    setLastName('');
    setPhone('');
    setIdentityNumber('');
    setAddress('');
    setBirthdate('');
    setSelectedOffices([]);
  }

  const handleEdit = (emp) => {
    setAction('Editar');
    onOpen();

    setEmployeeId(emp.id);
    setFirstName(emp.firstname);
    setLastName(emp.lastname);
    setPhone(emp.phone);
    setIdentityNumber(emp.identitynumber);
    setAddress(emp.address);

    const isoDate = new Date(emp.birthdate).toISOString().split('T')[0];
    setBirthdate(isoDate);

    setSelectedOffices([]);
    getAssignedOffices(emp.id);

  }

  const getAssignedOffices = async (employeeId) => {
    const response = await getAssignedOfficesByEmployee(employeeId, user.token);
    setSelectedOffices(response.list);
  }

  const handleDelete = async (employeeId) => {
    try {
      await deleteEmployee(employeeId, user.token); 
      toast({
        title: 'Empleado eliminado',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
      listEmployees(user.token);
    } catch (err) {
      toast({
        title: 'Error al eliminar',
        description: err.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
    }
  }

  if (loading) {
    return (
      <Container centerContent py={8}>
        <Spinner size="xl" />
      </Container>
    )
  }

  return (
    <Container maxW="md" centerContent py={8}>
      <VStack spacing={5} >
        <Heading as="h2" size="lg">
          Bienvenido, {user.firstname}
          <Button ml={5} colorScheme="blue"
            onClick={handleNew}>
            Nuevo
          </Button>
          <Button colorScheme="red" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Heading>
      </VStack>


      {/*TABLA DE EMPLEADOS */}
      <Table variant="striped" mt={5} colorScheme="gray" >
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
                  onClick={() => { handleEdit(emp) }}
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


      {/**ALERTA PARA DIALOGO DE ELIMINACION */}
      <AlertDialog
        isOpen={isDelOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDelClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar Empleado
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro que deseas eliminar al empleado con ID {toDeleteId}?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDelClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  handleDelete(toDeleteId);
                  onDelClose();
                }}
                ml={3}
              >
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* MODAL GUARDAR EMPLEADO*/}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{action} Empleado</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={2} spacing={4}>
              <FormControl isRequired mb={4}>
                <FormLabel>Nombre</FormLabel>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Nombre"
                />
              </FormControl>
              <FormControl isRequired mb={4}>
                <FormLabel>Apellido</FormLabel>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Apellido"
                />
              </FormControl>
              <FormControl isRequired mb={4}>
                <FormLabel>Telefono</FormLabel>
                <Input
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,9}$/.test(value)) {
                      setPhone(value);
                    }
                  }}
                  placeholder="Telefono"
                />
              </FormControl>
              <FormControl isRequired mb={4}>
                <FormLabel>Documento de Identidad</FormLabel>
                <Input
                  value={identityNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,8}$/.test(value)) {
                      setIdentityNumber(value)
                    }
                  }}
                  placeholder="DNI"
                />
              </FormControl>
              <FormControl isRequired mb={4}>
                <FormLabel>Direccion</FormLabel>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Direccion"
                />
              </FormControl>
              <FormControl isRequired mb={4}>
                <FormLabel>Fecha Cumpleaños</FormLabel>
                <Input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  placeholder="Fecha Cumpleaños"
                />
              </FormControl>
            </SimpleGrid>
            <FormControl mb={4}>
              <FormLabel>Oficinas</FormLabel>
              <OfficesMultiSelect
                offices={offices}
                selected={selectedOffices}
                onChange={setSelectedOffices}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleSave}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Container>
  )
}
