export type CTConfig =
{
    data: CTData;
    columns: CTColumn[];
    options?: CTOptions;
};

export type CTCustomCell = 
{
     value: string;
 } & Partial<CTCell>;
 
export type CTCellData = string | CTCustomCell;

export type CTData = CTCellData[][];

export type CTColumn =
{
    options?: Partial<CTCell> & {
        maxWidth?: number;
        minWidth?: number;
    };
    title: string
};

export type CTOptions =
{
    borders?: Partial<CTBorders>;
    header?: Partial<CTHeader>;
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