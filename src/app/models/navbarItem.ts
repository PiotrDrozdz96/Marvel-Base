export interface NavbarItem {
    title: string;
    icon?: string;
    href?: string;
    dropdown?: Array<NavbarItem>;
}
