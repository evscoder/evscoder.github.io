export default class ExperianceDate {
    constructor() {
        this.element = document.querySelector('.js-exp-date');
        this.date = new Date();

        if (this.element) {
            this.init();
        }
    }

    init() {
        const { startDate } = this.element.dataset;
        this.element.textContent = this.date.getFullYear() - startDate;
    }
}
