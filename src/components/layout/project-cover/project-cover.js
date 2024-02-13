import VanillaTilt from 'vanilla-tilt';
import {
    gsap,
    Circ,
    Back
} from 'gsap/all.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import Swiper from 'swiper';
import {
    FreeMode,
    Pagination,
    Manipulation,
    Scrollbar,
    Mousewheel, Navigation
} from 'swiper/modules';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import PhotoSwipe from 'photoswipe';
gsap.registerPlugin(ScrollTrigger);

const GALLERY_CONFIG = {
    closeSVG: `<svg class="icon-icon-close" width="12" height="12"><use xlink:href="assets/img/svg-symbols.svg#icon-close"></use></svg>`,
    arrowPrevSVG: `<svg class="icon-icon-arrow-left"><use xlink:href="assets/img/svg-symbols.svg#icon-arrow-left"></use></svg>`,
    arrowNextSVG: `<svg class="icon-icon-arrow-right"><use xlink:href="assets/img/svg-symbols.svg#icon-arrow-right"></use></svg>`,
    bgOpacity: 0.9,
    zoom: false,
    paddingBottom: 75,
    paddingTop: 75,
    secondaryZoomLevel: 1
};
const SWITCHER_ACTIVE_CLS = 'switcher-grid--active';

export default class Projects {
    constructor() {
        this.nodes = {
            content: document.getElementById('content'),
            sliderElement: document.getElementById('projectsCoverSlider'),
            projectsContainer: document.querySelector('.project-covers'),
            switcherGrid: document.querySelector('.js-switcher-grid'),
            switcherGuide: document.querySelector('.project-guide'),
            filter: document.querySelector('#projectFilter'),
            itemsContainer: document.querySelector('.project-covers__items'),
            items: document.querySelectorAll('#projects [data-sort]'),
            sliderItems: document.querySelectorAll('#projects [data-slide-sort]')
        };

        const { projectsContainer } = this.nodes;

        if (projectsContainer) {
            this.toggleDuration = 0.2;
            this.windowWidth = window.innerWidth;
            this.detectWidth = this.windowWidth < 768;
            this.sliderGrid = this.slider();
            this.sliderInit = false;
            this.itemsState = [];
            this.onInit();
        }
    }

    onSliderScaleIn = () => {
        const { sliderElement } = this.nodes;

        sliderElement.querySelectorAll('.swiper-slide').forEach(el => {
            gsap.to(el, {
                scale: 0.9,
                duration: 0.4,
                delay: 0
            });
        });
    };

    onSliderScaleOut = () => {
        const { sliderElement } = this.nodes;

        sliderElement.querySelectorAll('.swiper-slide').forEach(el => {
            gsap.to(el, {
                scale: 1,
                duration: 0.4,
                delay: 0.1
            });
        });
    };

    lightboxGallery() {
        const links = document.querySelectorAll('.js-lightbox-gallery');

        links.forEach(link => {
            const dataSource = JSON.parse(link.dataset.images).map(el => {
                const element = el;
                const image = new Image();

                image.src = element?.src;

                image.addEventListener('load', () => {
                    element.width = image.width;
                    element.height = image.height;
                });

                return element;
            });

            const options = {
                ...GALLERY_CONFIG,
                dataSource,
                pswpModule: () => PhotoSwipe
            };

            const lightbox = new PhotoSwipeLightbox(options);

            lightbox.on('uiRegister', () => {
                lightbox.pswp.ui.registerElement(
                    {
                        name: 'caption',
                        order: 9,
                        isButton: false,
                        appendTo: 'root',
                        onInit: (el, pswp) => {
                            lightbox.pswp.on('change', () => {
                                const element = el;
                                const currSlideElement = lightbox.pswp.currSlide.data.element;
                                let captionHTML = '';

                                if (currSlideElement) {
                                    captionHTML = currSlideElement.dataset.title;
                                }

                                element.innerHTML = captionHTML || '';
                            });
                        }
                    }
                );
            });

            lightbox.init();

            link.addEventListener('click', (event) => {
                event.preventDefault();
                lightbox.loadAndOpen(0);
            });
        });
    }

    sliderCounterChange = slider => {
        const counter = document.querySelector('.project-covers__slider-counter');
        const { activeIndex, slides } = slider;

        counter.innerHTML = `${activeIndex + 1} / ${slides.length}`;
    };

    slider() {
        const { sliderElement } = this.nodes;
        const buttonArrows = sliderElement.querySelectorAll('.button-arrow');

        const options = {
            modules: [FreeMode, Pagination, Manipulation, Scrollbar, Mousewheel, Navigation],
            init: false,
            slidesPerView: 'auto',
            centeredSlides: false,
            freeMode: {
                enabled: true
            },
            navigation: {
                nextEl: buttonArrows[1],
                prevEl: buttonArrows[0]
            },
            spaceBetween: 30,
            speed: 400,
            touchStartPreventDefault: false,
            touchRatio: 2,
            resistanceRatio: 0.5,
            mousewheel: {
                invert: true,
                forceToAxis: true
            },
            scrollbar: {
                el: '.project-covers__progress-line',
                hide: false,
                draggable: true
            },
            breakpoints: {
                768: {
                    spaceBetween: 80
                }
            }
        };

        const swiper = new Swiper(sliderElement, options);

        swiper.on('init', this.sliderCounterChange);
        swiper.on('slideChange', this.sliderCounterChange);

        return swiper;
    }

