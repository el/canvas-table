import { Canvas } from "canvas";

export type CTConfig =
{
    columns: CTColumn[];
    data: CTData;
    events?: CTEvents;
    options?: CTOptions;
};

export type CTCustomCell =
{
    value?: string;
} & Partial<CTCell>;


export type CTData = (string | CTCustomCell | undefined)[][];

export type CTColumn =
{
    options?: Partial<CTCell> & {
        maxWidth?: number;
        minWidth?: number;
    };
    title: string
};

export type CTEventCallback = (canvas: Canvas | HTMLCanvasElement, x: number, y: number, data?: object)
    => void | Promise<void>;

export type CTEvents =
{
    cellCreated?: CTEventCallback;
    fadersCreated?: CTEventCallback;
    headerCreated?: CTEventCallback;
    rowCreated?: CTEventCallback;
    rowsCreated?: CTEventCallback;
    subtitleCreated?: CTEventCallback;
    tableBordersCreated?: CTEventCallback;
    tableCreated?: CTEventCallback;
    titleCreated?: CTEventCallback;
}

export type CTOptions =
{
    borders?: Partial<CTBorders>;
    header?: Partial<CTHeader> | false;
    cell?: Partial<CTCell>;
    background?: string;
    devicePixelRatio?: number;
    fader?: Partial<CTFader>;
    fit?: boolean;
    minCharWidth?: number;
    padding?: Partial<CTPadding>;
    subtitle?: Partial<CTTitle>;
    title?: Partial<CTTitle>;
};

export type CTInternalOptions =
{
    borders: CTBorders;
    header: CTHeader;
    hideHeader: boolean;
    cell: CTCell;
    background: string;
    devicePixelRatio: number;
    fader: CTFader;
    fit: boolean;
    minCharWidth: number;
    padding: CTPadding;
    subtitle: CTTitle;
    title: CTTitle;
};

export type CTTitle =
{
    multiline?: boolean;
    text?: string;
} & CTTextStyle;

export type CTBorder =
{
    color: string;
    width: number;
};

export type CTBorders =
{
    column?: CTBorder;
    header?: CTBorder;
    row?: CTBorder;
    table?: CTBorder;
};

export type CTHeader =
{
    background?: string;
} & CTCell;

export type CTCell =
{
    padding: CTPadding;
} & CTTextStyle;

export type CTFader =
{
    right: boolean;
    size: number;
    bottom: boolean;
};

export type CTTextStyle =
{
    background?: string;
    fontSize: number;
    fontWeight: string;
    fontFamily: string;
    color: string;
    lineHeight: number;
    textAlign: CanvasTextAlign;
};

export type CTPadding = CTExtractedPadding | number;

export type CTExtractedPadding = {
    bottom: number;
    left: number;
    right: number;
    top: number;
};

export type CTTableDimensions =
{
    height: number;
    width: number;
    x: number;
    y: number;
}