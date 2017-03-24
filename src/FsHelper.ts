import {readFileSync} from 'fs';

export class FsHelper {
    constructor(){

    }

    readJsonFile(fileFullpath: string){
        return JSON.parse(readFileSync(fileFullpath, {encoding: 'string'}));
        // return new Promise<any>((resolve, reject) => {
        //     readFileSync(fileFullpath, (error, data) => error ? reject(error) : resolve(JSON.parse(data.toString())));
        // });
    }
}