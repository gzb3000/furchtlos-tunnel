const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// --- 配置区 ---
const UUID = '这里填入你之前的UUID'; // 填入你的UUID
const DOMAIN = 'harvin.top';

const nodes = [
    { name: '美国-Visa', addr: 'www.visa.com' },
    { name: '美国-CSGO', addr: 'www.csgo.com' },
    { name: '全球-Garmin', addr: 'www.garmin.com' },
    { name: '美国-FBI', addr: 'www.fbi.gov' }
];

// --- 路由 ---
app.get('/', (req, res) => res.send('<h1>Hello World!</h1>'));

app.get('/admin', (req, res) => {
    res.send('<form action="/login" method="POST">密码: <input type="password" name="pwd"><button>登录</button></form>');
});

app.post('/login', (req, res) => {
    if (req.body.pwd === '12345678') {
        res.send(`<h1>成功</h1><p>Clash链接: <code>https://${DOMAIN}/clash</code></p><p>通用链接: <code>https://${DOMAIN}/sub</code></p>`);
    } else { res.send('错误'); }
});

app.get('/clash', (req, res) => {
    let y = `port: 7890\nmode: rule\nproxies:\n`;
    nodes.forEach(n => {
        y += `  - {name: "${n.name}", type: vless, server: ${n.addr}, port: 443, uuid: ${UUID}, tls: true, sni: ${DOMAIN}, network: ws, ws-opts: {path: "/?ed=2560", headers: {Host: ${DOMAIN}}}}\n`;
    });
    y += `proxy-groups:\n  - name: "🚀 自动选择"\n    type: url-test\n    url: http://www.gstatic.com/generate_204\n    interval: 300\n    proxies:\n`;
    nodes.forEach(n => { y += `      - "${n.name}"\n`; });
    res.setHeader('Content-Type', 'text/yaml');
    res.send(y);
});

app.get('/sub', (req, res) => {
    const s = nodes.map(n => `vless://${UUID}@${n.addr}:443?encryption=none&security=tls&sni=${DOMAIN}&type=ws&host=${DOMAIN}&path=%2F%3Fed%3D2560#${encodeURIComponent(n.name)}`).join('\n');
    res.send(Buffer.from(s).toString('base64'));
});

app.listen(port);
