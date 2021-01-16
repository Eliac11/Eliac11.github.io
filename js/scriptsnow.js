(() => {
    const config = {
        speeddirrad: 0.05,
        Maxdot: 100,
        dotMinRad: 5,
        dotMaxRad: 10,
        sphereRad: 350,
        bigDotRad: 35,
        mouseSize: 120,
        massFactor: 0.001,
        defColor: `rgba(255, 255, 255, 0.81)`,
        smooth: 0.85,
    }

    const TWO_PI = 2 * Math.PI;
    const canvas = document.querySelector(`canvas`);
    const ctx = canvas.getContext(`2d`);

    let w, h, mouse, dots;

    class Dot { 
        constructor(r) {
            this.pos = { x: random(0, w), y: -10 - random(0, 2000) }
            this.vel = { x: random(-2, 2), y: random(1,5) }
            this.rad = r || random(config.dotMinRad, config.dotMaxRad);
            this.mass = this.rad * config.massFactor;
            this.color = config.defColor;
            this.dirrad = config.speeddirrad * random(-1, 1);
        }

        draw(x, y) {
            this.pos.x = x || this.pos.x + this.vel.x;
            this.pos.y = y || this.pos.y + this.vel.y;
            createCircle(this.pos.x, this.pos.y, this.rad, true, this.color);
            createCircle(this.pos.x, this.pos.y, this.rad, false, config.defColor);
        }
    }

    function updateDots() {
        for (let i = 0; i < dots.length; i++) {
            if (dots[i].pos.y > h) {
                dots[i].pos = { x: random(0, w), y: -10 - random(0, 2000) };
                dots[i].vel = { x: random(-2, 2), y: random(1, 5) };
            }

            //dots[i].vel.y += 0.005

            //dots[i].vel.x += (h/2 - mouse.x) * 0.00001
        }

        dots.map(e => e.draw());
    }

    function createCircle(x, y, rad, fill, color) {
        ctx.fillStyle = ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, TWO_PI);
        ctx.closePath();
        fill ? ctx.fill() : ctx.stroke();
    }

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function init() {
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;

        mouse = { x: w / 2, y: h / 2, down: false }
        dots = [];
        for (let i = 0; i < 1000; i++) {
            dots.push(new Dot())
        }
    }

    function loop() {
        ctx.clearRect(0, 0, w, h);

        
        updateDots();

        window.requestAnimationFrame(loop);
    }

    init();
    loop();

    

    window.onresize = function () {
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;
    }
    function setPos({ layerX, layerY }) {
        [mouse.x, mouse.y] = [layerX, layerY];
    }
    window.addEventListener(`mousemove`, setPos);

})();
