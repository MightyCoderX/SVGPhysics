export class Vec2
{
    /**
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y)
    {
        this.x = x ?? 0;
        this.y = y ?? 0;
    }

    mag(originX, originY)
    {
        const o = new Vec2(originX ?? 0, originY ?? 0);
        return this.dist(o);
    }

    /**
     * @param {number} x 
     * @param {number} y 
     */
    set(x, y)
    {
        this.x = x ?? 0;
        this.y = y ?? 0;
        return this;
    }

    /**
     * @param {Vec2} vec 
     */
    add(vec)
    {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }
    
    /**
     * @param {Vec2} vec 
     */
    mul(vec)
    {
        this.x *= vec.x;
        this.y *= vec.y;
        return this;
    }

    /**
     * @param {Vec2} vec 
     */
    div(vec)
    {
        this.x /= vec.x;
        this.y /= vec.y;
    }
    
    /**
     * @param {Vec2} vec 
     */
    dist(vec)
    {
        const distanceSqr = (vec.x - this.x) ** 2 + (vec.y - this.y) ** 2;
        return Math.sqrt(distanceSqr);
    }

    normalize(originX, originY)
    {
        const mag = this.mag(originX, originY);
        
        if(mag == 0) return 0;

        this.mul(new Vec2(1 / mag, 1 / mag));

        return this;
    }

    heading()
    {
        return Math.atan2(this.y, this.x);
    }

    roundf()
    {
        const rounded = this.clone();
        rounded.x = Math.fround(rounded.x);
        rounded.y = Math.fround(rounded.y);
        return rounded;
    }

    clone()
    {
        return new Vec2(this.x, this.y);
    }
}

export function randRange(min, max)
{
    return Math.random() * (max - min) + min;
}