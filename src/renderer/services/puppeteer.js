import puppeteer from 'puppeteer'
import axios from 'axios'
import { ipcRenderer } from 'electron'


export default async function () {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://github.com/');
  await page.screenshot({path: 'example.png'});

  await browser.close();
}