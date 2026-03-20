const axios = require('axios');
const FormData = require('form-data');

// API Key ImgBB kamu
const IMGBB_KEY = '4f2dcd79dcf47d778991fc93e3320c09'; 
const BASE_URL = 'https://api.zenzxz.my.id'; 

async function uploadToImgBB(fileBuffer) {
    const form = new FormData();
    form.append('image', fileBuffer.toString('base64'));
    
    const response = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, form);
    return response.data.data.url;
}

async function handleRequest(fields, files) {
    const { endpoint } = fields;
    let params = new URLSearchParams();

    // Loop semua field teks
    for (let key in fields) {
        if (key !== 'endpoint') params.append(key, fields[key]);
    }

    // Loop semua file dan upload otomatis
    if (files && files.length > 0) {
        for (let file of files) {
            const uploadedUrl = await uploadToImgBB(file.buffer);
            // Map field file ke parameter API asli (avatar/url/content)
            params.append(file.fieldname, uploadedUrl);
        }
    }

    // Bangun URL akhir untuk menembak API Zenzxz
    return `${BASE_URL}${endpoint}?${params.toString()}`;
}

module.exports = { handleRequest };
