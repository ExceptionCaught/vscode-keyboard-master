'use strict';
import {window, QuickPickItem, workspace, commands} from 'vscode';
import {defaultBindings} from "./resources/defaultBindings";
import {KeyBindQuickPickItem} from "./KeyBindQuickPickItem";
import Uri from "vscode-uri";
import * as fs from "fs";
var jsonMinify = require('node-json-minify');

export function keyBindingChanger() {
    var defaultKeyBindingList = defaultBindings();
    var keybindingsList = defaultKeyBindingList.map(element => new KeyBindQuickPickItem(element.key, element.command, 'when' in element ? element['when'] : ' '));
    window.showQuickPick(keybindingsList, {matchOnDescription:true})
    .then(function(selectedQuickItem){
        if (selectedQuickItem){
            window.showInputBox({placeHolder: 'change key binding for ' + selectedQuickItem.description + ', currently: ' + selectedQuickItem.label})
            .then(function(inputValue){
                var selectedKeyBinding = defaultKeyBindingList.filter(element => element.key === selectedQuickItem.label && element.command === selectedQuickItem.description)[0];
                selectedKeyBinding.key = inputValue;
                updateNewKeyBinding(selectedKeyBinding);
            });
        }        
    });
}
function updateNewKeyBinding(newKeyBinding: any){
    let userSettingPath = process.env.APPDATA + '\\Code\\User\\keybindings.json';
    fs.exists(userSettingPath, (doesUserKeyFileExists) => {
        if (doesUserKeyFileExists == false) {
            fs.closeSync(fs.openSync(userSettingPath, 'w'));
        }
        var userSettingString = jsonMinify(fs.readFileSync(userSettingPath, 'utf-8'));
        var userKeyBindings : object [];
        try{
            userKeyBindings = JSON.parse(userSettingString);
        }
        catch(exception){
            userKeyBindings = new Array();
        }
        userKeyBindings.push(newKeyBinding);
        var newUserKeyBinding = JSON.stringify(userKeyBindings, null, 4);
        fs.writeFileSync(userSettingPath, newUserKeyBinding, 'utf-8' );
    })
}