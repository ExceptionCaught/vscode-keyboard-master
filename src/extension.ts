'use strict';
import * as vscode from 'vscode';
import {KeyBindingChanger} from './KeyBindingChanger';

export function activate(context: vscode.ExtensionContext) {
    let systemPlatform = process.platform;
    let keyBindingChanger = new KeyBindingChanger();
    if (systemPlatform === 'win32' || systemPlatform === 'darwin' || systemPlatform === 'linux'){
        let disposable = vscode.commands.registerCommand('extension.keyboardMaster', async () => {
            await keyBindingChanger.changeKey();
        });
        context.subscriptions.push(disposable);        
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}