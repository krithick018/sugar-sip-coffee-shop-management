const express = require('express');
const bodyParser = require('body-parser');
const dt = require('./database.js');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'Assets' directory
app.use(express.static(path.join(__dirname, 'Assets')));

// Route to serve the Gym.html file
app.get('/', (req, res) => {
    loadPage('index.html', res);
});

// Route to serve the register.html file
app.get('/book', (req, res) => {
    loadPage('book.html', res);
});

// Route to serve the login.html file
app.get('/login', (req, res) => {
    loadPage('login.html', res);
});

// Route to serve the home.html file
app.get('/dashboard', (req, res) => {
    loadPage('dashboard.html', res);
});

// Route to handle form submission for registration
app.post('/book', async (req, res) => {
    const { txtname, txtemail, number, numseats, numtime } = req.body;

    const passdata = JSON.stringify({
       txtname,
       txtemail,
       number,
       numseats,
       numtime,
  
    });

    // Replace dt.insertlocal with your actual database function
    const status = await dt.insertlocal(txtname, txtemail, number, numseats, numtime, passdata);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
        <h1>Booking successful!</h1>
        Your Name: ${txtname}<br>
        Your email: ${txtemail}<br>
        Your number: ${number}<br>
        Number seats: ${numseats}<br>
        Timmings: ${numtime}<br>
       
      
    `);
});

// Route to handle form submission for login
app.post('/login', async (req, res) => {
    const { admin, admin123 } = req.body;
    const isValid = await dt.validateLogin(admin, admin123);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    if (isValid) {
        res.end(`
            <html>
            <head>
                <script type="text/javascript">
                    alert('Login successful! Welcome back, ${admin}');
                    window.location.href = '/dashboard';
                </script>
            </head>
            <body></body>
            </html>
        `);
    } else {
        res.end(`
            <html>
            <head>
                <script type="text/javascript">
                    alert('Login failed. Invalid username or password');
                    window.location.href = '/admin';
                </script>
            </head>
            <body></body>
            </html>
        `);
    }
});

// Function to load HTML page
function loadPage(url, res) {
    fs.readFile(path.join(__dirname, 'Assets', url), (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end('404 Not Found');
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
    });
}

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
