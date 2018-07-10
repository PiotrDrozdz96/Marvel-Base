export interface Seria {
    zeszyty: Array<string>;
    tomy: Array<string>;
}

export interface Series {
    [index: string]: Seria;
}
