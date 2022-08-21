export interface ViolationModel {
    id: string;
    violationTitle: string;
    genericProperty: GenericProperty;
    sortOrder: null;
}

export interface GenericProperty {
    iconSrc: string;
    btnTxt: string;
}
