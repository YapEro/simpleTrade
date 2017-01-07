export class response{
    result:boolean;
    content:Object;
    message:string;

    constructor(result:boolean, message:string, content?:Object){
        this.result = result;
        this.message = message;
        this.content = content;
    }
}
