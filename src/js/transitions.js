import barba from '@barba/core';
import barbaRouter from '@barba/router';
import gsap from 'gsap/all.js';
import SwitcherTheme from '../components/ui/switcher-theme/switcher-theme.js';
let transitionInit = false;

export default class Transitions {
    constructor(cb) {
        barba.hooks.before(() => {
            document.documentElement.classList.add('is-animating');
        });

        barba.hooks.enter(() => {
            window.scrollTo(0, 0);
            document.documentElement.classList.remove('is-animating');
        });

        if (!transitionInit) {
            transitionInit = true;
            barba.hooks.after(cb);
        }

        barba.use(barbaRouter, {
            routes: [
                { name: 'home', path: '/index.html' },
                { name: 'about', path: '/about.html' }
            ]
        });

        barba.init({
            sync: true,
            transitions: [
                {
                    leave: ({ current }) => this.animateCurrent(current),
                    after: ({ next }) => this.animateNext(next)
                }
            ]
        });
    }

    animateCurrent({ container }) {
        const headerLinks = container.querySelector('.page-header__nav-link');
        const introContent = container.querySelector('.intro__content');
        const introPlaceTitle = container.querySelector('.intro-caption__title');

        gsap.to(introPlaceTitle, {
            clipPath: 'polygon(0 0, -10% 0, -10% 100%, 0 100%)',
            duration: 1
        });

        return gsap.to([headerLinks, introContent], {
            opacity: 0,
            duration: 0.3
        });
    }

    animateNext({ container }) {
        const headerLinks = container.querySelector('.page-header__nav-link');
        const introContent = container.querySelector('.intro__content');

        SwitcherTheme.toggle();

        return gsap.from([headerLinks, introContent], {
            opacity: 0,
            duration: 0.8,
            ease: 'power1.in'
        });
    }
}
