import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { CardActionArea } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/client';

export default function ActionAreaCard() {
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const productsCollection = collection(db, 'productos');
        const productsSnapshot = await getDocs(productsCollection);

        const uniqueCategories = new Set();
        const promises = [];

        productsSnapshot.forEach((doc) => {
          const productData = doc.data();
          if (productData.categoria && !uniqueCategories.has(productData.categoria)) {
            uniqueCategories.add(productData.categoria);

            const productsQuery = query(productsCollection, where('categoria', '==', productData.categoria));
            const promise = getDocs(productsQuery).then((categoryProductsSnapshot) => {
              const firstProduct = categoryProductsSnapshot.docs[0];
              const firstProductData = firstProduct?.data();

              return {
                title: productData.categoria,
                image: firstProductData?.image || 'https://via.placeholder.com/150',
                description: `Productos de la categoría ${productData.categoria}.`,
                productId: firstProduct?.id,
              };
            });

            promises.push(promise);
          }
        });

        // Esperar a que todas las promesas se completen
        const categoriesWithImages = await Promise.all(promises);

        setCardData(categoriesWithImages);
        setLoading(false); // Establecer loading a false cuando todas las categorías se han cargado
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Manejar errores y establecer loading a false
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <Typography gutterBottom variant="h2" component="div"  fontWeight="bold" textAlign="center">
  Categorias
</Typography>
      {loading ? (
        <CircularProgress style={{ margin: '50px auto', display: 'block' }} />
      ) : (
        <Grid container spacing={3} sx={{}}>
          {cardData
            .sort((a, b) => a.title.localeCompare(b.title)) // Ordenar alfabéticamente
            .map((card, index) => (
              <Grid key={index} item xs={12} sm={6} md={3}>
                <Card sx={{ maxWidth: 345, margin: 10 }}>
                  <CardActionArea onClick={() => navigate(`/categorias/${card.title.toLowerCase()}`)}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={card.image}
                      alt={card.title}
                      style={{ objectFit: 'contain' }}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {card.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {card.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
        </Grid>
      )}
    </>
  );
}
