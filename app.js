const express = require('express');
const { WebSocketServer } = require('ws');
const net = require('net');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8080;

// 1. 加载你的个性化配置
let config;
try {
    config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
} catch (e) {
    config = { UUID: "ad5f1610-6393-41a4-9e32-a548d8888888", PROXY_IP: "cdn.cloudflare.com" };
}

// 2. 静态页面服务：让你的服务器看起来像个正常的网页（伪装层）
app.use(express.static('public'));

// 3. 启动 HTTP 服务
const server = app.listen(port, () => {
    console.log(`-----------------------------------------`);
    console.log(`🚀 EdgeTunnel Docker 版启动成功！`);
    console.log(`🌍 监听端口: ${port}`);
    console.log(`🔑 当前 UUID: ${config.UUID}`);
    console.log(`-----------------------------------------`);
});

// 4. WebSocket 处理：这是核心的隧道逻辑
// 注意：真正的 VLESS 协议解析逻辑很长，
// 建议你在部署后参考 Github 的 vless-node 项目进行深度定制。
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
    console.log(`[${new Date().toLocaleTimeString()}] 收到新的隧道连接`);

    ws.on('message', (chunk) => {
        // 这里会处理来自客户端的加密流量
        // 并通过 net.connect() 转发到目标地址
    });

    ws.on('error', (err) => console.error('连接错误:', err));
});