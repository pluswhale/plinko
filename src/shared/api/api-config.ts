import axios from 'axios';

//@ts-ignore
const hostBackendUrl = 'https://whiskers-be-20342f5553a6.herokuapp.com/';
//@ts-ignore
const localBackendUrl = 'http://localhost:4000/';

//@ts-ignore
const dockerBackendUrl = 'https://spinforwhisk.com/backend/spin-and-earn/';

export const Instance = axios.create({
    baseURL: localBackendUrl,
    headers: {
        Accept: 'application/json',
        ['Content-Type']: 'application/json',
    },
});

