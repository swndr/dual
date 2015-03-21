
function init() {

  var canvas = document.getElementById("easel"),
  centerX = canvas.width/2,
  centerY = canvas.height/2;

  var lightLabelStyle = "100 30px Avenir";
  var mediumLabelStyle =  "bold 30px AvenirHeavy";
  var largeLabelStyle =  "bold 40px AvenirHeavy";
  var green = "#00CA9D";
  var blue = "#4BCAFF";
  var yellow = "#F6D034";
  var pink = "#E01062";
  var white = "#FFF";
  var black = "#333";
  var lightGray = "#C8B2B2";
  var darkGray = "#AA9696";
  var pink = "#E01062";

  var iconRadius = 40;
  var buttonSize = 130;
  var buttonRow = 1;
  var buttonMargin = 8;

  var dragging = false;
  var dropPosition = null;

  var sequence = [];

  var positionSelectors = [];
  var shapeSelectors = [];
  //var logic = [];
  //var actions = [];

  var stage = new createjs.Stage(canvas);
  createjs.Touch.enable(stage);
  stage.enableMouseOver(20);

  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", stage);

  // BACKGROUND

  var bg = new createjs.Shape();
  bg.graphics.beginFill("#AAA5A5");
  bg.graphics.rect(0,0,canvas.width,896);

  // BUILD GRID

  var grid = new createjs.Shape();

    var gridSize = 4;
    var gridSpacing = 180;
    var gridLeft = ((canvas.width - ((gridSize-1) * gridSpacing))/2);
    var gridTop = ((896 - ((gridSize-1) * gridSpacing))/2);

    grid.graphics.beginStroke(white);
    grid.graphics.setStrokeStyle(2);
    grid.alpha = .2;
    
    for (var i = 0; i < gridSize; i++) {
      grid.graphics.moveTo(gridLeft+(i*gridSpacing),0);
      grid.graphics.lineTo(gridLeft+(i*gridSpacing),896);
      grid.graphics.moveTo(0,(gridTop+(i*gridSpacing)));
      grid.graphics.lineTo(canvas.width,(gridTop+(i*gridSpacing)));
    }

  stage.addChild(bg);
  stage.addChild(grid);

    for (var i = 0; i < gridSize; i++) {
        var hLabel = new createjs.Text(i, "100 25px Avenir", "#E01062");
        hLabel.x = (gridLeft-7) + (i*gridSpacing);
        hLabel.y = gridTop - 130;
        hLabel.alpha = .5;
      var vLabel = new createjs.Text(i, "100 25px Avenir", "#E01062");
        vLabel.x = gridLeft - 130;
        vLabel.y = (gridTop-16) + (i*gridSpacing);
        vLabel.alpha = .5;
      stage.addChild(hLabel);
      stage.addChild(vLabel);
    }

  stage.update();

  // CONSTRUCT SHAPES

  var row = 0;
  var column = 0;

  function rowVal (r) {return (gridTop-gridSpacing)+((r+1)*gridSpacing)} // calcs row
  function colVal (c) {return (gridLeft+(c*gridSpacing))} // calcs col

  var radius = 75;

    for (var i = 0; i < (gridSize*gridSize); i++) {

    if (i/(row+1) == gridSize) {

      row++;
      column = 0;

    }

    var rectTL = new createjs.Shape();
    rectTL.x = colVal(column);
    rectTL.y = rowVal(row);
    rectTL.graphics.beginFill(white);
    rectTL.graphics.drawRoundRectComplex(-radius,-radius,radius,radius,radius,0,0,0);
    rectTL.round = true;
    stage.addChild(rectTL);
    rectTL.addEventListener("click", shapeClickTL);

    var rectTR = new createjs.Shape();
    rectTR.x = colVal(column);
    rectTR.y = rowVal(row);
    rectTR.graphics.beginFill(white);
    rectTR.graphics.drawRoundRectComplex(0,-radius,radius,radius,0,radius,0,0);
    rectTR.round = true;
    stage.addChild(rectTR);
    rectTR.addEventListener("click", shapeClickTR);

    var rectBR = new createjs.Shape();
    rectBR.x = colVal(column);
    rectBR.y = rowVal(row);
    rectBR.graphics.beginFill(white);
    rectBR.graphics.drawRoundRectComplex(0,0,radius,radius,0,0,radius,0);
    rectBR.round = true;
    stage.addChild(rectBR);  
    rectBR.addEventListener("click", shapeClickBR);  

    var rectBL = new createjs.Shape();
    rectBL.x = colVal(column);
    rectBL.y = rowVal(row);
    rectBL.graphics.beginFill(white);
    rectBL.graphics.drawRoundRectComplex(-radius,0,radius,radius,0,0,0,radius);
    rectBL.round = true;
    stage.addChild(rectBL);
    rectBL.addEventListener("click", shapeClickBL);

    stage.update();

    column++;

  }

  // PLAYER CONTROLS

  var selectorsBox = new createjs.Container();
  var logicBox = new createjs.Container(); logicBox.name = "logicBox";
  var sequenceBox = new createjs.Container();
  var actionsBox = new createjs.Container(); actionsBox.name = "actionsBox";

  var selectorsBG = new createjs.Shape();
  selectorsBG.graphics.beginFill(white);
  selectorsBG.graphics.drawRoundRect(0,0,336,750,10);

  var selectorsMask = new createjs.Shape();
  selectorsMask.graphics.beginFill(white);
  selectorsMask.graphics.drawRoundRect(40,940,336,750,10);
  selectorsBox.mask = selectorsMask;

  var selectorsTitle = new createjs.Shape();
  selectorsTitle.graphics.beginFill(green);
  selectorsTitle.graphics.drawRoundRectComplex(0,0,336,76,10,10,0,0);
  var selectorsText = new createjs.Text("SELECTORS", lightLabelStyle, white);
  selectorsText.textAlign = "center";
  selectorsText.x = 168;
  selectorsText.y = 20;

  var positionButton = new createjs.Shape();
  positionButton.graphics.beginFill(white);
  positionButton.graphics.drawRect(0,0,168,70);
  positionButton.y = 76;

  var positionLabel = new createjs.Text("POSITION", mediumLabelStyle, green);
  positionLabel.textAlign = "center";
  positionLabel.x = 102;
  positionLabel.y = 96;

  var shapeButton = new createjs.Shape();
  shapeButton.graphics.beginFill(white);
  shapeButton.graphics.drawRect(0,0,168,70);
  shapeButton.x = 168;
  shapeButton.y = 76;

  var shapeLabel = new createjs.Text("SHAPE", mediumLabelStyle, darkGray);
  shapeLabel.textAlign = "center";
  shapeLabel.x = 252;
  shapeLabel.y = 96;

  // switch between selector sets

  positionButton.addEventListener("click", loadPositionButtons);
  shapeButton.addEventListener("click", loadShapeButtons);

  selectorsBox.addChild(selectorsBG,selectorsTitle,selectorsText,positionButton,shapeButton,positionLabel,shapeLabel);
  selectorsBox.x = 40;
  selectorsBox.y = 940;

  var logicBG = new createjs.Shape();
  logicBG.graphics.beginFill(white);
  logicBG.graphics.drawRoundRect(0,0,336,275,10);

  var logicTitle = new createjs.Shape();
  logicTitle.graphics.beginFill(blue);
  logicTitle.graphics.drawRoundRectComplex(0,0,336,76,10,10,0,0);
  var logicText = new createjs.Text("LOGIC", lightLabelStyle, white);
  logicText.textAlign = "center";
  logicText.x = 168;
  logicText.y = 20;

  logicBox.addChild(logicBG,logicTitle,logicText);
  logicBox.x = 40;
  logicBox.y = 1720;

  var sequenceBG = new createjs.Shape();
  sequenceBG.graphics.beginFill("#616060");
  sequenceBG.graphics.drawRoundRect(0,0,704,1054,10);

  var sequenceTitle = new createjs.Shape();
  sequenceTitle.graphics.beginFill(black);
  sequenceTitle.graphics.drawRoundRectComplex(0,0,704,76,10,10,0,0);
  var sequenceText = new createjs.Text("SEQUENCE", lightLabelStyle, white);
  sequenceText.textAlign = "center";
  sequenceText.x = 352;
  sequenceText.y = 20;

  var clearButton = new createjs.Shape();
  clearButton.graphics.beginFill("#616060");
  clearButton.graphics.drawRect(0,0,200,100);
  clearButton.x = 56;
  clearButton.y = 890;

  var clearLabel = new createjs.Text("CLEAR", largeLabelStyle, lightGray);
  clearLabel.textAlign = "center";
  clearLabel.x = 156;
  clearLabel.y = 940;

  var testButton = new createjs.Shape();
  testButton.graphics.beginFill("#616060");
  testButton.graphics.drawRect(0,0,200,100);
  testButton.x = 252;
  testButton.y = 890;

  var testLabel = new createjs.Text("TEST", largeLabelStyle, white);
  testLabel.textAlign = "center";
  testLabel.x = 352;
  testLabel.y = 940;

  var playButton = new createjs.Shape();
  playButton.graphics.beginFill("#EAEAEA");
  playButton.graphics.drawRoundRect(0,0,180,80,10);
  playButton.x = 458;
  playButton.y = 925;

  var playLabel = new createjs.Text("PLAY", largeLabelStyle, pink);
  playLabel.textAlign = "center";
  playLabel.x = 548;
  playLabel.y = 940;

  sequenceBox.addChild(sequenceBG,sequenceTitle,sequenceText,clearButton,clearLabel,testButton,testLabel,playButton,playLabel);
  sequenceBox.x = 416;
  sequenceBox.y = 940;

  var actionsBG = new createjs.Shape();
  actionsBG.graphics.beginFill(white);
  actionsBG.graphics.drawRoundRect(0,0,336,1054,10);

  var actionsTitle = new createjs.Shape();
  actionsTitle.graphics.beginFill(yellow);
  actionsTitle.graphics.drawRoundRectComplex(0,0,336,76,10,10,0,0);
  var actionsText = new createjs.Text("ACTIONS", lightLabelStyle, white);
  actionsText.textAlign = "center";
  actionsText.x = 168;
  actionsText.y = 20;

  var transformLabel = new createjs.Text("TRANSFORM", mediumLabelStyle, yellow);
  transformLabel.textAlign = "center";
  transformLabel.x = 168;
  transformLabel.y = 96;

  var rotateLabel = new createjs.Text("ROTATE", mediumLabelStyle, yellow);
  rotateLabel.textAlign = "center";
  rotateLabel.x = 168;
  rotateLabel.y = 462;

  var flipLabel = new createjs.Text("FLIP", mediumLabelStyle, yellow);
  flipLabel.textAlign = "center";
  flipLabel.x = 168;
  flipLabel.y = 830;

  actionsBox.addChild(actionsBG,actionsTitle,actionsText,transformLabel,rotateLabel,flipLabel);
  actionsBox.x = 1160;
  actionsBox.y = 940;

  stage.addChild(sequenceBox,selectorsBox,logicBox,actionsBox);
  stage.update();

  // GENERATE BUTTONS

  function generateGreenButton() {
    var greenButton = new createjs.Shape();
    greenButton.graphics.beginFill(green);
    greenButton.graphics.drawRoundRect(0,0,buttonSize,buttonSize,5);
    return greenButton;
  }

  function generateBlueButton() {
    var blueButton = new createjs.Shape();
    blueButton.graphics.beginFill(blue);
    blueButton.graphics.drawRoundRect(0,0,buttonSize,buttonSize,5);
    return blueButton;
  }

  function generateYellowButton() {
    var yellowButton = new createjs.Shape();
    yellowButton.graphics.beginFill(yellow);
    yellowButton.graphics.drawRoundRect(0,0,buttonSize,buttonSize,5);
    return yellowButton;
  }

  function generateRow() {
    var rowIcon = new createjs.Shape();
    rowIcon.graphics.beginFill(darkGray);
    rowIcon.graphics.drawRect(0,0,100,30);
    rowIcon.x = 15;
    rowIcon.y = 50;
    return rowIcon;
  }

  function generateCol() {
    var colIcon = new createjs.Shape();
    colIcon.graphics.beginFill(darkGray);
    colIcon.graphics.drawRect(0,0,30,100);
    colIcon.x = 50;
    colIcon.y = 15;
    return colIcon;
  }

  function generateTopLeftC() {

    var topLeftC = new createjs.Shape();
    topLeftC.graphics.beginFill(lightGray);
    topLeftC.graphics.drawRoundRectComplex(-iconRadius,-iconRadius,iconRadius,iconRadius,iconRadius,0,0,0);
    topLeftC.x = 65;
    topLeftC.y = 65;
    return topLeftC;
  }

  function generateTopRightC() {

    var topRightC = new createjs.Shape();
    topRightC.graphics.beginFill(lightGray);
    topRightC.graphics.drawRoundRectComplex(0,-iconRadius,iconRadius,iconRadius,0,iconRadius,0,0);
    topRightC.x = 65;
    topRightC.y = 65;
    return topRightC;
  }

  function generateBottomRightC() {

    var bottomRightC = new createjs.Shape();
    bottomRightC.graphics.beginFill(lightGray);
    bottomRightC.graphics.drawRoundRectComplex(0,0,iconRadius,iconRadius,0,0,iconRadius,0);
    bottomRightC.x = 65;
    bottomRightC.y = 65;
    return bottomRightC;
  }

  function generateBottomLeftC() {

    var bottomLeftC = new createjs.Shape();
    bottomLeftC.graphics.beginFill(lightGray);
    bottomLeftC.graphics.drawRoundRectComplex(-iconRadius,0,iconRadius,iconRadius,0,0,0,iconRadius);
    bottomLeftC.x = 65;
    bottomLeftC.y = 65;
    return bottomLeftC;
  }

  function generateTopLeftR() {

    var topLeftR = new createjs.Shape();
    topLeftR.graphics.beginFill(darkGray);
    topLeftR.graphics.drawRect(-iconRadius,-iconRadius,iconRadius,iconRadius);
    topLeftR.x = 65;
    topLeftR.y = 65;
    return topLeftR;
  }

  function generateTopRightR() {

    var topRightR = new createjs.Shape();
    topRightR.graphics.beginFill(darkGray);
    topRightR.graphics.drawRect(0,-iconRadius,iconRadius,iconRadius);
    topRightR.x = 65;
    topRightR.y = 65;
    return topRightR;
  }

  function generateBottomRightR() {

    var bottomRightR = new createjs.Shape();
    bottomRightR.graphics.beginFill(darkGray);
    bottomRightR.graphics.drawRect(0,0,iconRadius,iconRadius);
    bottomRightR.x = 65;
    bottomRightR.y = 65;
    return bottomRightR;
  }

  function generateBottomLeftR() {

    var bottomLeftR = new createjs.Shape();
    bottomLeftR.graphics.beginFill(darkGray);
    bottomLeftR.graphics.drawRect(-iconRadius,0,iconRadius,iconRadius);
    bottomLeftR.x = 65;
    bottomLeftR.y = 65;
    return bottomLeftR;
  }

  function generateTransformR(x,y) {

    var transformR = new createjs.Shape();
    transformR.graphics.beginFill(black);
    transformR.graphics.drawRect(0,0,iconRadius,iconRadius);
    transformR.x = x;
    transformR.y = y;
    return transformR;
  }
  
  // SELECTOR ITEMS

  var selectors = new createjs.Container;
  selectors.name = "selectorsInnerBox";

  var CCRR = new createjs.Container();
  CCRR.addChild(generateGreenButton(),generateTopLeftC(),generateTopRightC(),generateBottomRightR(),generateBottomLeftR());
  shapeSelectors.push(CCRR);

  var RRCC = new createjs.Container();
  RRCC.addChild(generateGreenButton(),generateTopLeftR(),generateTopRightR(),generateBottomRightC(),generateBottomLeftC());
  shapeSelectors.push(RRCC);

  var CRRC = new createjs.Container();
  CRRC.addChild(generateGreenButton(),generateTopLeftC(),generateTopRightR(),generateBottomRightR(),generateBottomLeftC());
  shapeSelectors.push(CRRC);

  var RCCR = new createjs.Container();
  RCCR.addChild(generateGreenButton(),generateTopLeftR(),generateTopRightC(),generateBottomRightC(),generateBottomLeftR());
  shapeSelectors.push(RCCR);

  var CRRR = new createjs.Container();
  CRRR.addChild(generateGreenButton(),generateTopLeftC(),generateTopRightR(),generateBottomRightR(),generateBottomLeftR());
  shapeSelectors.push(CRRR);

  var RCRR = new createjs.Container();
  RCRR.addChild(generateGreenButton(),generateTopLeftR(),generateTopRightC(),generateBottomRightR(),generateBottomLeftR());
  shapeSelectors.push(RCRR);

  var RRRC = new createjs.Container();
  RRRC.addChild(generateGreenButton(),generateTopLeftR(),generateTopRightR(),generateBottomRightR(),generateBottomLeftC());
  shapeSelectors.push(RRRC);

  var RRCR = new createjs.Container();
  RRCR.addChild(generateGreenButton(),generateTopLeftR(),generateTopRightR(),generateBottomRightC(),generateBottomLeftR());
  shapeSelectors.push(RRCR);

  var CRRR = new createjs.Container();
  CRRR.addChild(generateGreenButton(),generateTopLeftC(),generateTopRightR(),generateBottomRightR(),generateBottomLeftR());
  shapeSelectors.push(CRRR);

  var RCRR = new createjs.Container();
  RCRR.addChild(generateGreenButton(),generateTopLeftR(),generateTopRightC(),generateBottomRightR(),generateBottomLeftR());
  shapeSelectors.push(RCRR);

  var RRRC = new createjs.Container();
  RRRC.addChild(generateGreenButton(),generateTopLeftR(),generateTopRightR(),generateBottomRightR(),generateBottomLeftC());
  shapeSelectors.push(RRRC);

  var RRCR = new createjs.Container();
  RRCR.addChild(generateGreenButton(),generateTopLeftR(),generateTopRightR(),generateBottomRightC(),generateBottomLeftR());
  shapeSelectors.push(RRCR);

  var RCRC = new createjs.Container();
  RCRC.addChild(generateGreenButton(),generateTopLeftR(),generateTopRightC(),generateBottomRightR(),generateBottomLeftC());
  shapeSelectors.push(RCRC);

  var CRCR = new createjs.Container();
  CRCR.addChild(generateGreenButton(),generateTopLeftC(),generateTopRightR(),generateBottomRightC(),generateBottomLeftR());
  shapeSelectors.push(CRCR);


  for (var i = 0; i < 4; i++) {

    var rowSelector = new createjs.Container();
    rowSelector.type = "position";
    rowSelector.addEventListener("mousedown",grabItem);
    rowSelector.addEventListener("pressmove",dragAndDrop);
    rowSelector.addEventListener("pressup",snapTo);
    rowSelector.x = 34;
    rowSelector.y = 16 + (buttonRow * (buttonSize + buttonMargin));
    rowSelector.originX = rowSelector.x;
    rowSelector.originY = rowSelector.y;
    rowSelector.originParent = selectors;

    var rowLabel = new createjs.Text(i, lightLabelStyle, white);
    rowLabel.x = 65;
    rowLabel.y = 45;
    rowLabel.textAlign = "center";

    rowSelector.addChild(generateGreenButton(),generateRow(),rowLabel);
    selectors.addChild(rowSelector);

    var colSelector = new createjs.Container();
    colSelector.type = "position";
    colSelector.addEventListener("mousedown",grabItem);
    colSelector.addEventListener("pressmove",dragAndDrop);
    colSelector.addEventListener("pressup",snapTo);
    colSelector.x = 34 + buttonSize + buttonMargin;
    colSelector.y = 16 + (buttonRow * (buttonSize + buttonMargin));
    colSelector.originX = colSelector.x;
    colSelector.originY = colSelector.y;
    colSelector.originParent = selectors;

    var colLabel = new createjs.Text(i, lightLabelStyle, white);
    colLabel.x = 65;
    colLabel.y = 45;
    colLabel.textAlign = "center";

    colSelector.addChild(generateGreenButton(),generateCol(),colLabel);
    selectors.addChild(colSelector);
    selectorsBox.addChild(selectors);
    buttonRow++;

    stage.update();

  }

  buttonRow = 1;

  // for (var i = 0; i < shapeSelectors.length; i++) {
  for (var i = 0; i < 8; i++) {

    shapeSelectors[i].type = "shape";
    shapeSelectors[i].addEventListener("mousedown",grabItem);
    shapeSelectors[i].addEventListener("pressmove",dragAndDrop);
    shapeSelectors[i].addEventListener("pressup",snapTo);

    if (!(i % 2)) {

    shapeSelectors[i].x = 372;
    shapeSelectors[i].y = 16 + (buttonRow * (buttonSize + buttonMargin));
    selectors.addChild(shapeSelectors[i]);
    selectorsBox.addChild(selectors);

    } else {

    shapeSelectors[i].x = 372 + buttonSize + buttonMargin;
    shapeSelectors[i].y = 16 + (buttonRow * (buttonSize + buttonMargin));
    selectors.addChild(shapeSelectors[i]);
    selectorsBox.addChild(selectors);
    buttonRow++;
    }

    shapeSelectors[i].originX = shapeSelectors[i].x;
    shapeSelectors[i].originY = shapeSelectors[i].y;
    shapeSelectors[i].originParent = selectors;

    stage.update();

  }

  // LOGIC ITEMS

    var andLogic = new createjs.Container();
    andLogic.type = "logic";
    andLogic.addEventListener("mousedown",grabItem);
    andLogic.addEventListener("pressmove",dragAndDrop);
    andLogic.addEventListener("pressup",snapTo);
    andLogic.x = 34;
    andLogic.y = 106;
    andLogic.originX = andLogic.x;
    andLogic.originY = andLogic.y;
    andLogic.originParent = logicBox;

    var orLogic = new createjs.Container();
    orLogic.type = "logic";
    orLogic.addEventListener("mousedown",grabItem);
    orLogic.addEventListener("pressmove",dragAndDrop);
    orLogic.addEventListener("pressup",snapTo);
    orLogic.x = 34 + buttonSize + buttonMargin;
    orLogic.y = 106;
    orLogic.originX = orLogic.x;
    orLogic.originY = orLogic.y;
    orLogic.originParent = logicBox;

    var andLabel = new createjs.Text("AND", mediumLabelStyle, white);
    andLabel.x = 65;
    andLabel.y = 45;
    andLabel.textAlign = "center";

    var orLabel = new createjs.Text("OR", mediumLabelStyle, white);
    orLabel.x = 65;
    orLabel.y = 45;
    orLabel.textAlign = "center";  

    andLogic.addChild(generateBlueButton(),andLabel);
    orLogic.addChild(generateBlueButton(),orLabel);

    logicBox.addChild(andLogic,orLogic);
    stage.update();


  // ACTION ITEMS
  
  var transformTL = new createjs.Container();
  transformTL.type = "action";
  transformTL.addEventListener("mousedown",grabItem);
  transformTL.addEventListener("pressmove",dragAndDrop);
  transformTL.addEventListener("pressup",snapTo);
  var transformTR = new createjs.Container();
  transformTR.type = "action";
  transformTR.addEventListener("mousedown",grabItem);
  transformTR.addEventListener("pressmove",dragAndDrop);
  transformTR.addEventListener("pressup",snapTo);
  var transformBR = new createjs.Container();
  transformBR.type = "action";
  transformBR.addEventListener("mousedown",grabItem);
  transformBR.addEventListener("pressmove",dragAndDrop);
  transformBR.addEventListener("pressup",snapTo);
  var transformBL = new createjs.Container();
  transformBL.type = "action";
  transformBL.addEventListener("mousedown",grabItem);
  transformBL.addEventListener("pressmove",dragAndDrop);
  transformBL.addEventListener("pressup",snapTo);
  var rotate90cc = new createjs.Container();
  rotate90cc.type = "action";
  rotate90cc.addEventListener("mousedown",grabItem);
  rotate90cc.addEventListener("pressmove",dragAndDrop);
  rotate90cc.addEventListener("pressup",snapTo);
  var rotate90c = new createjs.Container();
  rotate90c.type = "action";
  rotate90c.addEventListener("mousedown",grabItem);
  rotate90c.addEventListener("pressmove",dragAndDrop);
  rotate90c.addEventListener("pressup",snapTo);
  var rotate180cc = new createjs.Container();
  rotate180cc.type = "action";
  rotate180cc.addEventListener("mousedown",grabItem);
  rotate180cc.addEventListener("pressmove",dragAndDrop);
  rotate180cc.addEventListener("pressup",snapTo);
  var rotate180c = new createjs.Container();
  rotate180c.type = "action";
  rotate180c.addEventListener("mousedown",grabItem);
  rotate180c.addEventListener("pressmove",dragAndDrop);
  rotate180c.addEventListener("pressup",snapTo);
  var flipV = new createjs.Container();
  flipV.type = "action";
  flipV.addEventListener("mousedown",grabItem);
  flipV.addEventListener("pressmove",dragAndDrop);
  flipV.addEventListener("pressup",snapTo);
  var flipH = new createjs.Container();
  flipH.type = "action";
  flipH.addEventListener("mousedown",grabItem);
  flipH.addEventListener("pressmove",dragAndDrop);
  flipH.addEventListener("pressup",snapTo);

  // transform buttons

  var transformTLCircle = new createjs.Shape();
    transformTLCircle.graphics.beginFill(white);
    transformTLCircle.graphics.drawRoundRectComplex(0,0,iconRadius,iconRadius,iconRadius,0,0,0);
    transformTLCircle.x = 35;
    transformTLCircle.y = 35;

  transformTL.addChild(generateYellowButton(),generateTransformR(50,50),transformTLCircle);
  transformTL.x = 34;
  transformTL.y = 16 + buttonSize + buttonMargin;
  transformTL.originX = transformTL.x;
  transformTL.originY = transformTL.y;
  transformTL.originParent = actionsBox;

  var transformTRCircle = new createjs.Shape();
    transformTRCircle.graphics.beginFill(white);
    transformTRCircle.graphics.drawRoundRectComplex(0,0,iconRadius,iconRadius,0,iconRadius,0,0);
    transformTRCircle.x = 50;
    transformTRCircle.y = 35;

  transformTR.addChild(generateYellowButton(),generateTransformR(35,50),transformTRCircle);
  transformTR.x = 34 + buttonSize + buttonMargin;
  transformTR.y = 16 + buttonSize + buttonMargin;
  transformTR.originX = transformTR.x;
  transformTR.originY = transformTR.y;
  transformTR.originParent = actionsBox;

  var transformBRCircle = new createjs.Shape();
    transformBRCircle.graphics.beginFill(white);
    transformBRCircle.graphics.drawRoundRectComplex(0,0,iconRadius,iconRadius,0,0,iconRadius,0);
    transformBRCircle.x = 50;
    transformBRCircle.y = 50;

  transformBR.addChild(generateYellowButton(),generateTransformR(35,35),transformBRCircle);
  transformBR.x = 34 + buttonSize + buttonMargin;
  transformBR.y = 16 + (buttonSize*2) + (buttonMargin*2);
  transformBR.originX = transformBR.x;
  transformBR.originY = transformBR.y;
  transformBR.originParent = actionsBox;

  var transformBLCircle = new createjs.Shape();
    transformBLCircle.graphics.beginFill(white);
    transformBLCircle.graphics.drawRoundRectComplex(0,0,iconRadius,iconRadius,0,0,0,iconRadius);
    transformBLCircle.x = 35;
    transformBLCircle.y = 50;

  transformBL.addChild(generateYellowButton(),generateTransformR(50,35),transformBLCircle);
  transformBL.x = 34
  transformBL.y = 16 + (buttonSize*2) + (buttonMargin*2);
  transformBL.originX = transformBL.x;
  transformBL.originY = transformBL.y;
  transformBL.originParent = actionsBox;

  // rotate buttons

  var counter90Arc = new createjs.Shape();
    counter90Arc.graphics.beginStroke(pink);
    counter90Arc.graphics.setStrokeStyle(16);
    counter90Arc.graphics.arc(56,94,40,270*(Math.PI/180),0);

  var counter90Arrow = new createjs.Shape();
    counter90Arrow.graphics.beginFill(pink);
    counter90Arrow.graphics.lineTo(26,56);
    counter90Arrow.graphics.lineTo(56,36);
    counter90Arrow.graphics.lineTo(56,76);
    counter90Arrow.graphics.closePath();

    rotate90cc.addChild(generateYellowButton(),counter90Arc,counter90Arrow);
    rotate90cc.x = 34;
    rotate90cc.y = 520;
    rotate90cc.originX = rotate90cc.x;
    rotate90cc.originY = rotate90cc.y;
    rotate90cc.originParent = actionsBox;

  var clock90Arc = new createjs.Shape();
    clock90Arc.graphics.beginStroke(pink);
    clock90Arc.graphics.setStrokeStyle(16);
    clock90Arc.graphics.arc(74,94,40,180*(Math.PI/180),270*(Math.PI/180));

  var clock90Arrow = new createjs.Shape();
    clock90Arrow.graphics.beginFill(pink);
    clock90Arrow.graphics.lineTo(104,56);
    clock90Arrow.graphics.lineTo(74,36);
    clock90Arrow.graphics.lineTo(74,76);
    clock90Arrow.graphics.closePath();

    rotate90c.addChild(generateYellowButton(),clock90Arc,clock90Arrow);
    rotate90c.x = 34 + buttonSize + buttonMargin;
    rotate90c.y = 520;
    rotate90c.originX = rotate90c.x;
    rotate90c.originY = rotate90c.y;
    rotate90c.originParent = actionsBox;

  var cc180Arc = new createjs.Shape();
    cc180Arc.graphics.beginStroke(pink);
    cc180Arc.graphics.setStrokeStyle(16);
    cc180Arc.graphics.arc(65,68,26,180*(Math.PI/180),0);

  var cc180Arrow = new createjs.Shape();
    cc180Arrow.graphics.beginFill(pink);
    cc180Arrow.graphics.lineTo(39,98);
    cc180Arrow.graphics.lineTo(19,68);
    cc180Arrow.graphics.lineTo(59,68);
    cc180Arrow.graphics.closePath();

    rotate180cc.addChild(generateYellowButton(),cc180Arc,cc180Arrow);
    rotate180cc.x = 34
    rotate180cc.y = 520 + buttonSize + buttonMargin;
    rotate180cc.originX = rotate180cc.x;
    rotate180cc.originY = rotate180cc.y;
    rotate180cc.originParent = actionsBox;

  var c180Arc = new createjs.Shape();
    c180Arc.graphics.beginStroke(pink);
    c180Arc.graphics.setStrokeStyle(16);
    c180Arc.graphics.arc(65,68,26,180*(Math.PI/180),0);

  var c180Arrow = new createjs.Shape();
    c180Arrow.graphics.beginFill(pink);
    c180Arrow.graphics.lineTo(91,98);
    c180Arrow.graphics.lineTo(71,68);
    c180Arrow.graphics.lineTo(111,68);
    c180Arrow.graphics.closePath();

  rotate180c.addChild(generateYellowButton(),c180Arc,c180Arrow);
  rotate180c.x = 34 + buttonSize + buttonMargin;
  rotate180c.y = 520 + buttonSize + buttonMargin;
  rotate180c.originX = rotate180c.x;
  rotate180c.originY = rotate180c.y;
  rotate180c.originParent = actionsBox;

  // flip buttons

  var originFlipV = new createjs.Shape();
    originFlipV.graphics.beginFill(darkGray);
    originFlipV.graphics.lineTo(40,30);
    originFlipV.graphics.lineTo(90,30);
    originFlipV.graphics.lineTo(65,60);
    originFlipV.graphics.closePath();

  var targetFlipV = new createjs.Shape();
    targetFlipV.graphics.beginFill(pink);
    targetFlipV.graphics.lineTo(65,70);
    targetFlipV.graphics.lineTo(40,100);
    targetFlipV.graphics.lineTo(90,100);
    targetFlipV.graphics.closePath();

  flipV.addChild(generateYellowButton(),originFlipV,targetFlipV);
  flipV.x = 34;
  flipV.y = 886;
  flipV.originX = flipV.x;
  flipV.originY = flipV.y;
  flipV.originParent = actionsBox;

  var originFlipH = new createjs.Shape();
    originFlipH.graphics.beginFill(darkGray);
    originFlipH.graphics.lineTo(30,40);
    originFlipH.graphics.lineTo(30,90);
    originFlipH.graphics.lineTo(60,65);
    originFlipH.graphics.closePath();

  var targetFlipH = new createjs.Shape();
    targetFlipH.graphics.beginFill(pink);
    targetFlipH.graphics.lineTo(70,65);
    targetFlipH.graphics.lineTo(100,40);
    targetFlipH.graphics.lineTo(100,90);
    targetFlipH.graphics.closePath();

  flipH.addChild(generateYellowButton(),originFlipH,targetFlipH);
  flipH.x = 34 + buttonSize + buttonMargin;
  flipH.y = 886;
  flipHoriginX = flipH.x;
  flipH.originY = flipH.y;
  flipH.originParent = actionsBox;

  actionsBox.addChild(transformTL,transformTR,transformBR,transformBL,rotate90cc,rotate90c,rotate180cc,rotate180c,flipV,flipH);
  stage.update();


  // SEQUENCE TRAY

  // fill sequence array with null

  for (var i = 0; i < 15; i++) {
    sequence[i] = null;
  }

  var sequence1 = new createjs.Shape();
  sequence1.graphics.beginStroke(green).setStrokeStyle(8).beginFill(black);
  sequence1.graphics.drawRoundRect(0,0,442,150,5);
  sequence1.x = 36;
  sequence1.y = 122;

  var sequence2 = new createjs.Shape();
  sequence2.graphics.beginStroke(green).setStrokeStyle(8).beginFill(black);
  sequence2.graphics.drawRoundRect(0,0,442,150,5);
  sequence2.x = 36;
  sequence2.y = 322;

  var sequence3 = new createjs.Shape();
  sequence3.graphics.beginStroke(green).setStrokeStyle(8).beginFill(black);
  sequence3.graphics.drawRoundRect(0,0,442,150,5);
  sequence3.x = 36;
  sequence3.y = 522;

  var sequence4 = new createjs.Shape();
  sequence4.graphics.beginStroke(green).setStrokeStyle(8).beginFill(black);
  sequence4.graphics.drawRoundRect(0,0,442,150,5);
  sequence4.x = 36;
  sequence4.y = 722;

  var action1 = new createjs.Shape();
  action1.graphics.beginStroke(yellow).setStrokeStyle(8).beginFill(black);
  action1.graphics.drawRoundRect(0,0,160,150,5);
  action1.x = 508;
  action1.y = 122;

  var action2 = new createjs.Shape();
  action2.graphics.beginStroke(yellow).setStrokeStyle(8).beginFill(black);
  action2.graphics.drawRoundRect(0,0,160,150,5);
  action2.x = 508;
  action2.y = 322;

  var action3 = new createjs.Shape();
  action3.graphics.beginStroke(yellow).setStrokeStyle(8).beginFill(black);
  action3.graphics.drawRoundRect(0,0,160,150,5);
  action3.x = 508;
  action3.y = 522;

  var action4 = new createjs.Shape();
  action4.graphics.beginStroke(yellow).setStrokeStyle(8).beginFill(black);
  action4.graphics.drawRoundRect(0,0,160,150,5);
  action4.x = 508;
  action4.y = 722;

  sequenceBox.addChild(sequence1,sequence2,sequence3,sequence4,action1,action2,action3,action4);

  var dropZoneRow = 1;

  for (var i = 0; i < 16; i++) {

    var dropZone = new createjs.Shape();
    //dropZone.on("mouseover", startHighlight);
    //dropZone.on("mouseout", endHighlight);

    if (i == 1 || i == 5 || i == 9 || i == 13) {

    dropZone.graphics.beginFill(blue);
    dropZone.graphics.drawRoundRect(0,0,buttonSize,buttonSize,5);
    dropZone.alpha = .25;
    dropZone.x = 50 + buttonSize + (buttonMargin+4);
    dropZone.y = (dropZoneRow * 200) - 68;

    } else if (i == 3 || i == 7 || i == 11 || i == 15) {

    dropZone.graphics.beginFill(yellow);
    dropZone.graphics.drawRoundRect(0,0,buttonSize,buttonSize,5);
    dropZone.alpha = .25;
    dropZone.x = 523;
    dropZone.y = (dropZoneRow * 200) - 68;

    dropZoneRow++;

    } else if (i == 0 || i == 4 || i == 8 || i == 12) {

    dropZone.graphics.beginFill(green);
    dropZone.graphics.drawRoundRect(0,0,buttonSize,buttonSize,5);
    dropZone.alpha = .25;
    dropZone.x = 50
    dropZone.y = (dropZoneRow * 200) - 68;

    } else {
    
    dropZone.graphics.beginFill(green);
    dropZone.graphics.drawRoundRect(0,0,buttonSize,buttonSize,5);
    dropZone.alpha = .25;
    dropZone.x = 50 + (buttonSize*2) + ((buttonMargin+4)*2);;
    dropZone.y = (dropZoneRow * 200) - 68;

    }

    dropZone.slot = i;
    sequenceBox.addChild(dropZone);
  }

  stage.update();


  // INTERACTION

  function grabItem(event) {

    if (event.currentTarget.parent == sequenceBox) {
      for (var i = 0; i < sequence.length; i++) {
        if (sequence[i] == event.currentTarget.id) {
          sequence[i] = null;
        }
      }
    }

    if (event.currentTarget.parent.parent != null) {
      var pt = event.currentTarget.localToGlobal(event.currentTarget.x,event.currentTarget.y);
      event.currentTarget.x = (pt.x - event.currentTarget.x);
      event.currentTarget.y = (pt.y - event.currentTarget.y);
      stage.addChild(event.currentTarget);
      stage.update();
    }
  }

  function dragAndDrop(event) {

    dragging = true;

    event.currentTarget.set({
      x: event.stageX-65,
      y: event.stageY-65
    });

    // trying to highlight, but poor performance

    // if (event.stageX > 416 && event.stageX < 1121) {

    //   for (var i = 0; i < stage.getObjectsUnderPoint(event.stageX,event.stageY,0).length; i++) {
    //     if (stage.getObjectsUnderPoint(event.stageX,event.stageY,0)[i].slot != null) {
    //     var slot = stage.getObjectsUnderPoint(event.stageX,event.stageY,0)[i].slot;
    //     console.log(i + " " + slot);
    //     }
    //   }
    // }

    stage.update();

  }

  function snapTo(event) {

    dragging = false;

    event.currentTarget.set({
      x: event.stageX-65,
      y: event.stageY-65
    });

    //console.log(event.currentTarget.type);

    for (var i = 0; i < stage.getObjectsUnderPoint(event.stageX,event.stageY,0).length; i++) {
      if (stage.getObjectsUnderPoint(event.stageX,event.stageY,0)[i].slot != null) {
      dropPosition = stage.getObjectsUnderPoint(event.stageX,event.stageY,0)[i];
      }
    }

    if (dropPosition != null && sequence[dropPosition] == null) {
      addToSlot(event.currentTarget,dropPosition);
    } else {
      returnToOrigin(event.currentTarget,event.currentTarget.originParent,event.currentTarget.originX,event.currentTarget.originY);
    }

    dropPosition = null;
    stage.update();
  
  }

  function addToSlot(item,pos) {

    if (item.type == "position" || item.type == "shape") {

      if (pos.slot % 2 == 0) { 
        sequenceBox.addChild(item);
        item.x = pos.x; 
        item.y = pos.y;
        sequence[pos.slot] = item.id;
      } else { 
        returnToOrigin(item,item.originParent,item.originX,item.originY); 
      }

    } else if (item.type == "logic") {

      if (pos.slot == 1 || pos.slot == 5 || pos.slot == 9 || pos.slot == 13) { 
        sequenceBox.addChild(item);
        item.x = pos.x; 
        item.y = pos.y; 
        sequence[pos.slot] = item.id;
      } else { 
        returnToOrigin(item,item.originParent,item.originX,item.originY); 
      }

    } else {

      if (pos.slot == 3 || pos.slot == 7 || pos.slot == 11 || pos.slot == 15) { 
        sequenceBox.addChild(item);
        item.x = pos.x; 
        item.y = pos.y; 
        sequence[pos.slot] = item.id;
      } else { 
        returnToOrigin(item,item.originParent,item.originX,item.originY); 
      }

    }

    stage.update();

  }

  function returnToOrigin(item,parent,x,y) {

    parent.addChild(item);
    item.x = x;
    item.y = y;
    stage.update();

  }

  function startHighlight(event) {
    console.log(dragging);
    if (dragging == true) {
      event.currentTarget.alpha = .5;
      stage.update();
    }

  }

  function endHighlight(event) {

    if (dragging == true) {
      event.currentTarget.alpha = .25;
      stage.update();
    }

  }


  function loadPositionButtons(event) {

    positionLabel.color = green;
    shapeLabel.color = darkGray;
    stage.update();

    createjs.Tween.get(selectors, {override:true}).to({x:0}, 400, createjs.Ease.cubicOut);
  }
  
  function loadShapeButtons(event) {
    
    positionLabel.color = darkGray;
    shapeLabel.color = green;
    stage.update();

    createjs.Tween.get(selectors, {override:true}).to({x:-336}, 400, createjs.Ease.cubicOut);

  }



  // TOGGLE GAME OBJECTS

  function shapeClickTL(event) {

    if (event.target.round == true) {
       event.target.graphics
        .clear()
        .beginFill(black)
        .drawRoundRectComplex(-radius,-radius,radius,radius,0,0,0,0)
        stage.update();
        event.target.round = false;
    } else {
        event.target.graphics
        .clear()
        .beginFill(white)
        .drawRoundRectComplex(-radius,-radius,radius,radius,radius,0,0,0)
        event.target.round = true;
        stage.update();
    }

  }

  function shapeClickTR(event) {

    if (event.target.round == true) {
       event.currentTarget.graphics
        .clear()
        .beginFill(black)
        .drawRoundRectComplex(0,-radius,radius,radius,0,0,0,0)
        stage.update();
        event.currentTarget.round = false;
    } else {
        event.currentTarget.graphics
        .clear()
        .beginFill(white)
        .drawRoundRectComplex(0,-radius,radius,radius,0,radius,0,0)
        event.currentTarget.round = true;
        stage.update();
    }

  }

  function shapeClickBR(event) {

    if (event.target.round == true) {
       event.target.graphics
        .clear()
        .beginFill(black)
        .drawRoundRectComplex(0,0,radius,radius,0,0,0,0)
        stage.update();
        event.target.round = false;
    } else {
        event.target.graphics
        .clear()
        .beginFill(white)
        .drawRoundRectComplex(0,0,radius,radius,0,0,radius,0)
        event.target.round = true;
        stage.update();
    }

  }

  function shapeClickBL(event) {

    if (event.target.round == true) {
      console.log(event.target.graphics);
       event.target.graphics
        .clear()
        .beginFill(black)
        .drawRoundRectComplex(-radius,0,radius,radius,0,0,0,0)
        stage.update();
        event.target.round = false;
    } else {
        event.target.graphics
        .clear()
        .beginFill(white)
        .drawRoundRectComplex(-radius,0,radius,radius,0,0,0,radius)
        event.target.round = true;
        stage.update();
    }

  }


  // UTILITIES

  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}