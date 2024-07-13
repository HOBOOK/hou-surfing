const axios = require('axios');
const Push = require('../models/push');

exports.send = async (message) => {
    let pushList = []
    await Push
    .find()
    .then((res) => {
        pushList = res
    })

    for(let push of pushList) {
        if(push.webhookUrl) {
            axios.post(push.webhookUrl, {
                text: message
            })
            .then(res => {
                console.log(res.data)
            })
            .catch(err => {
                //console.log(err)
            })
        }
    }
}

exports.sendOnly = async (message, url) => {
    axios.post(url, {
        text: message
    })
    .then(res => {
        console.log(res.data)
    })
    .catch(err => {
        //console.log(err)
    })
}

exports.sendTest = async (url) => {
    return new Promise((resolve, reject) => {
        axios.post(url, {
            text: 'Hello VAZIL !!'
        })
        .then(res => {
            if(res.status === 200) {
                resolve(true)
            } else {
                reject()
            }
        })
        .catch(err => {
            //console.log(err)
            reject()
        })
    })
}

exports.parsingJsonMessage = (json) => {

    let message = ''
    try {

        message = '| Field        | Value                           |\n';
        message += '|--------------|---------------------------------|\n';
    
        const flattenObject = (obj, prefix = '') =>
          Object.keys(obj).reduce((cols, k) => {
            const pre = prefix.length ? `${prefix}.` : '';
            if (typeof obj[k] === 'object') Object.assign(cols, flattenObject(obj[k], pre + k));
            else cols[pre + k] = obj[k];
            return cols;
          }, {});
    
        const flatJson = flattenObject(json);
    
        for (const [key, value] of Object.entries(flatJson)) {
            message += `| ${key}        | ${value}                         |\n`;
        }
    
        return message;
      } catch (error) {
        console.error('Error parsing JSON string', error);
        return message;
      }
}