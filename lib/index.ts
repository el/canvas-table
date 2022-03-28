import { Canvas } from "canvas";
import defaultOptions from "./defaultOptions";
import { writeFile } from "fs";
import { CTConfig, CTData, CTInternalOptions, CTColumn, CTTitle, CTPadding, CTExtractedPadding, CTTableDimensions, CTCustomCell } from "./types"

export * from "./types";

const isNode = typeof window === 'undefined';

export class CanvasTable
{
    private static readonly ELLIPSIS = "…";
    private static readonly NOT_AVAILABLE_ON_BROWSER = "Not available on browser";
    private static readonly NOT_AVAILABLE_ON_NODE = "Not available on node";
    private static readonly NOT_GENERATED_ERROR_MESSAGE =
        "CanvasTable has not been generated. Please call generateTable() first.";
    private static readonly TRANSPARENT_COLOR = !isNode ? "rgba(255,255,255,0)" : "transparent";

    private canvas_: Canvas | HTMLCanvasElement;
    private canvasHeight: number;
    private canvasWidth: number;
    private columnOuterWidths: number[] = [];
    private columns: CTColumn[];
    private computedOuterWidths: number[] = [];
    private config: CTConfig;
    private ctx: CanvasRenderingContext2D;
    private data: CTData;
    private horizontalTotalPadding = 0;
    private isGenerated = false;
    private options: CTInternalOptions;
    private tableHeight = 0;
    private tableStartX = 0;
    private tableStartY = 0;
    private tableWidth = 0;
    private x = 0;
    private y = 0;

    constructor(canvas: Canvas | HTMLCanvasElement, config: CTConfig)
    {
        this.canvas_ = canvas;
        this.canvasHeight = canvas.height;
        this.canvasWidth = canvas.width;
        this.config = config;
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        this.populateOptions();
        this.calculateTableDimensions();
        if (this.options.background)
        {
            this.ctx.fillStyle = this.options.background;
            this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        }
        this.ctx.textBaseline = "top";

        this.columns = config.columns;
        this.data = config.data;

        if (this.options.header && config.columns)
        {
            this.data = [ config.columns.map(column => column.title), ...this.data];
        }
    }

