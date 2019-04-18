/// <reference path="fetch.d.ts" />
// TODO: Make all of this garbage functional using (ramda)

import * as request from "request-promise";

import {
    SENTENCES_URL,
    DEFINITIONS_URL
} from "./defaults";

export default function fetch(word: string, { appKey, appId }: credentials): Promise<[any, any]> {
    const BASE_CONFIG = {
        method  : "GET",
        json    : true,
        headers : {
            app_key : appKey,
            app_id  : appId
        }
    };

    return Promise.all([
        request({ uri : DEFINITIONS_URL(word), ...BASE_CONFIG }),
        request({ uri : SENTENCES_URL(word), ...BASE_CONFIG })
    ]);
}