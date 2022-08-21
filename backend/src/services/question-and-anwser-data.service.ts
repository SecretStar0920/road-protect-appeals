import { Injectable } from '@nestjs/common';
import { IMetadata, QuestionsAndAnswersModel } from '../models/questions-and-answers.model';
import { LogChannel } from '../config/logs';
import { LoggerService } from '@logger';

export enum IMetadataType {
    Topic = 'topic',
    Reason = 'reason',
    Answer = 'answer',
}

@Injectable()
export class QuestionAndAnwserDataService {
    constructor(private logger: LoggerService) {}

    modifyQuestionsAndAnswersData(data: QuestionsAndAnswersModel): { [key: string]: any } {
        const fnc = this.modifyQuestionsAndAnswersData.name;
        this.logger.debug(LogChannel.ZA, `Modifying the question and answer data`, fnc, data);
        const db = {};
        const metadata = {};
        data.questions.forEach(question => {
            const modifyAnswers = (accumulator, currentValue): any => {
                if (currentValue.metadata.paragraph !== '') {
                    const key = currentValue.answerCode || currentValue.questionCode;
                    metadata[key] = { ...currentValue.metadata, type: this.setType(currentValue) };
                    accumulator[key] = currentValue.metadata.paragraph;
                }
                if (currentValue.questions && currentValue.questions.length) {
                    const key = currentValue.answerCode;
                    metadata[key] = { ...currentValue.metadata, type: this.setType(currentValue) };
                    accumulator[key] = currentValue.questions.reduce(modifyAnswers, {});
                }
                if (currentValue.answers && currentValue.answers.length) {
                    const key = currentValue.questionCode;
                    metadata[key] = { ...currentValue.metadata, type: this.setType(currentValue) };
                    accumulator[key] = currentValue.answers.reduce(modifyAnswers, {});
                }
                return accumulator;
            };

            const key = question.questionCode;
            metadata[key] = { ...question.metadata, type: IMetadataType.Topic };
            db[key] = question.answers.reduce(modifyAnswers, {});
        });
        return { db, metadata };
    }

    private setType(currentObject: any): string {
        // if it is an answer:
        if (!/\S/.test(currentObject.metadata.pageTitle)) {
            // Answers have ' ' as their paragraph value
            return IMetadataType.Answer;
        } else {
            // Reasons have any string in the paragraph field of their metadata
            return IMetadataType.Reason;
        }
    }
}
