const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');

const interval = 1000;
var count = 0;


(async () => {
	// Launch a headless browser
	const browser = await puppeteer.launch({ headless: false });

	// Create a new page
	const page = await browser.newPage();

	// Navigate to a website
	await page.goto('https://www.chess.com/play/computer');

	////*[@id="placeholder-ccoxhxv"]/div/div[2]/div/div[2]/div/button
	// const [OKbutton] = await page.$x('//*[@id="placeholder-ccoxhxv"]/div/div[2]/div/div[2]/div/button');
	// await page.click(OKbutton);
	// await page.waitForSelector('#placeholder-ccoxhxv');
	// OKbutton.click();

	var wpL = 0;
	var isAvailable = true;
	setInterval(async () => {
		if (!isAvailable) return;
		isAvailable = false;
		const boards = await page.$('#board-vs-personalities');
		const cells = await boards.$$('div');
		for (let i = 0; i < cells.length; i++) {
			const cell = cells[i];
			const cellClass = await page.evaluate(cell => cell.className, cell);
			if (cellClass.includes('piece')) {
				let cellClasses = cellClass.split(" ");
				if (cellClasses[1].includes('square')) {
					console.log("point: ", cellClasses[1]);
					console.log("Location: ", cellClasses[2]);
					if (cellClasses[1].includes("32")) wpL = i;
				}
				if (cellClasses[2].includes('square')) {
					console.log("point: ", cellClasses[2]);
					console.log("Location: ", cellClasses[1]);
					if (cellClasses[2].includes("32")) wpL = i;
				}
			}
		}
		console.log("-------------------------------------------");
		console.log("wpL: ", wpL);
		const sourceBoundingBox = await cells[wpL].boundingBox();
		const sourceX = sourceBoundingBox.x + sourceBoundingBox.width / 2;
		const sourceY = sourceBoundingBox.y + sourceBoundingBox.height / 2;
		const targetX = sourceBoundingBox.x + sourceBoundingBox.width / 2;
		const targetY = sourceBoundingBox.y - sourceBoundingBox.height / 2;

		console.log("sourceX: ", sourceX);
		console.log("sourceY: ", sourceY);
		console.log("targetX: ", targetX);
		console.log("targetY: ", targetY);
		console.log(" Before await page.mouse.move(sourceX, sourceY)");
		// if(!isMousePressed) {		
		await page.mouse.move(sourceX, sourceY);
		console.log(" Before await page.mouse.down();");
		await page.mouse.down();
		console.log(" Before await page.mouse.move(targetX, targetY);");
		await page.mouse.move(targetX, targetY);
		console.log("before mouse.up");
		await page.mouse.up();
		console.log("after mouse.up");

		isAvailable = true;
		// } else {
		//	await page.mouse.up();
		// }
	}, interval);

	// await browser.close();
})();
