import { ReasonModel } from './reason.model';

export class TopicModel {
    text: string;
    id: number;
    icon: string;
}

export interface ITopicSelection {
    name: string;
    count: number;
}
