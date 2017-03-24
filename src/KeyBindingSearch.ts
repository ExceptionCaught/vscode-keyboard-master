import {defaultBindings} from "./resources/defaultBindings";

export class KeyBindingSearch {

    constructor(){
    }

    searchKey(keyToSearch: string) {
        let keyBindingsJson = defaultBindings();
        var searchResult = keyBindingsJson.filter(element => element.key.startsWith(keyToSearch));
        return '1\n2';

    }
}