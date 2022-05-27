export declare type CTConfig = {
    data: CTData;
    columns: CTColumn[];
    options?: CTOptions;
};
export declare type CTCustomCell = {
    value?: string;
} & Partial<CTCell>;
export declare type CTData = (string | CTCustomCell | undefined)[][];
export declare type CTColumn = {
    options?: Partial<CTCell> & {
        maxWidth?: number;
        minWidth?: number;
    };
    title: string;
};
export declare type CTOptions = {
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
export declare type CTInternalOptions = {
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
export declare type CTTitle = {
    multiline?: boolean;
    text?: string;
} & CTTextStyle;
export declare type CTBorder = {
    color: string;
    width: number;
};
export declare type CTBorders = {
    column?: CTBorder;
    header?: CTBorder;
    row?: CTBorder;
    table?: CTBorder;
};
export declare type CTHeader = {
    background?: string;
} & CTCell;
export declare type CTCell = {
    padding: CTPadding;
} & CTTextStyle;
export declare type CTFader = {
    right: boolean;
    size: number;
    bottom: boolean;
};
export declare type CTTextStyle = {
    background?: string;
    fontSize: number;
    fontWeight: string;
    fontFamily: string;
    color: string;
    lineHeight: number;
    textAlign: CanvasTextAlign;
};
export declare type CTPadding = CTExtractedPadding | number;
export declare type CTExtractedPadding = {
    bottom: number;
    left: number;
    right: number;
    top: number;
};
export declare type CTTableDimensions = {
    height: number;
    width: number;
    x: number;
    y: number;
};
