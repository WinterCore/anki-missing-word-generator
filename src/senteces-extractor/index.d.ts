interface WordDocument {
    id          : string,
    definitions : string,
    word        : string,
    type        : string
}

interface MissingWordDocument extends WordDocument {
    examples : string[]
}


type args = {
    words            : string[],
    count            : number,
    includeSubsenses : boolean,
    appId            : string,
    appKey           : string,
    throttle         : boolean
};

