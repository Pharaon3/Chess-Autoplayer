const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const interval = 10000;
var count = 0;
let oldShPos =[
  { position: '11', point: 'wr' },
  { position: '21', point: 'wn' },
  { position: '31', point: 'wb' },
  { position: '41', point: 'wq' },
  { position: '51', point: 'wk' },
  { position: '61', point: 'wb' },
  { position: '71', point: 'wn' },
  { position: '81', point: 'wr' },
  { position: '12', point: 'wp' },
  { position: '22', point: 'wp' },
  { position: '32', point: 'wp' },
  { position: '42', point: 'wp' },
  { position: '52', point: 'wp' },
  { position: '62', point: 'wp' },
  { position: '72', point: 'wp' },
  { position: '82', point: 'wp' },
  { position: '17', point: 'bp' },
  { position: '27', point: 'bp' },
  { position: '37', point: 'bp' },
  { position: '47', point: 'bp' },
  { position: '57', point: 'bp' },
  { position: '67', point: 'bp' },
  { position: '77', point: 'bp' },
  { position: '87', point: 'bp' },
  { position: '18', point: 'br' },
  { position: '28', point: 'bn' },
  { position: '38', point: 'bb' },
  { position: '48', point: 'bq' },
  { position: '58', point: 'bk' },
  { position: '68', point: 'bb' },
  { position: '78', point: 'bn' },
  { position: '88', point: 'br' }
];
let oldChPos = [
  { position: '88', point: 'br' },
  { position: '78', point: 'bn' },
  { position: '68', point: 'bb' },
  { position: '58', point: 'bk' },
  { position: '48', point: 'bq' },
  { position: '38', point: 'bb' },
  { position: '28', point: 'bn' },
  { position: '18', point: 'br' },
  { position: '87', point: 'bp' },
  { position: '77', point: 'bp' },
  { position: '67', point: 'bp' },
  { position: '57', point: 'bp' },
  { position: '47', point: 'bp' },
  { position: '37', point: 'bp' },
  { position: '27', point: 'bp' },
  { position: '17', point: 'bp' },
  { position: '82', point: 'wp' },
  { position: '72', point: 'wp' },
  { position: '62', point: 'wp' },
  { position: '52', point: 'wp' },
  { position: '42', point: 'wp' },
  { position: '32', point: 'wp' },
  { position: '22', point: 'wp' },
  { position: '12', point: 'wp' },
  { position: '81', point: 'wr' },
  { position: '71', point: 'wn' },
  { position: '61', point: 'wb' },
  { position: '51', point: 'wk' },
  { position: '41', point: 'wq' },
  { position: '31', point: 'wb' },
  { position: '21', point: 'wn' },
  { position: '11', point: 'wr' }
];
(async () => {
  const browser1 = await puppeteer.launch({headless:false});
	const browser2 = await puppeteer.launch({ headless: false });
  const page1 = await browser1.newPage();
	const page2 = await browser2.newPage();
  await page1.goto('https://www.shredderchess.com/online/play-chess-online.html');  
	await page2.goto('https://www.chess.com/play/computer');

	var isAvailable = false;
  const iframeId1 = 'blockrandom';
  await page1.waitForFunction(id => {
    const iframe1 = document.getElementById(id);
    return iframe1 !== null;
  }, {}, iframeId1);
  await page1.waitForSelector(`#${iframeId1}`);
  const frame1 = await page1.$(`#${iframeId1}`);
  const iframe1 = await frame1.contentFrame();
  const blackbutton = await iframe1.$x('//*[@id="buttons"]/div[4]');
  if (blackbutton.length > 0) {
    await iframe1.evaluate((element) => {
      element.click();
    }, blackbutton[0]);
    console.log('Button clicked.');
  } else {
    console.log('Button not found.');
  }

  await page1.waitForTimeout(1000);
  const boards1 = await iframe1.$('#board');
  const board1 = await boards1.$('div');
  const cells1 = await board1.$$('div');
  let newShPos = [];
  for (let i = 0; i < 64; i++) {
    const cell1 = cells1[i];
    const cellDiv1 = await cell1.$$('img');
    if(cellDiv1.length){
      let imgPath = await iframe1.evaluate(img => img.src, cellDiv1[0]);
      let imgPathArray = imgPath.split("/");
      imgPathArray = imgPathArray[imgPathArray.length - 1].split(".");
      let point1 = imgPathArray[0];
      point1 = point1.replace("a109", "");
      imgPath.replace("https://www.shredderchess.com/online/applets/images/a109", "");
      imgPath.replace(".png", "");
      let position10 = (i + 1) % 8;
      if(position10 == 0) position10 = 8;
      let position = position10 + "" + (Math.floor(i / 8) + 1);
      if(point1 != "free") newShPos.push({"position": position, "point": point1});
    }
  }
  console.log("newShPos: ", newShPos);

  const boards2 = await page2.$('#board-vs-personalities');
  const cells2 = await boards2.$$('div');
  let newChPos = [];
  for (let i = 0; i < cells2.length; i++) {
    const cell2 = cells2[i];
    const cellClass2 = await page2.evaluate(cell => cell.className, cell2);
    if (cellClass2.includes('piece')) {
      let cellClasses2 = cellClass2.split(" ");
      if (cellClasses2[1].includes('square')) {
        // console.log("Location: ", cellClasses2[1]);
        // console.log("point: ", cellClasses2[2]);
        newChPos.push({"position": cellClasses2[1].replace("square-", ""), "point": cellClasses2[2]})
        if (cellClasses2[1].includes("32")) wpL = i;
      }
      if (cellClasses2[2].includes('square')) {
        // console.log("Location: ", cellClasses2[2]);
        // console.log("point: ", cellClasses2[1]);
        newChPos.push({"position": cellClasses2[2].replace("square-", ""), "point": cellClasses2[1]})
        if (cellClasses2[2].includes("32")) wpL = i;
      }
    }
  }
  console.log("newChPos: ", newChPos);
  
  SsL = "";
  EsL = "";
  for (let i = 0; i < oldShPos.length; i++){
    let flag = false;
    for (let j = 0; j < newShPos.length; j++){
      if(oldShPos[i]["position"] == newShPos[j]["position"]) flag = true;
    }
    if (!flag) {
      SsL=oldShPos[i];
    }
  }
  for (let i = 0; i < newShPos.length; i++){
    let flag = false;
    for (let j = 0; j < oldShPos.length; j++){
      if(oldShPos[j]["position"] == newShPos[i]["position"] && oldShPos[j]["point"] == newShPos[i]["point"]) flag = true;
    }
    if (!flag) {
      EsL=newShPos[i];
    }
  }
  let ScL = "";
  let EcL = "";
  console.log("SsL: ", SsL);
  console.log("EsL: ", EsL);
  await new Promise((resolve) => rl.once('line', resolve));
  isAvailable = true;
  setInterval(async () => {
    if(!isAvailable) return;
    isAvailable = false;
    let s10 = Math.floor(SsL["position"] / 10);
    let s1 = Math.floor(SsL["position"] % 10);
    let e10 = Math.floor(EsL["position"] / 10);
    let e1 = Math.floor(EsL["position"] % 10);
    // s10 = 9 - s10;
    s1 = 9 - s1;
    // e10 = 9 - e10;
    e1 = 9 - e1;
    console.log("SsL", SsL["position"]);
    console.log("s10, s1", s10 + ":" + s1);
    console.log("EsL", EsL["position"]);
    console.log("s10, s1", e10 + ":" + e1);
    SsL = "";
    EsL = "";
    const boards2 = await page2.$('#board-vs-personalities');
    const svg = await boards2.$$("svg");
		const BoundingBox2 = await svg[0].boundingBox();
		const sourceX2 = BoundingBox2.x + BoundingBox2.width * (s10 * 2 - 1) / 16;
		const sourceY2 = BoundingBox2.y + BoundingBox2.height * (s1 * 2 - 1) / 16;
		const targetX2 = BoundingBox2.x + BoundingBox2.width * (e10 * 2 - 1) / 16;
		const targetY2 = BoundingBox2.y + BoundingBox2.height * (e1 * 2 - 1) / 16;
    console.log("sourceX2", sourceX2)
    console.log("sourceY2", sourceY2)
    console.log("targetX2", targetX2)
    console.log("targetY2", targetY2)
		await page2.mouse.move(sourceX2, sourceY2);
		await page2.mouse.down();
		await page2.mouse.move(targetX2, targetY2);
		await page2.mouse.up();
    ScL = ""
    ScE = ""
    let newChPos = [];
    let ScLflag = true;
    while(ScLflag){
      newChPos = [];
      await page2.waitForTimeout(100);
      const cells2 = await boards2.$$('div');
      for (let i = 0; i < cells2.length; i++) {
        const cell2 = cells2[i];
        const cellClass2 = await page2.evaluate(cell => cell.className, cell2);
        if (cellClass2.includes('piece')) {
          let cellClasses2 = cellClass2.split(" ");
          if (cellClasses2[1].includes('square')) {
            // console.log("Location: ", cellClasses2[1]);
            // console.log("point: ", cellClasses2[2]);
            newChPos.push({"position": cellClasses2[1].replace("square-", ""), "point": cellClasses2[2]})
          }
          if (cellClasses2[2].includes('square')) {
            // console.log("Location: ", cellClasses2[2]);
            // console.log("point: ", cellClasses2[1]);
            newChPos.push({"position": cellClasses2[2].replace("square-", ""), "point": cellClasses2[1]})
          }
        }
      }
      for (let i = 0; i < oldChPos.length; i++){
        let flag = false;
        for (let j = 0; j < newChPos.length; j++){
          if(oldChPos[i]["position"] == newChPos[j]["position"]) flag = true;
        }
        if (!flag && oldChPos[i]["point"][0] == "b") {
          ScL = oldChPos[i];
          ScLflag = false;
        }
      }
      for (let i = 0; i < newChPos.length; i++){
        let flag = false;
        for (let j = 0; j < oldChPos.length; j++){
          if(oldChPos[j]["position"] == newChPos[i]["position"] && oldChPos[j]["point"] == newChPos[i]["point"]) flag = true;
        }
        if (!flag && newChPos[i]["point"][0] == "b") {
          EcL = newChPos[i];
        }
      }
    }
    console.log("newChPos: ", newChPos);
    console.log("ScL", ScL);
    console.log("EcL", EcL);
    oldChPos = newChPos;
		// console.log("-------------------------------------------");
		// console.log("wpL: ", wpL);
    s10 = Math.floor(ScL["position"] / 10);
    s1 = Math.floor(ScL["position"] % 10);
    e10 = Math.floor(EcL["position"] / 10);
    e1 = Math.floor(EcL["position"] % 10);
    s10 = 9 - s10;
    // s1 = 9 - s1;
    e10 = 9 - e10;
    // e1 = 9 - e1;
    console.log("SL", ScL["position"]);
    console.log("s10, s1", s10 + ":" + s1);
    console.log("EL", EcL["position"]);
    console.log("s10, s1", e10 + ":" + e1);
    ScL = ""
    ScE = ""
    const boards1 = await iframe1.$('#board');
    const board1 = await boards1.$('div');
    const cells1 = await board1.$$('div');
		const BoundingBox1 = await board1.boundingBox();
    const sourceX1 = BoundingBox1.x + BoundingBox1.width * (s10 * 2 - 1) / 16;
    const sourceY1 = BoundingBox1.y + BoundingBox1.height * (s1 * 2 - 1) / 16;
    const targetX1 = BoundingBox1.x + BoundingBox1.width * (e10 * 2 - 1) / 16;
    const targetY1 = BoundingBox1.y + BoundingBox1.height * (e1 * 2 - 1) / 16;
    console.log("sourceX1", sourceX1)
    console.log("sourceY1", sourceY1)
    console.log("targetX1", targetX1)
    console.log("targetY1", targetY1)
    await page1.mouse.move(sourceX1, sourceY1);
    await page1.mouse.down();
    await page1.mouse.move(targetX1, targetY1);
    await page1.mouse.up();
    SsL = "";
    SsE = "";
    let newShPos = [];
    let SsLFlag = true;
    while(SsLFlag){
      newShPos = [];
      await page1.waitForTimeout(100);
      for (let i = 0; i < 64; i++) {
        const cell1 = cells1[i];
        const cellDiv1 = await cell1.$$('img');
        if(cellDiv1.length){
          let imgPath = await iframe1.evaluate(img => img.src, cellDiv1[0]);
          let imgPathArray = imgPath.split("/");
          imgPathArray = imgPathArray[imgPathArray.length - 1].split(".");
          let point1 = imgPathArray[0];
          point1 = point1.replace("a109", "");
          imgPath.replace("https://www.shredderchess.com/online/applets/images/a109", "");
          imgPath.replace(".png", "");
          let position10 = (i + 1) % 8;
          if(position10 == 0) position10 = 8;
          let position = position10 + "" + (Math.floor(i / 8) + 1);
          if(point1 != "free") newShPos.push({"position": position, "point": point1});
        }
      }
      
      for (let i = 0; i < oldShPos.length; i++){
        let flag = false;
        for (let j = 0; j < newShPos.length; j++){
          if(oldShPos[i]["position"] == newShPos[j]["position"]) flag = true;
        }
        if (!flag && oldShPos[i]["point"][0] == "w") {
          SsL = oldShPos[i];
          SsLFlag = false;
        }
      }
      for (let i = 0; i < newShPos.length; i++){
        let flag = false;
        for (let j = 0; j < oldShPos.length; j++){
          if(oldShPos[j]["position"] == newShPos[i]["position"] && oldShPos[j]["point"] == newShPos[i]["point"]) flag = true;
        }
        if (!flag && newShPos[i]["point"][0] == "w") {
          EsL = newShPos[i];
        }
      }
    }
    console.log("SsL", SsL);
    console.log("EsL", EsL); 
    oldShPos = newShPos;
    console.log("newShPos: ", newShPos);  
    isAvailable = true;
  }, interval);
  
  // await browser.close();
})();
