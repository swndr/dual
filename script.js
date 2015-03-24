
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
  var purple = "#A106D0";

  var radius = 75;
  var iconRadius = 40;
  var buttonSize = 130;
  var buttonRow = 1;
  var buttonMargin = 8;

  var dropPosition = null;

  var sequence = [];
  var playCount = 0;

  var positionSelectors = [];
  var shapeSelectors = [];
  var setOfShapes = [];
  var andCount = 4;
  var orCount = 4;

  var objectsInPlay = [];

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
  bg.graphics.rect(0,0,canvas.width,890);

  // BUILD GRID

  var grid = new createjs.Shape();

    var gridSize = 4;
    var gridSpacing = 180;
    var gridLeft = ((canvas.width - ((gridSize-1) * gridSpacing))/2);
    var gridTop = ((890 - ((gridSize-1) * gridSpacing))/2);

    grid.graphics.beginStroke(white);
    grid.graphics.setStrokeStyle(2);
    grid.alpha = .2;
    
    for (var i = 0; i < gridSize; i++) {
      grid.graphics.moveTo(gridLeft+(i*gridSpacing),0);
      grid.graphics.lineTo(gridLeft+(i*gridSpacing),890);
      grid.graphics.moveTo(0,(gridTop+(i*gridSpacing)));
      grid.graphics.lineTo(canvas.width,(gridTop+(i*gridSpacing)));
    }

  stage.addChild(bg);
  bg.cache(0,0,canvas.width,890);
  stage.addChild(grid);
  grid.cache(0,0,canvas.width,890);

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

  var whiteIcon = new createjs.Shape().set({x:80,y:445});
  whiteIcon.graphics.beginFill(white).drawCircle(0,0,iconRadius,iconRadius);
  var whiteScore = new createjs.Text(wScore, largeLabelStyle, white).set({x:140,y:425});
  whiteScore.textAlign = "left";
  var blackIcon = new createjs.Shape().set({x:(canvas.width - iconRadius - 80),y:(445 - iconRadius)});
  blackIcon.graphics.beginFill(black).drawRect(0,0,iconRadius*2,iconRadius*2);
  var blackScore = new createjs.Text(bScore, largeLabelStyle, black).set({x:(canvas.width - 140),y:425});
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
      gameObject.tl = 1;
      TL.graphics.beginFill(white);
      TL.graphics.drawRoundRectComplex(-radius,-radius,radius,radius,radius,0,0,0);
      TL.round = true;
      TL.name = "TL";
    } else {
      gameObject.tl = 0;
      TL.graphics.beginFill(black);
      TL.graphics.drawRoundRectComplex(-radius,-radius,radius,radius,0,0,0,0);
      TL.round = false;
      TL.name = "TL";
    }

    if (tr == 1) {
      gameObject.tr = 1;
      TR.graphics.beginFill(white);
      TR.graphics.drawRoundRectComplex(0,-radius,radius,radius,0,radius,0,0);
      TR.round = true;
      TR.name = "TR";
    } else {
      gameObject.tr = 0;
      TR.graphics.beginFill(black);
      TR.graphics.drawRoundRectComplex(0,-radius,radius,radius,0,0,0,0);
      TR.round = false;
      TR.name = "TR";
    }

    if (br == 1) {
      gameObject.br = 1;
      BR.graphics.beginFill(white);
      BR.graphics.drawRoundRectComplex(0,0,radius,radius,0,0,radius,0);
      BR.round = true;
      BR.name = "BR";
    } else {
      gameObject.br = 0;
      BR.graphics.beginFill(black);
      BR.graphics.drawRoundRectComplex(0,0,radius,radius,0,0,0,0);
      BR.round = false;
      BR.name = "BR";
    }

    if (bl == 1) {
      gameObject.bl = 1;
      BL.graphics.beginFill(white);
      BL.graphics.drawRoundRectComplex(-radius,0,radius,radius,0,0,0,radius);
      BL.round = true;
      BL.name = "BL";
    } else {
      gameObject.bl = 0;
      BL.graphics.beginFill(black);
      BL.graphics.drawRoundRectComplex(-radius,0,radius,radius,0,0,0,0);
      BL.round = false;
      BL.name = "BL";
    }

    gameObject.addChild(TL,TR,BR,BL);

    return gameObject;

  }

  // ADD START OBJECTS TO BOARD

  var row = 0;
  var column = 0;

  var startObjects = shuffle([[0,0,1,1],[0,0,1,1],[0,1,1,0],[0,1,1,0],[1,1,0,0],[1,1,0,0],[1,0,0,1],[1,0,0,1],[1,0,1,1],[0,1,1,1],[0,1,0,0],[1,0,0,0],[1,0,1,0],[1,0,1,0],[0,1,0,1],[0,1,0,1]]);

  for (var i = 0; i < (gridSize*gridSize); i++) {

    if (i/(row+1) == gridSize) { row++; column = 0; }

    var fourm = new GameObject(startObjects[i][0],startObjects[i][1],startObjects[i][2],startObjects[i][3]);
    fourm.x = colVal(column);
    fourm.y = rowVal(row);
    fourm.id = i;

    objectsInPlay.push(fourm);
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
    if (bgColor == white) { bg.alpha = .7; }

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

  var selectorsBox = new Box(40,920,336,1054,white,green,"SELECTORS");
  var sequenceBox = new Box(416,920,704,1054,"#616060",black,"SEQUENCE");
  var actionsBox = new Box(1160,920,336,1054,white,yellow,"ACTIONS","actionsBox");

  var selectorsMask = new createjs.Shape();
  selectorsMask.graphics.beginFill(white).drawRoundRect(40,920,336,1054,10);
  selectorsBox.mask = selectorsMask;

  var positionLabel = new createjs.Text("POSITION", mediumLabelStyle, green).set({x:168,y:96});
  positionLabel.textAlign = "center";

  var shapeLabel = new createjs.Text("SHAPE", mediumLabelStyle, green).set({x:168,y:452});
  shapeLabel.textAlign = "center";

  var logicLabel = new createjs.Text("LOGIC", mediumLabelStyle, blue).set({x:168,y:820});
  logicLabel.textAlign = "center";

  var andCountLabel = new createjs.Text(andCount, "bold 25px AvenirHeavy", blue).set({x:99,y:1010});
  andCountLabel.textAlign = "center";

  var orCountLabel = new createjs.Text(andCount, "bold 25px AvenirHeavy", blue).set({x:237,y:1010});
  orCountLabel.textAlign = "center";

  selectorsBox.addChild(positionLabel,shapeLabel,logicLabel,andCountLabel,orCountLabel);

  var clearButton = new createjs.Shape().set({x:56,y:910});
  clearButton.graphics.beginFill("#616060").drawRect(0,0,200,100);
  clearButton.addEventListener("click",clearSequence);
  var clearLabel = new createjs.Text("CLEAR", largeLabelStyle, lightGray).set({x:156,y:940});
  clearLabel.textAlign = "center";

  var testButton = new createjs.Shape().set({x:252,y:910});
  testButton.graphics.beginFill("#616060").drawRect(0,0,200,100);
  var testLabel = new createjs.Text("TEST", largeLabelStyle, white).set({x:352,y:940});
  testLabel.textAlign = "center";

  var playButton = new createjs.Shape().set({x:458,y:925});
  playButton.graphics.beginFill(gray).drawRoundRect(0,0,180,80,10);
  playButton.addEventListener("click",play);
  var playLabel = new createjs.Text("PLAY", largeLabelStyle, pink).set({x:548,y:940});
  playLabel.textAlign = "center";

  sequenceBox.addChild(clearButton,clearLabel,testButton,testLabel,playButton,playLabel);

  var transformLabel = new createjs.Text("TRANSFORM", mediumLabelStyle, yellow).set({x:168,y:96});
  transformLabel.textAlign = "center";

  var rotateLabel = new createjs.Text("ROTATE", mediumLabelStyle, yellow).set({x:168,y:452});
  rotateLabel.textAlign = "center";

  var flipLabel = new createjs.Text("FLIP", mediumLabelStyle, yellow).set({x:168,y:820});
  flipLabel.textAlign = "center";

  actionsBox.addChild(transformLabel,rotateLabel,flipLabel);

  stage.addChild(sequenceBox,selectorsBox,actionsBox);
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

  function PositionButton(axis,axisW,axisH,axisX,axisY,label,x,y) {

    var posButton = new createjs.Container();

    posButton.type = "position";
    posButton.addEventListener("mousedown",grabItem);
    posButton.addEventListener("pressmove",dragAndDrop);
    posButton.addEventListener("pressup",snapTo);
    posButton.originX = x;
    posButton.originY = y;
    posButton.originParent = selectorsBox;

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
    posButton.name = axis;
    posButton.val = label;
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
    shapeButton.originParent = selectorsBox;

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
    shapeButton.val = [tl,tr,br,bl];
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
    logicButton.originParent = selectorsBox;

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
    logicButton.name = label;
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

  // positions

  for (var i = 0; i < 4; i++) {
    
    var rowSelector = new PositionButton("row",100,30,15,50,i,34,0);
    positionSelectors.push(rowSelector);
    var colSelector = new PositionButton("col",30,100,50,15,i,(34 + buttonSize + buttonMargin),0);
    positionSelectors.push(colSelector);

  }

  var shuffledPositionSelectors = shuffle(positionSelectors); // randomize shape selectors

  for (var i = 0; i < 4; i++) { // load first 4 from randomized array
    
    if (!(i % 2)) {
      shuffledPositionSelectors[i].x = 34;
      shuffledPositionSelectors[i].y = 16 + (buttonRow * (buttonSize + buttonMargin));
      shuffledPositionSelectors[i].originX = shuffledPositionSelectors[i].x
      shuffledPositionSelectors[i].originY = shuffledPositionSelectors[i].y
    } else {
      shuffledPositionSelectors[i].x = (34 + buttonSize + buttonMargin);
      shuffledPositionSelectors[i].y = 16 + (buttonRow * (buttonSize + buttonMargin));
      shuffledPositionSelectors[i].originX = shuffledPositionSelectors[i].x
      shuffledPositionSelectors[i].originY = shuffledPositionSelectors[i].y
      buttonRow++;
    }

    var placeholder = new PlaceholderButton(shuffledPositionSelectors[i].x,shuffledPositionSelectors[i].y);
    selectorsBox.addChild(placeholder,shuffledPositionSelectors[i]);

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
  var RRCR = [0,0,1,0]; shapeSelectors.push(RRCR);
  var RRRC = [0,0,0,1]; shapeSelectors.push(RRRC);

  var RCCC = [0,1,1,1]; shapeSelectors.push(RCCC);
  var CRCC = [1,0,1,1]; shapeSelectors.push(CRCC);
  var CCRC = [1,1,0,1]; shapeSelectors.push(CCRC);
  var CCCR = [1,1,1,0]; shapeSelectors.push(CCCR);

  var RCRC = [0,1,0,1]; shapeSelectors.push(RCRC);
  var CRCR = [1,0,1,0]; shapeSelectors.push(CRCR);

  setOfShapes.push(shapeSelectors[getRandomInt(0, 3)]);
  setOfShapes.push(shapeSelectors[getRandomInt(4, 7)]);
  setOfShapes.push(shapeSelectors[getRandomInt(8, 11)]);
  setOfShapes.push(shapeSelectors[getRandomInt(12, 13)]);

  var shuffledShapeSelectors = shuffle(setOfShapes); // randomize shape selectors

  for (var i = 0; i < 4; i++) { // load first 4 from randomized array

    if (!(i % 2)) {
    var shapeSelector = new ShapeButton(shuffledShapeSelectors[i][0],shuffledShapeSelectors[i][1],shuffledShapeSelectors[i][2],shuffledShapeSelectors[i][3],34,(372 + (buttonRow * (buttonSize + buttonMargin))));
    } else {
    var shapeSelector = new ShapeButton(shuffledShapeSelectors[i][0],shuffledShapeSelectors[i][1],shuffledShapeSelectors[i][2],shuffledShapeSelectors[i][3],(34 + buttonSize + buttonMargin),(372 + (buttonRow * (buttonSize + buttonMargin))));
    //shapeSelector.name = "shape" + i;
    buttonRow++;
    }

    var placeholder = new PlaceholderButton(shapeSelector.x,shapeSelector.y);
    selectorsBox.addChild(placeholder,shapeSelector);

    stage.update();

  }

  // LOGIC ITEMS

  var andPlaceholder = new PlaceholderButton(34,876);
  var orPlaceholder = new PlaceholderButton((34 + buttonSize + buttonMargin),876);
  selectorsBox.addChild(andPlaceholder,orPlaceholder);

  for (var i = 0; i < 4; i++) {
      var andLogic = new LogicButton("AND",34,876);
      var orLogic = new LogicButton("OR",(34 + buttonSize + buttonMargin),876);
      selectorsBox.addChild(andLogic,orLogic);
  }

  stage.update();

  // ACTION ITEMS

  // transform buttons
  
  var transformTL = new TransformButton(50,50,iconRadius,0,0,0,35,35,34,(16 + buttonSize + buttonMargin));
  transformTL.name = "transTL";
  transformTL.func = transTL;
  var placeholderTL = new PlaceholderButton(transformTL.x,transformTL.y);
  var transformTR = new TransformButton(35,50,0,iconRadius,0,0,50,35,(34 + buttonSize + buttonMargin),(16 + buttonSize + buttonMargin));
  transformTR.name = "transTR";
  transformTR.func = transTR;
  var placeholderTR = new PlaceholderButton(transformTR.x,transformTR.y);
  var transformBR = new TransformButton(35,35,0,0,iconRadius,0,50,50,(34 + buttonSize + buttonMargin),(16 + (buttonSize*2) + (buttonMargin*2)));
  transformBR.name = "transBR";
  transformBR.func = transBR;
  var placeholderBR = new PlaceholderButton(transformBR.x,transformBR.y);
  var transformBL = new TransformButton(50,35,0,0,0,iconRadius,35,50,34,(16 + (buttonSize*2) + (buttonMargin*2)));
  transformBL.name = "transBL";
  transformBL.func = transBL;
  var placeholderBL = new PlaceholderButton(transformBL.x,transformBL.y);
  
  // rotate buttons

  var rotate90cc = new RotateButton(90,"cc",34,510);
  rotate90cc.name = "r90cc";
  var placeholder90cc = new PlaceholderButton(rotate90cc.x,rotate90cc.y);
  var rotate90c = new RotateButton(90,"c",(34 + buttonSize + buttonMargin),510);
  rotate90c.name = "r90c";
  var placeholder90c = new PlaceholderButton(rotate90c.x,rotate90c.y);
  var rotate180cc = new RotateButton(180,"cc",34,(510 + buttonSize + buttonMargin));
  rotate180cc.name = "r180cc";
  var placeholder180cc = new PlaceholderButton(rotate180cc.x,rotate180cc.y);
  var rotate180c = new RotateButton(180,"c",(34 + buttonSize + buttonMargin),(510 + buttonSize + buttonMargin));
  rotate180c.name = "r180c";
  var placeholder180c = new PlaceholderButton(rotate180c.x,rotate180c.y);

  // flip buttons

  var flipV = new FlipButton(40,30,90,30,65,60,65,70,40,100,90,100,34,876);
  flipV.name = "fV";
  var placeholderFlipV = new PlaceholderButton(flipV.x,flipV.y);
  var flipH = new FlipButton(30,40,30,90,60,65,70,65,100,40,100,90,(34 + buttonSize + buttonMargin),876);
  flipH.name = "fH";
  var placeholderFlipH = new PlaceholderButton(flipH.x,flipH.y);

  actionsBox.addChild(placeholderTL,placeholderTR,placeholderBR,placeholderBL,placeholder90cc,placeholder90c,placeholder180cc,placeholder180c,placeholderFlipV,placeholderFlipH);
  actionsBox.addChild(transformTL,transformTR,transformBR,transformBL,rotate90cc,rotate90c,rotate180cc,rotate180c,flipV,flipH);

  stage.update();


  // SEQUENCE TRAY

  // fill sequence array with null

  for (var i = 0; i < 15; i++) {
    sequence[i] = null;
  }

  var trays = new createjs.Container();

  for (var i = 0; i < 8; i++) {

    if (!(i % 2)) {
      var sequenceTray = new createjs.Shape();
      sequenceTray.graphics.beginStroke(green).setStrokeStyle(8).beginFill(black);
      sequenceTray.graphics.drawRoundRect(0,0,442,154,5);
      sequenceTray.x = 36;
      sequenceTray.y = 120 + ((i/2)*200);
      sequenceTray.tray = i;
      sequenceTray.type = "selectors";

      trays.addChild(sequenceTray);
      sequenceTray.cache(-4,-4,450,162);
    
  } else {

    var actionTray = new createjs.Shape();
    actionTray.graphics.beginStroke(yellow).setStrokeStyle(8).beginFill(black);
    actionTray.graphics.drawRoundRect(0,0,160,154,5);
    actionTray.x = 508;
    actionTray.y = 20 + (i*100);
    actionTray.tray = i;
    actionTray.type = "action";

    trays.addChild(actionTray);
    actionTray.cache(-4,-4,168,162);

    }
  }

  var dropZoneRow = 1;
  var dropZoneContainer = new createjs.Container();

  for (var i = 0; i < 16; i++) {

    var dropZone = new createjs.Shape();

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

    dropZone.slot = i; // to determine which slot items dropped in
    dropZoneContainer.addChild(dropZone);
  }

  sequenceBox.addChild(trays,dropZoneContainer);
  stage.update();

  // INTERACTION

  function grabItem(event) {

    // re-opening sequence slot

    if (event.currentTarget.parent == sequenceBox) {
        sequence[event.currentTarget.inSlot] = null;
        event.currentTarget.inSlot = false;
      } else {
          if (event.currentTarget.name == "AND") {
            andCount--;
            andCountLabel.text = andCount;
        } else if (event.currentTarget.name == "OR") {
            orCount--;
            orCountLabel.text = orCount;
         }
      }

    // translate local to global, re-parent to stage

      var pt = event.currentTarget.localToGlobal(event.currentTarget.x,event.currentTarget.y);
      event.currentTarget.x = (pt.x - event.currentTarget.x);
      event.currentTarget.y = (pt.y - event.currentTarget.y);
      stage.addChild(event.currentTarget);

    // slot highlighting

    if (event.currentTarget.type == "logic") {

      for (var i = 0; i < dropZoneContainer.children.length; i++) {
        if (dropZoneContainer.children[i].slot == 1 || dropZoneContainer.children[i].slot == 5 || dropZoneContainer.children[i].slot == 9 || dropZoneContainer.children[i].slot == 13) {
          dropZoneContainer.children[i].alpha = .5;
        }
      }

    } else if (event.currentTarget.type == "action") {

      for (var i = 0; i < dropZoneContainer.children.length; i++) {
        if (dropZoneContainer.children[i].slot == 3 || dropZoneContainer.children[i].slot == 7 || dropZoneContainer.children[i].slot == 11 || dropZoneContainer.children[i].slot == 15) {
          dropZoneContainer.children[i].alpha = .5;
        }
      }
    
    } else {

      for (var i = 0; i < dropZoneContainer.children.length; i++) {
        if ((dropZoneContainer.children[i].slot % 2) == 0) {
          dropZoneContainer.children[i].alpha = .5;
        }
      }      
    }

    stage.update();
  }

  function dragAndDrop(event) {

    event.currentTarget.set({
      x: event.stageX-65,
      y: event.stageY-65
    });
   
    stage.update();

  }

  function snapTo(event) {

    var pt = dropZoneContainer.globalToLocal(event.stageX,event.stageY);

    // determine if dragged over a sequence slot, record which one

    for (var i = 0; i < dropZoneContainer.getObjectsUnderPoint(pt.x,pt.y,0).length; i++) {
      if (dropZoneContainer.getObjectsUnderPoint(pt.x,pt.y,0)[i].slot != null) {
      dropPosition = dropZoneContainer.getObjectsUnderPoint(pt.x,pt.y,0)[i];
      }
    }

    // if slot is open, drop in (otherwise return to item's original position)

    if (dropPosition != null && sequence[dropPosition.slot] == null) {
      addToSlot(event.currentTarget,dropPosition);
    } else {
      returnToOrigin(event.currentTarget,event.currentTarget.originParent,event.currentTarget.originX,event.currentTarget.originY);
    } 

    // unhighlight slots

    for (var i = 0; i < dropZoneContainer.children.length; i++) {
      if (dropZoneContainer.children[i].slot != null) {
        dropZoneContainer.children[i].alpha = .25;
      }
    }

    stage.update();
    dropPosition = null;

  
  }

  function addToSlot(item,pos) {

    if (item.type == "position" || item.type == "shape") {

      if (pos.slot % 2 == 0) { 
        sequenceBox.addChild(item);
        item.x = pos.x; 
        item.y = pos.y;
        item.inSlot = pos.slot;
        sequence[pos.slot] = item;
      } else { 
        returnToOrigin(item,item.originParent,item.originX,item.originY); 
      }

    } else if (item.type == "logic") {

      if (pos.slot == 1 || pos.slot == 5 || pos.slot == 9 || pos.slot == 13) { 
        sequenceBox.addChild(item);
        item.x = pos.x; 
        item.y = pos.y; 
        item.inSlot = pos.slot;
        sequence[pos.slot] = item;
      } else { 
        returnToOrigin(item,item.originParent,item.originX,item.originY); 
      }

    } else {

      if (pos.slot == 3 || pos.slot == 7 || pos.slot == 11 || pos.slot == 15) { 
        sequenceBox.addChild(item);
        item.x = pos.x; 
        item.y = pos.y; 
        item.inSlot = pos.slot;
        sequence[pos.slot] = item;
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
    item.inSlot = false;

    if (item.name == "AND") {
      andCount++;
      andCountLabel.text = andCount;
    } else if (item.name == "OR") {
      orCount++;
      orCountLabel.text = orCount;
    }

    stage.update();

  }

  function clearSequence() {

    var toClear = [];

    for (var i = 0; i < sequenceBox.children.length; i++) {
      if (sequenceBox.children[i].type != null) {
        toClear.push(sequenceBox.children[i]);
      }
    }

    for (var i = 0; i < toClear.length; i++) {
      returnToOrigin(toClear[i],toClear[i].originParent,toClear[i].originX,toClear[i].originY);
    }

    for (var i = 0; i < sequence.length; i++) {
      sequence[i] = null;
    }

    for (var i = 0; i < trays.children.length; i++) {
        if (trays.children[i].type == "selectors") {
          trays.children[i].graphics
          .clear()
          .beginStroke(green).setStrokeStyle(8).beginFill(black)
          .drawRoundRect(0,0,442,154,5);
          trays.children[i].updateCache();
       } else {
          trays.children[i].graphics
          .clear()
          .beginStroke(yellow).setStrokeStyle(8).beginFill(black)
          .drawRoundRect(0,0,160,154,5);
          trays.children[i].updateCache();
        }
    }

    playCount = 0;
    stage.update();
  }

  function tick(event) {
    if (!event.paused) {
      stage.update(event);
    }
  }

  function endTween() {
    createjs.Ticker.setPaused(true);
  }

  // PLAY SEQUENCE

  function play() {

    highlightSequenceBox(playCount);

    if (!(playCount % 2)) {
      targetGameObjects(playCount);
      console.log("target " + playCount);
    } else {
      deliverAction(targetGameObjects(playCount-1),playCount);
      console.log("action " + playCount);
    }

    updateScores();

    if (playCount < 7) { playCount++ };

  }


  function highlightSequenceBox(step) {

      for (var i = 0; i < trays.children.length; i++) {
          if (trays.children[i].tray == step) {
            if (trays.children[i].type == "selectors") {
              trays.children[i].graphics
              .clear()
              .beginStroke(pink).setStrokeStyle(8).beginFill(black)
              .drawRoundRect(0,0,442,154,5);
              trays.children[i].updateCache();
           } else {
              trays.children[i].graphics
              .clear()
              .beginStroke(pink).setStrokeStyle(8).beginFill(black)
              .drawRoundRect(0,0,160,154,5);
              trays.children[i].updateCache();
            }
          }
        }

    stage.update();

  }

  function targetGameObjects(step) {

    var ruleSet = [];
    var targets = [];

    // get items from trays

    if (step == 0) {

      for (var i = 0; i < 3; i++) {
        if (sequence[i] != null) {
        var rule = extractRule(sequence[i]);
        ruleSet.push(rule);
        }
      }

    } else if (step == 2) {

      for (var i = 4; i < 7; i++) {
        if (sequence[i] != null) {
        var rule = extractRule(sequence[i]);
        ruleSet.push(rule);
        }
      }

    } else if (step == 4) {

      for (var i = 8; i < 11; i++) {
        if (sequence[i] != null) {
        var rule = extractRule(sequence[i]);
        ruleSet.push(rule);
        }
      }

    } else if (step == 6) {

      for (var i = 12; i < 15; i++) {
        if (sequence[i] != null) {
        var rule = extractRule(sequence[i]);
        ruleSet.push(rule);
        }
      }
    }

    // loop through objects and test for matches

    for (i in objectsInPlay) {

      if (ruleSet.length == 3) {

        if (ruleSet[1](ruleSet[0](objectsInPlay[i]),ruleSet[2](objectsInPlay[i]))) {
          targets.push(objectsInPlay[i]);
        }
   
      } else if (ruleSet.length == 1) {

        if (ruleSet[0](objectsInPlay[i])) {
          targets.push(objectsInPlay[i]);
        }

      } else {
        console.log("Incomplete rule set");
      }
    }

    console.log(targets);

    return targets;

  }

  // build consistent functions to test game objects for matches

  function extractRule(rule) {

    var ruleComponents;

    if (rule.type == "position") {

      if (rule.name == "col") {
        ruleComponents = function(obj) {
          if (obj.x == colVal(rule.val)) {return true;}
        }
      } else {
        ruleComponents = function(obj) {
        if (obj.y == rowVal(rule.val)) {return true;}
        }
      }

    } else if (rule.type == "shape") {

        ruleComponents = function(obj) {
          var shape = [obj.tl,obj.tr,obj.br,obj.bl];
          if (arraysEqual(shape,rule.val)) {return true;}
        }

    } else if (rule.type == "logic") {

        if (rule.name == "AND") {
          ruleComponents = function(a,b) {if (a && b) {return true;}}
        } else {
          ruleComponents = function(a,b) {if (a || b) {return true;}}
        }
    }

    return ruleComponents;

  }
  


  function deliverAction(targets,step) {

    for (i in targets) {
      if (step == 1) {
        sequence[3].func(targets[i]);
      } else if (step == 3) {
        sequence[7].func(targets[i]);
      } else if (step == 5) {
        sequence[11].func(targets[i]);
      } else {
        sequence[15].func(targets[i]);
      }
    }
  }



  function transTL(obj) {

    //createjs.Ticker.setPaused(false); 

    var o = obj.getChildByName("TL");

     if (obj.tl == 0) {
        o.graphics
        .clear()
        .beginFill(white)
        .drawRoundRectComplex(-radius,-radius,radius,radius,radius,0,0,0);
        obj.tl = 1;
      } else {
        o.graphics
        .clear()
        .beginFill(black)
        .drawRoundRectComplex(-radius,-radius,radius,radius,0,0,0,0);
        obj.tl = 0;
      }

      stage.update();

      //createjs.Tween.get(o, {override:true}).to({scaleX:0.8,scaleY:0.8}, 100, createjs.Ease.cubicIn).to({scaleX:1,scaleY:1}, 200, createjs.Ease.cubicOut).call(endTween);
  }

  function transTR(obj) {

    //createjs.Ticker.setPaused(false); 

    var o = obj.getChildByName("TR");

     if (obj.tr == 0) {
        o.graphics
        .clear()
        .beginFill(white)
        .drawRoundRectComplex(0,-radius,radius,radius,0,radius,0,0);
        obj.tr = 1;
      } else {
        o.graphics
        .clear()
        .beginFill(black)
        .drawRoundRectComplex(0,-radius,radius,radius,0,0,0,0);
        obj.tr = 0;
      }

      stage.update();

      //createjs.Tween.get(o, {override:true}).to({scaleX:0.8,scaleY:0.8}, 100, createjs.Ease.cubicIn).to({scaleX:1,scaleY:1}, 200, createjs.Ease.cubicOut).call(endTween);
  }

  function transBR(obj) {

    //createjs.Ticker.setPaused(false); 

    var o = obj.getChildByName("BR");

     if (obj.br == 0) {
        o.graphics
        .clear()
        .beginFill(white)
        .drawRoundRectComplex(0,0,radius,radius,0,0,radius,0);
        obj.br = 1;
      } else {
        o.graphics
        .clear()
        .beginFill(black)
        .drawRoundRectComplex(0,0,radius,radius,0,0,0,0);
        obj.br = 0;
      }

      stage.update();

      //createjs.Tween.get(o, {override:true}).to({scaleX:0.8,scaleY:0.8}, 100, createjs.Ease.cubicIn).to({scaleX:1,scaleY:1}, 200, createjs.Ease.cubicOut).call(endTween);
  }

  function transBL(obj) {

    //createjs.Ticker.setPaused(false); 

    var o = obj.getChildByName("BL");

     if (obj.bl == 0) {
        o.graphics
        .clear()
        .beginFill(white)
        .drawRoundRectComplex(-radius,0,radius,radius,0,0,0,radius);
        obj.bl = 1;
      } else {
        o.graphics
        .clear()
        .beginFill(black)
        .drawRoundRectComplex(-radius,0,radius,radius,0,0,0,0);
        obj.bl = 0;
      }

      stage.update();

      //createjs.Tween.get(o, {override:true}).to({scaleX:0.8,scaleY:0.8}, 100, createjs.Ease.cubicIn).to({scaleX:1,scaleY:1}, 200, createjs.Ease.cubicOut).call(endTween);
  }


  // SCORES

  function updateScores() {

  var wScore = 0;
  var bScore = 0;

  for (var i = 0; i < objectsInPlay.length; i++) {
    if (objectsInPlay[i].tl == 0 && objectsInPlay[i].tr == 0 && objectsInPlay[i].br == 0 && objectsInPlay[i].bl == 0) {
      bScore++;
    } else if (objectsInPlay[i].tl == 1 && objectsInPlay[i].tr == 1 && objectsInPlay[i].br == 1 && objectsInPlay[i].bl == 1) {
      wScore++;
    }
  } 
    blackScore.text = bScore;
    whiteScore.text = wScore;
    stage.update();

  } 


/*
  // TOGGLE GAME OBJECTS

  function shapeClick(event) {

    // transform corners

    createjs.Ticker.setPaused(false);

    if (event.target.round == false) {

      if (event.target.name == "TL") {
        event.target.graphics
        .clear()
        .beginFill(white)
        .drawRoundRectComplex(-radius,-radius,radius,radius,radius,0,0,0);
        stage.update();
        event.target.parent.tl = 1;
      } else if (event.target.name == "TR") {
        event.target.graphics
        .clear()
        .beginFill(white)
        .drawRoundRectComplex(0,-radius,radius,radius,0,radius,0,0);
        event.target.parent.tr = 1;
      } else if (event.target.name == "BR") {
        event.target.graphics
        .clear()
        .beginFill(white)
        .drawRoundRectComplex(0,0,radius,radius,0,0,radius,0);
        event.target.parent.br = 1;
      } else {
        event.target.graphics
        .clear()
        .beginFill(white)
        .drawRoundRectComplex(-radius,0,radius,radius,0,0,0,radius);
        event.target.parent.bl = 1;
      }
      console.log(event.target.parent);
      event.target.round = true;
    } else {
      if (event.target.name == "TL") {
        event.target.graphics
        .clear()
        .beginFill(black)
        .drawRoundRectComplex(-radius,-radius,radius,radius,0,0,0,0);
        event.target.parent.tl = 0;
      } else if (event.target.name == "TR") {
        event.target.graphics
        .clear()
        .beginFill(black)
        .drawRoundRectComplex(0,-radius,radius,radius,0,0,0,0);
        event.target.parent.tr = 0;
      } else if (event.target.name == "BR") {
        event.target.graphics
        .clear()
        .beginFill(black)
        .drawRoundRectComplex(0,0,radius,radius,0,0,0,0);
        event.target.parent.br = 0;
      } else {
        event.target.graphics
        .clear()
        .beginFill(black)
        .drawRoundRectComplex(-radius,0,radius,radius,0,0,0,0);
        event.target.parent.bl = 0;
      }
      event.target.round = false;
      console.log(event.target.parent);
    }

  // update scores

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

  createjs.Tween.get(event.target, {override:true}).to({scaleX:0.8,scaleY:0.8}, 100, createjs.Ease.cubicIn).to({scaleX:1,scaleY:1}, 200, createjs.Ease.cubicOut).call(endTween);

  }
  */

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

  function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}