    sliderInitial() {
        if (!this.sliderInit) {
            this.sliderInit = true;
            this.sliderGrid.init();
            this.sliderGrid.on('init', this.sliderChangeFilter);
        }
    }

    onToggleFilter = event => {
        const button = event.target;

        if (button.dataset.toggle) {
            const diff = button.dataset.toggle.toLowerCase().split(' ');
            const {
                itemsContainer
            } = this.nodes;

            if (button.classList.contains('is-active')) {
                return;
            }

            button.parentNode.querySelector('.is-active').classList.remove('is-active');
            button.classList.add('is-active');

            gsap.set(itemsContainer.children, {
                scale: 1,
                autoAlpha: 1
            });

            gsap.to(itemsContainer.children, {
                scale: 0.5,
                autoAlpha: 0,
                duration: 0.4,
                ease: Back.easeIn.config(1),
                onComplete: () => {
                    itemsContainer.style.height = `${itemsContainer.offsetHeight}px`;
                    itemsContainer.innerHTML = '';

                    this.itemsState.forEach((el, index) => {
                        const element = el;
                        const sortItems = element.dataset.sort.toLowerCase().split(' ');
                        const isMatched = sortItems.filter(it => diff.includes(it)).length > 0;
                        const lastElement = index === this.itemsState.length - 1;

                        if (lastElement) {
                            itemsContainer.style.height = '';
                        }

                        if (isMatched) {
                            itemsContainer.appendChild(element);

                            gsap.set(element, {
                                scale: 0,
                                x: 0,
                                autoAlpha: 1
                            });

                            gsap.to(element, {
                                x: 0,
                                scale: 1,
                                duration: 0.4,
                                ease: Back.easeOut.config(1),
                                onStart: () => {
                                    if (lastElement) {
                                        ScrollTrigger.refresh();
                                    }
                                },
                                onComplete: () => {
                                    element.style.clipPath = '';
                                }
                            });
                        }
                    });
                }
            });

            if (this.sliderInit) {
                this.sliderChangeFilter();
            }
        }
    };

    sliderChangeFilter = () => {
        const diff = document.querySelector('.switcher-grid__filter .is-active').dataset.toggle.toLowerCase().split(' ');
        const {
            sliderElement,
            sliderItems
        } = this.nodes;

        gsap.set(sliderItems, {
            scale: 1,
            autoAlpha: 1
        });

        gsap.to(sliderItems, {
            scale: 0.5,
            autoAlpha: 0,
            duration: 0.4,
            ease: Back.easeIn.config(1),
            onComplete: () => {
                sliderElement.style.height = `${sliderElement.offsetHeight}px`;
                this.sliderGrid.removeAllSlides();

                sliderItems.forEach((el, index) => {
                    const element = el;
                    const sortItems = element.dataset.slideSort.toLowerCase().split(' ');
                    const isMatched = sortItems.filter(it => diff.includes(it)).length > 0;

                    gsap.set(element.children, {
                        scale: 0,
                        autoAlpha: 0
                    });

                    if (isMatched) {
                        gsap.to(element.children, {
                            scale: 1,
                            autoAlpha: 1,
                            duration: 0.4,
                            ease: 'power1.inOut',
                            onStart: () => {
                                this.sliderGrid.appendSlide(el);
                                this.sliderCounterChange(this.sliderGrid);
                                sliderElement.style.height = '';

                                gsap.set(sliderItems, {
                                    scale: 1,
                                    autoAlpha: 1
                                });
                            },
                            onComplete: () => {
                            }
                        });
                    }
                });
            }
        });
    };

