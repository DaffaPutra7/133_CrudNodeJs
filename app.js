const express = require('express');
const todosRoutes = require('./routes/tododb.js');
const app = express();
require('dotenv').config();
const port = process.env.PORT;

app.use(express.json());

app.use('/todos', todosRoutes);
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index');
})

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.use((req, res) => {
    res.status(404).send('404 - Page Not Found')
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
});