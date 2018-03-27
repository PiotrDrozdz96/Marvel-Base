export interface Element {
    title: string;
    volume: string;
    number: string;
    id: string;
    series: Array<string>;
    subTitle: string;
    publishedDate: string;
    cover: string;
}

export interface Base {
    [index: string]: Element;
}
