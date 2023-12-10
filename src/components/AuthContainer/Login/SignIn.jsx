import React, { useContext, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getDocs, query, where, collection } from 'firebase/firestore';
import { db } from '../../../firebase/client';
import { ShopContext } from '../../../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../../errors/CustomAlert';

function SignIn() {
  const navigate = useNavigate();
  const { cart, setCart } = useContext(ShopContext);
  const [alertOpen, setAlertOpen] = useState(false);

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get('username');
    const password = data.get('userpassword');

    if (!email || !password) {
      setAlertOpen(true);
      return;
    }

    // Consulta en Firestore para verificar el usuario
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email), where('password', '==', password));

    try {
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setAlertOpen(true);
        return;
      }

      const user = snapshot.docs[0].data();
      setCart({
        ...cart,
        buyer: {
          name: user.name,
          phone: user.phone,
          email: user.email,
        },
      });

      navigate("/");
    } catch (error) {
      setAlertOpen(true);
    }
  };

  const defaultTheme = createTheme();

  return (
    <>
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom:25
          }}
        >   
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Email"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="userpassword"
              label="Password"
              type="password"
              id="userpassword"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link onClick={() => navigate("/singup")} variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>          
   
        <CustomAlert
          open={alertOpen}
          onClose={handleCloseAlert}
          title="Alerta"
          description="Por favor, ingrese un correo electrónico y una contraseña válidos."
        />
      </Container>
    </ThemeProvider>
    </>
    
  );
}

export default SignIn;