    onToggleGrid = event => {
        const { toggleDuration } = this;
        const { switcherGuide } = this.nodes;
        const grid = document.querySelector('.project-covers__items');
        const row = document.querySelector('.project-covers__row');
        const gridItems = grid.querySelectorAll(':scope > .project-covers__item');
        const sliderRow = row.querySelector('.project-covers__row-slider');
        const footer = document.querySelector('.footer');
        const projectsTitle = document.querySelector('.project-covers__title-text');
        const sliderProgress = document.querySelector('.project-covers__progress-line');
        const element = event.currentTarget;
        const tlToggle = gsap.timeline();
        const tlRow = gsap.timeline();
        const btnUp = document.querySelector('.back-to-top-fixed');

        event.preventDefault();
        element.classList.toggle(SWITCHER_ACTIVE_CLS);

        if (!switcherGuide.classList.contains('is-complete')) {
            switcherGuide.classList.add('is-active');
        }

        if (element.classList.contains(SWITCHER_ACTIVE_CLS)) {
            btnUp.classList.add('in-visible');

            gsap.to(gridItems, {
                scale: 0.0,
                duration: toggleDuration + 0.2
            });

            gsap.set(sliderRow, {
                x: '100%',
                autoAlpha: 0
            });

            gsap.set(footer, {
                autoAlpha: 0
            });

            gsap.set(projectsTitle, {
                x: '-18%',
                autoAlpha: 0
            });

            tlToggle.to(grid, {
                autoAlpha: 0,
                duration: toggleDuration,
                ease: 'linear'
            }).to(row, {
                autoAlpha: 1,
                duration: toggleDuration,
                ease: 'linear',
                onStart: () => {
                    grid.style.display = 'none';
                    row.style.display = 'block';
                    tlRow.to(sliderRow, {
                        x: '0',
                        duration: toggleDuration + 0.5,
                        ease: 'power4.out'
                    })
                        .to(sliderRow, {
                            autoAlpha: 1,
                            duration: toggleDuration + 0.2,
                            ease: 'power1.in'
                        }, '-=0.75')
                        .to(projectsTitle, {
                            x: '0',
                            autoAlpha: 1,
                            duration: toggleDuration + 0.6,
                            ease: Circ.easeOut
                        }, '-=0.75');
                    gsap.to(footer, { autoAlpha: 1 });
                    sliderProgress.classList.add('is-visible');

                    this.sliderInitial();
                }
            });
        } else {
            btnUp.classList.remove('in-visible');
            sliderProgress.classList.remove('is-visible');

            tlToggle.to(row, {
                autoAlpha: 0,
                duration: toggleDuration,
                ease: 'linear'
            }).to(grid, {
                autoAlpha: 1,
                duration: toggleDuration,
                ease: 'linear',
                onStart: () => {
                    grid.style.display = '';
                    row.style.display = 'none';
                    gsap.to(gridItems, {
                        scale: 1,
                        duration: toggleDuration + 0.1,
                        ease: Back.easeOut.config(1)
                    });
                }
            });
        }
    };

    onToggleGuide = ({ currentTarget }) => {
        currentTarget.classList.add('is-complete');
        currentTarget.classList.remove('is-active');
    };

    itemsGrid() {
        const {
            projectsContainer,
            switcherGrid
        } = this.nodes;
        const pageHeader = document.querySelector('.page-header');
        const projectGridItems = document.querySelectorAll('.project-covers__item');
        const projectItems = document.querySelectorAll('.project-covers__items .project-cover');
        const projectsTitle = document.querySelector('.project-covers__title');

        VanillaTilt.init(document.querySelectorAll('.project-item__image-wrap'), {
            max: 10,
            axis: 'x',
            speed: 2000,
            perspective: 3000,
            glare: true,
            'max-glare': 1,
            scale: 1.04,
            transition: true,
            easing: 'cubic-bezier(.03,.98,.52,.99)'
        });

        gsap.set(projectsTitle, {
            x: -30
        });

        gsap.set(projectGridItems, {
            y: this.detectWidth ? '5%' : 50
        });

        gsap.set(projectItems, {
            y: this.detectWidth ? '2%' : 75,
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)'
        });

        projectGridItems.forEach(el => {
            const element = el;

            gsap.to(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 90%',
                    end: 'bottom 80%',
                    scrub: 0.4
                },
                y: 0,
                duration: 0.4,
                ease: 'power1.inOut'
            });
        });

        projectItems.forEach(el => {
            const element = el;

            gsap.to(element, {
                scrollTrigger: {
                    trigger: element,
                    start: this.detectWidth ? '20% 100%' : '25% 100%',
                    end: '40% bottom'
                },
                y: 0,
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                duration: 0.4,
                ease: 'power1.inOut',
                onComplete: () => {
                    element.style.clipPath = '';
                    element.classList.add('is-visible');
                }
            });
        });

        gsap.to(projectsTitle, {
            scrollTrigger: {
                trigger: projectsTitle,
                start: 'top 100%',
                end: 'bottom bottom',
                scrub: 1.4
            },
            x: 0,
            duration: 0.4,
            ease: 'power1.inOut'
        });

        gsap.to(switcherGrid, {
            scrollTrigger: {
                trigger: projectsContainer,
                start: `-${pageHeader.offsetHeight + 20}`,
                end: '0',
                scrub: true,
                onEnter: () => switcherGrid.closest('.switcher-grid').classList.add('is-sticky'),
                onLeaveBack: () => switcherGrid.closest('.switcher-grid').classList.remove('is-sticky')
            }
        });
    }

    onDetectWidth = () => {
        setTimeout(() => {
            this.windowWidth = window.innerWidth;
        }, 50);
    };

    onInit() {
        const {
            content,
            projectsContainer,
            switcherGrid,
            switcherGuide,
            filter,
            items
        } = this.nodes;

        if (!projectsContainer) {
            return;
        }

        this.itemsState = [...items];
        this.lightboxGallery();
        this.itemsGrid();
        content.addEventListener('mousedown', this.onSliderScaleIn);
        content.addEventListener('mouseup', this.onSliderScaleOut);
        window.addEventListener('orientationchange', this.onDetectWidth);
        switcherGrid.addEventListener('click', this.onToggleGrid);
        switcherGuide.addEventListener('click', this.onToggleGuide);
        filter.addEventListener('click', this.onToggleFilter);
    }
}
