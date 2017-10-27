const express = require('express');
const busboy = require('connect-busboy');
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'davertron', 
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const app = express();

app.use(express.static('public'));
app.use(busboy());

app.post('/', (req, res) => {
    try {
        req.pipe(req.busboy);
        req.busboy.on('file', (fieldname, file, filename) => {
            console.log('Uploading ' + filename);
            let stream = cloudinary.uploader.upload_stream((result, error) => {
                if (error) {
                    console.error(error);
                    res.status(400).send('Error uploading file');
                } else {
                    res.send(`File was uploaded to cloudinary with public id ${result.public_id}`);
                }
            });

            file.pipe(stream);
        });
    } catch (e) {
        console.error(e);
        res.status(400).send('Something went wrong');
    }
});

app.listen(5000, () => {
    console.log('Cloudinary uploader listening on port 5000');
});
