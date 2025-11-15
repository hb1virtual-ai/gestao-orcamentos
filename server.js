// server.js (no Render.com)
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Arquivos
const PRODUCTS_FILE = path.join(__dirname, 'products.json');
const BUDGETS_FILE = path.join(__dirname, 'budgets.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Inicializar arquivos
function initializeFiles() {
    if (!fs.existsSync(PRODUCTS_FILE)) fs.writeFileSync(PRODUCTS_FILE, '[]');
    if (!fs.existsSync(BUDGETS_FILE)) fs.writeFileSync(BUDGETS_FILE, '[]');
}

// Rotas API
app.get('/api/products', (req, res) => {
    try {
        const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json([]);
    }
});

app.post('/api/products', (req, res) => {
    try {
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

app.get('/api/budgets', (req, res) => {
    try {
        const data = fs.readFileSync(BUDGETS_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json([]);
    }
});

app.post('/api/budgets', (req, res) => {
    try {
        fs.writeFileSync(BUDGETS_FILE, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

// Inicializar
initializeFiles();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`API rodando em https://orcamento-supremo.onrender.com`);
});
