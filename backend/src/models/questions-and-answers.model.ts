interface IViolationInformation {
    ticketType: string;
    ticketTypeName: string;
}

export interface IMetadata {
    pageTitle: string;
    iconSrc: string;
    subTitle: string;
    btnTxt: string;
    paragraph: string;
}

export interface IAnswer {
    answer: string;
    metadata: IMetadata;
    answerCode: string;
    isSkipButton: boolean;
    selected: boolean;
    questions: string | IQuestion[];
}

export interface IQuestion {
    question: string;
    metadata: IMetadata;
    questionCode: string;
    questionAnswerType: string;
    required: boolean;
    answers: IAnswer[];
}

export interface QuestionsAndAnswersModel {
    violationInformation: IViolationInformation;
    questions: IQuestion[];
}
