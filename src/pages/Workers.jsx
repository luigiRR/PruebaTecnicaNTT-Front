// src/pages/Dashboard.jsx
import React from 'react';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOffices, saveEmployee, getEmployees, getAssignedOfficesByEmployee, deleteEmployee, updateEmployee } from '@/api/api'
import { useDisclosure } from '@chakra-ui/react'
import EmployeeTable from '../components/ui/EmployeeTable'
import EmployeeModal from '@/components/ui/EmployeeModal';
import {
  Button,
  Container,
  Heading,
  Spinner,
  VStack,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Flex,
} from '@chakra-ui/react'

export default function Workers() {
  //ABRIR MODAL
  const { isOpen, onOpen, onClose } = useDisclosure()

  //PROPIEDADES DEL EMPLEADO
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

  //USESTATES INICIALES
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

      if (employeeId) {
        payload.id = employeeId
        await updateEmployee(payload, user.token)
      } else {
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
    <Container centerContent py={8}>
      <VStack spacing={5} width="100%" align="stretch">
        <Flex align="center" justify="space-between">
          <Heading as="h2" size="lg">
            Bienvenido, {user.firstname}
          </Heading>
          <Flex gap={3}>
            <Button colorScheme="blue" onClick={handleNew}>
              Nuevo
            </Button>
            <Button colorScheme="red" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </Flex>
        </Flex>
      </VStack>

      {/* COMPONENTE TABLA DE EMPLEADOS */}
      <EmployeeTable
        employees={employees}
        handleEdit={handleEdit}
        setToDeleteId={setToDeleteId}
        onDelOpen={onDelOpen}
      />

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
              ¿Estás seguro que deseas eliminar a este empleado?
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

      {/* COMPONENTE MODAL GUARDAR EMPLEADO*/}
      <EmployeeModal
        isOpen={isOpen}
        onClose={onClose}
        action={action}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        phone={phone}
        setPhone={setPhone}
        identityNumber={identityNumber}
        setIdentityNumber={setIdentityNumber}
        address={address}
        setAddress={setAddress}
        birthdate={birthdate}
        setBirthdate={setBirthdate}
        selectedOffices={selectedOffices}
        setSelectedOffices={setSelectedOffices}
        offices={offices}
        handleSave={handleSave}
      />

    </Container>
  )
}
