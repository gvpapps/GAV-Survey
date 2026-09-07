/**
 * गाव कुटुंब व बाल सर्वेक्षण प्रणाली - स्थानिक वेब सर्व्हर
 * निर्माता: श्री गणेश विलास पष्टे
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const server = http.createServer((req, res) => {
    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '') {
        reqPath = '/index.html';
    }

    const filePath = path.join(BASE_DIR, reqPath);

    // Prevent directory traversal
    if (!filePath.startsWith(BASE_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('403 Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h2>४०४ - फाईल सापडली नाही (File Not Found)</h2><p><a href="/">मुख्य पृष्ठावर जा</a></p>');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        });

        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

server.listen(PORT, () => {
    const localIp = getLocalIp();
    console.log('================================================================');
    console.log('    गाव कुटुंब व बाल सर्वेक्षण प्रणाली (Gav Sarve Software)     ');
    console.log('    सॉफ्टवेअर व नोंदवही रचना निर्माता: श्री गणेश विलास पष्टे      ');
    console.log('================================================================');
    console.log(`\n कॉम्प्युटरवर वापरण्यासाठी:  http://localhost:${PORT}`);
    console.log(`\n मोबाईल फोनवर वापरण्यासाठी:   http://${localIp}:${PORT}`);
    console.log('\n टीप: तुमचा मोबाईल आणि कॉम्प्युटर एकाच वायफाय किंवा मोबाईल');
    console.log('      हॉटस्पॉटशी जोडलेले असल्यास वरील मोबाईल लिंक थेट उघडेल.');
    console.log('================================================================\n');

    // Auto-open in default browser
    exec(`start http://localhost:${PORT}`, (err) => {
        if (err) {
            // Silently ignore if auto-open fails
        }
    });
});
