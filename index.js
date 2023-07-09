const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');

(async () => {
  // Launch a headless browser
  const browser = await puppeteer.launch({headless:false});

  // Create a new page
  const page = await browser.newPage();

  // Enable request interception
  // await page.setRequestInterception(true);

  // // Array to store network requests with headers
  // const networkRequests = [];

  // // Listen for network request events
  // page.on('request', (request) => {
  //   networkRequests.push({
  //   //   url: request.url(),
  //     headers: request.headers()
  //   });
  //   request.continue();
  // });
  // // Array to store network requests with headers
  // const networkResponses = [];

  // // Listen for network request events
  // page.on('response', (response) => {
  //   networkResponses.push({
  //   //   url: request.url(),
  //     headers: response.headers()
  //   });
  //   // response.continue();
  // });

  // Navigate to a website
  await page.goto('https://www.shredderchess.com/online/play-chess-online.html');

  // Wait for the iframe with the specified id
  const iframeId = 'blockrandom'; // Replace with the ID of your iframe
  await page.waitForFunction(id => {
    const iframe = document.getElementById(id);
    return iframe !== null;
  }, {}, iframeId);

  // Switch to the iframe using its ID
  await page.waitForSelector(`#${iframeId}`);
  const frame = await page.$(`#${iframeId}`);
  const iframe = await frame.contentFrame();
  
  const boards = await iframe.$('#board');
  const board = await boards.$('div');

  const boardId = await iframe.evaluate(board => board.id, board);

  const positionIds = [];
  for (let i = 0; i < 64; i++) {
    positionIds.push(boardId + "_" + i);
  }

  console.log("boardId: ", boardId);
  console.log("positionIds: ", positionIds);

  // networkRequests.forEach(request => {
  //   console.log('URL:', request.url);
  //   console.log('Headers:', request.headers);
  // });
  await browser.close();
})();
