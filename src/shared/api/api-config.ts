import axios from 'axios';

//@ts-ignore
const hostBackendUrl = 'https://whiskers-be-20342f5553a6.herokuapp.com/';
//@ts-ignore
const localBackendUrl = 'http://localhost:3000/';

//@ts-ignore
const dockerBackendUrl = 'http://spinforwhisk.com:4001/';

export const Instance = axios.create({
    baseURL: dockerBackendUrl,
    headers: {
        Accept: 'application/json',
        ['Content-Type']: 'application/json',
    },
});

