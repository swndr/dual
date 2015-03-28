
function init() {

  var canvas = document.getElementById("easel"),
  centerX = canvas.width/2,
  centerY = canvas.height/2;

  var lightLabelStyle = "100 30px Avenir-Book";
  var mediumLabelStyle =  "bold 30px Avenir-Heavy";
  var largeLabelStyle =  "bold 40px Avenir-Heavy";
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
  var buttonRow = 0;
  var buttonMargin = 8;
  var spawnOffset = 13;

  var dropPosition = null;

  var sequence = [];
  var playCount = 0;
  var playReady = false;

  var rowSelectors = [];
  var colSelectors = [];
  var shapeSelectors = [];
  var shuffledRowSelectors;
  var shuffledColSelectors;
  var shuffledShapeSelectors;
  var shuffledSelectors = [];
  var selectorsP1 = [];
  var selectorsP2 = [];

  var animateDuration;
  var elasticOriginX;
  var elasticOriginY;
  var elasticRotation;

  var andCount = 4;
  var orCount = 4;

  var objectsInPlay = [];

  var wScore = 0;
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
        var hLabel = new createjs.Text(i, lightLabelStyle, pink);
        hLabel.x = (gridLeft-8) + (i*gridSpacing);
        hLabel.y = gridTop - 150;
        hLabel.alpha = .5;
      var vLabel = new createjs.Text(i, lightLabelStyle, pink);
        vLabel.x = gridLeft - 150;
        vLabel.y = (gridTop-18) + (i*gridSpacing);
        vLabel.alpha = .5;
      stage.addChild(hLabel);
      stage.addChild(vLabel);
    }

  stage.update();

  // GAME MGMT & SCORES

  var newGameButton = new createjs.Shape().set({x:60,y:35});
  newGameButton.graphics.beginFill("#AAA5A5").drawRect(0,0,300,100);
  newGameButton.addEventListener("click",newGame);
  newGameButton.name = "new";
  var newGameLabel = new createjs.Text("NEW GAME", mediumLabelStyle, white).set({x:206,y:65});
  newGameLabel.textAlign = "center";

  var nextTurnButton = new createjs.Shape().set({x:canvas.width-360,y:35});
  nextTurnButton.graphics.beginFill("#AAA5A5").drawRect(0,0,300,100);
  nextTurnButton.addEventListener("click",nextTurn);
  nextTurnButton.name = "next";
  var nextTurnLabel = new createjs.Text("SWITCH PLAYER", mediumLabelStyle, pink).set({x:canvas.width-210,y:65});
  nextTurnLabel.textAlign = "center";

  var whiteTurn = new createjs.Text("PLAY", mediumLabelStyle, pink).set({x:44,y:(448+iconRadius)});
  whiteTurn.visible = true;
  var whiteIcon = new createjs.Shape().set({x:80,y:445});
  whiteIcon.graphics.beginFill(white).drawCircle(0,0,iconRadius,iconRadius);
  var whiteScore = new createjs.Text(wScore, largeLabelStyle, white).set({x:160,y:425});
  whiteScore.textAlign = "left";

  var blackTurn = new createjs.Text("PLAY", mediumLabelStyle, pink).set({x:canvas.width-116,y:(448+iconRadius)});
  blackTurn.visible = false;
  var blackIcon = new createjs.Shape().set({x:(canvas.width - iconRadius - 80),y:(445 - iconRadius)});
  blackIcon.graphics.beginFill(black).drawRect(0,0,iconRadius*2,iconRadius*2);
  var blackScore = new createjs.Text(bScore, largeLabelStyle, black).set({x:(canvas.width - 160),y:425});
  blackScore.textAlign = "right";

  stage.addChild(newGameButton,newGameLabel,nextTurnButton,nextTurnLabel,whiteTurn,whiteIcon,blackTurn,blackIcon);
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
      TL.name = "TL";
    } else {
      gameObject.tl = 0;
      TL.graphics.beginFill(black);
      TL.graphics.drawRoundRectComplex(-radius,-radius,radius,radius,0,0,0,0);
      TL.name = "TL";
    }

    if (tr == 1) {
      gameObject.tr = 1;
      TR.graphics.beginFill(white);
      TR.graphics.drawRoundRectComplex(0,-radius,radius,radius,0,radius,0,0);
      TR.name = "TR";
    } else {
      gameObject.tr = 0;
      TR.graphics.beginFill(black);
      TR.graphics.drawRoundRectComplex(0,-radius,radius,radius,0,0,0,0);
      TR.name = "TR";
    }

    if (br == 1) {
      gameObject.br = 1;
      BR.graphics.beginFill(white);
      BR.graphics.drawRoundRectComplex(0,0,radius,radius,0,0,radius,0);
      BR.name = "BR";
    } else {
      gameObject.br = 0;
      BR.graphics.beginFill(black);
      BR.graphics.drawRoundRectComplex(0,0,radius,radius,0,0,0,0);
      BR.name = "BR";
    }

    if (bl == 1) {
      gameObject.bl = 1;
      BL.graphics.beginFill(white);
      BL.graphics.drawRoundRectComplex(-radius,0,radius,radius,0,0,0,radius);
      BL.name = "BL";
    } else {
      gameObject.bl = 0;
      BL.graphics.beginFill(black);
      BL.graphics.drawRoundRectComplex(-radius,0,radius,radius,0,0,0,0);
      BL.name = "BL";
    }

    gameObject.addChild(TL,TR,BR,BL);

    return gameObject;

  }

  // ADD START OBJECTS TO BOARD

  function loadGameObjects() {

    var row = 0;
    var column = 0;

    var startObjects = shuffle([[0,0,1,1],[0,0,1,1],[0,1,1,0],[0,1,1,0],[1,1,0,0],[1,1,0,0],[1,0,0,1],[1,0,0,1],[1,0,1,1],[0,1,1,1],[0,1,0,0],[1,0,0,0],[1,0,1,0],[1,0,1,0],[0,1,0,1],[0,1,0,1]]);

    for (var i = 0; i < (gridSize*gridSize); i++) {

      if (i/(row+1) == gridSize) { row++; column = 0; }

      var fourm = new GameObject(startObjects[i][0],startObjects[i][1],startObjects[i][2],startObjects[i][3]);
      fourm.x = colVal(column);
      fourm.y = rowVal(row);
      fourm.id = i;
      fourm.complete = false;

      objectsInPlay.push(fourm);
      stage.addChild(fourm);

      column++;

    }

    stage.update();
  }

  loadGameObjects();

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

  var selectorsBox = new Box(40,920,336,1054,white,green,"CONDITIONS");
  var sequenceBox = new Box(416,920,704,1054,"#616060",black,"SEQUENCE");
  var actionsBox = new Box(1160,920,336,1054,white,yellow,"ACTIONS","actionsBox");

  var logicLabel = new createjs.Text("LOGIC", mediumLabelStyle, blue).set({x:168,y:820});
  logicLabel.textAlign = "center";

  var andCountLabel = new createjs.Text(andCount, "bold 25px Avenir-Heavy", blue).set({x:99,y:1010});
  andCountLabel.textAlign = "center";

  var orCountLabel = new createjs.Text(andCount, "bold 25px Avenir-Heavy", blue).set({x:237,y:1010});
  orCountLabel.textAlign = "center";

  selectorsBox.addChild(logicLabel,andCountLabel,orCountLabel);

  var clearButton = new createjs.Shape().set({x:96,y:928});
  clearButton.graphics.beginFill("#616060").beginStroke(lightGray).setStrokeStyle(4).drawRoundRect(0,0,246,76,10);
  clearButton.addEventListener("mousedown",clearHighlight);
  clearButton.addEventListener("pressup",clearSequence);
  clearButton.name = "clear";
  var clearLabel = new createjs.Text("CLEAR", largeLabelStyle, white).set({x:219,y:940});
  clearLabel.textAlign = "center";

  // var testButton = new createjs.Shape().set({x:252,y:910});
  // testButton.graphics.beginFill("#616060").drawRect(0,0,200,100);
  // var testLabel = new createjs.Text("TEST", largeLabelStyle, white).set({x:352,y:940});
  // testLabel.textAlign = "center";

  var playButton = new createjs.Shape().set({x:368,y:925});
  playButton.graphics.beginFill(gray).drawRoundRect(0,0,250,80,10);
  playButton.alpha = .5;
  // playButton.addEventListener("click",play);
  var playLabel = new createjs.Text("PLAY", largeLabelStyle, pink).set({x:493,y:940});
  playLabel.textAlign = "center";
  playLabel.alpha = .5;

  sequenceBox.addChild(clearButton,clearLabel,playButton,playLabel);

  var transformLabel = new createjs.Text("SWITCH", mediumLabelStyle, yellow).set({x:168,y:96});
  transformLabel.textAlign = "center";

  var flipLabel = new createjs.Text("FLIP", mediumLabelStyle, yellow).set({x:168,y:452});
  flipLabel.textAlign = "center";

  var rotateLabel = new createjs.Text("ROTATE", mediumLabelStyle, yellow).set({x:168,y:682});
  rotateLabel.textAlign = "center";

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
    posButton.inSlot = false;
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
    shapeButton.inSlot = false;
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
    arc.graphics.setStrokeStyle(12);

    var arrow = new createjs.Shape();
    arrow.graphics.beginFill(pink);

    var line = new createjs.Shape();
    line.graphics.beginStroke(lightGray);
    line.graphics.setStrokeStyle(8);

    if (type == 90) {
      if (dir == "cc") {
        line.graphics.moveTo(100,30);
        line.graphics.lineTo(100,100);
        line.graphics.lineTo(30,100);
        arc.graphics.arc(74,64,34,180*(Math.PI/180),280*(Math.PI/180));
        arrow.graphics.lineTo(20,58);
        arrow.graphics.lineTo(40,88);
        arrow.graphics.lineTo(60,58);
        
      } else {
        line.graphics.moveTo(30,30);
        line.graphics.lineTo(30,100);
        line.graphics.lineTo(100,100);
        arc.graphics.arc(56,66,34,260*(Math.PI/180),0);
        arrow.graphics.lineTo(110,58);
        arrow.graphics.lineTo(90,88);
        arrow.graphics.lineTo(70,58);
      }

    } else {
        line.graphics.moveTo(30,100);
        line.graphics.lineTo(100,100);
        arc.graphics.arc(65,58,26,180*(Math.PI/180),0);
        arrow.graphics.lineTo(40,88);
        arrow.graphics.lineTo(20,58);
        arrow.graphics.lineTo(60,58);
      }

    arrow.graphics.closePath();

    rotateButton.addChild(button,line,arc,arrow);
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
    arrow1.graphics.beginFill(lightGray);
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
    rowSelectors.push(rowSelector);
    var colSelector = new PositionButton("col",30,100,50,15,i,(34 + buttonSize + buttonMargin),0);
    colSelectors.push(colSelector);

  }

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

  for (var i = 0; i < 10; i++) {
    selectorsP1[i] = null;
    selectorsP2[i] = null;
   }

  function loadSelectors(set) {

  var toClear = [];

  for (i in selectorsBox.children) {
    if (selectorsBox.children[i].type == "position" || selectorsBox.children[i].type == "shape") {
      toClear.push(selectorsBox.children[i]);
    } 
  }

  for (var i = 0; i < toClear.length; i++) {
      selectorsBox.removeChild(toClear[i]);
    }

  shuffledSelectors = [];

  buttonRow = 0;

  shuffledRowSelectors = shuffle(rowSelectors); // randomize pos selectors
  shuffledColSelectors = shuffle(colSelectors); // randomize pos selectors
  shuffledShapeSelectors = shuffle(shapeSelectors); // randomize shape selectors

  for (var i = 0; i < 10; i++) {
    if (i < 2) {
      shuffledSelectors[i] = shuffledRowSelectors[i];
    } else if (i >= 2 && i < 4) {
      shuffledSelectors[i] = shuffledColSelectors[i];
    } else {
      shuffledSelectors[i] = new ShapeButton(shuffledShapeSelectors[i][0],shuffledShapeSelectors[i][1],shuffledShapeSelectors[i][2],shuffledShapeSelectors[i][3],0,0);
    }
  }

  createjs.Ticker.setPaused(false);

  for (var i = 0; i < 10; i++) {

    if (set[i] == null) {

        animateDuration = getRandomInt(200,600);
        elasticOriginX = getRandomInt(-200,200);
        elasticOriginY = getRandomInt(0,850);
        elasticRotation = getRandomInt(-30,30);

      if (!(i % 2)) {

        shuffledSelectors[i].x = elasticOriginX;
        shuffledSelectors[i].y = elasticOriginY;
        shuffledSelectors[i].rotation = elasticRotation;
        shuffledSelectors[i].originX = 34;
        shuffledSelectors[i].originY = 106 + (buttonRow * (buttonSize + buttonMargin));

      } else {

        shuffledSelectors[i].x = elasticOriginX;
        shuffledSelectors[i].y = elasticOriginY;
        shuffledSelectors[i].rotation = elasticRotation;
        shuffledSelectors[i].originX = (34 + buttonSize + buttonMargin);
        shuffledSelectors[i].originY = 106 + (buttonRow * (buttonSize + buttonMargin));
      }

      var placeholder = new PlaceholderButton(shuffledSelectors[i].originX,shuffledSelectors[i].originY);

      selectorsBox.addChild(placeholder,shuffledSelectors[i]);
      createjs.Tween.get(shuffledSelectors[i], {override:true}).to({rotation:0,x:shuffledSelectors[i].originX,y:shuffledSelectors[i].originY}, animateDuration, createjs.Ease.backOut);

      set[i] = shuffledSelectors[i];

    } else {

      if (!(i % 2)) {
        set[i].x = 34;
        set[i].y = 106 + (buttonRow * (buttonSize + buttonMargin));
        set[i].originX = set[i].x
        set[i].originY = set[i].y
      } else {
        set[i].x = (34 + buttonSize + buttonMargin);
        set[i].y = 106 + (buttonRow * (buttonSize + buttonMargin));
        set[i].originX = set[i].x
        set[i].originY = set[i].y
      }

      var placeholder = new PlaceholderButton(set[i].x,set[i].y);
      selectorsBox.addChild(placeholder,set[i]);
    }

    if (i % 2) { buttonRow++; }

  }
    console.log(set);
    stage.update();
    window.setTimeout(endTween,1000);
  }

  loadSelectors(selectorsP1);

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
  
  // flip buttons

  var flipV = new FlipButton(40,30,90,30,65,60,65,70,40,100,90,100,34,510);
  flipV.name = "fV";
  flipV.func = flipVertical;
  var placeholderFlipV = new PlaceholderButton(flipV.x,flipV.y);
  var flipH = new FlipButton(30,40,30,90,60,65,70,65,100,40,100,90,(34 + buttonSize + buttonMargin),510);
  flipH.name = "fH";
  flipH.func = flipHorizontal;
  var placeholderFlipH = new PlaceholderButton(flipH.x,flipH.y);

  // rotate buttons

  var rotate90cc = new RotateButton(90,"cc",34,740);
  rotate90cc.name = "r90cc";
  rotate90cc.func = rt90cc;
  var placeholder90cc = new PlaceholderButton(rotate90cc.x,rotate90cc.y);
  var rotate90c = new RotateButton(90,"c",(34 + buttonSize + buttonMargin),740);
  rotate90c.name = "r90c";
  rotate90c.func = rt90c;
  var placeholder90c = new PlaceholderButton(rotate90c.x,rotate90c.y);
  var rotate180cc = new RotateButton(180,"cc",34,(740 + buttonSize + buttonMargin));
  rotate180cc.name = "r180cc";
  rotate180cc.func = rt180cc;
  var placeholder180cc = new PlaceholderButton(rotate180cc.x,rotate180cc.y);

  actionsBox.addChild(placeholderTL,placeholderTR,placeholderBR,placeholderBL,placeholderFlipV,placeholderFlipH,placeholder90cc,placeholder90c,placeholder180cc);
  actionsBox.addChild(transformTL,transformTR,transformBR,transformBL,flipV,flipH,rotate90cc,rotate90c,rotate180cc);

  stage.update();


  // SEQUENCE TRAY

  // fill sequence array with null

  for (var i = 0; i < 16; i++) {
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
    sequenceReady();
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

  function clearHighlight() {
    clearLabel.color = lightGray;
    stage.update();
  }

  function clearSequence(event) {

    clearLabel.color = white;

    var toClear = [];

    for (var i = 0; i < sequenceBox.children.length; i++) {
      if (sequenceBox.children[i].type != null) {
        toClear.push(sequenceBox.children[i]);
      }
    }

    for (var i = 0; i < toClear.length; i++) {
      if (arguments.length == 1) {
        returnToOrigin(toClear[i],toClear[i].originParent,toClear[i].originX,toClear[i].originY);
      } else {
        if (toClear[i].type == "logic" || toClear[i].type == "action") {
          returnToOrigin(toClear[i],toClear[i].originParent,toClear[i].originX,toClear[i].originY);
        } else {
          sequenceBox.removeChild(toClear[i]);
        }
      }
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
    sequenceReady();
    stage.update();
  }

  // PLAY SEQUENCE

  function sequenceReady() {

    playReady = false;
    var falseCheck = 0;

    for (var i = 0; i < 16; i+=4) {

      if ((sequence[i] != null || sequence[i+1] != null || sequence[i+2] != null) && sequence[i+3] != null) {
        playReady = true;
      } else if ((sequence[i] != null || sequence[i+1] != null || sequence[i+2] != null) && sequence[i+3] == null) {
        falseCheck++;
      } else if ((sequence[i] == null || sequence[i+1] == null || sequence[i+2] == null) && sequence[i+3] != null) {
        falseCheck++;
      }

    }

    if (playReady == true && falseCheck == 0) {
      playButton.addEventListener("mousedown",playHighlight);
      playButton.addEventListener("pressup",play);
      playButton.alpha = 1;
      playLabel.alpha = 1;
    } else {
      playButton.removeEventListener("mousedown",playHighlight);
      playButton.removeEventListener("pressup",play);
      playButton.alpha = .5;
      playLabel.alpha = .5;
    }

    stage.update();
  }

  function playHighlight() {
    playButton.alpha = .8;
    stage.update();
  }

  function play() {

    playButton.alpha = 1;

    playSequence();
    var playing = window.setInterval(playSequence,1000);

    function playSequence() {

      highlightSequenceBox(playCount);

      if (!(playCount % 2)) {
        targetGameObjects(playCount);
      } else {
        deliverAction(targetGameObjects(playCount-1),playCount);
      }

      if (playCount < 8) { 
        playCount++; 
      } else {
        clearInterval(playing);
        nextTurn();
      }
    }
  }


  function highlightSequenceBox(step) {

      for (var i = 0; i < trays.children.length; i++) {
          if (trays.children[i].tray == step) {
            if (trays.children[i].type == "selectors") {
              trays.children[i].graphics
              .clear()
              .beginStroke(black).setStrokeStyle(8).beginFill(black)
              .drawRoundRect(0,0,442,154,5);
              trays.children[i].updateCache();
           } else {
              trays.children[i].graphics
              .clear()
              .beginStroke(black).setStrokeStyle(8).beginFill(black)
              .drawRoundRect(0,0,160,154,5);
              trays.children[i].updateCache();
            }
          }
        }

    stage.update();

  }

  function targetGameObjects(step) {

    createjs.Ticker.setPaused(false);

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
          createjs.Tween.get(objectsInPlay[i], {override:true}).to({alpha:1,}, 300, createjs.Ease.cubicIn);
        } else {
          createjs.Tween.get(objectsInPlay[i], {override:true}).to({alpha:.2,}, 400, createjs.Ease.cubicOut);
        }
   
      } else if (ruleSet.length == 1) {

        if (ruleSet[0](objectsInPlay[i])) {
          targets.push(objectsInPlay[i]);
          createjs.Tween.get(objectsInPlay[i], {override:true}).to({alpha:1,}, 300, createjs.Ease.cubicIn);
        } else {
          createjs.Tween.get(objectsInPlay[i], {override:true}).to({alpha:.2,}, 400, createjs.Ease.cubicOut);
        }
      } else {
        createjs.Tween.get(objectsInPlay[i], {override:true}).to({alpha:.2,}, 400, createjs.Ease.cubicOut);
      }

      var findMorph = objectsInPlay[i].getChildByName("morph");
      if (findMorph != null) {
        removeMorph(objectsInPlay[i],findMorph);
        //createjs.Tween.get(findMorph, {override:true}).to({alpha:0}, 600, createjs.Ease.cubicOut).call(removeMorph,[objectsInPlay[i],findMorph]);
      }

    }

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
      updateScores();
  }

  // ACTION FUNCTIONS

  function transTL(obj) {

    var tl = obj.getChildByName("TL");

     if (obj.tl == 0) {
        morphWithHighlight(tl,white,-radius,-radius,radius,0,0,0);
        obj.tl = 1;
      } else {
        morphWithHighlight(tl,black,-radius,-radius,0,0,0,0);
        obj.tl = 0;
      }
  }

  function transTR(obj) {

    var tr = obj.getChildByName("TR");

     if (obj.tr == 0) {
        morphWithHighlight(tr,white,0,-radius,0,radius,0,0);
        obj.tr = 1;
      } else {
        morphWithHighlight(tr,black,0,-radius,0,0,0,0);
        obj.tr = 0;
      }
  }

  function transBR(obj) {

    var br = obj.getChildByName("BR");

     if (obj.br == 0) {
        morphWithHighlight(br,white,0,0,0,0,radius,0);
        obj.br = 1;
      } else {
        morphWithHighlight(br,black,0,0,0,0,0,0);
        obj.br = 0;
      }
  }

  function transBL(obj) {

    var bl = obj.getChildByName("BL");

     if (obj.bl == 0) {
        morphWithHighlight(bl,white,-radius,0,0,0,0,radius);
        obj.bl = 1;
      } else {
        morphWithHighlight(bl,black,-radius,0,0,0,0,0);
        obj.bl = 0;
      }
  }

  function rt90cc(obj) {

    var tempTL;
    var tempTR;
    var tempBR;
    var tempBL;

    obj.cache(-130,-130,260,260);
    createjs.Ticker.setPaused(false);

    var tl = obj.getChildByName("TL");
    var tr = obj.getChildByName("TR");
    var br = obj.getChildByName("BR");
    var bl = obj.getChildByName("BL");

    if (obj.tl == 0) {
        morph(bl,black,-radius,0,0,0,0,0);
        tempBL = 0;
      } else {
        morph(bl,white,-radius,0,0,0,0,radius);
        tempBL = 1;
      }

    if (obj.tr == 0) {
        morph(tl,black,-radius,-radius,0,0,0,0);
        tempTL = 0;
      } else {
        morph(tl,white,-radius,-radius,radius,0,0,0);
        tempTL = 1;
      }

     if (obj.br == 0) {
        morph(tr,black,0,-radius,0,0,0,0);
        tempTR = 0;
      } else {
        morph(tr,white,0,-radius,0,radius,0,0);
        tempTR = 1;
      }

      if (obj.bl == 0) {
        morph(br,black,0,0,0,0,0,0);
        tempBR = 0;
      } else {
        morph(br,white,0,0,0,0,radius,0);
        tempBR = 1;
      }

      obj.tl = tempTL;
      obj.tr = tempTR;
      obj.br = tempBR;
      obj.bl = tempBL;

      createjs.Tween.get(obj, {override:true}).to({rotation:-90}, 200, createjs.Ease.getBackOut(2)).call(redraw,[obj]);

  }

  function rt90c(obj) {

    var tempTL;
    var tempTR;
    var tempBR;
    var tempBL;

    obj.cache(-130,-130,260,260);
    createjs.Ticker.setPaused(false);

    var tl = obj.getChildByName("TL");
    var tr = obj.getChildByName("TR");
    var br = obj.getChildByName("BR");
    var bl = obj.getChildByName("BL");

    if (obj.tl == 0) {
        morph(tr,black,0,-radius,0,0,0,0);
        tempTR = 0;
      } else {
        morph(tr,white,0,-radius,0,radius,0,0);
        tempTR = 1;
      }

    if (obj.tr == 0) {
        morph(br,black,0,0,0,0,0,0);
        tempBR = 0;
      } else {
        morph(br,white,0,0,0,0,radius,0);
        tempBR = 1;
      }

     if (obj.br == 0) {
        morph(bl,black,-radius,0,0,0,0,0);
        tempBL = 0;
      } else {
        morph(bl,white,-radius,0,0,0,0,radius);
        tempBL = 1;
      }

      if (obj.bl == 0) {
        morph(tl,black,-radius,-radius,0,0,0,0);
        tempTL = 0;
      } else {
        morph(tl,white,-radius,-radius,radius,0,0,0);
        tempTL = 1;
      }

      obj.tl = tempTL;
      obj.tr = tempTR;
      obj.br = tempBR;
      obj.bl = tempBL;

      createjs.Tween.get(obj, {override:true}).to({rotation:90}, 200, createjs.Ease.getBackOut(2)).call(redraw,[obj]);
  }

  function rt180cc(obj) {

    var tempTL;
    var tempTR;
    var tempBR;
    var tempBL;

    obj.cache(-130,-130,260,260);
    createjs.Ticker.setPaused(false);

    var tl = obj.getChildByName("TL");
    var tr = obj.getChildByName("TR");
    var br = obj.getChildByName("BR");
    var bl = obj.getChildByName("BL");

      if (obj.tl == 0) {
        morph(br,black,0,0,0,0,0,0);
        tempBR = 0;
      } else {
        morph(br,white,0,0,0,0,radius,0);
        tempBR = 1;
      }

    if (obj.tr == 0) {
         morph(bl,black,-radius,0,0,0,0,0);
        tempBL = 0;
      } else {
        morph(bl,white,-radius,0,0,0,0,radius);
        tempBL = 1;
      }

     if (obj.br == 0) {
        morph(tl,black,-radius,-radius,0,0,0,0);
        tempTL = 0;
      } else {
        morph(tl,white,-radius,-radius,radius,0,0,0);
        tempTL = 1;
      }

      if (obj.bl == 0) {
        morph(tr,black,0,-radius,0,0,0,0);
        tempTR = 0;
      } else {
        morph(tr,white,0,-radius,0,radius,0,0);
        tempTR = 1;
      }

      obj.tl = tempTL;
      obj.tr = tempTR;
      obj.br = tempBR;
      obj.bl = tempBL;

      createjs.Tween.get(obj, {override:true}).to({rotation:-180}, 200, createjs.Ease.getBackOut(2)).call(redraw,[obj]);
  }

  function flipHorizontal(obj) {

    var tempTL;
    var tempTR;
    var tempBR;
    var tempBL;

    obj.cache(-130,-130,260,260);
    createjs.Ticker.setPaused(false);

    var tl = obj.getChildByName("TL");
    var tr = obj.getChildByName("TR");
    var br = obj.getChildByName("BR");
    var bl = obj.getChildByName("BL");

    if (obj.tl == 0) {
        morph(tr,black,0,-radius,0,0,0,0);
        tempTR = 0;
      } else {
        morph(tr,white,0,-radius,0,radius,0,0);
        tempTR = 1;
      }

    if (obj.tr == 0) {
        morph(tl,black,-radius,-radius,0,0,0,0);
        tempTL = 0;
      } else {
        morph(tl,white,-radius,-radius,radius,0,0,0);
        tempTL = 1;
      }

     if (obj.br == 0) {
        morph(bl,black,-radius,0,0,0,0,0);
        tempBL = 0;
      } else {
        morph(bl,white,-radius,0,0,0,0,radius);
        tempBL = 1;
      }

      if (obj.bl == 0) {
        morph(br,black,0,0,0,0,0,0);
        tempBR = 0;
      } else {
        morph(br,white,0,0,0,0,radius,0);
        tempBR = 1;
      }

      obj.tl = tempTL;
      obj.tr = tempTR;
      obj.br = tempBR;
      obj.bl = tempBL;

      createjs.Tween.get(obj, {override:true}).to({scaleX:-1}, 300, createjs.Ease.cubicInOut).call(redraw,[obj]);
  }

  function flipVertical(obj) {

    obj.cache(-130,-130,260,260);
    createjs.Ticker.setPaused(false);

    var tempTL;
    var tempTR;
    var tempBR;
    var tempBL;

    var tl = obj.getChildByName("TL");
    var tr = obj.getChildByName("TR");
    var br = obj.getChildByName("BR");
    var bl = obj.getChildByName("BL");

    if (obj.tl == 0) {
        morph(bl,black,-radius,0,0,0,0,0);
        tempBL = 0;
      } else {
        morph(bl,white,-radius,0,0,0,0,radius);
        tempBL = 1;
      }

    if (obj.tr == 0) {
        morph(br,black,0,0,0,0,0,0);
        tempBR = 0;
      } else {
        morph(br,white,0,0,0,0,radius,0);
        tempBR = 1;
      }

     if (obj.br == 0) {
        morph(tr,black,0,-radius,0,0,0,0);
        tempTR = 0;
      } else {
        morph(tr,white,0,-radius,0,radius,0,0);
        tempTR = 1;
      }

      if (obj.bl == 0) {
        morph(tl,black,-radius,-radius,0,0,0,0);
        tempTL = 0;
      } else {
        morph(tl,white,-radius,-radius,radius,0,0,0);
        tempTL = 1;
      }

      obj.tl = tempTL;
      obj.tr = tempTR;
      obj.br = tempBR;
      obj.bl = tempBL;

      createjs.Tween.get(obj, {override:true}).to({scaleY:-1}, 400, createjs.Ease.cubicInOut).call(redraw,[obj]);
  }

  function morphWithHighlight(corner,color,x,y,tl,tr,br,bl) {

    //createjs.Ticker.setPaused(false); 
        
        corner.graphics
        .clear()
        .beginFill(color)
        .drawRoundRectComplex(x,y,radius,radius,tl,tr,br,bl);

       var morphHighlight = corner.clone(true);
        
        morphHighlight.graphics.clear().beginFill(pink).drawRoundRectComplex(x,y,radius,radius,tl,tr,br,bl);
        morphHighlight.name = "morph";
        morphHighlight.alpha = .95;
        corner.parent.addChild(morphHighlight);
        stage.update();

        //createjs.Tween.get(morphHighlight, {override:true}).to({alpha:.8}, 300, createjs.Ease.cubicIn).to({alpha:0}, 300, createjs.Ease.cubicOut).call(removeMorph,[corner]);
  }

  function morph(corner,color,x,y,tl,tr,br,bl) {
    corner.graphics
    .clear()
    .beginFill(color)
    .drawRoundRectComplex(x,y,radius,radius,tl,tr,br,bl);
  }

  function removeMorph(obj,corner) {
    obj.removeChild(corner);
  }

  function redraw(obj) {
    obj.rotation = 0;
    obj.scaleX = 1;
    obj.scaleY = 1;
    obj.updateCache();
    obj.uncache();
  }

  // SCORES

  function updateScores() {

  bScore = 0;
  wScore = 0;

  for (var i = 0; i < objectsInPlay.length; i++) {
    if (objectsInPlay[i].tl == 0 && objectsInPlay[i].tr == 0 && objectsInPlay[i].br == 0 && objectsInPlay[i].bl == 0) {
      objectsInPlay[i].complete = "b";
      bScore++;
    } else if (objectsInPlay[i].tl == 1 && objectsInPlay[i].tr == 1 && objectsInPlay[i].br == 1 && objectsInPlay[i].bl == 1) {
      objectsInPlay[i].complete = "w";
      wScore++;
    } else {
      objectsInPlay[i].complete = false;
    }
  } 
    blackScore.text = bScore;
    whiteScore.text = wScore;
    stage.update();

  } 

  function checkWin() {

    var success = [];
    var bRowsOrCols = 0;
    var wRowsOrCols = 0;

    for (var a = 0; a < 4; a++) {

      var bColCount = 0;
      var bRowCount = 0;
      var wColCount = 0;
      var wRowCount = 0;

      for (var i = 0; i < objectsInPlay.length; i++) {

        if (objectsInPlay[i].complete == "b" && objectsInPlay[i].x == colVal(a)) {
          bColCount++;
        } else if (objectsInPlay[i].complete == "w" && objectsInPlay[i].x == colVal(a)) {
          wColCount++;
        } else if (objectsInPlay[i].complete == "b" && objectsInPlay[i].y == rowVal(a)) {
          bRowCount++;
        } else if (objectsInPlay[i].complete == "w" && objectsInPlay[i].y == rowVal(a)) {
          wRowCount++;
        }
      }

      if (bColCount == 4) {
        success.push([["b"],["col"],[a]]);
        console.log("BCOL " + a);
      } else if (bRowCount == 4) {
        success.push([["b"],["row"],[a]]);
        console.log("BROW " + a);
      } else if (wColCount == 4) {
        success.push([["w"],["col"],[a]]);
        console.log("WCOL " + a);
      } else if (wRowCount == 4) {
        success.push([["w"],["row"],[a]]);
        console.log("WROW " + a);
      }
    }

    if (success.length == 1) {
      if (success[0][0] == "b") {
        console.log("BLACK WINS");
      } else {
        console.log("WHITE WINS");
      }
    } else if (success.length > 1) {
      for (i in success) {
        if (success[i][0] == "b") {
          bRowsOrCols++;
        } else {
          wRowsOrCols++;
        }
      }

      if (bRowsOrCols > wRowsOrCols) {
        console.log("BLACK WINS");
      } else if (bRowsOrCols < wRowsOrCols) {
        console.log("WHITE WINS");
      } else {
        console.log("DRAW");
      }
    }
  }

  // GAME MGMT

  function nextTurn() {

    createjs.Ticker.setPaused(false);

    for (var i in objectsInPlay) {

      var findMorph = objectsInPlay[i].getChildByName("morph");
        if (findMorph != null) {
        removeMorph(objectsInPlay[i],findMorph);
      }

      if (i < objectsInPlay.length-1) {
      createjs.Tween.get(objectsInPlay[i], {override:true}).to({alpha:1,}, 300, createjs.Ease.cubicIn);
      } else {
        createjs.Tween.get(objectsInPlay[i], {override:true}).to({alpha:1,}, 300, createjs.Ease.cubicIn);
      }
    }

    clearSequence();
    sequenceReady();

    if (whiteTurn.visible == true) {
      whiteTurn.visible = false;
      blackTurn.visible = true;

      for (var i = 0; i < selectorsP1.length; i++) {
        if (selectorsP1[i].inSlot !== false) {
          selectorsP1[i] = null;
        }
      }

      loadSelectors(selectorsP2);

    } else {
      whiteTurn.visible = true;
      blackTurn.visible = false;
      
      for (var i = 0; i < selectorsP2.length; i++) {
        if (selectorsP2[i].inSlot !== false) {
          selectorsP2[i] = null;
        }
      }
      
      loadSelectors(selectorsP1);
    }

    checkWin();
    stage.update();
  }

  function newGame() {

    for (var i in objectsInPlay) {
      stage.removeChild(objectsInPlay[i]);
    }

    objectsInPlay = [];

    for (var i = 0; i < 10; i++) {
      selectorsP1[i] = null;
      selectorsP2[i] = null;
    }

    clearSequence();
    loadGameObjects();
    loadSelectors(selectorsP1);

    updateScores();

    whiteTurn.visible = true;
    blackTurn.visible = false;

    stage.update();
  }

  // ANIMATION

  function tick(event) {
    if (!event.paused) {
      stage.update(event);
    }
  }

  function endTween() {
    createjs.Ticker.setPaused(true);
    console.log(createjs.Ticker.paused);
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