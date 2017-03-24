'use strict';
import * as vscode from 'vscode';
import {KeyBindingChanger} from './KeyBindingChanger';

export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "vscode-keyboard-master" is now active!');
    var bindingChanger = new KeyBindingChanger;
    let disposable = vscode.commands.registerCommand('extension.keyboardMaster', bindingChanger.keyChanger);

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}