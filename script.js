import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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
    confirmBtn.addEventListener('click', async function() {
        const buyerName = document.getElementById('buyerName').value;
        const day = document.getElementById('day').value;
        const month = document.getElementById('month').value;
        const year = document.getElementById('year').value;

        if (!buyerName || !day || !month || !year) {
            alert('Пожалуйста, введите имя второй стороны и выберите дату!');
            return;
        }

        const selectedDate = `${day}/${month}/${year}`;
        const orderId = Date.now(); // Уникальный ID заказа

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
                buyerGoods += `- ${name} — ${qty
