'use strict';
import {window, QuickPickItem, workspace, commands} from 'vscode';
import {defaultBindings} from "./resources/defaultBindings";
import {defaultBindingsMac} from "./resources/defaultBindingsMac";
import {defaultBindingsLinux} from "./resources/defaultBindingsLinux";
import {KeyBindQuickPickItem} from "./models/KeyBindQuickPickItem";
import {IKeyBindConfig} from "./models/IKeyBindConfig";
import Uri from "vscode-uri";
import * as fs from "fs";
import * as _ from "lodash";
var jsonMinify = require('node-json-minify');
let userSettingPath = process.env.APPDATA + '\\Code\\User\\keybindings.json';
let defaultKeyBindingList : IKeyBindConfig[] = defaultBindings();

if (process.platform === 'darwin'){
    userSettingPath = process.env.HOME + '/Library/Application Support/Code/User/keybindings.json';
    defaultKeyBindingList = defaultBindingsMac();
}
if (process.platform === 'linux'){
    userSettingPath = process.env.HOME + '/.config/Code/User/keybindings.json';
    defaultKeyBindingList = defaultBindingsLinux();
}


export function keyBindingChanger() {
    let userKeyBindingList : IKeyBindConfig[] = getUserKeyBindingArray();
    userKeyBindingList.map(element => element.when = element.when ? element.when + ' (user setting)' : '(user setting)');
    let combinedList = _.union(userKeyBindingList, defaultKeyBindingList);
    let keybindingsList = combinedList.map(element => new KeyBindQuickPickItem(element.key, element.command, element.when));
    userKeyBindingList.map(element => element.when = element.when.replace('(user setting)', '').trim());
    userKeyBindingList.map(element => {if (element.when === '') {element.when = undefined}});

    window.showQuickPick(keybindingsList, {matchOnDescription:true})
    .then(function(selectedQuickItem){
        if (selectedQuickItem){
            window.showInputBox({placeHolder: 'change key binding for ' + selectedQuickItem.description + ', currently: ' + selectedQuickItem.label})
            .then(function(inputValue){
                var selectedKeyBinding = combinedList.filter(element => element.key === selectedQuickItem.label && element.command === selectedQuickItem.description)[0];
                selectedKeyBinding.key = inputValue;
                updateNewKeyBinding(selectedKeyBinding, userKeyBindingList)
                .then(function(saveResult) {
                    if (saveResult === true){
                        window.showInformationMessage('key binding for ' + selectedKeyBinding.command + ' has been changed to ' + selectedKeyBinding.key);
                    }
                });
            });
        }        
    });
}

function updateNewKeyBinding(newKeyBinding: IKeyBindConfig, existingUserKey : IKeyBindConfig[]){
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

    return new Promise<boolean>((resolve, reject) => {
        fs.writeFile(userSettingPath, newUserKeyBinding, 'utf-8', (error) => {
            if (error){
                console.log(error);
                reject(false);
            }
            resolve(true);
            
        });
        
    });
        
}

function getUserKeyBindingArray (){
    var userKeyBindings : IKeyBindConfig[];
    if (!fs.existsSync(userSettingPath)){
        fs.closeSync(fs.openSync(userSettingPath, 'w'));
    }
    var userSettingString = jsonMinify(fs.readFileSync(userSettingPath, 'utf-8'));
    try{
        userKeyBindings = JSON.parse(userSettingString);
    }
    catch(exception){
        userKeyBindings = new Array();
    }

    return userKeyBindings;
}