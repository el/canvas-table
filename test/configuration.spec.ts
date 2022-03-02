import { CanvasTable } from "../lib";
import { createCanvas, Canvas } from "canvas";
import { CTConfig, CTData, CTColumn } from "../lib/types";
import { join } from "path";
import { FakeCanvas } from "./fakeCanvas";
import { expect } from "chai";

describe("CanvasTable", async() =>
{
    const title = "Here's to the crazy ones. The misfits. The rebels. The troublemakers. The round pegs in the square" +
    " holes. The ones who see things differently. They're not fond of rules. And they have no respect for the status " +
    "quo. You can quote them, disagree with them, glorify or vilify them. About the only thing you can't do is ignore" +
    " them. Because they change things. They push the human race forward. And while some may see them as the crazy on" +
    "es, we see genius. Because the people who are crazy enough to think they can change the world, are the ones who " +
    "do."
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
    
    it("renders a table", async () =>
    {
        const canvas = createCanvas(640, 250);
        const config: CTConfig = { columns, data };
        const ct = new CanvasTable(canvas, config);
        await ct.generateTable();
        await ct.renderToFile(join(testDirectory,"test-table.png"));
    });
    
    it("renders a table with a title", async () =>
    {
        const canvas = createCanvas(640, 250);
        const config: CTConfig = { columns, data, options: { title: {text: "Title"} } };
        const ct = new CanvasTable(canvas, config);
        await ct.generateTable();
        await ct.renderToFile(join(testDirectory,"test-table.png"));
    });
    
    it("renders a table with a long title", async () =>
    {
        const canvas = createCanvas(250, 250);
        const config: CTConfig = { columns, data, options: { title: {text: title} } };
        const ct = new CanvasTable(canvas, config);
        await ct.generateTable();
        await ct.renderToFile(join(testDirectory,"test-title.png"));
    });
    
    it("renders a table with a long multi-line title", async () =>
    {
        const canvas = createCanvas(250, 400);
        const config: CTConfig = { columns, data, options: { title: {multiline: true, text: title} } };
        const ct = new CanvasTable(canvas, config);
        await ct.generateTable();
        await ct.renderToFile(join(testDirectory,"test-multi-line.png"));
    });
    
    it("renders a fitted table", async () =>
    {
        const canvas = createCanvas(640, 250);
        const config: CTConfig = { columns, data, options: { fit: true } };
        const ct = new CanvasTable(canvas, config);
        await ct.generateTable();
        await ct.renderToFile(join(testDirectory,"test-fit.png"));
    });
    
    it("renders a table with min and max width", async () =>
    {
        const canvas = createCanvas(640, 250);
        const config: CTConfig = {
            columns: [
                { title: "Text", options: { minWidth: 100 }},
                { title: "Net amount of the transactions", options: { maxWidth: 70 }},
                { title: "Expenses", options: { minWidth: 240 }}
            ],
            data
        };
        const ct = new CanvasTable(canvas, config);
        await ct.generateTable();
        await ct.renderToFile(join(testDirectory,"test-width.png"));
    });
    
    it("renders a table with min and max width with a big table", async () =>
    {
        const canvas = createCanvas(400, 250);
        const config: CTConfig = {
            columns: [
                { title: "Text"},
                { title: "Net amount of the transactions", options: { minWidth: 250 }},
                { title: "Expenses"}
            ],
            data
        };
        const ct = new CanvasTable(canvas, config);
        await ct.generateTable();
        await ct.renderToFile(join(testDirectory,"test-width-big.png"));
    });

    it("renders a table with long data", async () =>
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

    it("renders a table with long data", async () =>
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

    it("renders a table with small canvas", async () =>
    {
        const canvas = createCanvas(90, 90);
        const config: CTConfig = { columns, data, options: { fader: undefined, padding: 0 }};
        const ct = new CanvasTable(canvas, config);
        await ct.generateTable();
        await ct.renderToFile(join(testDirectory,"test-small.png"));
    });

    it("renders a table with lots of data", async () =>
    {
        const canvas = createCanvas(640, 250);

        const config: CTConfig = {
            columns: [
                { title: "ID" },
                { title: "Date", options: { textAlign: "right" } },
                { title: "Amount", options: { textAlign: "right" } },
                { title: "Type" },
                { title: "Category" }
            ],
            data: [
                ["1","4/20/2018","$638.45","Deposit","Fuel"],
                ["2","1/9/2018","$627.71","Deposit","Technology"],
                ["3","8/8/2019","$437.48","Withdrawal","Technology"],
                ["4","6/1/2018","$281.74","Deposit","Technology"],
                ["5","12/23/2018","$408.28","Deposit","Food"],
                ["6","4/27/2018","$901.42","Withdrawal","Technology"],
                ["7","2/26/2019","$213.48","Deposit","Fuel"],
                ["8","6/8/2018","$428.49","Withdrawal","Entertainment"],
                ["9","10/31/2018","$37.53","Withdrawal","Entertainment"],
                ["10","2/23/2019","$937.4","Deposit","Clothes"],
                ["11","4/20/2019","$150.56","Deposit","Entertainment"],
                ["12","7/14/2018","$474.59","Withdrawal","Technology"]
            ],
            options: {
                borders: {
                    table: { color: "#aaa", width: 1 }
                },
                devicePixelRatio: 2,
                fit: true,
                header: {
                    color: "#9c26af"
                },
                title: {
                    text: "Account Status"
                }
            }
        };
        const ct = new CanvasTable(canvas, config);
        await ct.generateTable();
        await ct.renderToFile(join(testDirectory,"test-account.png"));
    });

    it("renders a table with a fader", async () =>
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
    
    it("renders a table", async () =>
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