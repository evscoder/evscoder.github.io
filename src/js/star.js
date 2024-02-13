export default class Star {
    constructor(
        canvas,
        size,
        speed,
        color
    ) {
        this.ctx = canvas.getContext('2d');
        this.size = size;
        this.speed = speed;
        this.color = color;
        this.x = Star.rand(window.innerWidth);
        this.y = Star.rand(window.innerHeight);
    }

    animate(delta) {
        this.x += this.speed * delta;
        this.y -= this.speed * delta;

        if (this.y < 0) {
            this.y = window.innerHeight;
        }

        if (this.x > window.innerWidth) {
            this.x = 0;
        }

        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    static rand(max) {
        return Math.random() * max;
    }
}
