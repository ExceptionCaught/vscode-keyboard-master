'use strict';
import * as fsAsync from "async-file";

export class FileManager {
    async createIfNotExist(filePath : string) {
        let fileStats = await fsAsync.stat(filePath);
        if (!fileStats.isFile()){
            await fsAsync.close(await fsAsync.open(filePath, "w"));
        }
    }

    async readFileAsync(filePath : string, encode : string) {
        return await fsAsync.readFile(filePath, encode);
    }

    async writeFileAsync(filePath : string, fileContent : String,  encode : string) {
        return await fsAsync.writeFile(filePath, fileContent, encode);
    }
}