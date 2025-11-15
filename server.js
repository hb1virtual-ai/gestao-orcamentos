const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;
const PRODUCTS_FILE = path.join(__dirname, 'products.json');
const BUDGETS_FILE = path.join(__dirname, 'budgets.json');

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static('.'));

// Garantir que os arquivos existam
function initializeFiles() {
    if (!fs.existsSync(PRODUCTS_FILE)) {
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2));
    }
    if (!fs.existsSync(BUDGETS_FILE)) {
        fs.writeFileSync(BUDGETS_FILE, JSON.stringify([], null, 2));
    }
}

// Carregar produtos
function loadProducts() {
    try {
        if (fs.existsSync(PRODUCTS_FILE)) {
            const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
    return [];
}

// Salvar produtos
function saveProducts(products) {
    try {
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
        return true;
    } catch (error) {
        console.error('Erro ao salvar produtos:', error);
        return false;
    }
}

// Carregar orçamentos
function loadBudgets() {
    try {
        if (fs.existsSync(BUDGETS_FILE)) {
            const data = fs.readFileSync(BUDGETS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Erro ao carregar orçamentos:', error);
    }
    return [];
}

// Salvar orçamentos
function saveBudgets(budgets) {
    try {
        fs.writeFileSync(BUDGETS_FILE, JSON.stringify(budgets, null, 2));
        return true;
    } catch (error) {
        console.error('Erro ao salvar orçamentos:', error);
        return false;
    }
}

// Rotas
app.get('/api/products', (req, res) => {
    const products = loadProducts();
    res.json(products);
});

app.post('/api/products', (req, res) => {
    const products = req.body;
    if (saveProducts(products)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, error: 'Erro ao salvar produtos' });
    }
});

app.get('/api/budgets', (req, res) => {
    const budgets = loadBudgets();
    res.json(budgets);
});

app.post('/api/budgets', (req, res) => {
    const budgets = req.body;
    if (saveBudgets(budgets)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, error: 'Erro ao salvar orçamentos' });
    }
});

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Inicializar arquivos
initializeFiles();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Acesse de outro PC na rede: http://SEU_IP:${PORT}`);
});