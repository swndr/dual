
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
  var gray = "#EAEAEA";
  var lightGray = "#C8B2B2";
  var darkGray = "#AA9696";
  var pink = "#E01062";

  var radius = 75;
  var iconRadius = 40;
  var buttonSize = 130;
  var buttonRow = 1;
  var buttonMargin = 8;

  //var dragging = false;
  var dropPosition = null;

  var sequence = [];

  var positionSelectors = [];
  var shapeSelectors = [];
  //var logic = [];
  //var actions = [];

  var wScore = 0
  var bScore = 0;

  var stage = new createjs.Stage(canvas);
  createjs.Touch.enable(stage);
  stage.enableMouseOver(20);

  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", tick);
  createjs.Ticker.setPaused(true);

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
  bg.cache(0,0,canvas.width,896);
  stage.addChild(grid);
  grid.cache(0,0,canvas.width,896);

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

  // SCORES

  var whiteIcon = new createjs.Shape();
  whiteIcon.graphics.beginFill(white).drawCircle(0,0,iconRadius,iconRadius);
  whiteIcon.x = 80;
  whiteIcon.y = 448;
  var whiteScore = new createjs.Text(wScore, largeLabelStyle, white);
  whiteScore.x = 140;
  whiteScore.y = 428;
  whiteScore.textAlign = "left";
  var blackIcon = new createjs.Shape();
  blackIcon.graphics.beginFill(black).drawRect(0,0,iconRadius*2,iconRadius*2);
  blackIcon.x = canvas.width - iconRadius - 80;
  blackIcon.y = 448 - iconRadius;
  var blackScore = new createjs.Text(bScore, largeLabelStyle, black);
  blackScore.x = canvas.width - 140;
  blackScore.y = 428;
  blackScore.textAlign = "right";
  stage.addChild(whiteIcon,whiteScore,blackIcon,blackScore);
  stage.update();

  // CONSTRUCT SHAPES

  function rowVal (r) {return (gridTop-gridSpacing)+((r+1)*gridSpacing)} // calcs row
  function colVal (c) {return (gridLeft+(c*gridSpacing))} // calcs col

  function GameObject(tl,tr,br,bl) {

    var gameObject = new createjs.Container();

    var TL = new createjs.Shape();
    var TR = new createjs.Shape();
    var BR = new createjs.Shape();
    var BL = new createjs.Shape();

    if (tl == 1) {
      TL.graphics.beginFill(white);
      TL.graphics.drawRoundRectComplex(-radius,-radius,radius,radius,radius,0,0,0);
      TL.round = true;
      TL.name = "TL";
      TL.addEventListener("click", shapeClick);
    } else {
      TL.graphics.beginFill(black);
      TL.graphics.drawRoundRectComplex(-radius,-radius,radius,radius,0,0,0,0);
      TL.round = false;
      TL.name = "TL";
      TL.addEventListener("click", shapeClick);
    }

    if (tr == 1) {
      TR.graphics.beginFill(white);
      TR.graphics.drawRoundRectComplex(0,-radius,radius,radius,0,radius,0,0);
      TR.round = true;
      TR.name = "TR";
      TR.addEventListener("click", shapeClick);
    } else {
      TR.graphics.beginFill(black);
      TR.graphics.drawRoundRectComplex(0,-radius,radius,radius,0,0,0,0);
      TR.round = false;
      TR.name = "TR";
      TR.addEventListener("click", shapeClick);
    }

    if (br == 1) {
      BR.graphics.beginFill(white);
      BR.graphics.drawRoundRectComplex(0,0,radius,radius,0,0,radius,0);
      BR.round = true;
      BR.name = "BR";
      BR.addEventListener("click", shapeClick);
    } else {
      BR.graphics.beginFill(black);
      BR.graphics.drawRoundRectComplex(0,0,radius,radius,0,0,0,0);
      BR.round = false;
      BR.name = "BR";
      BR.addEventListener("click", shapeClick);
    }

    if (bl == 1) {
      BL.graphics.beginFill(white);
      BL.graphics.drawRoundRectComplex(-radius,0,radius,radius,0,0,0,radius);
      BL.round = true;
      BL.name = "BL";
      BL.addEventListener("click", shapeClick);
    } else {
      BL.graphics.beginFill(black);
      BL.graphics.drawRoundRectComplex(-radius,0,radius,radius,0,0,0,0);
      BL.round = false;
      BL.name = "BL";
      BL.addEventListener("click", shapeClick);
    }

    gameObject.addChild(TL,TR,BR,BL);

    return gameObject;

  }

  // ADD START OBJECTS TO BOARD

  var row = 0;
  var column = 0;

  var startObjects = shuffle([[0,0,1,1],[0,0,1,1],[0,1,1,0],[0,1,1,0],[1,1,0,0],[1,1,0,0],[1,0,0,1],[1,0,0,1],[1,0,1,1],[0,1,1,1],[0,1,0,0],[1,0,0,0],[1,0,1,0],[1,0,1,0],[0,1,0,1],[0,1,0,1]]);

  for (var i = 0; i < (gridSize*gridSize); i++) {

    if (i/(row+1) == gridSize) {

      row++;
      column = 0;

    }

    var fourm = new GameObject(startObjects[i][0],startObjects[i][1],startObjects[i][2],startObjects[i][3]);
    fourm.x = colVal(column);
    fourm.y = rowVal(row);

    stage.addChild(fourm);

    column++;

  }

  stage.update();

  // PLAYER CONTROLS

  function Box(x,y,w,h,bgColor,color,title,name) {

    var box = new createjs.Container();
    if (arguments.length == 8) {
      box.name = name;
    }

    var bg = new createjs.Shape();
    bg.graphics.beginFill(bgColor);
    bg.graphics.drawRoundRect(0,0,w,h,10);

    var header = new createjs.Shape();
    header.graphics.beginFill(color);
    header.graphics.drawRoundRectComplex(0,0,w,76,10,10,0,0);
    var label = new createjs.Text(title, lightLabelStyle, white);
    label.textAlign = "center";
    label.x = w/2;
    label.y = 20;

    box.addChild(bg,header,label);
    box.x = x;
    box.y = y;

    return box;
  }

  var selectorsBox = new Box(40,940,336,750,white,green,"SELECTORS");
  var logicBox = new Box(40,1720,336,275,white,blue,"LOGIC","logicBox");
  var sequenceBox = new Box(416,940,704,1054,"#616060",black,"SEQUENCE");
  var actionsBox = new Box(1160,940,336,1054,white,yellow,"ACTIONS","actionsBox");

  var selectorsMask = new createjs.Shape();
  selectorsMask.graphics.beginFill(white).drawRoundRect(40,940,336,750,10);
  selectorsBox.mask = selectorsMask;

  var positionLabelButton = new createjs.Shape();
  positionLabelButton.graphics.beginFill(white).drawRect(0,0,168,70);
  positionLabelButton.y = 76;

  var positionLabel = new createjs.Text("POSITION", mediumLabelStyle, green);
  positionLabel.textAlign = "center";
  positionLabel.x = 102;
  positionLabel.y = 96;

  var shapeLabelButton = new createjs.Shape();
  shapeLabelButton.graphics.beginFill(white).drawRect(0,0,168,70);
  shapeLabelButton.x = 168;
  shapeLabelButton.y = 76;

  var shapeLabel = new createjs.Text("SHAPE", mediumLabelStyle, darkGray);
  shapeLabel.textAlign = "center";
  shapeLabel.x = 252;
  shapeLabel.y = 96;

  // switch between selector sets
  positionLabelButton.addEventListener("click", loadPositionButtons);
  shapeLabelButton.addEventListener("click", loadShapeButtons);

  selectorsBox.addChild(positionLabelButton,shapeLabelButton,positionLabel,shapeLabel);

  var clearButton = new createjs.Shape();
  clearButton.graphics.beginFill("#616060").drawRect(0,0,200,100);
  clearButton.x = 56;
  clearButton.y = 910;

  var clearLabel = new createjs.Text("CLEAR", largeLabelStyle, lightGray);
  clearLabel.textAlign = "center";
  clearLabel.x = 156;
  clearLabel.y = 940;

  var testButton = new createjs.Shape();
  testButton.graphics.beginFill("#616060").drawRect(0,0,200,100);
  testButton.x = 252;
  testButton.y = 910;

  var testLabel = new createjs.Text("TEST", largeLabelStyle, white);
  testLabel.textAlign = "center";
  testLabel.x = 352;
  testLabel.y = 940;

  var playButton = new createjs.Shape();
  playButton.graphics.beginFill(gray).drawRoundRect(0,0,180,80,10);
  playButton.x = 458;
  playButton.y = 925;

  var playLabel = new createjs.Text("PLAY", largeLabelStyle, pink);
  playLabel.textAlign = "center";
  playLabel.x = 548;
  playLabel.y = 940;

  sequenceBox.addChild(clearButton,clearLabel,testButton,testLabel,playButton,playLabel);

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

  actionsBox.addChild(transformLabel,rotateLabel,flipLabel);

  stage.addChild(sequenceBox,selectorsBox,logicBox,actionsBox);
  stage.update();

  // GENERATE BUTTONS

  function PlaceholderButton(x,y) {

    var button = new createjs.Shape();
    button.graphics.beginFill(gray);
    button.graphics.drawRoundRect(0,0,buttonSize,buttonSize,5);

    button.x = x;
    button.y = y;
    button.cache(0,0,buttonSize,buttonSize);

    return button;
  }

  function PositionButton(axisW,axisH,axisX,axisY,label,x,y) {

    var posButton = new createjs.Container();

    posButton.type = "position";
    posButton.addEventListener("mousedown",grabItem);
    posButton.addEventListener("pressmove",dragAndDrop);
    posButton.addEventListener("pressup",snapTo);
    posButton.originX = x;
    posButton.originY = y;
    posButton.originParent = selectors;

    var button = new createjs.Shape();
    button.graphics.beginFill(green);
    button.graphics.drawRoundRect(0,0,buttonSize,buttonSize,5);

    var axisShape = new createjs.Shape();
    axisShape.graphics.beginFill(darkGray);
    axisShape.graphics.drawRect(0,0,axisW,axisH);
    axisShape.x = axisX;
    axisShape.y = axisY;

    var axisLabel = new createjs.Text(label, lightLabelStyle, white);
    axisLabel.x = 65;
    axisLabel.y = 45;
    axisLabel.textAlign = "center";

    posButton.addChild(button,axisShape,axisLabel);
    posButton.x = x;
    posButton.y = y;
    posButton.cache(0,0,buttonSize,buttonSize);

    return posButton;
  }

  function ShapeButton(tl,tr,br,bl,x,y) {

    var shapeButton = new createjs.Container();

    shapeButton.type = "shape";
    shapeButton.addEventListener("mousedown",grabItem);
    shapeButton.addEventListener("pressmove",dragAndDrop);
    shapeButton.addEventListener("pressup",snapTo);
    shapeButton.originX = x;
    shapeButton.originY = y;
    shapeButton.originParent = selectors;

    var button = new createjs.Shape();
    button.graphics.beginFill(green);
    button.graphics.drawRoundRect(0,0,buttonSize,buttonSize,5);

    var TL = new createjs.Shape();
    var TR = new createjs.Shape();
    var BR = new createjs.Shape();
    var BL = new createjs.Shape();

    if (tl == 1) {
      TL.graphics.beginFill(lightGray);
      TL.graphics.drawRoundRectComplex(-iconRadius,-iconRadius,iconRadius,iconRadius,iconRadius,0,0,0);
    } else {
      TL.graphics.beginFill(darkGray);
      TL.graphics.drawRect(-iconRadius,-iconRadius,iconRadius,iconRadius);
    }

    if (tr == 1) {
      TR.graphics.beginFill(lightGray);
      TR.graphics.drawRoundRectComplex(0,-iconRadius,iconRadius,iconRadius,0,iconRadius,0,0);
    } else {
      TR.graphics.beginFill(darkGray);
      TR.graphics.drawRect(0,-iconRadius,iconRadius,iconRadius);
    }

    if (br == 1) {
      BR.graphics.beginFill(lightGray);
      BR.graphics.drawRoundRectComplex(0,0,iconRadius,iconRadius,0,0,iconRadius,0);
    } else {
      BR.graphics.beginFill(darkGray);
      BR.graphics.drawRect(0,0,iconRadius,iconRadius);
    }

    if (bl == 1) {
      BL.graphics.beginFill(lightGray);
      BL.graphics.drawRoundRectComplex(-iconRadius,0,iconRadius,iconRadius,0,0,0,iconRadius);
    } else {
      BL.graphics.beginFill(darkGray);
      BL.graphics.drawRect(-iconRadius,0,iconRadius,iconRadius);
    }

    TL.x = 65;
    TL.y = 65;
    TR.x = 65;
    TR.y = 65;
    BR.x = 65;
    BR.y = 65;
    BL.x = 65;
    BL.y = 65;

    shapeButton.addChild(button,TL,TR,BR,BL);
    shapeButton.x = x;
    shapeButton.y = y;
    shapeButton.cache(0,0,buttonSize,buttonSize);

    return shapeButton;

  }

  function LogicButton(label,x,y) {

    var logicButton = new createjs.Container();

    logicButton.type = "logic";
    logicButton.addEventListener("mousedown",grabItem);
    logicButton.addEventListener("pressmove",dragAndDrop);
    logicButton.addEventListener("pressup",snapTo);
    logicButton.originX = x;
    logicButton.originY = y;
    logicButton.originParent = logicBox;

    var button = new createjs.Shape();
    button.graphics.beginFill(blue);
    button.graphics.drawRoundRect(0,0,buttonSize,buttonSize,5);

    var logicLabel = new createjs.Text(label, mediumLabelStyle, white);
    logicLabel.x = 65;
    logicLabel.y = 45;
    logicLabel.textAlign = "center";

    logicButton.addChild(button,logicLabel);
    logicButton.x = x;
    logicButton.y = y;
    logicButton.cache(0,0,buttonSize,buttonSize);

    return logicButton;
  }

  function TransformButton(rX,rY,c1,c2,c3,c4,cX,cY,x,y) {

    var transformButton = new createjs.Container();
    transformButton.type = "action";
    transformButton.addEventListener("mousedown",grabItem);
    transformButton.addEventListener("pressmove",dragAndDrop);
    transformButton.addEventListener("pressup",snapTo);
    transformButton.originX = x;
    transformButton.originY = y;
    transformButton.originParent = actionsBox;

    var button = new createjs.Shape();
    button.graphics.beginFill(yellow);
    button.graphics.drawRoundRect(0,0,buttonSize,buttonSize,5);

    var rect = new createjs.Shape();
    rect.graphics.beginFill(black);
    rect.graphics.drawRect(0,0,iconRadius,iconRadius);
    rect.x = rX;
    rect.y = rY;

    var circle = new createjs.Shape();
    circle.graphics.beginFill(white);
    circle.graphics.drawRoundRectComplex(0,0,iconRadius,iconRadius,c1,c2,c3,c4);
    circle.x = cX;
    circle.y = cY;

    transformButton.addChild(button,rect,circle);
    transformButton.x = x;
    transformButton.y = y;
    transformButton.cache(0,0,buttonSize,buttonSize);

    return transformButton;
  }

  function RotateButton(type,dir,x,y) {

    var rotateButton = new createjs.Container();
    rotateButton.type = "action";
    rotateButton.addEventListener("mousedown",grabItem);
    rotateButton.addEventListener("pressmove",dragAndDrop);
    rotateButton.addEventListener("pressup",snapTo);
    rotateButton.originX = x;
    rotateButton.originY = y;
    rotateButton.originParent = actionsBox;

    var button = new createjs.Shape();
    button.graphics.beginFill(yellow);
    button.graphics.drawRoundRect(0,0,buttonSize,buttonSize,5);

    var arc = new createjs.Shape();
    arc.graphics.beginStroke(pink);
    arc.graphics.setStrokeStyle(16);

    var arrow = new createjs.Shape();
    arrow.graphics.beginFill(pink);

    if (type == 90) {
      if (dir == "cc") {
        arc.graphics.arc(56,94,40,270*(Math.PI/180),0);
        arrow.graphics.lineTo(26,56);
        arrow.graphics.lineTo(56,36);
        arrow.graphics.lineTo(56,76);
        
      } else {
        arc.graphics.arc(74,94,40,180*(Math.PI/180),270*(Math.PI/180));
        arrow.graphics.lineTo(104,56);
        arrow.graphics.lineTo(74,36);
        arrow.graphics.lineTo(74,76);
      }

    } else {
      if (dir == "cc") {
        arc.graphics.arc(65,68,26,180*(Math.PI/180),0);
        arrow.graphics.lineTo(39,98);
        arrow.graphics.lineTo(19,68);
        arrow.graphics.lineTo(59,68);
      } else {
        arc.graphics.arc(65,68,26,180*(Math.PI/180),0);
        arrow.graphics.lineTo(91,98);
        arrow.graphics.lineTo(71,68);
        arrow.graphics.lineTo(111,68);
      }

      arrow.graphics.closePath();

    }

    rotateButton.addChild(button,arc,arrow);
    rotateButton.x = x;
    rotateButton.y = y;
    rotateButton.cache(0,0,buttonSize,buttonSize);

    return rotateButton;
  }

  function FlipButton(a1,a2,a3,a4,a5,a6,b1,b2,b3,b4,b5,b6,x,y) {

    var flipButton = new createjs.Container();
    flipButton.type = "action";
    flipButton.addEventListener("mousedown",grabItem);
    flipButton.addEventListener("pressmove",dragAndDrop);
    flipButton.addEventListener("pressup",snapTo);
    flipButton.originX = x;
    flipButton.originY = y;
    flipButton.originParent = actionsBox;

    var button = new createjs.Shape();
    button.graphics.beginFill(yellow);
    button.graphics.drawRoundRect(0,0,buttonSize,buttonSize,5);

    var arrow1 = new createjs.Shape();
    arrow1.graphics.beginFill(darkGray);
    arrow1.graphics.lineTo(a1,a2);
    arrow1.graphics.lineTo(a3,a4);
    arrow1.graphics.lineTo(a5,a6);
    arrow1.graphics.closePath();

    var arrow2 = new createjs.Shape();
    arrow2.graphics.beginFill(pink);
    arrow2.graphics.lineTo(b1,b2);
    arrow2.graphics.lineTo(b3,b4);
    arrow2.graphics.lineTo(b5,b6);
    arrow2.graphics.closePath();

    flipButton.addChild(button,arrow1,arrow2);
    flipButton.x = x;
    flipButton.y = y;
    flipButton.cache(0,0,buttonSize,buttonSize);

    return flipButton;
  }
  
  // SELECTOR ITEMS

  var selectors = new createjs.Container;
  selectors.name = "selectorsInnerBox";

  // positions

  for (var i = 0; i < 4; i++) {
    
    var rowSelector = new PositionButton(100,30,15,50,i,34,16 + (buttonRow * (buttonSize + buttonMargin)));
    var placeholder = new PlaceholderButton(rowSelector.x,rowSelector.y);
    selectors.addChild(placeholder,rowSelector);

    var colSelector = new PositionButton(30,100,50,15,i,(34 + buttonSize + buttonMargin),16 + (buttonRow * (buttonSize + buttonMargin)));
    var placeholder = new PlaceholderButton(colSelector.x,colSelector.y);
    selectors.addChild(placeholder,colSelector);

    selectorsBox.addChild(selectors);
    buttonRow++;

    stage.update();

  }

  buttonRow = 1;

  // shapes

  var CCRR = [1,1,0,0]; shapeSelectors.push(CCRR);
  var RRCC = [0,0,1,1]; shapeSelectors.push(RRCC);
  var CRRC = [1,0,0,1]; shapeSelectors.push(CRRC);
  var RCCR = [0,1,1,0]; shapeSelectors.push(RCCR);
  var CRRR = [1,0,0,0]; shapeSelectors.push(CRRR);
  var RCRR = [0,1,0,0]; shapeSelectors.push(RCRR);
  var RRRC = [0,0,0,1]; shapeSelectors.push(RRRC);
  var RRCR = [0,0,1,0]; shapeSelectors.push(RRCR);
  var RCCC = [1,0,0,0]; shapeSelectors.push(RCCC);
  var CRCC = [0,1,0,0]; shapeSelectors.push(CRCC);
  var CCRC = [1,1,1,0]; shapeSelectors.push(CCRC);
  var CCCR = [1,1,0,1]; shapeSelectors.push(CCCR);
  var RCRC = [0,1,0,1]; shapeSelectors.push(RCRC);
  var CRCR = [1,0,1,0]; shapeSelectors.push(CRCR);

  for (var i = 0; i < 8; i++) { // update to random from shapeSelectors.length

    if (!(i % 2)) {
    var shapeSelector = new ShapeButton(shapeSelectors[i][0],shapeSelectors[i][1],shapeSelectors[i][2],shapeSelectors[i][3],372,(16 + (buttonRow * (buttonSize + buttonMargin))));
    } else {
    var shapeSelector = new ShapeButton(shapeSelectors[i][0],shapeSelectors[i][1],shapeSelectors[i][2],shapeSelectors[i][3],(372 + buttonSize + buttonMargin),(16 + (buttonRow * (buttonSize + buttonMargin))));
    buttonRow++;
    }

    var placeholder = new PlaceholderButton(shapeSelector.x,shapeSelector.y);
    selectors.addChild(placeholder,shapeSelector);
    selectorsBox.addChild(selectors);

    stage.update();

  }

  // LOGIC ITEMS

  var andLogic = new LogicButton("AND",34,106);
  var andPlaceholder = new PlaceholderButton(andLogic.x,andLogic.y);
  var orLogic = new LogicButton("OR",(34 + buttonSize + buttonMargin),106);
  var orPlaceholder = new PlaceholderButton(orLogic.x,orLogic.y);

  logicBox.addChild(andPlaceholder,orPlaceholder,andLogic,orLogic);
  stage.update();

  // ACTION ITEMS

  // transform buttons
  
  var transformTL = new TransformButton(50,50,iconRadius,0,0,0,35,35,34,(16 + buttonSize + buttonMargin));
  var placeholderTL = new PlaceholderButton(transformTL.x,transformTL.y);
  var transformTR = new TransformButton(35,50,0,iconRadius,0,0,50,35,(34 + buttonSize + buttonMargin),(16 + buttonSize + buttonMargin));
  var placeholderTR = new PlaceholderButton(transformTR.x,transformTR.y);
  var transformBR = new TransformButton(35,35,0,0,iconRadius,0,50,50,(34 + buttonSize + buttonMargin),(16 + (buttonSize*2) + (buttonMargin*2)));
  var placeholderBR = new PlaceholderButton(transformBR.x,transformBR.y);
  var transformBL = new TransformButton(50,35,0,0,0,iconRadius,35,50,34,(16 + (buttonSize*2) + (buttonMargin*2)));
  var placeholderBL = new PlaceholderButton(transformBL.x,transformBL.y);
  
  // rotate buttons

  var rotate90cc = new RotateButton(90,"cc",34,520);
  var placeholder90cc = new PlaceholderButton(rotate90cc.x,rotate90cc.y);
  var rotate90c = new RotateButton(90,"c",(34 + buttonSize + buttonMargin),520);
  var placeholder90c = new PlaceholderButton(rotate90c.x,rotate90c.y);
  var rotate180cc = new RotateButton(180,"cc",34,(520 + buttonSize + buttonMargin));
  var placeholder180cc = new PlaceholderButton(rotate180cc.x,rotate180cc.y);
  var rotate180c = new RotateButton(180,"c",(34 + buttonSize + buttonMargin),(520 + buttonSize + buttonMargin));
  var placeholder180c = new PlaceholderButton(rotate180c.x,rotate180c.y);

  // flip buttons

  var flipV = new FlipButton(40,30,90,30,65,60,65,70,40,100,90,100,34,886);
  var placeholderFlipV = new PlaceholderButton(flipV.x,flipV.y);
  var flipH = new FlipButton(30,40,30,90,60,65,70,65,100,40,100,90,(34 + buttonSize + buttonMargin),886);
  var placeholderFlipH = new PlaceholderButton(flipH.x,flipH.y);

  actionsBox.addChild(placeholderTL,placeholderTR,placeholderBR,placeholderBL,placeholder90cc,placeholder90c,placeholder180cc,placeholder180c,placeholderFlipV,placeholderFlipH);
  actionsBox.addChild(transformTL,transformTR,transformBR,transformBL,rotate90cc,rotate90c,rotate180cc,rotate180c,flipV,flipH);

  stage.update();


  // SEQUENCE TRAY

  // fill sequence array with null

  for (var i = 0; i < 15; i++) {
    sequence[i] = null;
  }

  for (var i = 0; i < 4; i++) {
    var sequenceTray = new createjs.Shape();
    sequenceTray.graphics.beginStroke(green).setStrokeStyle(8).beginFill(black);
    sequenceTray.graphics.drawRoundRect(0,0,442,150,5);
    sequenceTray.x = 36;
    sequenceTray.y = 122 + (i*200);

    sequenceBox.addChild(sequenceTray);
    sequenceTray.cache(-4,-4,450,158);
  }

  for (var i = 0; i < 4; i++) {
    var actionTray = new createjs.Shape();
    actionTray.graphics.beginStroke(yellow).setStrokeStyle(8).beginFill(black);
    actionTray.graphics.drawRoundRect(0,0,160,150,5);
    actionTray.x = 508;
    actionTray.y = 122 + (i*200);

    sequenceBox.addChild(actionTray);
    actionTray.cache(-4,-4,168,158);
  }

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

    createjs.Ticker.setPaused(false);

    positionLabel.color = green;
    shapeLabel.color = darkGray;
    stage.update();

    createjs.Tween.get(selectors, {override:true}).to({x:0}, 400, createjs.Ease.cubicOut).call(endTween);
  }
  
  function loadShapeButtons(event) {

    createjs.Ticker.setPaused(false);

    positionLabel.color = darkGray;
    shapeLabel.color = green;
    stage.update();

    createjs.Tween.get(selectors, {override:true}).to({x:-336}, 400, createjs.Ease.cubicOut).call(endTween);
  }

  function tick(event) {
    if (!event.paused) {
      stage.update(event);
    }
  }

  function endTween() {
    createjs.Ticker.setPaused(true);
  }

  // TOGGLE GAME OBJECTS

  function shapeClick(event) {

    if (event.target.round == false) {
      if (event.target.name == "TL") {
        event.target.graphics
        .clear()
        .beginFill(white)
        .drawRoundRectComplex(-radius,-radius,radius,radius,radius,0,0,0);
      } else if (event.target.name == "TR") {
        event.target.graphics
        .clear()
        .beginFill(white)
        .drawRoundRectComplex(0,-radius,radius,radius,0,radius,0,0);
      } else if (event.target.name == "BR") {
        event.target.graphics
        .clear()
        .beginFill(white)
        .drawRoundRectComplex(0,0,radius,radius,0,0,radius,0);
      } else {
        event.target.graphics
        .clear()
        .beginFill(white)
        .drawRoundRectComplex(-radius,0,radius,radius,0,0,0,radius);
      }
      event.target.round = true;
    } else {
      if (event.target.name == "TL") {
        event.target.graphics
        .clear()
        .beginFill(black)
        .drawRoundRectComplex(-radius,-radius,radius,radius,0,0,0,0);
      } else if (event.target.name == "TR") {
        event.target.graphics
        .clear()
        .beginFill(black)
        .drawRoundRectComplex(0,-radius,radius,radius,0,0,0,0);
      } else if (event.target.name == "BR") {
        event.target.graphics
        .clear()
        .beginFill(black)
        .drawRoundRectComplex(0,0,radius,radius,0,0,0,0);
      } else {
        event.target.graphics
        .clear()
        .beginFill(black)
        .drawRoundRectComplex(-radius,0,radius,radius,0,0,0,0);
      }
      event.target.round = false;
    }

  var wCount = 0;
  var bCount = 0;

  for (var i = 0; i < event.target.parent.children.length; i++) {
    if (event.target.parent.children[i].round == true) {
      wCount++;
    } else {
      bCount++;
    }
  } 

  if (wCount == 4) {
    wScore++;
    whiteScore.text = wScore;
  } else if (bCount == 4) {
    bScore++;
    blackScore.text = bScore;
  }

  stage.update();

  }

  // UTILITIES

  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}