import { Vec2 } from './MathUtils.js';
import Particle from './Particle.js';

const canvas = document.getElementById('canvas');


const balls = [];
const ellipses = [];

for(let i = 0; i < 1000; i++)
{
    const x = 20 + Math.random() * canvas.getBoundingClientRect().width;
    const y = 20 + Math.random() * canvas.getBoundingClientRect().height;
    const vX = 1 + Math.random() * 10;
    const vY = 1 + Math.random() * 10;
    
    const ball = new Particle(x, y, 20, vX, vY);
    
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

const restitution = 0.9;
const maxSpeed = 10;
const controlsForce = 0.02;
const attractorForce = maxSpeed/15;

function animate()
{
    const canvasRect = canvas.getBoundingClientRect();
    for(const ball of balls)
    {
        if(mouseDown)
        {
            const mag = ball.pos.mag(mousePos.x, mousePos.y);
            if(mag !== 0)
            {
                ball.applyForce(((mousePos.x - ball.pos.x)/mag) * attractorForce, ((mousePos.y - ball.pos.y)/mag) * attractorForce);
            }
        }
        
        if(isKeyDown('ArrowUp'))
        {
            ball.applyForce(0, -controlsForce);
        }
        
        if(isKeyDown('ArrowDown'))
        {
            ball.applyForce(0, controlsForce);
        }
        
        if(isKeyDown('ArrowLeft'))
        {
            ball.applyForce(-controlsForce, 0);
        }
        
        if(isKeyDown('ArrowRight'))
        {
            ball.applyForce(controlsForce, 0);
        }
        
        
        if(Math.abs(ball.vel.x) > maxSpeed)
        {
            ball.vel.x = Math.sign(ball.vel.x) * maxSpeed;
            // console.log('too fast');
        }
        
        if(Math.abs(ball.vel.y) > maxSpeed)
        {
            ball.vel.y = Math.sign(ball.vel.y) * maxSpeed;
            // console.log('too fast');
        }
        
        
        ball.edges(canvasRect, Math.random());
        
        // ball.collide(balls);

        ball.updatePhysics();
        ball.draw(ellipses[balls.indexOf(ball)]);
    }
    requestAnimationFrame(animate);
}

animate();