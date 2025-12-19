const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
    {
        url: 'https://placehold.co/400x300/2E7D32/FFFFFF?text=Urea',
        filename: 'urea.jpg'
    },
    {
        url: 'https://placehold.co/400x300/4CAF50/FFFFFF?text=Organic',
        filename: 'organic.jpg'
    }
];

const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const filepath = path.join(__dirname, 'public', 'uploads', filename);
        const file = fs.createWriteStream(filepath);

        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded ${filename}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => {});
            reject(err);
        });
    });
};

const downloadAllImages = async () => {
    try {
        for (const image of images) {
            await downloadImage(image.url, image.filename);
        }
        console.log('All images downloaded successfully!');
    } catch (error) {
        console.error('Error downloading images:', error);
    }
};

downloadAllImages(); 