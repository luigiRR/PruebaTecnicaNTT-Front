// src/components/EmployeeModal.jsx
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    SimpleGrid,
    FormControl,
    FormLabel,
    Input
} from '@chakra-ui/react';
import OfficesMultiSelect from './OfficesMultiSelect';

const EmployeeModal = ({
    isOpen,
    onClose,
    action,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    setPhone,
    identityNumber,
    setIdentityNumber,
    address,
    setAddress,
    birthdate,
    setBirthdate,
    selectedOffices,
    setSelectedOffices,
    offices,
    handleSave
}) => {
    return (
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
                                        setIdentityNumber(value);
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
    );
};

export default EmployeeModal;
