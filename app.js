/*
* by github：7Hello12
* Email：g3399711161@gmail.com
* Github homepage：https://github.com/7Hello12
* 转载或二创请通过邮箱说一声哦！
*/

const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const port = 3003;
const HttpRequestModule = require('./requests');

const httpModule = new HttpRequestModule();

app.use(express.static(path.join(__dirname, '/public')));

app.get("/index",(req,res) => {
    res.sendFile(__dirname + '/public/index.html');
});

//计算视频时长
function gmdate(format, timestamp) {
  var date = new Date(timestamp * 1000);

  // 获取小时、分钟、秒
  var hours = date.getUTCHours().toString().padStart(2, '0');
  var minutes = date.getUTCMinutes().toString().padStart(2, '0');
  var seconds = date.getUTCSeconds().toString().padStart(2, '0');

  // 替换格式中的占位符
  format = format.replace('H', hours);
  format = format.replace('i', minutes);
  format = format.replace('s', seconds);

  return format;
}

app.all("/api",(req,res) => {
    const bvids = req.query.bvid;
    httpModule.get('https://api.bilibili.com/x/web-interface/view?bvid=' + bvids, (error, response, body) => {
        if (error) {
            console.error(error);
            res.json({code: '-1', msg: "什么！！出现错误了？错误原因：" + error})
        } else {
            const jsonData = JSON.parse(body);
            if (jsonData.code == 0) {
                const cids = jsonData.data.pages[0].cid;
                httpModule.get('https://api.bilibili.com/x/player/playurl?otype=json&fnver=0&fnval=2&player=1&qn=64&bvid=' + bvids + '&cid=' + cids + '&platform=html5&high_quality=1', (error, response, body) => {
                    if (error) {
                        res.json({code: '-1', msg: "什么！！解析失败了？请检查一下你的参数是否输入正确"})
                    } else {
                        const Json_data = JSON.parse(body);
                        const biliJson = [{
                            'title': jsonData.data.pages[0].part,
                            'duration': jsonData.data.duration,
                            'durationFormat': gmdate('H:i:s', jsonData.data.duration - 1),
                            'accept': Json_data.data.accept_description,
                            'video_url': Json_data.data.durl[0].url,
                        }];
                        const array = {
                            'code': 0,
                            'msg': '视频解析成功',
                            'title': jsonData.data.title,
                            'imgurl': jsonData.data.pic,
                            'desc': jsonData.data.desc,
                            'data': biliJson,
                            'user': {
                                'name': jsonData.data.owner.name,
                                'user_img': jsonData.data.owner.face
                            },
                            'text': '本接口只支持解析B站视频，对于番剧、电影、电视剧等都不能进行解析'
                        };
                        res.json(array);
                    }
                });
            } else {
                res.json({code: '-1', msg: "什么！！解析失败了？请检查一下你的参数是否输入正确"})
            }
        }
    });
});

app.listen(port,() => {
  console.log('                            _ooOoo_')
  console.log('                           o8888888o')
  console.log('                           88" . "88')
  console.log('                           (| -_- |)')
  console.log('                           O\\  =  /O')
  console.log("                        ____/`---'\\____")
  console.log("                      .'  \\||     ||/  `.")
  console.log("                     /  \\||||  :  ||||/  \\ ")
  console.log("                    /  _||||| -:- |||||-  \\ ")
  console.log("                    |   | |||  -  ||| |   |")
  console.log("                    | \\_|  ''\\---/''  |   |")
  console.log("                    \\  .-\\__  `-`  ___/-. /")
  console.log("                  ___`. .'  /--.--\\  `. . __")
  console.log("               .'''< ```.___\\_<|>_/___. ```>'''.")
  console.log("              | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |")
  console.log("              \\  \\ `-.   \\_ __\\ /__ _/   .-` /  /")
  console.log("         ======`-.____`-.___\\_____/___.-`____.-'======")
  console.log("         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
  console.log("                // 佛祖保佑 永不宕机 永无BUG //")
  console.log("           \\视频解析服务启动成功，感谢您对我们的支持/")
  console.log(`         请访问 http://localhost:${port}/index 进入解析页面`)
  console.log(`         API接口地址 http://loaclhost:${port}/api?bvid=xxx`)
});
