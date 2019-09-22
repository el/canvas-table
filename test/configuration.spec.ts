import { CanvasTable } from '../lib';
import { createCanvas, Canvas } from "canvas";
import { CTConfig, CTData, CTColumn } from '../lib/types';
import { join } from 'path';
import { FakeCanvas } from './fakeCanvas';
import { expect } from "chai";

describe('CanvasTable', async() =>
{
    const testDirectory = __dirname;
    const data: CTData = [
        ["lorem", "200$", "300$"],
        ["ipsum", "201$", "301$"],
        ["dolor", "202$", "302$"]
    ];
    const columns: CTColumn[] = [
        {title: "Text"},
        {title: "Expenses", options: { textAlign: "right" }},
        {title: "Net", options: { textAlign: "right" }}
    ];
    
    it('renders a table', async () =>
    {
        const canvas = createCanvas(640, 250);
        const config: CTConfig = { columns, data };
        const ct = new CanvasTable(canvas, config);
        await ct.generateTable();
        await ct.renderToFile(join(testDirectory,"test-table.png"));
    });
    
    it('renders a table with a title', async () =>
    {
        const canvas = createCanvas(640, 250);
        const config: CTConfig = { columns, data, options: { title: {text: "Title"} } };
        const ct = new CanvasTable(canvas, config);
        await ct.generateTable();
        await ct.renderToFile(join(testDirectory,"test-table.png"));
    });
    
    it('renders a fitted table', async () =>
    {
        const canvas = createCanvas(640, 250);
        const config: CTConfig = { columns, data, options: { fit: true } };
        const ct = new CanvasTable(canvas, config);
        await ct.generateTable();
        await ct.renderToFile(join(testDirectory,"test-fit.png"));
    });

    it('renders a table with long data', async () =>
    {
        const canvas = createCanvas(640, 250);
        const config: CTConfig = { data: [
            ...data,
            ["sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet", "202$", "302$"]
        ], columns };
        const ct = new CanvasTable(canvas, config);
        await ct.generateTable();
        await ct.renderToFile(join(testDirectory,"test-long.png"));
    });

    it('renders a table with long data', async () =>
    {
        const canvas = createCanvas(640, 250);
        const config: CTConfig = {
            data,
            columns,
            options: {
                borders: {
                    column: { width: 2, color: "red" },
                    header: undefined,
                    row: { width: 1, color: "blue" },
                    table: { width: 2, color: "purple" }
                }
            }
        };
        const ct = new CanvasTable(canvas, config);
        await ct.generateTable();
        await ct.renderToFile(join(testDirectory,"test-border.png"));
    });

    it('renders a table with small canvas', async () =>
    {
        const canvas = createCanvas(90, 90);
        const config: CTConfig = { columns, data, options: { fader: undefined, padding: 0 }};
        const ct = new CanvasTable(canvas, config);
        await ct.generateTable();
        await ct.renderToFile(join(testDirectory,"test-small.png"));
    });

    it('renders a table with a fader', async () =>
    {
        const canvas = createCanvas(90, 90);
        const config: CTConfig = {
            columns,
            data,
            options: {
                fader: {
                    bottom: true,
                    right: true,
                    size: 20
                }, 
                padding: 0
            }
        };
        const ct = new CanvasTable(canvas, config);
        await ct.generateTable();
        await ct.renderToFile(join(testDirectory,"test-small.png"));
    });
    
    it('renders a table', async () =>
    {
        const canvas = new FakeCanvas(640, 250);
        const config: CTConfig = { columns, data: [["1", "2", "3"]] };
        const ct = new CanvasTable(canvas as any, config);
        await ct.generateTable();
        const ctx = canvas.getContext("");
        const stack = [
            ["scale",2,2],["fillRect",0,0,640,250],["measureText","Text"],["measureText","Expenses"],
            ["measureText","Net"],["measureText","1"],["measureText","2"],["measureText","3"],["measureText","……"],
            ["fillText","Text",25,25],["fillText","Expenses",37,25],["fillText","Net",48,25],["beginPath"],
            ["moveTo",20,44.4],["lineTo",53,44.4],["stroke"],["fillText","1",25,49.4],["fillText","2",37,49.4],
            ["fillText","3",48,49.4]
        ];
        expect(ctx.methods()).to.have.deep.ordered.members(stack);
    });

});