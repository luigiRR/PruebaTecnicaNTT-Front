// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/api';
import {
    Box,
    Button,
    Input,
    FormControl,
    FormLabel,
    Heading,
    Container,
    Text,
    SimpleGrid,
    FormHelperText
} from '@chakra-ui/react';

export default function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
            const data = await register({ firstName, lastName, phone, birthdate, email, password });
            sessionStorage.setItem('user', JSON.stringify(data));
            navigate('/login', { replace: true });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Container maxW="md" centerContent py={8}>
            <Box w="100%">
                <Heading mb={6}>Registro de Usuario</Heading>
                {error && <Text color="red.500">{error}</Text>}
                <form onSubmit={handleSubmit}>
                    <SimpleGrid columns={2} spacing={4}>
                        <FormControl mb={4} isRequired>
                            <FormLabel>Nombre</FormLabel>
                            <Input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </FormControl>

                        <FormControl mb={4} isRequired>
                            <FormLabel>Apellido</FormLabel>
                            <Input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </FormControl>

                        <FormControl mb={4} isRequired>
                            <FormLabel>Teléfono</FormLabel>
                            <Input
                                type="text"
                                value={phone}
                                pattern="^\d{0,9}$"
                                required
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d{0,9}$/.test(value)) {
                                        setPhone(value);
                                    }
                                }}
                            />
                            <FormHelperText>Máximo 9 dígitos.</FormHelperText>
                        </FormControl>

                        <FormControl mb={4} isRequired>
                            <FormLabel>Fecha de Nacimiento</FormLabel>
                            <Input
                                type="date"
                                value={birthdate}
                                onChange={(e) => setBirthdate(e.target.value)}
                                required
                            />
                        </FormControl>

                        <FormControl mb={4} isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </FormControl>

                        <FormControl mb={4} isRequired>
                            <FormLabel>Contraseña</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </FormControl>

                        <FormControl mb={6} isRequired>
                            <FormLabel>Confirmar Contraseña</FormLabel>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </FormControl>
                    </SimpleGrid>

                    <Button type="submit" colorScheme="teal" w="full">
                        Registrarse
                    </Button>
                </form>

                <Text mt={4}>
                    ¿Ya tienes cuenta?{' '}
                    <Button variant="link" colorScheme="blue" onClick={() => navigate('/login')}>
                        Iniciar sesión
                    </Button>
                </Text>
            </Box>
        </Container>
    );
}
