# 1. 使用 Node.js 18 官方轻量版本作为基础镜像
FROM node:18-alpine

# 2. 设置容器内的工作目录
WORKDIR /app

# 3. 将项目依赖文件复制到镜像中
COPY package.json ./

# 4. 安装生产环境所需的依赖库
# (包括 express 用于 Web 服务，ws 用于处理 WebSocket)
RUN npm install --production

# 5. 复制主程序代码、配置文件以及伪装网页目录
COPY app.js .
COPY config.json .
COPY public/ ./public/

# 6. 声明容器运行过程中监听的端口 (8080)
EXPOSE 8080

# 7. 定义容器启动时执行的命令
CMD ["node", "app.js"]