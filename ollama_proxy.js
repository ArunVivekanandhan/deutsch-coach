const http = require('http');
const https = require('https');

const PORT = 8080;

http.createServer((clientReq, clientRes) => {
    // 1. Intercept all requests and attach generous CORS headers
    clientRes.setHeader('Access-Control-Allow-Origin', '*');
    clientRes.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    clientRes.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 2. Automatically approve all preflight OPTIONS requests from the browser
    if (clientReq.method === 'OPTIONS') {
        clientRes.writeHead(200);
        clientRes.end();
        return;
    }

    console.log(`[Proxy] Forwarding request to Ollama Cloud: ${clientReq.url}`);

    // 3. Forward the actual request to Ollama.com
    const options = {
        hostname: 'ollama.com',
        port: 443,
        path: clientReq.url,
        method: clientReq.method,
        headers: {
            ...clientReq.headers,
            host: 'ollama.com' // Force the host header to ollama
        }
    };

    // Remove headers that might give away that this is a browser request
    delete options.headers['origin'];
    delete options.headers['referer'];
    delete options.headers['sec-fetch-dest'];
    delete options.headers['sec-fetch-mode'];
    delete options.headers['sec-fetch-site'];

    const proxyReq = https.request(options, (proxyRes) => {
        // Forward the response headers back to the browser
        for (const [key, value] of Object.entries(proxyRes.headers)) {
            // Don't forward Ollama's strict CORS/security headers, let our generous ones take over
            if (!key.toLowerCase().startsWith('access-control-')) {
                clientRes.setHeader(key, value);
            }
        }
        clientRes.writeHead(proxyRes.statusCode);
        proxyRes.pipe(clientRes, { end: true });
    });

    proxyReq.on('error', (err) => {
        console.error('[Proxy Error]', err);
        clientRes.writeHead(500);
        clientRes.end('Proxy Error: ' + err.message);
    });

    clientReq.pipe(proxyReq, { end: true });

}).listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`✅ Ollama Cloud CORS Proxy is running!`);
    console.log(`======================================================`);
    console.log(`👉 In your Deutsch-Coach Global Setup, set your Endpoint to:`);
    console.log(`   http://localhost:${PORT}/v1/chat/completions\n`);
    console.log(`(Leave this terminal window open while you use the app)`);
});
