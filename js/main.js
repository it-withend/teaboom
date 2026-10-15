(function () {
  'use strict';

  const ADDED_STATE_MS = 2000;

  // 349.2 → «349,20 ₽», 1432 → «1 432 ₽»
  function formatPrice(value) {
    const fractionDigits = Number.isInteger(value) ? 0 : 2;
    const formatted = new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value);

    return formatted + ' ₽';
  }

  function initProductCard(card) {
    const form = card.querySelector('[data-buy-form]');
    const variants = card.querySelectorAll('input[name="variant"]');
    const skuEl = card.querySelector('[data-sku]:not(input)');
    const priceEl = card.querySelector('[data-price]:not(input)');
    const oldPriceEl = card.querySelector('[data-old-price]:not(input)');
    const discountEl = card.querySelector('[data-discount]');
    const button = card.querySelector('[data-buy-button]');
    const buttonText = card.querySelector('[data-buy-text]');
    const defaultButtonText = buttonText.textContent;
    let resetTimer = null;

    function render(input) {
      const price = Number(input.dataset.price);
      const oldPrice = Number(input.dataset.oldPrice);
      const hasDiscount = oldPrice > price;

      skuEl.textContent = input.dataset.sku;
      priceEl.textContent = formatPrice(price);
      priceEl.value = price;

      oldPriceEl.textContent = hasDiscount ? formatPrice(oldPrice) : '';
      oldPriceEl.hidden = !hasDiscount;

      discountEl.textContent = hasDiscount
        ? '−' + Math.round((1 - price / oldPrice) * 100) + '%'
        : '';
      discountEl.hidden = !hasDiscount;
    }

    variants.forEach(function (input) {
      input.addEventListener('change', function () {
        render(input);
      });
    });

    // Реальной корзины нет — просто показываем подтверждение на кнопке
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      button.classList.add('is-added');
      buttonText.textContent = 'Добавлено';

      clearTimeout(resetTimer);
      resetTimer = setTimeout(function () {
        button.classList.remove('is-added');
        buttonText.textContent = defaultButtonText;
      }, ADDED_STATE_MS);
    });

    const checked = card.querySelector('input[name="variant"]:checked');
    if (checked) {
      render(checked);
    }
  }

  document.querySelectorAll('[data-product]').forEach(initProductCard);
})();
