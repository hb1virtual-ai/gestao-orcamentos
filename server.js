const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Arquivos de dados
const PRODUCTS_FILE = path.join(__dirname, 'products.json');
const BUDGETS_FILE = path.join(__dirname, 'budgets.json');

// === CORS CONFIGURADO PARA SEU DOMÍNIO ===
app.use(cors({
    origin: ['https://virtualparaiso.com.br', 'https://virtualparaiso.com.br/security/orcamento_supremo'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json({ limit: '10mb' }));

// === FUNÇÕES DE ARQUIVO ===
function initializeFiles() {
    if (!fs.existsSync(PRODUCTS_FILE)) {
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2));
    }
    if (!fs.existsSync(BUDGETS_FILE)) {
        fs.writeFileSync(BUDGETS_FILE, JSON.stringify([], null, 2));
    }
}

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

function saveProducts(products) {
    try {
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
        return true;
    } catch (error) {
        console.error('Erro ao salvar produtos:', error);
        return false;
    }
}

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

function saveBudgets(budgets) {
    try {
        fs.writeFileSync(BUDGETS_FILE, JSON.stringify(budgets, null, 2));
        return true;
    } catch (error) {
        console.error('Erro ao salvar orçamentos:', error);
        return false;
    }
}

// === ROTAS API ===
app.get('/api/products', (req, res) => {
    console.log('GET /api/products chamado');
    const products = loadProducts();
    res.json(products);
});

app.post('/api/products', (req, res) => {
    console.log('POST /api/products chamado com:', req.body);
    const products = req.body;
    if (saveProducts(products)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, error: 'Erro ao salvar produtos' });
    }
});

app.get('/api/budgets', (req, res) => {
    console.log('GET /api/budgets chamado');
    const budgets = loadBudgets();
    res.json(budgets);
});

app.post('/api/budgets', (req, res) => {
    console.log('POST /api/budgets chamado com:', req.body);
    const budgets = req.body;
    if (saveBudgets(budgets)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, error: 'Erro ao salvar orçamentos' });
    }
});

// Rota para testar CORS
app.get('/test-cors', (req, res) => {
    res.json({ message: 'CORS funcionando!', origin: req.headers.origin });
});

// Inicializar arquivos
initializeFiles();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`API: https://orcamento-supremo.onrender.com/api/products`);
});
