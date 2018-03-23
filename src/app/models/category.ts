export interface Category {
    title: string;
    checked: boolean;
    series?: Array<Category>;
}
