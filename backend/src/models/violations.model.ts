export interface IViolations {
    id: string;
    violationTitle: string;
    genericProperty: IGenericPropertyClass | number;
    sortOrder: number | null;
}

export interface IGenericPropertyClass {
    iconSrc: string;
    btnTxt: string;
}
