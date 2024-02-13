const SWITCHER_ACTIVE_CLS = 'switcher-theme--active';
const SWITCHER_THEME_CLS = 'theme-alt';

export default class SwitcherTheme {
    constructor() {
        this.onInit();
    }

    static toggle() {
        if (document.documentElement.classList.contains(SWITCHER_THEME_CLS)) {
            const switcher = document.querySelector('.switcher-theme');

            switcher.classList.add(SWITCHER_ACTIVE_CLS);
        }
    }

    onToggle = event => {
        const button = event.target.closest('.switcher-theme');

        if (!button) {
            return;
        }

        event.preventDefault();
        button.classList.toggle(SWITCHER_ACTIVE_CLS);
        document.documentElement.classList.toggle(SWITCHER_THEME_CLS);
    };

    onInit() {
        document.body.addEventListener('click', this.onToggle);
    }

    dispose() {
        document.body.removeEventListener('click', this.onToggle);
    }
}
