const puppeteer = require('puppeteer');

let browser = null;
let page = null;

/**
 * 開啟瀏覽器、頁面、進入財政部官網，並點擊開啟登入彈窗
 */
const init = async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 }); // 指定瀏覽器的寬度、高度(確保截圖尺寸固定)
  await page.goto('https://www.einvoice.nat.gov.tw/'); // 進入財政部發票平台
  await page.click('#loginBtn'); // 點擊登入按鈕
  await page.waitForSelector('#randPicIndex'); // 等待驗證碼圖案出現
  await new Promise(r => setTimeout(r, 500));
};

/**
 * 自動登入
 */
const login = async ({ phone, cardEncrypt, CAPTCHA }) => {
  await page.type('#l0_mobile', phone);
  await page.type('#l0_password', cardEncrypt);
  await page.type('#checkPicIndex', CAPTCHA);
  await page.click('#button'); // 登入
};

/**
 *  捕捉當前畫面的圖片驗證碼圖案並返回base64
 */
const catchCAPTCHA = async () => {
  const CAPTCHA = await page.$('#randPicIndex');
  const CAPTCHA_Box = await CAPTCHA.boundingBox();
  const base64 = await page.screenshot({
    // path: 'element.png',
    encoding: 'base64',
    clip: {
      x: CAPTCHA_Box.x,
      y: CAPTCHA_Box.y,
      width: CAPTCHA_Box.width,
      height: CAPTCHA_Box.height
    }
  });

  return base64;
};

/**
 * 關閉當前頁面、關閉瀏覽器
 */
const close = async () => {
  await browser.close();
  browser = null;
  page = null;
}

/**
 * 取得手機條碼
 */
const getCarrierId = async ({ phone, cardEncrypt, CAPTCHA }) => {
  if (!browser || !page) {
    await init();
  }

  let result = null;

  const pickCarrierId = async (response) => {
    if (response.url().includes('userInfo')) {
      const data = await response.json();
      return { carrierId2: data.carrierId2 };
    }

    if (response.url().includes('getCarrierList')) {
      const data = await response.json();
      return { carrierId2: data[0].carrierId2 };
    }
  }

  const listenResponse = async (response) => {
    result = await pickCarrierId(response);
    if (result) page.removeListener('response', listenResponse);
  }

  const listenDialog = async (dialog) => {
    console.warn(`A dialog box has appeared: ${dialog.message()}`);
    await dialog.dismiss(); // 不執行alert的確認或是取消
    await page.goBack(); // 如果偵聽到有alert到出現
    page.removeListener('dialog', listenDialog);
  }

  page.on('response', listenResponse);

  page.on('dialog', listenDialog);

  await login({ phone, cardEncrypt, CAPTCHA }); // 自動完成登入
  await page.waitForNavigation(); // 等待頁面加載完成
  await close();

  return result;
}

const getCAPTCHA = async () => {
  if (!browser || !page) {
    await init();
  }

  const base64 = await catchCAPTCHA();

  return base64;
}

module.exports = { getCarrierId, getCAPTCHA };
