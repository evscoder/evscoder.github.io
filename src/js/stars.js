import Star from './star.js';

export default class Stars {
    constructor(
        id
    ) {
        this.canvas = document.getElementById(id);
        this.stars = [];
        this.resizeTimeout = null;
        this.resizeCooldown = 500;
        this.lastResizeTime = Date.now();
        this.lastPaintTime = 0;

        this.onInit();
    }

    initStars() {
        const sizeArea = this.canvas.clientWidth * this.canvas.clientHeight;
        const smallStarsDensity = 0.0003;
        const mediumStarsDensity = 0.00005;
        const largeStarsDensity = 0.00002;
        const smallStarsCount = sizeArea * smallStarsDensity;
        const mediumStarsCount = sizeArea * mediumStarsDensity;
        const largeStarsCount = sizeArea * largeStarsDensity;

        this.stars = [];

        for (let i = 0; i < smallStarsCount; i++) {
            this.stars.push(new Star(this.canvas, 0.9, 3, '#ffffff'));
        }

        for (let i = 0; i < mediumStarsCount; i++) {
            this.stars.push(new Star(this.canvas, 2, 9, '#ffffff'));
        }

        for (let i = 0; i < largeStarsCount; i++) {
            this.stars.push(new Star(this.canvas, 3, 18, '#ffffff'));
        }
    }

    renderStars(delta) {
        this.stars.forEach(el => el.animate(delta));
    }

    paintLoop = timestamp => {
        let delta = timestamp - this.lastPaintTime / 1000;

        this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (delta > 0.05) {
            delta = 0.025;
        }

        this.renderStars(delta);

        window.requestAnimationFrame(ts => this.paintLoop(ts));
        this.lastPaintTime = timestamp;
    };

    fadeAnim(el, startTime, duration) {
        const element = el;
        let newOpacity = (Date.now() - startTime) / duration;

        if (newOpacity > 1) {
            newOpacity = 1;
        } else {
            window.requestAnimationFrame(() => {
                this.fadeAnim(element, startTime, duration);
            });
        }

        element.style.opacity = newOpacity;
    }

    fadeIn(el, duration) {
        const element = el;
        let startTime = Date.now();

        element.style.opacity = 0;
        element.style.display = 'block';
        this.fadeAnim(element, startTime, duration);
    }

    onUpdateSizes = () => {
        const { canvas } = this;

        if (Date.now() - this.lastResizeTime < this.resizeCooldown && this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = null;
        }

        this.lastResizeTime = Date.now();
        canvas.style.display = 'none';

        this.resizeTimeout = setTimeout(() => {
            this.fadeIn(canvas, 500);
            this.initStars();
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }, 500);
    };

    onInit() {
        const { canvas } = this;

        if (!canvas) {
            return;
        }

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        canvas.style.display = 'none';

        setTimeout(() => {
            this.fadeIn(canvas, 500);
            this.initStars();
        }, 300);

        window.addEventListener('resize', this.onUpdateSizes);
        window.requestAnimationFrame(this.paintLoop);
    }
}
