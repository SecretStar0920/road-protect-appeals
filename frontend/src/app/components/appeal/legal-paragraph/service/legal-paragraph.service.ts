import { environment } from '../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { LegalParagraphModel } from '../../../../core/models/legal-paragraph.model';
import { HttpClient } from '@angular/common/http';
import paragraphs from '../../../../../assets/jsons/legal-paragraphs.json';

@Injectable()
export class LegalParagraphService {
    constructor(private http: HttpClient) {}

    public getLegalParagraphs(ticketId: number): Promise<any> {
        let text: string = '';
        return this.http
            .get<LegalParagraphModel[]>(`${environment.baseUrl}/legal-paragraph/${ticketId}`)
            .toPromise()
            .then((result: LegalParagraphModel[]) => {
                result.map((paragraph: LegalParagraphModel) => {
                    text += paragraph.text;
                    text += '\n\n';
                });

                return text;
            });
    }
}
