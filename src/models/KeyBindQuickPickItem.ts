import {QuickPickItem} from 'vscode';

export class KeyBindQuickPickItem implements QuickPickItem {
    label: string;
    description: string;
    detail: string;

    constructor(label:string, description:string, detail: string){
        this.label = label;
        this.description = description;
        this.detail = detail;
    }
}
