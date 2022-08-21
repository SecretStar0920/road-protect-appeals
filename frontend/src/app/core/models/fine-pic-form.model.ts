export class Pic {
    src: string;
    file: PicFile;
}

export class FinePicFormModel {
    finePicsArray: any[];
    otherPicsArray: any[];
    finished: boolean;
}
export class PicFile {
    lastModified: number;
    lastModifiedDate: Date;
    name: string;
    size: number;
    type: string;
    webkitRelativePath?: any;
}
