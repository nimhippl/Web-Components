export function setActiveButton(button, selector) {
    if (!button) return;

    document.querySelectorAll(selector).forEach(item => {
        item.classList.remove('active');
    });

    button.classList.add('active');
}

export function createThemeSwitcher(applyThemeToTarget) {
    document.querySelectorAll('.theme-button').forEach(button => {
        button.addEventListener('click', event => {
            const clickedButton = event.currentTarget;
            const theme = clickedButton.dataset.theme;
            const target = clickedButton.dataset.target;

            if (!theme || !target) return;

            clickedButton.parentElement.querySelectorAll('.theme-button').forEach(item => {
                item.classList.remove('active');
            });

            clickedButton.classList.add('active');

            applyThemeToTarget(target, theme);
        });
    });
}