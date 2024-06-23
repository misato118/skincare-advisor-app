import { BACKEND_URI } from "./BACKEND_URI";

function getHeaders() {
    var headers = {
        "Content-Type": "application/json"
    };
    return headers;
}

export async function chatApi(request) {
    const body = JSON.stringify(request);
    console.log(body);

    return await fetch(`${BACKEND_URI}/ai`, {
        method: "POST",
        mode: "cors",
        headers: getHeaders(),
        body: body
    });
}

export function getCitationFilePath(citation) {
    return `${BACKEND_URI}/content/${citation}`;
}
