import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box, Typography, Button, Card, CardContent, CardMedia, Grid } from '@mui/material';
import ItemCount from './ItemCount';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/client';

export default function ItemDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productoRef = doc(db, 'productos', id);

    getDoc(productoRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setData({
            id: snapshot.id,
            ...snapshot.data(),
          });
        } else {
          navigate("/Pagenofound")
        }
      })
      .catch((e) => {
        console.error(e);
        setError('Error al cargar el producto.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Typography variant="h6">Cargando...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button component={Link} to="/" variant="outlined" color="primary" style={{ marginTop: 2 }}>
          Volver a Home
        </Button>
      </Box>
    );
  }

  return (
    <Grid container justifyContent="center" alignItems="center" spacing={3}>
      <Grid item xs={12} sm={6}>
        <Card>
          <Typography p={3} variant="h4" component="div">
            {data.title}
          </Typography>
          <CardMedia component="img" alt={data.title} height="300" image={data.image} style={{ objectFit: 'contain' }} />
          <CardContent>
            <Typography variant="h5">Descripcion:</Typography>

            <Typography variant="subtitle1" color="textSecondary">
              {data.description}
            </Typography>

            <Box sx={{ textAlign: 'center', marginTop: 2 }}>
              <ButtonGroup variant="contained" aria-label="outlined button group disableElevation" fullWidth>
                <Button onClick={() => navigate(`/categorias/`)}>Categorias</Button>
                <Button onClick={() => navigate(`/categorias/${data.categoria}`)}>{data.categoria}</Button>
                <Button style={{ cursor: 'default' }}>Precio: $ {data.price}</Button>
                <Button style={{ cursor: 'default', background: data.stock === 0 ? 'red' : 'primary' }}>
                  Stock disponible: {data.stock}
                </Button>
              </ButtonGroup>

              <Box mt={2}>
                <ItemCount item={data} />
              </Box>

              <Button
                endIcon={<ShortcutIcon />}
                onClick={() => navigate("/")}
                variant="outlined"
                fullWidth
                mt={2}
              >
                Seguir Comprando
              </Button>

              <Button
                endIcon={<ShoppingCartIcon />}
                onClick={() => navigate("/cart")}
                variant="outlined"
                fullWidth
                mt={2}
              >
                ir al carrito
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
