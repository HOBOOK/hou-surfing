const minio = require('minio');


const minioClient = new minio.Client({
    endPoint: process.env.MINIO_HOST,   // 사용하는 Minio 서버의 endpoint
    port: 9000,                // port
    useSSL: false,             // SSL 사용 여부
    accessKey: process.env.MINIO_ACCESS_KEY,   // Minio 서버의 접근 키
    secretKey: process.env.MINIO_SECRET_KEY   // Minio 서버의 비밀 키
});

module.exports = minioClient