export type CTConfig =
{
    data: CTData;
    columns: CTColumn[];
    options?: Partial<CTPassedOptions>;
};

export type CTData = string[][];

export type CTColumn =
{
    options?: Partial<CTCell>;
    title: string
};

export type CTPassedOptions =
{
    borders: Partial<CTBorders>;
    header: Partial<CTHeader>;
    cell: Partial<CTCell>;
    background: string;
    devicePixelRatio: number;
    fader: Partial<CTFader>;
    fit: boolean;
    padding: Partial<CTPadding>;
    subtitle: Partial<CTTitle>;
    title: Partial<CTTitle>;
};

export type CTOptions =
{
    borders: CTBorders;
    header: CTHeader;
    cell: CTCell;
    background: string;
    devicePixelRatio: number;
    fader: CTFader;
    fit: boolean;
    padding: CTPadding;
    subtitle: CTTitle;
    title: CTTitle;
};

export type CTTitle =
{
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