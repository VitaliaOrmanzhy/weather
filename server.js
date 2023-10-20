import express from 'express';
const server = express();

server.use(express.static('dist'));
server.listen(8080, () => {
    console.log('Example app listening on port 8080');
});