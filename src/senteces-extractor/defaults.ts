const BASE_URL        = "https://od-api.oxforddictionaries.com/api/v1";
const SENTENCES_URL   = (word: string) => `${BASE_URL}/entries/en/${word}/sentences`;
const DEFINITIONS_URL = (word: string) => `${BASE_URL}/entries/en/${word}`;

export {
    DEFINITIONS_URL,
    SENTENCES_URL
};