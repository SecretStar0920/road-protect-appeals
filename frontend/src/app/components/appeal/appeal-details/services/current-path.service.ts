import { Injectable } from '@angular/core';

@Injectable()
export class CurrentPathService {
    public currentPath: string[] = [];
    private selectedReasons: { [key: string]: boolean } = {};
    private topicTree: { [key: string]: any } = {};

    constructor() {}

    initialiseCurrentPath() {
        this.currentPath = [];
    }

    addToCurrentPath(key: string): boolean {
        // first check that it isn't already selected in current path
        if (this.isSelected(key)) {
            this.unselectLast();
            return false;
        }

        if (this.lastOptionIsSelected()) {
            this.unselectLast();
        }

        // add to current path
        this.currentPath.push(key);
        this.selectedReasons[key] = true;
        return true;
    }

    isSelected(reason: string): boolean {
        return this.currentPath.includes(reason);
    }

    unselectLast() {
        const key = this.currentPath.pop();
        this.selectedReasons[key] = false;
        return key;
    }

    setTopicTree(topicTree: { [key: string]: any }) {
        this.topicTree = topicTree;
    }

    lastOptionIsSelected() {
        let tempObject = { ...this.topicTree };
        this.currentPath.forEach(step => {
            tempObject = tempObject[step];
            return tempObject;
        });
        return typeof tempObject === 'string';
    }
}
