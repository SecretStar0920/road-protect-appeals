import { ITicketData } from '../models/ticket.model';
import { DocumentModel } from '../models/document.model';
export interface GetTicketResponseDTO extends ITicketData {
    documents: DocumentModel[];
    questionsAndAnswers: string[][];
}
