import 'swiper/css';
import 'swiper/css/scrollbar';
import 'photoswipe/style.css';
import isTouchDevices from './fn/detected.js';
import Header from '../components/layout/header/header.js';
import Intro from '../components/layout/intro/intro.js';
import Projects from '../components/layout/project-cover/project-cover.js';
import SwitcherTheme from '../components/ui/switcher-theme/switcher-theme.js';
import Stars from './stars.js';
import GetTime from './get-time.js';
import ScrollUp from './scroll-up.js';
import ScrollTo from './scroll-to.js';
import Transitions from './transitions.js';
import ExperianceDate from './experience-date.js';
import Animations from './animations.js';
import SwitcherGrid from '../components/ui/switcher-grid/switcher-grid.js';

class App {
    constructor() {
        this.setDetected();
        this.onInit();
    }

    setDetected() {
        if (isTouchDevices) {
            document.querySelector('html').classList.add('is-touch');
        }
    }

    onLoaded = () => {
        document.body.classList.add('load');
    };

    getComponents = () => {
        new Header();
        new Intro();
        new Projects();
        new Stars('stars');
        new ScrollUp();
        new ExperianceDate();
        new GetTime();
        new Animations();
        new ScrollTo('.js-scroll-link', 0, 0.6);
        new SwitcherGrid(document.querySelector('#projectFilter'));

        const copyrightDate = document.querySelector('.js-copyright-date');

        copyrightDate.innerHTML = new Date().getFullYear();
    };

    onReady = () => {
        window.addEventListener('load', this.onLoaded);
        new SwitcherTheme();
        this.getComponents();
        new Transitions(this.getComponents);
    };

    onInit() {
        document.addEventListener('DOMContentLoaded', this.onReady);
    }
}

const app = new App();
