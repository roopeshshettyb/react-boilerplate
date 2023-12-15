const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

function writeJsonToFile(data, filename) {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        return fs.writeFile(filename, jsonData);
    } catch (err) {
        console.log(err)
    }
}


const getPreDeployData = async () => {
    try {
        const response = await axios({
            method: 'get',
            url: `http://localhost:8000/dev/common-services/pre-deploy-data`
        })
        const filePath = path.join('./src/config', 'apiConstants.json');
        let apiConstants = response.data.data.constants;
        await writeJsonToFile(apiConstants, filePath);
    } catch (error) {
        console.log({ error, source: 'getPreDeployData' });
    }
}

(async () => {
    console.log('FETCHING CONSTANTS BEFORE STARTING SERVER');
    await getPreDeployData();
    console.log('CONSTANTS FETCHED');
})()