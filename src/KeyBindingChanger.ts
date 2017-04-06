'use strict';
import {window, QuickPickItem, workspace, commands} from 'vscode';
import {defaultBindings} from "./resources/defaultBindings";
import {defaultBindingsMac} from "./resources/defaultBindingsMac";
import {defaultBindingsLinux} from "./resources/defaultBindingsLinux";
import {KeyBindQuickPickItem} from "./models/KeyBindQuickPickItem";
import {IKeyBindConfig} from "./models/IKeyBindConfig";
import * as _ from "lodash";
import {FileManager} from "./FileManager";
let jsonMinify = require('node-json-minify');


export class KeyBindingChanger {
    private baseKeybindingFilePath : string = '/Code/User/keybindings.json';
    private userSettingPath : string = process.env.APPDATA + this.baseKeybindingFilePath;
    private defaultKeyBindingList : IKeyBindConfig[] = defaultBindings();

    constructor(){
        switch(process.platform){
            case 'darwin':
                this.userSettingPath = process.env.HOME + '/Library/Application Support' + this.baseKeybindingFilePath;
                this.defaultKeyBindingList = defaultBindingsMac();
                break;
            case 'linux':
                this.userSettingPath = process.env.HOME + '/.config' + this.baseKeybindingFilePath;
                this.defaultKeyBindingList = defaultBindingsLinux();
                break;
        }
    }


    async changeKey() {
        let userKeyBindingList : IKeyBindConfig[] = await this.getUserKeyBindingArray();
        userKeyBindingList.map(element => element.when = element.when ? element.when + ' (user setting)' : '(user setting)');
        let combinedList = _.union(userKeyBindingList, this.defaultKeyBindingList);
        let keybindingsList = combinedList.map(element => new KeyBindQuickPickItem(element.key, element.command, element.when));
        userKeyBindingList.map(element => element.when = element.when.replace('(user setting)', '').trim());
        userKeyBindingList.map(element => {if (element.when === '') {element.when = undefined}});
        let changer = this;

        window.showQuickPick(keybindingsList, {matchOnDescription:true})
        .then(function(selectedQuickItem){
            if (selectedQuickItem){
                window.showInputBox({placeHolder: 'change key binding for ' + selectedQuickItem.description + ', currently: ' + selectedQuickItem.label})
                .then(function(inputValue){
                    if (inputValue){
                        var selectedKeyBinding = combinedList.filter(element => element.key === selectedQuickItem.label && element.command === selectedQuickItem.description)[0];
                        selectedKeyBinding.key = inputValue;
                        changer.updateNewKeyBinding(selectedKeyBinding, userKeyBindingList)
                        .then(function(saveResult) {
                            if (saveResult === true){
                                window.showInformationMessage('key binding for ' + selectedKeyBinding.command + ' has been changed to ' + selectedKeyBinding.key);
                            }
                        });
                    }
                });
            }        
        });
    };

    private async updateNewKeyBinding (newKeyBinding: IKeyBindConfig, existingUserKey : IKeyBindConfig[]) : Promise<boolean>{
        if (newKeyBinding.when){
            newKeyBinding.when = newKeyBinding.when.replace('(user setting)', '').trim() ;
            if (newKeyBinding.when === ''){
                newKeyBinding.when = undefined;
            }
        }
        
        let newArray : IKeyBindConfig[] = new Array();
        newArray.push(newKeyBinding);
        let updatedUserKey = _.unionWith(newArray, existingUserKey, (arrValue :IKeyBindConfig, otherValue :IKeyBindConfig) => {
            return arrValue.command === otherValue.command && (arrValue.when) ? arrValue.when.replace('(user setting)', '').trim() === otherValue.when : true;
        });

        var newUserKeyBinding = JSON.stringify(updatedUserKey, null, 4);
        let fileManager = new FileManager();
        try {
            await fileManager.writeFileAsync(this.userSettingPath, newUserKeyBinding, 'utf-8');
            return true;
        }
        catch(exception){
            console.log(exception);
            return false;
        }
    }

    private async getUserKeyBindingArray(){
        var userKeyBindings : IKeyBindConfig[];
        let fileManager = new FileManager();
        await fileManager.createIfNotExist(this.userSettingPath);
        var userSettingString = jsonMinify(await fileManager.readFileAsync(this.userSettingPath, 'utf-8'));

        try{
            if (userSettingString !== ''){
                userKeyBindings = JSON.parse(userSettingString);
            }
        }
        catch(exception){
            userKeyBindings = new Array();
            console.log(exception);
        }

        return userKeyBindings;
    }
}

