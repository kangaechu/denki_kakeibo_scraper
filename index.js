const { Chromeless } = require('chromeless')
const path = require('path')

const userID = 'USERID'; // ユーザID
const password = 'PASSWORD'; // パスワード
const loopNum = 2; // 取得する回数（今日からxx日分）

async function run() {
  const chromeless = new Chromeless()

  // ログインページからログイン
  await chromeless
    .goto('https://www.kakeibo.tepco.co.jp/dk/aut/login/') 
    .type(userID, 'input[name="id"]')
    .type(password, 'input[name="password"]')
    .click('#idLogin')
    .wait('.login_info')

  // トップページ
  await chromeless
    .click('.box01 a') // 使用量と料金をグラフで見る
    .wait('.graph_head a')

  // 日毎の使用量のページ
  await chromeless
    .click('.graph_head a') // 時間別グラフはこちら
    .wait(3000) // TODO: 前画面と同じ構成なのでタイムアウトを使用しているがあまり良くない

  // 30分ごとの使用量のページ
  for (let i = 0; i < loopNum; i++) {
    // 取得したHTMLから日付と30分ごとの電力使用量を取得
    const html = await chromeless.html()
    const regexPowerStatus = /var items = \[\["日次", (.*?)\]/;
    const powerStatus = html.match(regexPowerStatus)[1];
    const regexDate = /(\d{4}\/\d{2}\/\d{2})　の電気使用量/;
    const date = html.match(regexDate)[1];
    console.log(date, powerStatus);

    await chromeless
      .click('#doPrevious')
      .wait(3000) // TODO: 前画面と同じ構成なのでタイムアウトを使用しているがあまり良くない
      
  }
  await chromeless.end()
}

run().catch(console.error.bind(console))