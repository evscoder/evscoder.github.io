export default class SwitcherGrid {
    constructor(el) {
        this.switcher = el;

        if (this.switcher) {
            this.floatElement = this.switcher.querySelector('.switcher-grid__float');

            this.init();
        }
    }

    getWidth(element, activeButton) {
        const elem = element;

        elem.style.width = `${activeButton.offsetWidth + 4}px`;
        elem.style.transform = `translateX(${activeButton.offsetLeft - 2}px) scale(1.01)`;
    }

    getPosition = () => {
        const active = this.switcher.querySelector('.is-active');

        this.getWidth(this.floatElement, active);
    };

    toggle = event => {
        const { target } = event;
        const btn = target.closest('.switcher-grid__filter-btn');

        if (!btn || !btn.contains(target)) {
            return;
        }

        this.getWidth(this.floatElement, target);
    };

    init() {
        this.getPosition();
        this.switcher.addEventListener('click', this.toggle);
    }

    dispose() {
        this.switcher.removeEventListener('click', this.toggle);
    }
}
