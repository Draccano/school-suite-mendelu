import { app, BrowserWindow, ipcMain, Menu, MenuItem } from 'electron';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\');
}

let mainWindow;
const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

const puppeteer = require('puppeteer');

const path = require('path');
const url = require('url');
const request = require('request-promise');

var browser;
var page;

function getChromiumExecPath() {
  console.log(`executablePath: ${puppeteer.executablePath()}`);
  console.log(
    `executablePath.replace('app.asar', 'app.asar.unpacked'): ${puppeteer
      .executablePath()
      .replace('app.asar', 'app.asar.unpacked')}`
  );
  return puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
}

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 500,
    useContentSize: true,
    width: 700,
  });
  mainWindow.setMenuBarVisibility(true);

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    if (browser) {
      browser.close();
    }
    mainWindow = null;
  });

  const contextMenu = new Menu();
  contextMenu.append(
    new MenuItem({
      label: 'kopírovat',
      role: 'copy',
      click: () => {
        console.log('kopirovat kliknuto');
      },
    })
  );
  contextMenu.append(
    new MenuItem({
      label: 'vložit',
      role: 'paste',
      click: () => {
        console.log('vložit kliknuto');
      },
    })
  );

  mainWindow.webContents.on('context-menu', function(e, params) {
    contextMenu.popup(mainWindow, params.x, params.y);
  });
}
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('login', (event, args) => {
  login(args);
});

ipcMain.on('logout', (event, args) => {
  browser.close();
});

ipcMain.on('checkTerm', (event, args) => {
  console.log('args:' + args);
  checkTerm(args);
});

ipcMain.on('registerTerm', (event, args) => {
  registerTerm(args);
});

ipcMain.on('getUserInfo', (event) => {
  _getUserInfo();
});

async function login(credentials) {
  if (browser) {
    browser.close();
  }
  browser = await puppeteer.launch({
    headless: false, //false
    executablePath: getChromiumExecPath(),
    slowMo: 50,
  });
  page = await browser.newPage();
  await page.goto('https://is.mendelu.cz/auth/');

  await page.type('#credential_0', credentials.nickname);
  await page.type('#credential_1', credentials.password);
  await page.click('#login-btn');

  await page.waitForNavigation();
  await page.goto(
    'https://is.mendelu.cz/auth/student/terminy_seznam.pl?lang=cz;',
    { waitUntil: 'networkidle0' }
  );

  try {
    const terms = await page.$$eval('#table_2 tbody tr', (trs) =>
      trs.map((tr) => {
        return {
          subject: tr.querySelector('td:nth-child(4)').textContent,
          name: tr.querySelector('td:nth-child(5)').textContent,
          date: tr.querySelector('td:nth-child(7) small').textContent,
          entered: tr.querySelector('td:nth-child(8)').textContent,
          url: tr.querySelector('td:nth-child(14) small').innerHTML,
        };
      })
    );
    mainWindow.webContents.send('userInfoToShow', terms);
  } catch (e) {
    mainWindow.webContents.send('noTerms');
  }
}

async function checkTerm(credentials) {
  console.log(credentials);
  var searchingTerm;

  await page.goto(
    'https://is.mendelu.cz/auth/student/terminy_seznam.pl?lang=cz;',
    { waitUntil: 'networkidle0' }
  );

  try {
    const terms = await page.$$eval('#table_2 tbody tr', (trs) =>
      trs.map((tr) => {
        return {
          subject: tr.querySelector('td:nth-child(4)').textContent,
          name: tr.querySelector('td:nth-child(5)').textContent,
          date: tr.querySelector('td:nth-child(7) small').textContent,
          entered: tr.querySelector('td:nth-child(8)').textContent,
          url: tr.querySelector('td:nth-child(14) small').innerHTML,
          state: tr.querySelector('td:nth-child(15) > small > a > img').title,
        };
      })
    );

    terms.forEach((item) => {
      console.log('item ' + item.subject + ' subject');
      console.log(
        `${credentials.selectedSubject}===${item.subject} && ${
          credentials.selectedTerm
        }===${item.date}`
      );
      if (
        credentials.selectedSubject === item.subject &&
        credentials.selectedTerm === item.date
      ) {
        if (item.state === 'Přihlásit') {
          searchingTerm = item;

          mainWindow.webContents.send('termAccesible', item);
        } else {
          mainWindow.webContents.send('termUnAccesible', item);
        }
      }
    });
  } catch (e) {
    mainWindow.webContents.send('errorLog', e);
  }
}

async function registerTerm(credentials) {
  console.log('register term');
  var registerTerm = {};
  await page.goto(
    'https://is.mendelu.cz/auth/student/terminy_seznam.pl?lang=cz;',
    { waitUntil: 'networkidle0' }
  );
  let terms = await page.$$eval('#table_2 tbody tr', (trs) =>
    trs.map((tr) => {
      return {
        subject: tr.querySelector('td:nth-child(4)').textContent,
        date: tr.querySelector('td:nth-child(7) small').textContent,
        url: tr.querySelector('td:nth-child(14) small').innerHTML,
        state: tr.querySelector('td:nth-child(15) > small > a > img').title,
        href: tr.querySelector('td:nth-child(15) > small > a').href,
      };
    })
  );

  terms.forEach((item) => {
    if (
      credentials.selectedSubject === item.subject &&
      credentials.selectedTerm === item.date &&
      item.state === 'Přihlásit'
    ) {
      registerTerm.href = item.href;
      registerTerm.date = item.date;
      registerTerm.subject = item.subject;
    }
  });
  console.log(terms);
  console.log(registerTerm);
  if (registerTerm.href) {
    await page.goto(`${registerTerm.href}`, { waitUntil: 'networkidle0' });
    await page
      .click(
        "#content > div.mainpage > form > input[type=submit][value='Přihlásit na termín']"
      )
      .then(() => page.waitForNavigation({ waitUntil: 'load' }));

    await page.goto(
      'https://is.mendelu.cz/auth/student/terminy_seznam.pl?lang=cz',
      { waitUntil: 'networkidle0' }
    );
    terms = await page.$$eval('#table_2 tbody tr', (trs) =>
      trs.map((tr) => {
        return {
          subject: tr.querySelector('td:nth-child(4)').textContent,
          date: tr.querySelector('td:nth-child(7) small').textContent,
          url: tr.querySelector('td:nth-child(14) small').innerHTML,
          state: tr.querySelector('td:nth-child(15) > small > a > img').title,
          href: tr.querySelector('td:nth-child(15) > small > a').href,
        };
      })
    );

    mainWindow.webContents.send('termRegistered', {
      term: registerTerm,
      terms: terms,
    });
  } else {
    mainWindow.webContents.send('termNonRegistered', { registerTerm, terms });
  }
}
