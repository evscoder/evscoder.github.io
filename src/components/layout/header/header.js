import { gsap, Back } from 'gsap/all.js';

export default class Header {
    constructor() {
        this.header = document.querySelector('.page-header');
        this.tooltipElement = document.querySelector('.page-header__avatar .tooltip');

        if (this.header) {
            this.onInit();
        }
    }

    onScrolled = () => {
        const header = this.header;
        const targetTop = header.offsetHeight + 20;

        header.classList.toggle('is-fixed', window.pageYOffset > targetTop);
    };

    tooltip() {
        if (!this.tooltipElement) {
            return;
        }

        gsap.to(this.tooltipElement, {
            opacity: 1,
            display: 'block',
            delay: 4,
            ease: Back.easeOut.config(2),
            onComplete: () => {
                gsap.to(this.tooltipElement, {
                    opacity: 0,
                    delay: 10,
                    ease: Back.easeIn.config(2),
                    onComplete: () => {
                        this.tooltipElement.style.display = 'none';
                    }
                });
            }
        });
    }

    onInit() {
        this.tooltip();

        document.addEventListener('scroll', this.onScrolled);
    }

    dispose() {}
}
