const fs = require('fs');
const https = require('https');

async function download(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, function(response) {
            if (response.statusCode === 301 || response.statusCode === 302) {
                return download(response.headers.location, dest).then(resolve).catch(reject);
            }
            response.pipe(file);
            file.on('finish', function() {
                file.close(resolve);
            });
        }).on('error', function(err) {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function main() {
    await download('https://cdn.simpleicons.org/apple/ffffff', 'assets/apple-white.svg');
    await download('https://cdn.simpleicons.org/googleplay/ffffff', 'assets/googleplay-white.svg');
    await download('https://cdn.simpleicons.org/android/3DDC84', 'assets/android-green.svg');
    await download('https://cdn.simpleicons.org/apple/000000', 'assets/apple-black.svg');
    await download('https://cdn.simpleicons.org/googleplay/000000', 'assets/googleplay-black.svg');
    console.log("Done");
}

main().catch(console.error);
