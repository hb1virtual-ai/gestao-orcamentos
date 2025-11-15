const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;  // Render força essa porta

const PRODUCTS_FILE = path.join(__dirname, 'products.json');
const BUDGETS_FILE = path.join(__dirname, 'budgets.json');

// CORS para seu domínio
app.use(cors({
  origin: ['https://virtualparaiso.com.br', 'https://virtualparaiso.com.br/security/orcamento_supremo'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json({ limit: '10mb' }));

// Inicializar arquivos vazios
function initializeFiles() {
  if (!fs.existsSync(PRODUCTS_FILE)) fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2));
  if (!fs.existsSync(BUDGETS_FILE)) fs.writeFileSync(BUDGETS_FILE, JSON.stringify([], null, 2));
}

// Load/Save produtos
function loadProducts() {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveProducts(products) {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    return true;
  } catch {
    return false;
  }
}

// Load/Save orçamentos
function loadBudgets() {
  try {
    const data = fs.readFileSync(BUDGETS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveBudgets(budgets) {
  try {
    fs.writeFileSync(BUDGETS_FILE, JSON.stringify(budgets, null, 2));
    return true;
  } catch {
    return false;
  }
}

// ROTAS API
app.get('/api/products', (req, res) => {
  console.log('GET /api/products');
  res.json(loadProducts());
});

app.post('/api/products', (req, res) => {
  console.log('POST /api/products:', req.body);
  if (saveProducts(req.body)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

app.get('/api/budgets', (req, res) => {
  console.log('GET /api/budgets');
  res.json(loadBudgets());
});

app.post('/api/budgets', (req, res) => {
  console.log('POST /api/budgets:', req.body);
  if (saveBudgets(req.body)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

// Teste CORS
app.get('/test-cors', (req, res) => {
  res.json({ message: 'CORS OK!', origin: req.headers.origin });
});

// Rota raiz (para evitar "Cannot GET /")
app.get('/', (req, res) => {
  res.json({ message: 'API Orçamento Supremo rodando! Use /api/products ou /api/budgets' });
});

// Inicializar
initializeFiles();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
