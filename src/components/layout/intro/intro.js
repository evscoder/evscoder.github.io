import { gsap } from 'gsap/all.js';
import { TextPlugin } from 'gsap/TextPlugin.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
gsap.registerPlugin(TextPlugin, ScrollTrigger);
import SplitType from 'split-type';

export default class Intro {
    constructor() {
        this.animated();
        this.timeIdInContent = null;
        this.timeIdOutContent = null;
    }

    animated() {
        const container = document.querySelector('.intro');

        if (!container) {
            return;
        }

        const pageContent = document.querySelector('.page-content');
        const bgTitle = document.querySelector('.intro-caption__title');
        const content = document.querySelector('.intro__content');
        const pageHeader = document.querySelector('.page-header');
        const headerTitle = document.querySelector('.page-header__title-link');
        const buttonScroll = document.querySelector('.intro__scroll-btn');
        const switcherGrid = document.querySelector('.js-switcher-grid');
        const tl = gsap.timeline();
        const tlIntro = gsap.timeline({
            delay: 0.2
        });

        if (!content) {
            return;
        }

        const titleType = content.querySelector('.text-type');

        gsap.set(headerTitle, {
            opacity: 0,
            onStart: () => {
                headerTitle.style.pointerEvents = 'none';
            }
        });

        gsap.set(bgTitle, {
            clipPath: 'polygon(0 0, -10% 0, -10% 100%, 0 100%)',
            x: '100px'
        });

        gsap.set(titleType, {
            opacity: 0,
            x: '40px'
        });

        gsap.set(buttonScroll, {
            opacity: 0,
            y: '40px'
        });

        const lettersSplit = new SplitType('.intro__title-letters', { type: 'chars' });

        gsap.set(lettersSplit.chars, { opacity: 0 });

        tlIntro
            .to(bgTitle, {
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                duration: 2,
                ease: 'power1.inOut'
            })
            .to(bgTitle, {
                x: 0,
                duration: 2
            }, '-=1.5')
            .to(lettersSplit.chars, {
                autoAlpha: 1,
                stagger: 0.06,
                duration: 0.4,
                delay: 0
            }, '-=2')
            .to(titleType, {
                opacity: 1,
                x: 0
            }, '-=0.4')
            .to(buttonScroll, {
                opacity: 1,
                y: 0,
                onComplete: () => {
                    buttonScroll.style = '';
                }
            }, '-=0.25');

        tl.to(content, {
            scrollTrigger: {
                trigger: container,
                start: 'top',
                end: 'bottom',
                scrub: 0.1
            },
            y: '200%',
            ease: 'none'
        }).to(content, {
            scrollTrigger: {
                trigger: container,
                start: 'top',
                end: '50%',
                scrub: true,
                onEnterBack: () => {
                    pageHeader.classList.remove('page-header--fixed');
                    gsap.to(headerTitle, {
                        opacity: 0,
                        y: '0',
                        ease: 'none',
                        duration: 0.2,
                        onStart: () => {
                            headerTitle.style.pointerEvents = 'none';
                        }
                    });
                },
                onLeave: () => {
                    pageHeader.classList.add('page-header--fixed');
                    gsap.to(headerTitle, {
                        opacity: 1,
                        y: 0,
                        ease: 'none',
                        delay: 0.1,
                        duration: 0.2,
                        onStart: () => {
                            headerTitle.style.pointerEvents = '';
                        }
                    });
                }
            },
            opacity: 0,
            ease: 'none'
        });

        gsap.to(pageContent, {
            y: 0,
            duration: 1,
            scrollTrigger: {
                trigger: pageContent,
                start: 'top bottom',
                end: 'top 80%',
                scrub: 1,
                onLeaveBack: () => {
                    if (switcherGrid) {
                        switcherGrid.closest('.switcher-grid').classList.remove('is-visible');
                    }

                    clearTimeout(this.timeIdInContent);

                    this.timeIdOutContent = setTimeout(() => {
                        ScrollTrigger.refresh();
                        buttonScroll.classList.add('is-visible');
                    }, 300);
                },
                onLeave: () => {
                    clearTimeout(this.timeIdOutContent);

                    this.timeIdInContent = setTimeout(() => {
                        ScrollTrigger.refresh();
                        buttonScroll.classList.remove('is-visible');

                        if (switcherGrid) {
                            switcherGrid.closest('.switcher-grid').classList.add('is-visible');
                        }
                    }, 300);
                }
            }
        });
    }
}
