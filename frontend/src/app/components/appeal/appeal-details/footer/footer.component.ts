import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IMetaData } from '../../../../core/models/ui-metadata.model';
import { ITopicSelection } from '../../../../core/models/topic.model';
import { TicketService } from '../../../../core/services/ticket.service';
import { CrudService } from '../../../../core/services/crud.service';
import { SavedReasonsService } from '../services/saved-reasons.service';

@Component({
    selector: 'appeal-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
    public uiMetadata: { [key: string]: IMetaData } = {};
    public topicTree: { [key: string]: any } = {};
    constructor(
        private readonly ticketService: TicketService,
        private crudService: CrudService,
        private savedReasons: SavedReasonsService,
    ) {}

    async ngOnInit() {
        await this.initialiseQuestionsAndAnswers();
    }

    private async initialiseQuestionsAndAnswers() {
        const ticketId = this.ticketService.fine.get('id').value;
        const { db, metadata } = await this.crudService.getQuestionsAndAnswers(ticketId);
        this.topicTree = db;
        this.uiMetadata = metadata;
    }

    public getUiMetaData(name: string): string {
        if (!Object.keys(this.uiMetadata).length) {
            return '';
        }
        return this.uiMetadata ? this.uiMetadata[name].btnTxt : '';
    }

    public get title(): string {
        return this.topics.length === 1 ? 'בחרתי נושא אחד' : `בחרתי ${this.topics.length} נושאים`;
    }

    public getNumberOfReasons(topic: ITopicSelection): string {
        return topic.count === 1 ? 'נבחרה סיבה אחת' : `נבחרו ${topic.count} סיבות`;
    }

    public removeTopic(topic: string): void {
        this.savedReasons.removeSavedPath([topic]);
    }

    public get topics(): Array<ITopicSelection> {
        const topics = [];
        this.savedReasons.savedReasons.forEach((reason: Array<string>) => {
            const index = topics.findIndex(elem => elem.name === reason[0]);
            if (index !== -1) {
                topics[index].count++;
            } else {
                topics.push({
                    name: reason[0],
                    count: 1,
                });
            }
        });
        return topics;
    }
}
