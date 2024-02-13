import { gsap, ScrollTrigger } from 'gsap/all.js';
gsap.registerPlugin(ScrollTrigger);

export default class Animations {
    constructor() {
        this.run();
    }

    prepare() {

    }

    refresh() {

    }

    run() {
        this.titles();
        this.about();
    }

    titles() {
        const sectionTitles = document.querySelectorAll('.section__title');

        sectionTitles.forEach(sectionTitle => {
            const titleText = sectionTitle.querySelector('.section__title-text');
            const lineAfter = sectionTitle.querySelector('.section__title-line--after');

            gsap.set([titleText, lineAfter], {
                clipPath: 'polygon(0% 100%, 0 0%, 0% 0%, 0% 100%)'
            });

            const anim = gsap.timeline({ paused: true }).to(sectionTitle, {
                autoAlpha: 1
            }).to(titleText, {
                clipPath: 'polygon(100% 120%, 100% 0%, 0% 0%, 0% 120%)',
                duration: 0.5
            }).to(lineAfter, {
                clipPath: 'polygon(100% 100%, 100% 0%, 0% 0%, 0% 100%)'
            });

            ScrollTrigger.create({
                trigger: sectionTitle,
                start: 'top 90%',
                onEnter: ({ progress }) => {
                    anim.play();

                    if (progress === 1) {
                        anim.pause();
                    }
                },
                onEnterBack: self => {
                    anim.play();
                    self.disable();
                }
            });
        });
    }

    about() {
        const about = document.querySelector('.section-about');

        if (about) {
            const items = about.querySelectorAll('h3, h4, p, li');

            const anim = elements => gsap.to(elements, {
                y: 0,
                autoAlpha: 1,
                stagger: 0.2,
                duration: 1,
                ease: 'power1',
                overwrite: true,
                paused: true,
                delay: 0.3
            });

            gsap.set(items, { autoAlpha: 0, y: 50 });

            ScrollTrigger.batch(items, {
                start: 'top 95%',
                end: 'top 0%',
                onEnter: (self, targets) => {
                    anim(self).play();
                    targets.forEach((target, index) => {
                        if (target.progress === 1) {
                            anim(self[index]).pause();
                        }
                    });
                },
                onEnterBack: (self, targets) => {
                    anim(self).play();
                    targets.forEach(target => {
                        target.disable();
                    });
                }
            });
        }
    }
}
