// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/api';
import { 
  Box, Button, Input, FormControl, FormLabel, Heading, Container, Text 
} from '@chakra-ui/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login({ email, password });
      sessionStorage.setItem('user',JSON.stringify(data))
      navigate('/workers', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxW="md" centerContent py={8}>
      <Box w="100%">
        <Heading mb={6}>Iniciar sesión</Heading>
        {error && <Text color="red.500">{error}</Text>}
        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>
          <FormControl mb={6}>
            <FormLabel>Contraseña</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>
          <Button type="submit" colorScheme="teal" w="full">
            Entrar
          </Button>
        </form>
      </Box>
    </Container>
  );
}