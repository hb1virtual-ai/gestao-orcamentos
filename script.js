// script.js – SALVA TUDO NO NAVEGADOR (localStorage)
// Funciona 100% em Hostinger, sem Node.js, sem 404

document.addEventListener('DOMContentLoaded', () => {
    console.log('Sistema carregado com localStorage');

    // === ELEMENTOS DO DOM ===
    const productForm = document.getElementById('productForm');
    const productList = document.getElementById('productList');
    const budgetForm = document.getElementById('budgetForm');
    const budgetList = document.getElementById('budgetList');

    // === FUNÇÕES DE PRODUTOS ===
    function loadProducts() {
        const data = localStorage.getItem('products');
        return data ? JSON.parse(data) : [];
    }

    function saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products));
    }

    function renderProducts() {
        const products = loadProducts();
        if (!productList) return;

        productList.innerHTML = '';
        products.forEach((p, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${p.name}</strong> - R$ ${p.price}
                <button onclick="removeProduct(${index})" style="margin-left: 10px; color: red;">Remover</button>
            `;
            productList.appendChild(li);
        });
    }

    window.removeProduct = function(index) {
        let products = loadProducts();
        products.splice(index, 1);
        saveProducts(products);
        renderProducts();
    };

    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('productName').value.trim();
            const price = parseFloat(document.getElementById('productPrice').value);

            if (!name || isNaN(price) || price <= 0) {
                alert('Preencha nome e preço válido!');
                return;
            }

            const products = loadProducts();
            products.push({ name, price });
            saveProducts(products);
            renderProducts();

            productForm.reset();
            alert('Produto salvo com sucesso!');
        });
    }

    // === FUNÇÕES DE ORÇAMENTOS ===
    function loadBudgets() {
        const data = localStorage.getItem('budgets');
        return data ? JSON.parse(data) : [];
    }

    function saveBudgets(budgets) {
        localStorage.setItem('budgets', JSON.stringify(budgets));
    }

    function renderBudgets() {
        const budgets = loadBudgets();
        if (!budgetList) return;

        budgetList.innerHTML = '';
        budgets.forEach((b, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${b.client}</strong> - Total: R$ ${b.total.toFixed(2)}
                <button onclick="removeBudget(${index})" style="margin-left: 10px; color: red;">Remover</button>
            `;
            budgetList.appendChild(li);
        });
    }

    window.removeBudget = function(index) {
        let budgets = loadBudgets();
        budgets.splice(index, 1);
        saveBudgets(budgets);
        renderBudgets();
    };

    if (budgetForm) {
        budgetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const client = document.getElementById('clientName').value.trim();
            const items = document.getElementById('budgetItems').value.trim();

            if (!client || !items) {
                alert('Preencha cliente e itens!');
                return;
            }

            const products = loadProducts();
            let total = 0;
            const lines = items.split('\n');
            lines.forEach(line => {
                const match = line.match(/R\$\s*([\d.,]+)/);
                if (match) {
                    total += parseFloat(match[1].replace('.', '').replace(',', '.'));
                }
            });

            const budgets = loadBudgets();
            budgets.push({ client, items, total });
            saveBudgets(budgets);
            renderBudgets();

            budgetForm.reset();
            alert('Orçamento salvo com sucesso!');
        });
    }

    // === INICIAR ===
    renderProducts();
    renderBudgets();
});