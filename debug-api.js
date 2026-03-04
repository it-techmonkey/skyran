
const fetch = require('node-fetch');

const url = 'https://tm-backend-qfaf.onrender.com/api/projects/c76506eb-918e-42c4-9bf5-2441c0d8e322?include=true';

async function getData() {
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(err);
    }
}

getData();
