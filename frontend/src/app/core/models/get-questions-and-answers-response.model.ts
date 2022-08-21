import { IMetaData } from './ui-metadata.model';

export interface GetQuestionsAndAnswersResponseModel {
    db: { [key: string]: any };
    metadata: { [key: string]: IMetaData };
}
