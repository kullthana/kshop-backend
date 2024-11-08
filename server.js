const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
