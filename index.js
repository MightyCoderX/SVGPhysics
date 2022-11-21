import { Vec2, randRange, mapRange } from './MathUtils.js';
import Particle from './Particle.js';

const outFps = document.querySelector('.fps');
const canvas = document.getElementById('canvas');

const fps = 60;

const balls = [];
const ellipses = [];

for(let i = 0; i < 1000; i++)
{
    const x = randRange(100, canvas.getBoundingClientRect().width - 100);
    const y = randRange(100, canvas.getBoundingClientRect().height - 100);

    const direction = () => Math.random() > 0.5 ? 1 : -1;
    const vX = randRange(0, 10) * direction();
    const vY = randRange(0, 10) * direction();

    const mass = randRange(1, 5);
    const size = mapRange(mass, 1, 5, 5, 15);

    if(i === 0)
    {
        console.log({x, y, vX, vY, mass, size});
    }
    
    const ball = new Particle(x, y, size, mass, vX, vY);
    
    const r = Math.random()*255;
    const g = Math.random()*255;
    const b = Math.random()*255;
    const a = 0.8;
    
    balls.push(ball);
    
    const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    ellipse.setAttributeNS(null, 'cx', ball.pos.x);
    ellipse.setAttributeNS(null, 'cy', ball.pos.y);
    ellipse.setAttributeNS(null, 'rx', ball.r);
    ellipse.setAttributeNS(null, 'ry', ball.r);
    ellipse.setAttributeNS(null, 'fill', `rgba(${r}, ${g}, ${b}, ${a})`);
    ellipses.push(ellipse);
    
    canvas.append(ellipse);
}


let mouseDown = false;
const mousePos = new Vec2();

const keysDown = new Set();

function isKeyDown(key)
{
    return keysDown.has(key);
}

window.addEventListener('mousedown', e =>
{
    mousePos.set(e.x, e.y);
    mouseDown = true;
});
window.addEventListener('mousemove', e =>
{
    mousePos.set(e.x, e.y);
});
window.addEventListener('mouseup', () => mouseDown = false);

window.addEventListener('keydown', e => keysDown.add(e.key));
window.addEventListener('keyup', e => keysDown.delete(e.key));

const physics =
{
    maxSpeed: 10,
    limitSpeed: true,
    get restitution()
    {
        return randRange(0.5, 1);
    },
    get controlsForce()
    {
        return this.maxSpeed/30;
    },
    get attractorForce()
    {
        return this.controlsForce;
    }
}

function animate()
{
    const canvasRect = canvas.getBoundingClientRect();
    for(const ball of balls)
    {
        if(mouseDown)
        {
            const mag = ball.pos.dist(mousePos);
            if(mag !== 0)
            {
                const x = ((mousePos.x - ball.pos.x)/mag) * physics.attractorForce;
                const y = ((mousePos.y - ball.pos.y)/mag) * physics.attractorForce;
                ball.applyForce(x, y);
            }
        }
        
        if(isKeyDown('ArrowUp'))
        {
            ball.applyForce(0, -physics.controlsForce);
        }
        
        if(isKeyDown('ArrowDown'))
        {
            ball.applyForce(0, physics.controlsForce);
        }
        
        if(isKeyDown('ArrowLeft'))
        {
            ball.applyForce(-physics.controlsForce, 0);
        }
        
        if(isKeyDown('ArrowRight'))
        {
            ball.applyForce(physics.controlsForce, 0);
        }
        
        if(physics.limitSpeed)
        {
            if(Math.abs(ball.vel.x) > physics.maxSpeed)
            {
                ball.vel.x = Math.sign(ball.vel.x) * physics.maxSpeed;
            }
            
            if(Math.abs(ball.vel.y) > physics.maxSpeed)
            {
                ball.vel.y = Math.sign(ball.vel.y) * physics.maxSpeed;
            }
        }
        
        ball.edges(canvasRect, physics.restitution);
        
        // ball.collide(balls);

        ball.updatePhysics();
        ball.draw(ellipses[balls.indexOf(ball)]);
    }
}

let startTime = window.performance.now();
let frameCount = 0;
let then = startTime;
let elapsed;
const fpsInterval = 1000/fps;

function loop(now)
{
    requestAnimationFrame(loop);
    
    elapsed = now - then;

    if (elapsed > fpsInterval)
    {
        then = now - (elapsed % fpsInterval);

        animate();

        const sinceStart = now - startTime;
        const currentFps = Math.round(1000 / (sinceStart / ++frameCount) * 100) / 100;
        console.log(currentFps);
        outFps.textContent = `${currentFps.toFixed(2)} FPS`;
    }

}

loop();