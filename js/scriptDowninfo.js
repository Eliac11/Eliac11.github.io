(() => {
    const config = {
        speeddirrad: 0.05,
        Maxdot: 100,
        dotMinRad: 5,
        dotMaxRad: 20,
        sphereRad: 350,
        mouseSize: 120,
        defColor: `rgba(250, 10, 30, 0.9)`,
    }

    const TWO_PI = 2 * Math.PI;
    const canvas = document.querySelector(`canvas`);
    const ctx = canvas.getContext(`2d`);

    let w, h, mouse, dots;

    class Dot {
        constructor(r) {
            this.pos = { x: mouse.x, y: mouse.y }
            this.vel = { x: 0, y: 0 }
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
            let acc = { x: 0, y: 0 }

            for (let j = 0; j < dots.length; j++) {
                if (i == j) continue;
                let [a, b] = [dots[i], dots[j]];

                let delta = { x: b.pos.x - a.pos.x, y: b.pos.y - a.pos.y }
                let dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y) || 1;
                let force = (dist - a.rad*30) / dist * b.mass;

                

                acc.x += delta.x * force;
                acc.y += delta.y * force;
            }


            dots[i].vel.x = dots[i].vel.x * config.smooth + acc.x * dots[i].mass;
            dots[i].vel.y = dots[i].vel.y * config.smooth + acc.y * dots[i].mass;
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

        mouse = { x: w / 2, y: h / 2 }
        dots = [];
    }

    function loop() {
        ctx.clearRect(0, 0, w, h);
        updateDots();

        window.requestAnimationFrame(loop);
    }

    init();
    loop();

    function setPos({ layerX, layerY }) {
        [mouse.x, mouse.y] = [layerX, layerY];
    }

    

    canvas.addEventListener(`mousemove`, setPos);

    window.onresize = function () {
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;
    }

/*попытка поддержки мобил*/
    
    canvas.ontouchmove = function (e) {
        setPos({ layerX: e.touches[0].pageX, layerY: e.touches[0].pageY });
    }
    window.ontouchstart = function (e) {
        setPos({ layerX: e.touches[0].pageX, layerY: e.touches[0].pageY });
    }
    

})();
