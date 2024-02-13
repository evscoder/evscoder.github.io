import { gsap, ScrollTrigger, ScrollToPlugin } from 'gsap/all.js';
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default class ScrollUp {
    constructor() {
        this.button = document.querySelector('.back-to-top-fixed');

        if (!this.button) {
            return;
        }

        this.target = document.getElementById('content');
        this.progressBar = this.button.querySelector('.back-to-top-fixed__bar');
        this.progressBar.style.strokeDasharray = this.totalLength;
        this.progressBar.style.strokeDashoffset = this.totalLength;

        this.onInit();
    }

    get totalLength() {
        return this.progressBar.getTotalLength();
    }

    setProgress() {
        const { clientHeight, scrollHeight, scrollTop } = document.documentElement;
        const percentage = scrollTop / (scrollHeight - clientHeight);

        this.progressBar.style.strokeDashoffset = this.totalLength - this.totalLength * percentage;
    }

    onButtonClick = event => {
        event.preventDefault();

        gsap.to(window, {
            duration: 0.4,
            scrollTo: 0
        });
    };

    onScrolled = () => {
        this.button = document.querySelector('.back-to-top-fixed');

        if (!this.button) {
            this.disposeOnScroll();

            return;
        }

        this.setProgress();
    };

    onInit() {
        this.button.addEventListener('click', this.onButtonClick);
        window.addEventListener('scroll', this.onScrolled);

        gsap.to(this.button, {
            scrollTrigger: {
                trigger: this.target,
                start: '100',
                scrub: true,
                onEnter: () => this.button?.classList.add('is-active'),
                onLeaveBack: () => this.button?.classList.remove('is-active')
            }
        });
    }

    disposeOnScroll() {
        window.removeEventListener('scroll', this.onScrolled);
    }
}
