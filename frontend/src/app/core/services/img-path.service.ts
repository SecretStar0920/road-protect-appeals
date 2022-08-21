import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ImgPathService {
    // FOLDER pathes
    imgPath: string = './assets/images/';
    iconPath: string = this.imgPath + 'icons/';
    presentationIconPath: string = this.iconPath + 'presentation/';
    processIconPath: string = this.iconPath + 'process/';
    uiIconPath: string = this.iconPath + 'ui/';
    // IMAGES
    logoMobile: string = this.imgPath + 'logo.png';
    logoDesktop: string = this.imgPath + 'logo-desktop.png';
    logoPci: string = this.imgPath + 'logo-pci.png';
    logoSsl: string = this.imgPath + 'logo-ssl.png';
    // ICONS
    // presentation icons
    userIcon: string = this.presentationIconPath + 'user.svg';
    emailIcon: string = this.presentationIconPath + 'email.svg';
    chatIcon: string = this.presentationIconPath + 'chat.svg';
    faxIcon: string = this.presentationIconPath + 'print.svg';
    timeIcon: string = this.presentationIconPath + 'time.svg';
    // process icons
    attentionProcessIcon: string = this.processIconPath + 'attention.svg';
    busStopProcessIcon: string = this.processIconPath + 'bus-stop-parking.svg';
    carBrokenProcessIcon: string = this.processIconPath + 'car-broken.svg';
    carRoadProcessIcon: string = this.processIconPath + 'car-road.svg';
    carStackProcessIcon: string = this.processIconPath + 'car-stack.svg';
    enviromentProcessIcon: string = this.processIconPath + 'enviroment.svg';
    goodProcessIcon: string = this.processIconPath + 'good.svg';
    handicapProcessIcon: string = this.processIconPath + 'handicap.svg';
    medicalProcessIcon: string = this.processIconPath + 'medical.svg';
    noPayProcessIcon: string = this.processIconPath + 'no-pay.svg';
    notLegalProcessIcon: string = this.processIconPath + 'not-legal.svg';
    otherProcessIcon: string = this.processIconPath + 'other.svg';
    paidProcessIcon: string = this.processIconPath + 'paid.svg';
    redWhiteProcessIcon: string = this.processIconPath + 'red-white.svg';
    reportProcessIcon: string = this.processIconPath + 'report.svg';
    sidwalkParkingProcessIcon: string = this.processIconPath + 'sidewalk-parking.svg';
    stickerProcessIcon: string = this.processIconPath + 'sticker.svg';
    wrongParkProcessIcon: string = this.processIconPath + 'wrong-park.svg';
    // ui icons
    burgerUiIcon: string = this.uiIconPath + 'menu.svg';
    calanderUiIcon: string = this.uiIconPath + 'date.svg';
    chevronRightUiIcon: string = this.uiIconPath + 'chevron-right.svg';
    closeUiIcon: string = this.uiIconPath + 'close.svg';
    editUiIcon: string = this.uiIconPath + 'pencil.svg';
    errorUiIcon: string = this.uiIconPath + 'error.svg';
    questionUiIcon: string = this.uiIconPath + 'question.svg';
    thumbUiIcon: string = this.uiIconPath + 'thumb.svg';
    thumbEmptyUiIcon: string = this.uiIconPath + 'thumb-empty.svg';
    thumbsUpUiIcon: string = this.uiIconPath + 'thumbs-up.svg';
    thumbsUpFilledUiIcon: string = this.uiIconPath + 'thumbs-up-filled.svg';
    thumbsDownUiIcon: string = this.uiIconPath + 'thumbs-down.svg';
    thumbsDownFilledUiIcon: string = this.uiIconPath + 'thumbs-down-filled.svg';
    uploadUiIcon: string = this.uiIconPath + 'upload.svg';
    pdfUiIcon: string = this.uiIconPath + 'pdf.svg';
    trashUiIcon: string = this.uiIconPath + 'trash.svg';
    sendUiIcon: string = this.uiIconPath + 'send.svg';
    locationUiIcon: string = this.uiIconPath + 'location.svg';
    constructor() {}
}
