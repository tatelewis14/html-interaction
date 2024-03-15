export class Particle {
    constructor(effect) {
        this.effect = effect;
        this.radius = Math.random() * 9 +1
        this.x = Math.random() * (this.effect.canvas.width - this.radius*2) + this.radius;
        this.y = Math.random() * (this.effect.canvas.height -this.radius*2) + this.radius    
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = 0
        this.pushX = 0;
        this.pushY = 0;
        this.friction = 0.95;
        this.gravity = this.radius * 0.003;
        this.width = this.radius * 2;
        this.height = this.width;
        this.bounces = 3;
    }
    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fill()
        if(this.effect.debug) {
            ctx.strokeRect(this.x-this.radius, this.y-this.radius, this.width, this.width)
        }
    }
    update(width, height) {
        if(this.effect.mouse.isPressed) {
            const dx = this.x-this.effect.mouse.x;
            const dy = this.y - this.effect.mouse.y
            const distance = Math.hypot(dx, dy);
            const force = this.effect.mouse.radius/distance
            if(distance<this.effect.mouse.radius) {
                const angle = Math.atan2(dy, dx)
                this.pushX += Math.cos(angle) * force
                this.pushY += Math.sin(angle) * force
            }
        }
        if(this.bounces > 0) {
        if (
            this.x - this.radius < this.effect.element.x + this.effect.element.width &&
            this.x - this.radius > this.effect.element.x &&
            this.y < this.effect.element.y + 1 &&
            this.y + this.height -this.radius> this.effect.element.y
          ) {
            this.vy *=-1
            this.bounces--
          }
        }

        this.vy+=this.gravity
        this.x+=this.vx +(this.pushX*=this.friction);
        this.y+= this.vy + (this.pushY*=this.friction);
         
        
         if(this.y > this.effect.height - this.radius || this.x+this.radius > this.effect.width || this.x-this.radius < 0) {
            this.reset()
        }        
    }
    reset() {
            this.x = this.radius + Math.random() * (this.effect.width-this.radius*2);
            this.y = -this.radius - Math.random() * this.effect.height * 0.5;
            this.vy = 0;
            this.bounces = 3;
    }

}