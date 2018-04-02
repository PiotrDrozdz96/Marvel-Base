export interface Category {
    title: string;
    checked: boolean;
    series?: Array<Category>;
}

export interface Categories {
    [index: string]: Category;
}
