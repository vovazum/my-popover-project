import '../css/style.css';

document.addEventListener('DOMContentLoaded', function() {
    const trigger = document.getElementById('popover-trigger');
    const popover = document.getElementById('popover');

    if (!trigger || !popover) {
        console.error('Элементы не найдены!');
        return;
    }

    // Инициализация стилей popover
    popover.style.position = 'absolute';
    popover.style.transition = 'opacity 0.3s ease';
    popover.style.opacity = '0';  // Изначально скрыт

    trigger.addEventListener('click', function() {
        const rect = trigger.getBoundingClientRect();

        // Логируем позицию кнопки и поповера
        console.log('Координаты кнопки:', rect);
        console.log('Ширина поповера:', popover.offsetWidth);
        console.log('Высота поповера:', popover.offsetHeight);

        // Если popover уже видим, скрываем его
        if (popover.classList.contains('show')) {
            popover.classList.remove('show');
            popover.style.pointerEvents = 'none'; // Отключаем события при скрытии
        } else {
            // Показываем popover
            popover.style.left = `${rect.left + window.scrollX + rect.width / 2 - popover.offsetWidth / 2}px`; // Центрируем по горизонтали
            popover.style.top = `${rect.top + window.scrollY - popover.offsetHeight - 10}px`; // Помещаем выше кнопки с отступом
            popover.classList.add('show');
            popover.style.opacity = '1';  // Делаем popover видимым
            popover.style.pointerEvents = 'auto'; // Включаем события при отображении
        }
    });
});
