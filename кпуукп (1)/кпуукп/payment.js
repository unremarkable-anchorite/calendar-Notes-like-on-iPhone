// payment.js

// Класс для обработки различных стратегий оплаты
class PaymentStrategy {
    pay(amount) {
        throw new Error("Метод pay() должен быть реализован");
    }
}

class CardPayment extends PaymentStrategy {
    pay(amount) {
        alert(`Оплата на сумму ${amount} руб. прошла успешно!`);
    }
}

class PaymentContext {
    setStrategy(strategy) {
        this.strategy = strategy;
    }

    executeStrategy(amount) {
        this.strategy.pay(amount);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const payBtn = document.getElementById('pay-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const paymentContext = new PaymentContext();
    paymentContext.setStrategy(new CardPayment());

    payBtn.addEventListener('click', function() {
        const amount = 5000; // Здесь можно подставить сумму из выбранного плана
        paymentContext.executeStrategy(amount);
        window.location.href = 'index.html';
    });

    cancelBtn.addEventListener('click', function() {
        window.location.href = 'premium.html';
    });
});
