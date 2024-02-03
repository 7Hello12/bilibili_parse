// httpRequestModule.js

const request = require('request');

// 封装 HTTP 请求功能的模块
class HttpRequestModule {
  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
      'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
      // 添加其他头部信息
      'cookie': '你的B站账号cookie',
    };
  }

  // 发送 GET 请求的方法
  get(url, callback) {
    const options = {
      url: url,
      headers: this.headers,
    };

    request.get(options, callback);
  }
}

// 导出模块
module.exports = HttpRequestModule;