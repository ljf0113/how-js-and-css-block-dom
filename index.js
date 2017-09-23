const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');
const fs = require('fs');
const path = require('path');

function sleep(time) {
  return new Promise(function(res) {
    setTimeout(() => {
      res()
    }, time);
  })
}

app.use(serve(__dirname + '/static/html'));
app.use(async (ctx) => {
  let { url } = ctx.request;
  const _timeArr = url.match(/sleep(\d+)(?=-)/);
  let time = null;
  if (_timeArr) {
    url = url.replace(/sleep\d+-/, '');
    time = _timeArr[1];
  }
  const res = await new Promise(function(res, rej) {
    fs.readFile(path.join(__dirname, 'static', url), (err, data) => {
      if (err) return rej(err);
      res(data);
    })
  });
  if (/css/.test(url)) {
    ctx.response.set('Content-Type', 'text/css');
  }
  if (time) {
    await sleep(time);
  }
  ctx.body = res;
});

app.listen(3000, () => console.log(`http://localhost:3000/`));