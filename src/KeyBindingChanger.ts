'use strict';
import {window} from 'vscode';
import {KeyBindingSearch} from './KeyBindingSearch';

export class KeyBindingChanger {
    constructor(private keyBindingSearch : KeyBindingSearch){

    }
    keyChanger() {
        window.showInputBox({validateInput: this.validateInput})
        .then((keyBindingValue) => {

        });
    }

    private validateInput(textValue: string){
        return this.keyBindingSearch.searchKey(textValue);
    }
    
}