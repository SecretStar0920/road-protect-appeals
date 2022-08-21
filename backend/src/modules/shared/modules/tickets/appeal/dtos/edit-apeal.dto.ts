import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Moment } from 'moment';
import { DocumentModel } from '../../../../../../models/document.model';

export interface EditAppealDetails {
    documents?: DocumentModel[];
    questionsAndAnswers?: string[][];
    roadProtectZAId?: string;
}

export class EditApealDto {
    @IsOptional()
    details?: EditAppealDetails;

    @IsOptional()
    @IsString()
    customParagraphs?: string;

    @IsOptional()
    deletedAt?: Moment;

    @IsNumber()
    @IsOptional()
    customerId?: number;
}
