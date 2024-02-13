import { gsap, ScrollTrigger, ScrollToPlugin } from 'gsap/all.js';
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default class ScrollTo {
    constructor(el, offsetTop, velocity) {
        this.header = document.querySelector('.page-header');
        this.links = document.querySelectorAll(el);
        this.el = el;
        this.props = {
            offsetTop: offsetTop,
            velocity: velocity
        };
        this.onInit();
    }

    onInit() {
        this.links.forEach(element => {
            const target = element.getAttribute('href');

            if (!target) {
                return;
            }

            element.addEventListener('click', this.onScroll);
        });
    }

    onScroll = event => {
        const { currentTarget: selector } = event;

        if (!selector) {
            return;
        }

        event.preventDefault();

        const { velocity } = this.props;
        let offsetY = 0;

        gsap.to(window, {
            duration: velocity,
            scrollTo: {
                y: selector,
                offsetY
            }
        });
    };
}
