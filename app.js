const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// --- 节点配置区 ---
// Ben，这里记得填入你那 7 个文件里提到的 UUID
const USER_CONFIG = {
    uuid: '这里替换成你的UUID', 
    host: 'harvin.top',
    path: '/?ed=2560'
};

// 模拟原先 7 个文件里的常用 Cloudflare 节点地址
const cfNodes = [
    'www.visa.com',
    'www.csgo.com',
    'www.digitalocean.com',
    'www.itunes.com',
    'www.garmin.com',
    'www.who.int',
    'www.fbi.gov'
];

function generateVless() {
    return cfNodes.map(ip => {
        return `vless://${USER_CONFIG.uuid}@${ip}:443?encryption=none&security=tls&sni=${USER_CONFIG.host}&fp=random&type=ws&host=${USER_CONFIG.host}&path=${encodeURIComponent(USER_CONFIG.path)}#CF-${ip}`;
    }).join('\n');
}

// 1. 首页
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1><p>站点建设中，管理后台请访问 /admin</p>');
});

// 2. 登录页面
app.get('/admin', (req, res) => {
    res.send(`
        <div style="text-align:center; margin-top:100px; font-family:sans-serif;">
            <h2>管理后台登录</h2>
            <form action="/login" method="POST">
                <input type="password" name="pwd" placeholder="请输入密码" style="padding:8px;">
                <button type="submit" style="padding:8px 15px; cursor:pointer;">进入</button>
            </form>
        </div>
    `);
});

// 3. 登录处理
app.post('/login', (req, res) => {
    if (req.body.pwd === '12345678') {
        res.send(`
            <div style="padding:20px; font-family:sans-serif;">
                <h2>登录成功！</h2>
                <p><strong>你的专属订阅链接：</strong></p>
                <code style="background:#f4f4f4; padding:10px; display:block;">https://harvin.top/sub</code>
                <br>
                <p>直接点击查看内容：<a href="/sub" target="_blank">点击打开</a></p>
                <hr>
                <a href="/">回到首页</a>
            </div>
        `);
    } else {
        res.send('密码错误！<a href="/admin">重新输入</a>');
    }
});

// 4. 订阅内容输出
app.get('/sub', (req, res) => {
    const content = generateVless();
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(Buffer.from(content).toString('base64'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
