export interface Category {
    title: string;
    checked: boolean;
    series?: Array<Category>;
}

export interface Categories {
    baseTitle: Category;
    [index: string]: Category;
}
