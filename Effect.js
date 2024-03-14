import { Particle } from "./Particle.js";
import { gradient } from "./script.js";

export class Effect {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.rafId;
        this.stopped = false;
        this.maxDistance = 100;
        this.ctx = ctx;
        this.mouse = {
            x:0,
            y:0,
            isPressed: false,
            radius: 150
        };
        this.debug = false;
        this.element = document.getElementById("text").getBoundingClientRect()
        window.addEventListener('mousemove', e=>{
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        })
        window.addEventListener('mousedown', e=>{
            this.mouse.isPressed = true;
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        })
        window.addEventListener('mouseup', e=>{
            this.mouse.isPressed = false;
        })
        window.addEventListener('keydown', e=>{
            console.log(e)
            let element = document.getElementById("text")
            if(e.key ==='d' && e.ctrlKey) {
                this.debug = !this.debug
                console.log(`Debug mode: `, this.debug)
            } else {
                if(e.shiftKey && e.key !== 'Shift') {
                 element.textContent += e.key.toUpperCase()
                } else if(e.key!=="Shift" && e.key!=="Backspace" && e.key!=="Control" && e.key!=='Alt'&&e.key!=='Meta') {
                    element.textContent += e.key
                }
                if(e.key ==='Backspace') {
                    element.textContent = element.textContent.slice(0, -1)
                }
                this.elementResize()
            }
        })
        window.addEventListener('resize', e=>{
           this.resize(e.target.window.innerWidth, e.target.window.innerHeight, this.ctx)
        })
        console.log(this.element)
    }
    init(arr, amount) {
        for(let i = 0; i<amount; i++) {
            arr.push(new Particle(this))
        }
        console.log(arr)
    }
    animate(ctx, arr) {
        const animate = () =>{
            this.rafId = requestAnimationFrame(animate)
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
            ctx.fillRect(0,0, this.width, this.height)
            ctx.fillStyle = gradient
            this.connectParticles(ctx, arr)

            arr.forEach(obj=>{
                obj.draw(ctx)
                obj.update(this.width, this.height)
            })
            if(this.debug) ctx.strokeRect(this.element.x, this.element.y, this.element.width, this.element.height)
        }
        animate()


    }
    stop() {
        cancelAnimationFrame(this.rafId)
    }
    connectParticles(ctx, arr) {
        for(let a = 0; a<arr.length; a++) {
            for(let b = a; b<arr.length; b++) {
                let dx = arr[a].x-arr[b].x;
                let dy = arr[a].y-arr[b].y;
                let distance = Math.hypot(dx, dy);
                if(distance<this.maxDistance) {
                    ctx.save()
                    ctx.globalAlpha = 1-(distance/this.maxDistance)
                    ctx.beginPath()
                    ctx.moveTo(arr[a].x, arr[a].y)
                    ctx.lineTo(arr[b].x, arr[b].y)
                    ctx.stroke()
                    ctx.restore()
                }

            }
        }
    }
    resize(width, height, ctx) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        ctx.fillStyle = gradient;
        ctx.strokeStyle = 'white';
        this.element = document.getElementById("text").getBoundingClientRect();
    }
    elementResize() {
        this.element = document.getElementById("text").getBoundingClientRect();

    }
}