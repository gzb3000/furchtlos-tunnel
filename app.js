const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// --- 从你提供的链接提取的精确配置 ---
const USER_CONFIG = {
    uuid: '73bcd72f-9545-4cb8-8daf-7d004501880d', 
    host: 'laugna.com',
    path: '/'
};

// 你提供的 16 个优选 IP 节点
const cfNodes = [
    { name: 'CF-优选01', addr: '198.41.223.194', port: 443 },
    { name: 'CF-优选02', addr: '172.64.144.190', port: 8443 },
    { name: 'CF-优选03', addr: '172.67.77.50', port: 8443 },
    { name: 'CF-优选04', addr: '104.19.57.197', port: 2096 },
    { name: 'CF-优选05', addr: '104.18.39.148', port: 2083 },
    { name: 'CF-优选06', addr: '8.39.125.20', port: 2087 },
    { name: 'CF-优选07', addr: '162.159.42.20', port: 8443 },
    { name: 'CF-优选08', addr: '198.41.223.36', port: 443 },
    { name: 'CF-优选09', addr: '8.35.211.210', port: 8443 },
    { name: 'CF-优选10', addr: '8.35.211.50', port: 2083 },
    { name: 'CF-优选11', addr: '172.67.79.37', port: 443 },
    { name: 'CF-优选12', addr: '162.159.152.63', port: 2083 },
    { name: 'CF-优选13', addr: '198.41.223.230', port: 2083 },
    { name: 'CF-优选14', addr: '104.19.40.108', port: 443 },
    { name: 'CF-优选15', addr: '104.19.60.148', port: 2096 },
    { name: 'CF-优选16', addr: '104.19.37.74', port: 2096 }
];

app.get('/', (req, res) => res.send('<h1>Service Active</h1>'));

app.get('/admin', (req, res) => {
    res.send(`
        <div style="text-align:center;margin-top:50px;font-family:sans-serif;">
            <h2>Ben的节点管理后台</h2>
            <form action="/login" method="POST">
                <input type="password" name="pwd" placeholder="密码">
                <button type="submit">登录</button>
            </form>
        </div>
    `);
});

app.post('/login', (req, res) => {
    if (req.body.pwd === '12345678') {
        res.send(`
            <div style="padding:20px;font-family:sans-serif;">
                <h3>Clash 订阅链接:</h3>
                <code>https://harvin.top/clash</code>
                <h3>通用订阅链接:</h3>
                <code>https://harvin.top/sub</code>
            </div>
        `);
    } else { res.send('密码错误'); }
});

// Clash YAML 输出
app.get('/clash', (req, res) => {
    let yaml = `port: 7890\nallow-config-external-ui: true\nmode: rule\nproxies:\n`;
    cfNodes.forEach(n => {
        yaml += `  - name: "${n.name}"\n    type: vless\n    server: ${n.addr}\n    port: ${n.port}\n    uuid: ${USER_CONFIG.uuid}\n    tls: true\n    sni: ${USER_CONFIG.host}\n    network: ws\n    ws-opts: { path: "${USER_CONFIG.path}", headers: { Host: ${USER_CONFIG.host} } }\n`;
    });
    yaml += `proxy-groups:\n  - name: "🚀 自动选择"\n    type: url-test\n    url: http://www.gstatic.com/generate_204\n    interval: 300\n    proxies:\n`;
    cfNodes.forEach(n => { yaml += `      - "${n.name}"\n`; });
    res.setHeader('Content-Type', 'text/yaml; charset=utf-8');
    res.send(yaml);
});

// 通用 Base64 输出
app.get('/sub', (req, res) => {
    const list = cfNodes.map(n => `vless://${USER_CONFIG.uuid}@${n.addr}:${n.port}?encryption=none&security=tls&sni=${USER_CONFIG.host}&type=ws&host=${USER_CONFIG.host}&path=${encodeURIComponent(USER_CONFIG.path)}#${encodeURIComponent(n.name)}`).join('\n');
    res.send(Buffer.from(list).toString('base64'));
});

app.listen(port);
