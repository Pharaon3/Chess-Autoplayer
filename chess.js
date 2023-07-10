const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');

const interval = 9000;
var count = 0;


(async () => {
  // Launch a headless browser
  const browser = await puppeteer.launch({headless:false});

  // Create a new page
  const page = await browser.newPage();

  // Navigate to a website
  await page.goto('https://www.chess.com/play/computer');
  
  ////*[@id="placeholder-ccoxhxv"]/div/div[2]/div/div[2]/div/button
  const [OKbutton] = await page.$x('//*[@id="placeholder-ccoxhxv"]/div/div[2]/div/div[2]/div/button');
  // await page.click(OKbutton);
  await page.waitForSelector('#placeholder-ccoxhxv');
  OKbutton.click();

	var wpL = 0;
  setInterval(async () => {
    
    const boards = await page.$('#board-vs-personalities');
    const cells = await boards.$$('div');
	

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      const cellClass = await page.evaluate(cell => cell.className, cell);

      // console.log("cell class: ", cellClass);

      if(cellClass.includes('piece')) {
		  cellClasses = cellClass.split(" ");
		  if(cellClasses[1].includes('square')) {
			  console.log("point: ", cellClasses[1]);
			  console.log("Location: ", cellClasses[2]);
			  if(cellClasses[1] == "wp") wpL = i;
		  }
		  if(cellClasses[2].includes('square')) {
			  console.log("point: ", cellClasses[2]);
			  console.log("Location: ", cellClasses[1]);
			  if(cellClasses[2] == "wp") wpL = i;
		  }
      }
    }
	const sourceBoundingBox = await cells[wpL].boundingBox();
	// // const targetElement = await page.$(targetSelector);

	// count ++;
	// // Calculate the coordinates for the source and target <div> elements
	const sourceX = sourceBoundingBox.x + sourceBoundingBox.width / 2;
	const sourceY = sourceBoundingBox.y + sourceBoundingBox.height / 2;
	const targetX = sourceBoundingBox.x + sourceBoundingBox.width / 2;
	const targetY = sourceBoundingBox.y - sourceBoundingBox.height / 2;

	// // Perform the mouse press and release actions
	const isMousePressed = await page.evaluate(() => {
    return new Promise((resolve) => {
      document.addEventListener('mousedown', () => {
        resolve(true);
      });
    });
  });
	// if(!isMousePressed) {		
		await page.mouse.move(sourceX, sourceY);
		await page.mouse.down();
		await page.mouse.move(targetX, targetY);
		await page.mouse.up();
	// } else {
	//	await page.mouse.up();
	// }
  }, interval);
  
  // await browser.close();
})();
