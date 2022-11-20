import { Vec2 } from './MathUtils.js';

let idCounter = 0;

export default class Particle
{
    constructor(x, y, r, velX, velY)
    {
        this.id = idCounter++;

        this.pos = new Vec2(x, y);
        this.vel = new Vec2(velX, velY);
        this.acc = new Vec2();

        this.r = r;

        // this.audioCtx = new AudioContext();
    }

    updatePhysics()
    {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.set();
    }

    applyForce(x, y)
    {
        this.acc.add(new Vec2(x, y));
    }

    collide(others)
    {
        for(let other of others)
        {
            if(other.id === this.id) return;
            if(other.pos.dist(this.pos) < this.r + other.r)
            {
                this.vel.add(other.vel);
            }
        }
    }

    edges(rect, restitution)
    {
        if(this.pos.x + this.r >= rect.width || this.pos.x - this.r <= 0)
        {
            if(this.pos.x + this.r >= rect.width)
            {
                this.pos.x = rect.width - this.r;
            }
            else if(this.pos.x - this.r <= 0)
            {
                this.pos.x = this.r;
            }
            
            this.vel.x *= -restitution;
            // this.hit();
        }
        
        if(this.pos.y + this.r >= rect.height || this.pos.y - this.r <= 0)
        {
            if(this.pos.y + this.r >= rect.height)
            {
                this.pos.y = rect.height - this.r;
            }
            else if(this.pos.y - this.r <= 0)
            {
                this.pos.y = this.r;
            }

            this.vel.y *= -restitution;
            // this.hit();
        }
    }

    hit()
    {
        const hitSound = new Audio('./sounds/tsuzumi.mp3');
        const source = this.audioCtx.createMediaElementSource(hitSound);

        const gainNode = this.audioCtx.createGain();

        gainNode.gain.value = this.vel.mag()/10;

        source.connect(this.audioCtx.destination);

        hitSound.play();
    }

    /**
     * @param {SVGEllipseElement} ellipse 
     */
    draw(ellipse)
    {
        ellipse.setAttributeNS(null, 'cx', this.pos.x);
        ellipse.setAttributeNS(null, 'cy', this.pos.y);
    }
}