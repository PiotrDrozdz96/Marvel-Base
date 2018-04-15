export interface MarvelElement {
    title: string;
    volume: string;
    number: string;
    id: string;
    series: Array<string>;
    children?: Array<string>;
    subTitle: string;
    publishedDate: string;
    cover: string;
}

export interface MarvelElements {
    [index: string]: MarvelElement;
}
