type ParamsObject = { [key: string]: string };

export function parseUriParamsLine(line: string): null | ParamsObject {
    const params: ParamsObject = {};

    if (!line) {
        return params;
    }

    line.split('&').forEach((item) => {
        const [key, value = ''] = item.split('=');
        params[key] = decodeURIComponent(value);
    });

    return params;
}

export default function parseUriParams(uri: string, splited = uri.split('?')): ParamsObject | null {
    if (!splited?.[1]) {
        return null;
    }
    return parseUriParamsLine(splited?.[1]);
}

