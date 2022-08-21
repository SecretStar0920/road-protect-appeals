import { TicketService } from '../../../../core/services/ticket.service';
import { Injectable, OnInit } from '@angular/core';

@Injectable()
export class SavedReasonsService {
    private savedSelectedReasons: { [key: string]: boolean } = {};

    constructor(private ticketService: TicketService) {}

    initialiseSelectedReasons() {
        this.savedSelectedReasons = {};
        this.savedReasons.map(savedPath => {
            savedPath.map(selectedOption => {
                this.savedSelectedReasons[selectedOption] = true;
            });
        });
    }

    isSelected(reason: string): boolean {
        return this.savedSelectedReasons[reason];
    }

    get savedReasons(): Array<Array<string>> {
        return this.ticketService.appealPaths;
    }

    savePath(path: string[], pathToExclude?: string[]) {
        // if already saved then don't save
        if (this.pathIsAlreadySaved(path)) {
            return;
        }

        if (!!pathToExclude && pathToExclude.length > 0) {
            this.removeSavedPath(pathToExclude);
        }

        this.savedReasons.push(path);
        // add to selected obj
        path.forEach(reasonCode => {
            this.savedSelectedReasons[reasonCode] = true;
        });

        return;
    }

    removeSavedPath(path: string[]) {
        //  saved reasons to strings
        const pathString = path.join(',');
        this.ticketService.appealPaths = this.savedReasons.filter((savedPath: string[]) => {
            const savedString = savedPath.join(',');
            if (savedString.includes(pathString)) {
                savedPath.forEach(reasonCode => {
                    this.savedSelectedReasons[reasonCode] = false;
                });
                return false;
            } else {
                return true;
            }
        });
    }

    private pathIsAlreadySaved(currentPath: string[]): boolean {
        const pathString = currentPath.join(',');
        const savedReasonsStrings = this.savedReasons.map((path: string[]) => path.join(','));
        return savedReasonsStrings.indexOf(pathString) >= 0;
    }
}
