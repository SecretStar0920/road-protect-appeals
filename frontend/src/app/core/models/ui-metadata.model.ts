export enum IMetadataType {
    Topic = 'topic',
    Reason = 'reason',
    Answer = 'answer',
}

export interface IMetaData {
    pageTitle: string;
    iconSrc: string;
    subTitle: string;
    btnTxt: string;
    type?: IMetadataType;
}
