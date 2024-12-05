const express = require('express');
const todosRoutes = require('./routes/tododb.js');
const authRoutes = require('./routes/authRoutes');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const { isAuthenticated } = require('./middlewares/middleware.js');
const db = require('./database/db.js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware untuk parsing URL dan JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware untuk file statis (CSS, Images, JS)
app.use(express.static('public'));

// Middleware untuk express-ejs-layouts
app.use(expressLayouts);

// Set view engine ke EJS
app.set('view engine', 'ejs');

// Konfigurasi express-session
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // Ubah ke true jika menggunakan HTTPS
    })
);

// Rute untuk otentikasi
app.use('/', authRoutes);

// Rute untuk Todos
app.use('/todos', todosRoutes);

// Rute Halaman Utama (Home)
app.get('/', isAuthenticated, (req, res) => {
    res.render('index', {
        layout: 'layouts/main-layout.ejs',
        title: 'Home Page',
    });
});

// Rute Halaman Kontak
app.get('/contact', isAuthenticated, (req, res) => {
    res.render('contact', {
        layout: 'layouts/main-layout.ejs',
        title: 'Contact Us',
    });
});

// Rute Halaman Todo View
app.get('/todo-view', isAuthenticated, (req, res) => {
    db.query('SELECT * FROM todos', (err, todos) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.render('todo', {
            layout: 'layouts/main-layout.ejs',
            title: 'Todo List',
            todos: todos,
        });
    });
});

// Penanganan 404 untuk rute yang tidak ditemukan
app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});