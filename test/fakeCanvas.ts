import md5 from "md5";

export class FakeCanvas
{
    public width: number;
    public height: number;
    private ctx: FakeContext;

    constructor (width: number, height: number)
    {
        this.height = height;
        this.width = width;
        this.ctx = new FakeContext();
    }

    public getContext(_dimension: string): FakeContext
    {
        return this.ctx;
    }
}

export class FakeContext
{
    private attributes_: (string | number)[][] = [];
    private methods_: (string | number)[][] = [];

    set fillStyle(val: string) { this.attributes_.push(["fillStyle", val]); }
    set font(val: string) { this.attributes_.push(["font", val]); }
    set lineWidth(val: string) { this.attributes_.push(["lineWidth", val]); }
    set strokeStyle(val: string) { this.attributes_.push(["strokeStyle", val]); }
    set textAlign(val: string) { this.attributes_.push(["textAlign", val]); }
    set textBaseline(val: string) { this.attributes_.push(["textBaseline", val]); }

    public beginPath(...params) { this.methods_.push(["beginPath", ...params]); }
    public createLinearGradient(...params) { this.methods_.push(["createLinearGradient", ...params]); }
    public fillRect(...params) { this.methods_.push(["fillRect", ...params]); }
    public fillText(...params) { this.methods_.push(["fillText", ...params]); }
    public lineTo(...params) { this.methods_.push(["lineTo", ...params]); }
    public moveTo(...params) { this.methods_.push(["moveTo", ...params]); }
    public scale(...params) { this.methods_.push(["scale", ...params]); }
    public stroke(...params) { this.methods_.push(["stroke", ...params]); }
    public strokeRect(...params) { this.methods_.push(["strokeRect", ...params]); }

    public measureText(param) { this.methods_.push(["measureText", param]); return param.length * 5; }
    
    public attributes() { return this.attributes_; }
    public methods() { return this.methods_; }
    public stack() { return [...this.attributes_, ...this.methods_]; }

    public hash(): string
    {
        const stack = JSON.stringify(this.stack());
        return `${md5(stack)}`;
    }
}

