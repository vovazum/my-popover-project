import '../css/style.css';

document.addEventListener('DOMContentLoaded', function () {
    const trigger = document.getElementById('popover-trigger');
    const popover = document.getElementById('popover');

    if (!trigger || !popover) {
        console.error('Элементы не найдены!');
        return;
    }

    // Устанавливаем базовые стили
    popover.style.position = 'absolute';
    popover.style.opacity = '0';
    popover.style.pointerEvents = 'none';
    popover.style.transition = 'opacity 0.3s ease';

    trigger.addEventListener('click', function () {
        const isVisible = popover.classList.contains('show');

        if (isVisible) {
            // Скрыть
            popover.classList.remove('show');
            popover.style.opacity = '0';
            popover.style.pointerEvents = 'none';
        } else {
            // Временно показать, чтобы получить размеры
            popover.classList.add('show');
            popover.style.opacity = '0'; // Пока ещё невидим
            popover.style.pointerEvents = 'none';

            // Даем браузеру немного времени на рендер
            requestAnimationFrame(() => {
                const rect = trigger.getBoundingClientRect();
                const popoverWidth = popover.offsetWidth;
                const popoverHeight = popover.offsetHeight;

                // Центрирование
                const left = rect.left + window.scrollX + rect.width / 2 - popoverWidth / 2;
                const top = rect.top + window.scrollY - popoverHeight - 10;

                popover.style.left = `${left}px`;
                popover.style.top = `${top}px`;

                // Отображаем по-настоящему
                popover.style.opacity = '1';
                popover.style.pointerEvents = 'auto';
            });
        }
    });
});