    public async generateTable(): Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            const { options: { padding, title, subtitle } } = this;
            const tablePadding = this.calculatePadding(padding);
            this.y = tablePadding.top;
            this.x = tablePadding.left;
            try {
                this.generateTitle(title);
                this.generateTitle(subtitle);
                this.calculateColumnWidths();

                this.tableStartX = this.x;
                this.tableStartY = this.y;

                this.generateRows();
                this.generateFaders();
                this.drawTableBorders();
            } catch (error)
            {
                reject(error);
            }
            this.isGenerated = true;
            resolve();
        });
    }

    public async renderToBlob(): Promise<Blob>
    {
        this.throwErrorIfNotGenerated();
        return new Promise((resolve, reject) =>
        {
            if (this.canvas_ instanceof Canvas)
            {
                reject(new Error(CanvasTable.NOT_AVAILABLE_ON_NODE));
                return;
            }
            (this.canvas_ as any).toBlob(resolve);
        });
    }

    public async renderToBuffer(): Promise<Buffer>
    {
        this.throwErrorIfNotGenerated();
        if (!(this.canvas_ instanceof Canvas))
        {
            throw new Error(CanvasTable.NOT_AVAILABLE_ON_BROWSER);
        }
        return this.canvas_.toBuffer();
    }

    public async renderToFile(filePath: string): Promise<void>
    {
        this.throwErrorIfNotGenerated();
        const buffer = await this.renderToBuffer();
        return new Promise((resolve, reject) =>
        {
            writeFile(filePath, buffer, error => error ? reject(error) : resolve());
        });
    }

    public tableDimensions(): CTTableDimensions
    {
        return {
            height: this.tableHeight,
            width: this.tableWidth,
            x: this.x,
            y: this.y
        };
    }

    private cellValue(data?: CTCustomCell | string): string[]
    {
            const value = (typeof data === "object" ? data.value : data) || "";
            return value.split("\n") || "";
    }

    private calculateColumnTextWidths(): number[]
    {
        const { columns, ctx, data, options: { cell, header } } = this;
        const columnWidths = Array(data[0].length).fill(1);

        for (const rowIndex in data)
        {
            const row = data[rowIndex];
            for (const cellIndex in row)
            {
                const [cellValue] = this.cellValue(row[cellIndex]);
                const option = header && rowIndex === "0" ? header : cell;

                ctx.font = `${option.fontWeight} ${option.fontSize}px ${option.fontFamily}`;
                ctx.fillStyle = option.color;
                ctx.textAlign = option.textAlign;
                const metrics = ctx.measureText(cellValue);
                if (metrics.width > columnWidths[cellIndex])
                {
                    columnWidths[cellIndex] = metrics.width;
                }
                const maxWidth = columns[cellIndex].options?.maxWidth;
                const minWidth = columns[cellIndex].options?.minWidth;
                if (maxWidth && metrics.width > maxWidth)
                {
                    columnWidths[cellIndex] = maxWidth;
                }
                if (minWidth && metrics.width < minWidth)
                {
                    columnWidths[cellIndex] = minWidth;
                }
            }
        }
        return columnWidths;
    }

    private calculateColumnWidths(): void
    {
        const { columns, ctx, options: { cell, fit }, tableWidth } = this;

        const columnTextWidths = this.calculateColumnTextWidths();
        const cellPadding = this.calculatePadding(cell.padding);

        this.horizontalTotalPadding = cellPadding.left + cellPadding.right;
        const columnPaddingTotal = this.horizontalTotalPadding * columnTextWidths.length;
        const totalColumnWidths = columnTextWidths.reduce((a, b) => a+b, 0);
        const columnWidthTotal = totalColumnWidths + columnPaddingTotal;
        this.columnOuterWidths = columnTextWidths.map(width => width + this.horizontalTotalPadding);
        this.computedOuterWidths = [...this.columnOuterWidths];
        const minWidth = ctx.measureText(`${CanvasTable.ELLIPSIS}${CanvasTable.ELLIPSIS}`).width;
        const minWidthWithPadding = minWidth + this.horizontalTotalPadding;
        if (columnWidthTotal > tableWidth)
        {
            this.computedOuterWidths = [];
            const fatColumnIndexes: number[] = [];
            const reservedWidth = tableWidth / this.columnOuterWidths.length;
            let totalFatWidth = 0;
            let remainingWidth = tableWidth;
            this.columnOuterWidths.forEach((columnOuterWidth, columnIndex) =>
            {
                this.computedOuterWidths.push(columnOuterWidth);
                if (columnOuterWidth > reservedWidth && !columns[columnIndex].options?.minWidth)
                {
                    fatColumnIndexes.push(columnIndex);
                    totalFatWidth = totalFatWidth + columnOuterWidth;
                }
                else
                {
                    remainingWidth = remainingWidth - columnOuterWidth;
                }
            });
            console.log({ fatColumnIndexes, totalFatWidth })
            fatColumnIndexes.forEach(index =>
            {
                const columnOuterWidth = this.columnOuterWidths[index];
                const fatWidth = columnOuterWidth/totalFatWidth * remainingWidth;
                this.computedOuterWidths[index] = fatWidth < minWidthWithPadding ? minWidthWithPadding : fatWidth;
            });
        }
        else if (fit && columnWidthTotal < tableWidth)
        {
            const difference = tableWidth - columnWidthTotal;
            this.computedOuterWidths = columnTextWidths.map(width =>
                width + difference*width/totalColumnWidths + this.horizontalTotalPadding);
        }
    }

    private calculateTableDimensions(): void
    {
        const { canvas_, canvasHeight, canvasWidth, ctx, options: { devicePixelRatio, padding } } = this;
        canvas_.width =  canvasWidth * devicePixelRatio;
        canvas_.height = canvasHeight * devicePixelRatio;
        if ("style" in canvas_)
        {
          (canvas_ as any).style.width = `${canvasWidth}px`;
          (canvas_ as any).style.height = `${canvasHeight}px`;
        }
        const tablePadding = this.calculatePadding(padding);
        this.tableHeight = canvasHeight - tablePadding.top - tablePadding.bottom;
        this.tableWidth = canvasWidth - tablePadding.left - tablePadding.right;

        ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    private calculatePadding(padding?: CTPadding): CTExtractedPadding
    {
        const value = !padding ? 0 : padding;
        if (typeof value === "number")
        {
            return {
                bottom: value,
                left: value,
                right: value,
                top: value
            };
        }
        return value;
    }

    private generateTitle(title: CTTitle): void
    {
        const { ctx, tableWidth, x, y } = this;
        if (!title.text)
        {
            return;
        }

        ctx.font = `${title.fontWeight} ${title.fontSize}px ${title.fontFamily}`;
        ctx.fillStyle = title.color;
        ctx.textAlign = title.textAlign;
        const lineHeight = Math.round(title.fontSize * title.lineHeight);
        const titleLines = title.text.split("\n");
        const titleX = title.textAlign === "center" ? tableWidth/2 : 0;
        let lineIndex = 0;
        const isFat = (text) => ctx.measureText(text).width > this.tableWidth;
        titleLines.forEach((line) => {
            const innerLines: string[] = [];
            if (title.multiline) {
                innerLines.push("");
                const lineArray = line.split(" ");
                lineArray.forEach((lineValue) =>
                {
                    const index = innerLines.length - 1;
                    const nextValue = `${innerLines[index]} ${lineValue}`;
                    if (isFat(nextValue))
                    {
                        innerLines.push(lineValue);
                    }
                    else
                    {
                        innerLines[index] = nextValue;
                    }
                });
            }
            else
            {
                let cellValue = line;
                const valueWithEllipsis = () => `${cellValue}${CanvasTable.ELLIPSIS}`;
                if (isFat(valueWithEllipsis()))
                {
                    while (isFat(valueWithEllipsis()))
                    {
                        cellValue = cellValue.slice(0, -1);
                    }
                    cellValue = valueWithEllipsis();
                }
                innerLines.push(cellValue);
            }

            innerLines.forEach(innerLine => ctx.fillText(innerLine, x + titleX, y + lineIndex++ * lineHeight));
        });
        this.y += lineIndex * lineHeight + lineHeight / 2;
    }

    private generateRows(): void
    {
        const { canvasHeight, columnOuterWidths, columns, computedOuterWidths, ctx, data, horizontalTotalPadding,
            options: { cell, header, minCharWidth }, tableStartX } = this;
        const cellPadding = this.calculatePadding(cell.padding);

        for (let rowIndex = 0; rowIndex < data.length; rowIndex++)
        {
            const row = data[rowIndex];
            const lineHeight = cell.lineHeight * cell.fontSize + cellPadding.bottom + cellPadding.top;
            this.x = tableStartX;
            for (const cellIndex in columnOuterWidths)
            {
                const computedOuterWidth = computedOuterWidths[cellIndex];
                const columnOptions = columns && columns[cellIndex].options
                    ? columns[cellIndex].options : {};    
                const customCellStyles = typeof row[cellIndex] === "object" ? row[cellIndex] : {};
                let [cellValue] = this.cellValue( row[cellIndex]);
                const option = header && !rowIndex ? header : {...cell, ...columnOptions, ...customCellStyles};
                if (rowIndex &&  option.background)
                {
                    ctx.fillStyle = option.background;
                    ctx.fillRect(this.x, this.y, computedOuterWidth, lineHeight);
                }
                ctx.font = `${option.fontWeight} ${option.fontSize}px ${option.fontFamily}`;
                ctx.fillStyle = option.color;
                const textAlign = columnOptions && columnOptions.textAlign
                    ? columnOptions.textAlign : option.textAlign;
                ctx.textAlign = textAlign;
                const textWidth = ctx.measureText(cellValue).width;
                if (textWidth > computedOuterWidth)
                {
                    const isFat = () => ctx.measureText(cellValue.length > minCharWidth
                        ? `${cellValue}${CanvasTable.ELLIPSIS}`
                        : `${cellValue}.`).width > (computedOuterWidth - horizontalTotalPadding);
                    if (isFat())
                    {
                        while (isFat())
                        {
                            cellValue = cellValue.slice(0, -1);;
                        }
                        cellValue = cellValue.length > minCharWidth
                            ? `${cellValue}${CanvasTable.ELLIPSIS}` : `${cellValue}.`;
                    }
                }
                let cellX = this.x + cellPadding.left;
                let cellY = this.y + cellPadding.top;
                if (textAlign === "right")
                {
                    cellX = this.x + computedOuterWidth - cellPadding.right;
                }
                if (textAlign === "center")
                {
                    cellX = this.x + computedOuterWidth/2;
                }
                ctx.fillText(cellValue, cellX, cellY);
                this.x += computedOuterWidth;

                this.drawRowBorder(lineHeight);

            }
            this.y += lineHeight;
            this.drawColumnBorder(rowIndex);
            if (this.y > canvasHeight)
            {
                break;
            }
        }
    }

    private drawColumnBorder(rowIndex: number): void
    {
        const { ctx, options: { borders, header }, tableStartX, x, y } = this;
        const columnBorder = !rowIndex && header && borders.header ? borders.header : borders.column;
        if (!columnBorder)
        {
            return;
        }
        ctx.beginPath();
        ctx.moveTo(tableStartX, y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = columnBorder.color;
        ctx.lineWidth = columnBorder.width;
        ctx.stroke();
    }

    private drawRowBorder(lineHeight: number): void
    {
        const { ctx, options: { borders: { row } } } = this;
        if (!row)
        {
            return;
        }
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + lineHeight);
        ctx.strokeStyle = row.color;
        ctx.lineWidth = row.width;
        ctx.stroke();
    }

    private generateFaders(): void
    {
        const { canvasHeight, canvasWidth, ctx, options: { background, fader }, x, y } = this;
        if (!fader)
        {
            return;
        }
        if (y > canvasHeight && fader.bottom)
        {
            var bottomFader = ctx.createLinearGradient(0, canvasHeight - fader.size, 0, canvasHeight);
            bottomFader.addColorStop(0, CanvasTable.TRANSPARENT_COLOR);
            bottomFader.addColorStop(1, background);
            ctx.fillStyle = bottomFader;
            ctx.fillRect(0 , canvasHeight - fader.size, canvasWidth, fader.size);
        }

        if (x > canvasWidth && fader.right)
        {
            var rightFader = ctx.createLinearGradient(canvasWidth - fader.size, 0, canvasWidth, 0);
            rightFader.addColorStop(0, CanvasTable.TRANSPARENT_COLOR);
            rightFader.addColorStop(1, background);
            ctx.fillStyle = rightFader;
            ctx.fillRect(canvasWidth - fader.size, 0, fader.size, canvasHeight);
        }
    }

    private drawTableBorders(): void
    {
        const { table } = this.options.borders;
        if (!table)
        {
            return;
        }

        const { ctx, tableStartX, tableStartY, x, y } = this;
        ctx.strokeStyle = table.color;
        ctx.lineWidth = table.width;
        ctx.strokeRect(tableStartX, tableStartY, x - tableStartX, y - tableStartY);
    }

    private populateOptions(): void
    {
        const { options } = this.config;
        if (!options)
        {
            this.options = {...defaultOptions};
            return;
        }
        const { borders, header, cell, fader, subtitle, title } = defaultOptions;
        const defaultPadding = defaultOptions.padding as CTExtractedPadding;
        const padding = options.padding !== undefined ? (typeof options.padding !== "number"
            ? {...defaultPadding, ...options.padding } : options.padding) : defaultPadding;
        this.options = {
            ...defaultOptions,
            ...options,
            borders: options.borders ? { ...borders, ...options.borders } : borders,
            header: options.header ? { ...header, ...options.header } : header,
            cell: options.cell ? { ...cell, ...options.cell } : cell,
            fader: options.fader ? { ...fader, ...options.fader } : fader,
            padding: padding,
            subtitle: options.subtitle ? { ...subtitle, ...options.subtitle } : subtitle,
            title: options.title ? { ...title, ...options.title } : title,
        };
    }

    private throwErrorIfNotGenerated(): void
    {
        if (!this.isGenerated)
        {
            throw new Error(CanvasTable.NOT_GENERATED_ERROR_MESSAGE);
        }
    }
}