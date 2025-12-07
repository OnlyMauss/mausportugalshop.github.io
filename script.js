import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    const quantities = document.querySelectorAll('.quantity');
    const totalPriceSpan = document.getElementById('totalPrice');
    const confirmBtn = document.getElementById('confirmBtn');
    const addItemBtn = document.getElementById('addItemBtn');
    const buyerItems = document.getElementById('buyerItems');

    function calculateTotal() {
        let total = 0;
        quantities.forEach(input => {
            const price = parseFloat(input.previousElementSibling?.classList.contains('itemPrice') ? input.previousElementSibling.value : input.dataset.price) || 0;
            const qty = parseInt(input.value) || 0;
            total += price * qty;
        });
        totalPriceSpan.textContent = total.toFixed(2);
    }

    document.addEventListener('input', calculateTotal);

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

    confirmBtn.addEventListener('click', async function() {
        const buyerName = document.getElementById('buyerName').value;
        const day = document.getElementById('day').value;
        const month = document.getElementById('month').value;
        const year = document.getElementById('year').value;

        if (!buyerName || !day || !month || !year) {
            alert('Заполните все поля!');
            return;
        }

        const selectedDate = `${day}/${month}/${year}`;
        const orderId = Date.now();

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

        try {
            await addDoc(collection(window.db, "agreements"), {
                orderId,
                buyerName,
                selectedDate,
                portugalGoods,
                buyerGoods,
                totalPrice,
                timestamp: new Date()
            });
            alert('Заказ сохранён в базе данных!');
        } catch (e) {
            console.error("Ошибка сохранения: ", e);
            alert('Ошибка сохранения. Проверьте консоль.');
        }

        const agreementHTML = `
            <!DOCTYPE html>
            <html lang="ru">
            <head>
                <meta charset="UTF-8">
                <title>Торговое Соглашение</title>
                <style>body { font-family: 'Times New Roman', serif; background: #1a1a1a; color: #f0f0f0; margin: 20px; }</style>
            </head>
            <body>
                <h1>Заказ №${orderId}</h1>
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
                <pre>${portugalGoods || 'Нет'}</pre>
                
                <h3>2. Товары, предоставляемые ${buyerName}</h3>
                <pre>${buyerGoods || 'Нет'}</pre>
                
                <h2>III. Тарифы и платежи</h2>
                <ol>
                    <li>Пошлины на взаимный товарооборот снижаются до 15%.</li>
                    <li>Оплата производится в свободно конвертируемой валюте или золоте. Итого: ${totalPrice}$.</li>
                    <li>Возможны льготные тарифы при заключении договора на срок более 3 лет.</li>
                </ol>
                
                <h2>IV. Логистика и доставка</h2>
                <ol>
                    <li>Доставка товаров осуществляется через порты Лиссабона, Порту и Сетубала.</li>
                    <li>Вторая сторона предоставляет доступ к своим основным портам.</li>
                    <li>Стоимость транспортировки распределяется по заранее согласованной формуле.</li>
                </ol>
                
                <h2>V. Урегулирование споров</h2>
                <ol>
                    <li>Все споры решаются через двустороннюю торговую комиссию.</li>
                    <li>При отсутствии решения конфликт передаётся в международный арбитраж.</li>
                </ol>
                
                <p>Это сгенерированное торговое соглашение на основе каталога товаров Португалии.</p>
                <
