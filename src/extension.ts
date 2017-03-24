'use strict';
import * as vscode from 'vscode';
import {keyBindingChanger} from './KeyBindingChanger';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.keyboardMaster', keyBindingChanger);

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}