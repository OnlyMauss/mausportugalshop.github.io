document.addEventListener('DOMContentLoaded', function() {
    const quantities = document.querySelectorAll('.quantity');
    const totalPriceSpan = document.getElementById('totalPrice');
    const confirmBtn = document.getElementById('confirmBtn');
    const addItemBtn = document.getElementById('addItemBtn');
    const buyerItems = document.getElementById('buyerItems');

    // Функция расчёта общей цены
    function calculateTotal() {
        let total = 0;
        quantities.forEach(input => {
            const price = parseFloat(input.previousElementSibling?.classList.contains('itemPrice') ? input.previousElementSibling.value : input.dataset.price) || 0;
            const qty = parseInt(input.value) || 0;
            total += price * qty;
        });
        totalPriceSpan.textContent = total.toFixed(2);
    }

    // Обновление цены при изменении
    document.addEventListener('input', calculateTotal);

    // Добавление нового товара для второй стороны
    addItemBtn.addEventListener('click', function() {
        const newItem = document.createElement('div');
        newItem.className = 'item';
        newItem.innerHTML = `
            <input type="text" placeholder="Название товара" class="itemName">
            <input type="number" placeholder="Цена за единицу ($)" class="itemPrice" min="0">
            <input type="number" placeholder="Количество" class="quantity" min="0" value="0">
        `;
        buyerItems.insertBefore(newItem, addItemBtn);
    });

    // Подтверждение покупки и генерация соглашения
    confirmBtn.addEventListener('click', function() {
        const buyerName = document.getElementById('buyerName').value;
        const day = document.getElementById('day').value;
        const month = document.getElementById('month').value;
        const year = document.getElementById('year').value;

        if (!buyerName || !day || !month) {
            alert('Пожалуйста, введите имя второй стороны и выберите дату!');
            return;
        }

        const selectedDate = `${day}/${month}/${year}`;

        // Собираем данные для соглашения
        let portugalGoods = '';
        document.querySelectorAll('#portugalItems .quantity').forEach(input => {
            const qty = parseInt(input.value) || 0;
            if (qty > 0) {
                const name = input.dataset.name;
                const price = input.dataset.price;
                portugalGoods += `- ${name} — ${qty} единиц (цена: ${price}$ за шт.)\n`;
            }
        });

        let buyerGoods = '';
        document.querySelectorAll('#buyerItems .item').forEach(item => {
            const name = item.querySelector('.itemName').value;
            const price = item.querySelector('.itemPrice').value;
            const qty = item.querySelector('.quantity').value;
            if (name && qty > 0) {
                buyerGoods += `- ${name} — ${qty} единиц (цена: ${price}$ за шт.)\n`;
            }
        });

        const totalPrice = totalPriceSpan.textContent;

        // Сохраняем соглашение в localStorage
        const agreement = {
            buyerName,
            selectedDate,
            portugalGoods,
            buyerGoods,
            totalPrice,
            date: new Date().toLocaleString()
        };
        let agreements = JSON.parse(localStorage.getItem('tradeAgreements')) || [];
        agreements.push(agreement);
        localStorage.setItem('tradeAgreements', JSON.stringify(agreements));
        console.log('Соглашение сохранено:', agreement); // Отладка

        // Генерируем HTML для соглашения и открываем в новой вкладке
        const agreementHTML = `
            <!DOCTYPE html>
            <html lang="ru">
            <head>
                <meta charset="UTF-8">
                <title>Торговое Соглашение</title>
                <style>body { font-family: 'Times New Roman', serif; background: #1a1a1a; color: #f0f0f0; margin: 20px; }</style>
            </head>
            <body>
                <h1>🤝 Торговое соглашение между Португалией и ${buyerName} (${selectedDate})</h1>
                <h2>Преамбула</h2>
                <p>Правительство Португальской Республики и правительство ${buyerName}, руководствуясь стремлением укрепить экономические связи, повысить взаимную выгоду и обеспечить стабильность товарооборота между нашими государствами, заключают настоящее Торговое Соглашение.</p>
                
                <h2>I. Общие положения</h2>
                <ol>
                    <li>Стороны признают друг друга равноправными участниками международной торговли.</li>
                    <li>Настоящее соглашение регулирует обмен товарами, тарифы, условия доставки и финансовые обязательства.</li>
                    <li>Срок действия соглашения — 5 лет с возможностью продления по взаимному согласию.</li>
                </ol>
                
                <h2>II. Основные торговые положения</h2>
                <h3>1. Товары, предоставляемые Португалией</h3>
                <p>Португалия обязуется ежегодно предоставлять:</p>
                <pre>${
