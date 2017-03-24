import {FsHelper} from "./FsHelper";

export class KeyBindingSearch {

    constructor(private fsHelper: FsHelper){
    }

    searchKey(keyToSearch: string) {
        let keyBindings = this.fsHelper.readJsonFile('./resources/defaultBindings.json');
        return '';

    }
}