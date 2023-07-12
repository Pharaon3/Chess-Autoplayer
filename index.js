const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');

const interval = 5000;
var count = 0;

(async () => {
  // Launch a headless browser
  const browser = await puppeteer.launch({headless:false});

  // Create a new page
  const page = await browser.newPage();

  // Navigate to a website
  await page.goto('https://www.shredderchess.com/online/play-chess-online.html');

  setInterval(async () => {
    const iframeId = 'blockrandom';
    await page.waitForFunction(id => {
      const iframe = document.getElementById(id);
      return iframe !== null;
    }, {}, iframeId);

    // Switch to the iframe using its ID
    await page.waitForSelector(`#${iframeId}`);
    const frame = await page.$(`#${iframeId}`);
    const iframe = await frame.contentFrame();
    // //*[@id="buttons"]/div[4]
    const blackbutton = await iframe.$x('//*[@id="buttons"]/div[4]');
    if (blackbutton.length > 0) {
      await iframe.evaluate((element) => {
        element.click();
      }, blackbutton[0]);
      console.log('Button clicked.');
    } else {
      console.log('Button not found.');
    }
    const boards = await iframe.$('#board');
    const board = await boards.$('div');
    const cells = await board.$$('div');

    const boardId = await iframe.evaluate(board => board.id, board);

    const positionIds = [];
    for (let i = 0; i < 64; i++) {
      positionIds.push(boardId + "_" + i);
    }

    for (let i = 0; i < 64; i++) {
      const cell = cells[i];
      // const cellId = await iframe.evaluate(cell => cell.id, cell);
      const cellDiv = await cell.$$('img');
      if(cellDiv.length){
        const imgPath = await iframe.evaluate(img => img.src, cellDiv[0]);
        console.log(i, imgPath);
      }
    }

    // const sourceSelector = '#sourceDiv'; // Replace with your selector for the source <div> element
    // const targetSelector = '#targetDiv'; // Replace with your selector for the target <div> element

    // Get the bounding box of the source and target <div> elements
    // const sourceElement = await page.$(sourceSelector);
    const sourceBoundingBox = await cells[8 + count].boundingBox();
    // const targetElement = await page.$(targetSelector);
    const targetBoundingBox = await cells[24 + count].boundingBox();

    count ++;
    // Calculate the coordinates for the source and target <div> elements
    const sourceX = sourceBoundingBox.x + sourceBoundingBox.width / 2;
    const sourceY = sourceBoundingBox.y + sourceBoundingBox.height / 2;
    const targetX = targetBoundingBox.x + targetBoundingBox.width / 2;
    const targetY = targetBoundingBox.y + targetBoundingBox.height / 2;

    // Perform the mouse press and release actions
    await page.mouse.move(sourceX, sourceY);
    await page.mouse.down();
    await page.mouse.move(targetX, targetY);
    await page.mouse.up();


  }, interval);
  
  // await browser.close();
})();
