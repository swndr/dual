
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

  var dropPosition = null;

  var sequence = [];
  var steps;
  var playCount = 0;
  var playReady = false;

  var selectorsP1 = [];
  var selectorsP2 = [];

  var animateDuration;
  var elasticOriginX;
  var elasticOriginY;
  var elasticRotation;

  var andCount = 4;
  var orCount = 4;

  var tutorialObjectsInPlay = [];
  var objectsInPlay = [];

  var wTurn = true;
  var wTurns = 0;
  var bTurns = 0;
  var wConditions = 0;
  var bConditions = 0;
  var wActions = 0;
  var bActions = 0;
  var wComplete = 0;
  var bComplete = 0;
  var wScore = 0;
  var bScore = 0;
  var wCounter = 0;
  var bCounter = 0;
  var gameOver = false;

  var stage = new createjs.Stage(canvas);
  createjs.Touch.enable(stage);
  stage.enableMouseOver(20);

  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", tick);
  createjs.Ticker.setPaused(true);

  var animations = [];

  var startOverlay = new createjs.Container();
  var darkOverlay = new createjs.Container();
  var winOverlay = new createjs.Container();

  // BOARD

  var board = new createjs.Container();

  // BACKGROUND

  var bg = new createjs.Shape();
  bg.graphics.beginFill("#AAA5A5");
  bg.graphics.rect(0,0,canvas.width,890);
  bg.cache(0,0,canvas.width,890);

  var winGrid = new createjs.Shape();
  winGrid.graphics.beginFill(pink);
  winGrid.graphics.rect(0,0,canvas.width,890);
  winGrid.alpha = 0;

  // BUILD GRID

  var boardGrid = new Grid(4,180,890,145);
  board.addChild(bg,boardGrid);

  var gameObjects = new createjs.Container();

  // GAME MGMT & SCORES

  var newGameButton = new createjs.Shape().set({x:40,y:40});
  newGameButton.graphics.beginFill("#AAA5A5").drawRect(0,0,300,100);
  newGameButton.addEventListener("mousedown",newGameHighlight);
  newGameButton.addEventListener("pressup",newGame);
  newGameButton.name = "new";
  var newGameLabel = new createjs.Text("RESTART", mediumLabelStyle, white).set({x:185,y:70});
  newGameLabel.textAlign = "center";
  newGameLabel.alpha = 0;

  var exitButton = new createjs.Shape().set({x:canvas.width-330,y:40});
  exitButton.graphics.beginFill("#AAA5A5").drawRect(0,0,260,100);
  exitButton.addEventListener("mousedown",exitHighlight);
  exitButton.addEventListener("pressup",exit);
  exitButton.name = "exit";
  var exitLabel = new createjs.Text("EXIT", mediumLabelStyle, white).set({x:canvas.width-200,y:70});
  exitLabel.textAlign = "center";
  exitLabel.alpha = 0;

  var whiteTurn = new createjs.Shape().set({x:0,y:(445-iconRadius)});
  whiteTurn.graphics.beginFill(pink).drawRect(0,0,25,iconRadius*2);
  whiteTurn.visible = true;
  var whiteIcon = new createjs.Shape().set({x:80,y:445});
  whiteIcon.graphics.beginFill(white).drawCircle(0,0,iconRadius,iconRadius);
  var whiteScore = new createjs.Text(wScore, largeLabelStyle, white).set({x:160,y:425});
  whiteScore.textAlign = "left";

  var blackTurn = new createjs.Shape().set({x:(canvas.width - 25),y:(445 - iconRadius)});
  blackTurn.graphics.beginFill(pink).drawRect(0,0,25,iconRadius*2);
  blackTurn.visible = false;
  var blackIcon = new createjs.Shape().set({x:(canvas.width - iconRadius - 80),y:(445 - iconRadius)});
  blackIcon.graphics.beginFill(black).drawRect(0,0,iconRadius*2,iconRadius*2);
  var blackScore = new createjs.Text(bScore, largeLabelStyle, black).set({x:(canvas.width - 160),y:425});
  blackScore.textAlign = "right";

  board.addChild(newGameButton,newGameLabel,exitButton,exitLabel,whiteTurn,whiteIcon,blackTurn,blackIcon);

  // PLAYER CONTROLS

  var selectorsBox = new Box(40,920,336,1054,"#F9F9F9",green,"CONDITIONS");
  var sequenceBox = new Box(416,920,704,1054,"#616060",black,"SEQUENCE");
  var actionsBox = new Box(1160,920,336,1054,"#F9F9F9",yellow,"ACTIONS","actionsBox");

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

  var playButton = new createjs.Shape().set({x:368,y:925});
  playButton.graphics.beginFill(gray).drawRoundRect(0,0,250,80,10);
  playButton.alpha = .5;
  var playLabel = new createjs.Text("PLAY", largeLabelStyle, pink).set({x:493,y:940});
  playLabel.textAlign = "center";
  playLabel.alpha = .5;

  sequenceBox.addChild(clearButton,clearLabel,playButton,playLabel);

  var transformLabel = new createjs.Text("SWITCH", mediumLabelStyle, yellow).set({x:168,y:106});
  transformLabel.textAlign = "center";

  var flipLabel = new createjs.Text("FLIP", mediumLabelStyle, yellow).set({x:168,y:464});
  flipLabel.textAlign = "center";

  var rotateLabel = new createjs.Text("ROTATE", mediumLabelStyle, yellow).set({x:168,y:680});
  rotateLabel.textAlign = "center";

  actionsBox.addChild(transformLabel,rotateLabel,flipLabel);

  // SEQUENCE TRAY

  var trays = new createjs.Container();
  var dropZoneContainer = new createjs.Container();

  sequenceBox.addChild(trays,dropZoneContainer);

  function sequenceTrayStart() {

    trays.removeAllChildren();
    dropZoneContainer.removeAllChildren();

    for (var i = 0; i < 8; i++) {

      if (i < 2) {
        if (!(i % 2)) {
          var sequenceTray = new Tray(36,(117 + (i*100)),442,160,black,green,1,i,"selectors");
        } else {
          var sequenceTray = new Tray(508,(17 + (i*100)),160,160,black,yellow,1,i,"actions"); 
        }
      } else {
        if (!(i % 2)) {
          var sequenceTray = new Tray(36,(117 + (i*100)),442,160,black,lightGray,.7,i,"selectors");
        } else {
          var sequenceTray = new Tray(508,(17 + (i*100)),160,160,black,lightGray,.7,i,"actions"); 
        }
      }

      trays.addChild(sequenceTray);
    }

    buildSequenceStep(1,0);
    buildNextSequenceLocked(2);
    buildSequenceLocked(3);
    buildSequenceLocked(4);

    var requiredCondition = new createjs.Text("*","bold 100px Avenir-Heavy", white).set({x:90,y:150});
    requiredCondition.alpha = .1;

    var requiredAction = new createjs.Text("*","bold 100px Avenir-Heavy", white).set({x:563,y:150});
    requiredAction.alpha = .1;

    dropZoneContainer.addChild(requiredCondition,requiredAction);

  }

  function buildSequenceStep(row,startSlot) {

    var selectorZone0 = new DropZone(50,((row * 200) - 68),green,.25,"condition",startSlot);
    var logicZone = new DropZone((50 + buttonSize + (buttonMargin+4)),((row * 200) - 68),blue,.25,"logic",startSlot+1);
    var selectorZone1 = new DropZone((50 + (buttonSize*2) + ((buttonMargin+4)*2)),((row * 200) - 68),green,.25,"condition",startSlot+2);
    var actionZone = new DropZone(523,((row * 200) - 68),yellow,.25,"action",startSlot+3);
    dropZoneContainer.addChild(selectorZone0,logicZone,selectorZone1,actionZone);
  }

  function buildNextSequenceLocked(row) {

    var lockStatus = new createjs.Container().set({x:80,y:((row * 200) - 20)});
    var padlock = new Padlock(5,10);
    var lockText = new createjs.Text("LOCKED UNTIL NEXT TURN", "100 22px Avenir-Book", white).set({x:60,y:5});
    lockStatus.addChild(padlock,lockText);
    lockStatus.name = row;
    dropZoneContainer.addChild(lockStatus);
 
  }

  function buildSequenceLocked(row) {

    var lockStatus = new createjs.Container().set({x:80,y:((row * 200) - 20)});
    var padlock = new Padlock(5,10);
    var lockText = new createjs.Text("LOCKED", "100 22px Avenir-Book", white).set({x:60,y:5});
    lockStatus.addChild(padlock,lockText);
    lockStatus.alpha = .5;
    lockStatus.name = row;
    dropZoneContainer.addChild(lockStatus);

  }

// SELECTOR ITEMS

function generateConditions(set,p) {

    set.row = [];
    set.col = [];
    set.shapes = [];
    set.shapeArrays = [];

    set.all = new Array(10);

    // positions

    for (var i = 0; i < 4; i++) {
      
      var rowSelector = new PositionButton("row",100,30,15,50,i,34,0);
      set.row.push(rowSelector);
      var colSelector = new PositionButton("col",30,100,50,15,i,(34 + buttonSize + buttonMargin),0);
      set.col.push(colSelector);

    }

    // shapes

    var CCRR = [1,1,0,0]; set.shapeArrays.push(CCRR);
    var RRCC = [0,0,1,1]; set.shapeArrays.push(RRCC);
    var CRRC = [1,0,0,1]; set.shapeArrays.push(CRRC);
    var RCCR = [0,1,1,0]; set.shapeArrays.push(RCCR);

    var CRRR = [1,0,0,0]; set.shapeArrays.push(CRRR);
    var RCRR = [0,1,0,0]; set.shapeArrays.push(RCRR);
    var RRCR = [0,0,1,0]; set.shapeArrays.push(RRCR);
    var RRRC = [0,0,0,1]; set.shapeArrays.push(RRRC);

    var RCCC = [0,1,1,1]; set.shapeArrays.push(RCCC);
    var CRCC = [1,0,1,1]; set.shapeArrays.push(CRCC);
    var CCRC = [1,1,0,1]; set.shapeArrays.push(CCRC);
    var CCCR = [1,1,1,0]; set.shapeArrays.push(CCCR);

    var RCRC = [0,1,0,1]; set.shapeArrays.push(RCRC);
    var CRCR = [1,0,1,0]; set.shapeArrays.push(CRCR);

    for (i in set.shapeArrays) {
      var shapeSelector = new ShapeButton(set.shapeArrays[i][0],set.shapeArrays[i][1],set.shapeArrays[i][2],set.shapeArrays[i][3],0,0);
      set.shapes.push(shapeSelector);
    }

    shuffle(set.row);
    shuffle(set.col);
    shuffle(set.shapes);

    for (var i = 0; i < 10; i++) {
      if (i < 2) {
        set.all[i] = set.row.shift();
        set.all[i].player = p;
      } else if (i >= 2 && i < 4) {
        set.all[i] = set.col.shift();
        set.all[i].player = p;
      } else {
        set.all[i] = set.shapes.shift();
        set.all[i].player = p;
      }
    }

    return set;
  }


  function replaceSelectors(selector,set) {

    if (selector.name == "row") {
      var replacement = set.row.splice(getRandomInt(0,set.row.length-1),1,selector)[0];
    } else if (selector.name == "col") {
      var replacement = set.col.splice(getRandomInt(0,set.col.length-1),1,selector)[0];
    } else if (selector.name == "shape") {
      var replacement = set.shapes.splice(getRandomInt(0,set.shapes.length-1),1,selector)[0];
    }

    replacement.visible = false;

    if (replacement.parent == null) {
      selectorsBox.addChild(replacement);
    }

    replacement.inSlot = false;
    replacement.refresh = true;
    console.log(replacement);
    return replacement;
  }

  function loadSelectors(set,setToClear) {

    createjs.Ticker.setPaused(false);

    buttonRow = 0;

    for (var i = 0; i < 10; i++) {

      if (arguments.length > 1) {
        setToClear.all[i].visible = false;
      }

      set.all[i].visible = true;

      animateDuration = getRandomInt(200,500);
      elasticOriginX = getRandomInt(-200,200);
      elasticOriginY = getRandomInt(50,700);
      elasticRotation = getRandomInt(-80,80);

      if (!(i % 2)) {

        set.all[i].x = elasticOriginX;
        set.all[i].y = elasticOriginY;
        set.all[i].rotation = elasticRotation;
        set.all[i].originX = 34;
        set.all[i].originY = 110 + (buttonRow * (buttonSize + buttonMargin));

      } else {

        set.all[i].x = elasticOriginX;
        set.all[i].y = elasticOriginY;
        set.all[i].rotation = elasticRotation;
        set.all[i].originX = (34 + buttonSize + buttonMargin);
        set.all[i].originY = 110 + (buttonRow * (buttonSize + buttonMargin));
      }

      if (arguments.length == 1) {
        var placeholder = new PlaceholderButton(set.all[i].originX,set.all[i].originY);
        selectorsBox.addChild(placeholder);
      }

      selectorsBox.addChild(set.all[i]);
      createjs.Tween.get(set.all[i], {override:true}).call(addAnim,[0]).to({rotation:0,x:set.all[i].originX,y:set.all[i].originY}, animateDuration, createjs.Ease.backOut).call(rmAnim);

      set.all[i].refresh = false;

      if (i % 2) { buttonRow++; }
    }
  }

  function refreshSelectors(setToClear,setToAdd) {

    createjs.Ticker.setPaused(false);

    buttonRow = 0;

    for (i in setToClear.all) {
      setToClear.all[i].visible = false;
    }

    for (var i = 0; i < 10; i++) {

      setToAdd.all[i].visible = true;

      if (setToAdd.all[i].refresh == true) {

          animateDuration = getRandomInt(200,500);
          elasticOriginX = getRandomInt(-200,200);
          elasticOriginY = getRandomInt(50,700);
          elasticRotation = getRandomInt(-80,80);

        if (!(i % 2)) {

          setToAdd.all[i].x = elasticOriginX;
          setToAdd.all[i].y = elasticOriginY;
          setToAdd.all[i].rotation = elasticRotation;
          setToAdd.all[i].originX = 34;
          setToAdd.all[i].originY = 110 + (buttonRow * (buttonSize + buttonMargin));

        } else {

          setToAdd.all[i].x = elasticOriginX;
          setToAdd.all[i].y = elasticOriginY;
          setToAdd.all[i].rotation = elasticRotation;
          setToAdd.all[i].originX = (34 + buttonSize + buttonMargin);
          setToAdd.all[i].originY = 110 + (buttonRow * (buttonSize + buttonMargin));
        }

        createjs.Tween.get(setToAdd.all[i], {override:true}).call(addAnim,[0]).to({rotation:0,x:setToAdd.all[i].originX,y:setToAdd.all[i].originY}, animateDuration, createjs.Ease.backOut).call(rmAnim);

        setToAdd.all[i].refresh = false;

      } else {

        if (!(i % 2)) {
          setToAdd.all[i].x = 34;
          setToAdd.all[i].y = 110 + (buttonRow * (buttonSize + buttonMargin));
          setToAdd.all[i].originX = setToAdd.all[i].x
          setToAdd.all[i].originY = setToAdd.all[i].y
        } else {
          setToAdd.all[i].x = (34 + buttonSize + buttonMargin);
          setToAdd.all[i].y = 110 + (buttonRow * (buttonSize + buttonMargin));
          setToAdd.all[i].originX = setToAdd.all[i].x
          setToAdd.all[i].originY = setToAdd.all[i].y
        }
     }

      if (i % 2) { buttonRow++; }
    }
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

  // ACTION ITEMS

  // transform buttons
  
  var transformTL = new TransformButton(50,50,iconRadius,0,0,0,35,35,34,(34 + buttonSize + buttonMargin));
  transformTL.name = "transTL";
  transformTL.func = transTL;
  var placeholderTL = new PlaceholderButton(transformTL.x,transformTL.y);
  var transformTR = new TransformButton(35,50,0,iconRadius,0,0,50,35,(34 + buttonSize + buttonMargin),(34 + buttonSize + buttonMargin));
  transformTR.name = "transTR";
  transformTR.func = transTR;
  var placeholderTR = new PlaceholderButton(transformTR.x,transformTR.y);
  var transformBR = new TransformButton(35,35,0,0,iconRadius,0,50,50,(34 + buttonSize + buttonMargin),(34 + (buttonSize*2) + (buttonMargin*2)));
  transformBR.name = "transBR";
  transformBR.func = transBR;
  var placeholderBR = new PlaceholderButton(transformBR.x,transformBR.y);
  var transformBL = new TransformButton(50,35,0,0,0,iconRadius,35,50,34,(34 + (buttonSize*2) + (buttonMargin*2)));
  transformBL.name = "transBL";
  transformBL.func = transBL;
  var placeholderBL = new PlaceholderButton(transformBL.x,transformBL.y);
  
  // flip buttons

  var flipV = new FlipButton(40,30,90,30,65,60,65,70,40,100,90,100,34,524);
  flipV.name = "fV";
  flipV.func = flipVertical;
  var placeholderFlipV = new PlaceholderButton(flipV.x,flipV.y);
  var flipH = new FlipButton(30,40,30,90,60,65,70,65,100,40,100,90,(34 + buttonSize + buttonMargin),524);
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


  // ----------------- CONSTRUCTORS --------------------

  function Grid(gridSize,gridSpacing,gridHeight,labelMargin) {

    var gridLeft = ((canvas.width - ((gridSize-1) * gridSpacing))/2);
    var gridTop = ((gridHeight - ((gridSize-1) * gridSpacing))/2);

    var gridContainer = new createjs.Container();

    var grid = new createjs.Shape();

    grid.graphics.beginStroke(white);
    grid.graphics.setStrokeStyle(2);
    grid.alpha = .2;
    
    for (var i = 0; i < gridSize; i++) {
      grid.graphics.moveTo(gridLeft+(i*gridSpacing),0);
      grid.graphics.lineTo(gridLeft+(i*gridSpacing),gridHeight);
      grid.graphics.moveTo(0,(gridTop+(i*gridSpacing)));
      grid.graphics.lineTo(canvas.width,(gridTop+(i*gridSpacing)));
    }

    gridContainer.addChild(grid);
    grid.cache(0,0,canvas.width,gridHeight);

    for (var i = 0; i < gridSize; i++) {
        var hLabel = new createjs.Text(i, lightLabelStyle, white);
        hLabel.x = (gridLeft-8) + (i*gridSpacing);
        hLabel.y = gridTop - labelMargin;
        hLabel.alpha = .6;
      var vLabel = new createjs.Text(i, lightLabelStyle, white);
        vLabel.x = gridLeft - labelMargin;
        vLabel.y = (gridTop-18) + (i*gridSpacing);
        vLabel.alpha = .6;
      gridContainer.addChild(hLabel);
      gridContainer.addChild(vLabel);
    }
    return gridContainer;
  }

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

  function Box(x,y,w,h,bgColor,color,title,name) {

    var box = new createjs.Container();
    if (arguments.length == 8) {
      box.name = name;
    }

    var bg = new createjs.Shape();
    bg.graphics.beginFill(bgColor);
    bg.graphics.drawRoundRect(0,0,w,h,10);
    bg.name = "bg";

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

  function Tray(x,y,w,h,bgColor,borderColor,alpha,order,type) {

    var tray = new createjs.Shape();
    tray.graphics.beginStroke(borderColor).setStrokeStyle(8).beginFill(bgColor);
    tray.graphics.drawRoundRect(0,0,w,h,5);

    tray.x = x;
    tray.y = y;
    tray.alpha = alpha
    tray.tray = order;
    tray.type = type;

    return tray;
  }

  function DropZone(x,y,color,alpha,type,slot) {

    var dz = new createjs.Shape();
    dz.graphics.beginFill(color);
    dz.graphics.drawRoundRect(0,0,buttonSize,buttonSize,5);
    
    dz.x = x;
    dz.y = y;
    dz.alpha = alpha;
    dz.type = type
    dz.slot = slot;

    return dz;

  }

  function Padlock(x,y) {

    var icon = new createjs.Container();
    
    var lock = new createjs.Shape();
    lock.graphics.beginStroke(white).setStrokeStyle(3);
    lock.graphics.arc(15,-5,10,180*(Math.PI/180),0*(Math.PI/180));

    var lockBase = new createjs.Shape();
    lockBase.graphics.beginStroke(white).setStrokeStyle(3);
    lockBase.graphics.drawRoundRect(0,0,30,30,3);
    
    icon.addChild(lock,lockBase);
    icon.x = x;
    icon.y = y;

    return icon;

  }

  // GENERATE BUTTONS

  function PlaceholderButton(x,y) {

    var button = new createjs.Shape();
    button.graphics.beginFill(lightGray);
    button.graphics.drawRoundRect(0,0,buttonSize,buttonSize,5);
    button.alpha = .4;
    button.type = "placeholder";

    button.x = x;
    button.y = y;
    button.cache(0,0,buttonSize,buttonSize);

    return button;
  }

  function PositionButton(axis,axisW,axisH,axisX,axisY,label,x,y) {

    var posButton = new createjs.Container();

    posButton.type = "position";
    posButton.slotType = "condition";
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
    posButton.refresh = true;
    posButton.cache(0,0,buttonSize,buttonSize);

    return posButton;
  }

  function ShapeButton(tl,tr,br,bl,x,y) {

    var shapeButton = new createjs.Container();

    shapeButton.type = "shape";
    shapeButton.slotType = "condition";
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
    shapeButton.name = "shape";
    shapeButton.val = [tl,tr,br,bl];
    shapeButton.inSlot = false;
    shapeButton.refresh = true;
    shapeButton.cache(0,0,buttonSize,buttonSize);

    return shapeButton;

  }

  function LogicButton(label,x,y) {

    var logicButton = new createjs.Container();

    logicButton.type = "logic";
    logicButton.slotType = "logic";
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
    transformButton.slotType = "action";
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
    rotateButton.slotType = "action";
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
    flipButton.slotType = "action";
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


  // ------------- ADD BOARD & GAME OBJECTS -------------------


  // START WITH EVERYTHING HIDDEN

  board.visible = false;
  winGrid.visible = false;
  sequenceBox.visible = false;
  selectorsBox.visible = false;
  actionsBox.visible = false;
  gameObjects.visible = false;
  darkOverlay.visible = false;
  winOverlay.visible = false;

  stage.addChild(board,winGrid,sequenceBox,selectorsBox,actionsBox,gameObjects,winOverlay,darkOverlay);

  function loadGame() {

    for (var i = 0; i < 10; i++) {
      selectorsP1[i] = null;
      selectorsP2[i] = null;
    }

    for (var i = 0; i < 16; i++) {
      sequence[i] = null;
    }

    steps = 2;
    wTurns = 0;
    bTurns = 0;
    wConditions = 0;
    bConditions = 0;
    wActions = 0;
    bActions = 0;
    wComplete = 0;
    bComplete = 0;

    wTurn = true;
    whiteTurn.visible = true;
    blackTurn.visible = false;

    selectorsBox.getChildByName("bg").graphics.beginFill("#F9F9F9");
    selectorsBox.getChildByName("bg").graphics.drawRoundRect(0,0,336,1054,10);
    actionsBox.getChildByName("bg").graphics.beginFill("#F9F9F9");
    actionsBox.getChildByName("bg").graphics.drawRoundRect(0,0,336,1054,10);

    sequenceTrayStart();

    board.visible = true;
    sequenceBox.visible = true;
    selectorsBox.visible = true;
    actionsBox.visible = true;
    gameObjects.visible = true;

    selectorsP1 = generateConditions(selectorsP1,1);
    selectorsP2 = generateConditions(selectorsP2,2);
    loadGameObjects(4);
    stage.update();
  }

  function loadGameObjects(gridSize) {

    gameObjects.removeAllChildren();

    var row = 0;
    var column = 0;

    var startObjects = shuffle([[0,0,1,1],[0,0,1,1],[0,1,1,0],[0,1,1,0],[1,1,0,0],[1,1,0,0],[1,0,0,1],[1,0,0,1],[1,0,1,1],[0,1,1,1],[0,1,0,0],[1,0,0,0],[1,0,1,0],[1,0,1,0],[0,1,0,1],[0,1,0,1]]);

    for (var i = 0; i < (gridSize*gridSize); i++) {

      if (i/(row+1) == gridSize) { row++; column = 0; }

      var fourm = new GameObject(startObjects[i][0],startObjects[i][1],startObjects[i][2],startObjects[i][3]);
      fourm.x = colVal(column,4,180);
      fourm.y = rowVal(row,4,180,890);
      fourm.id = i;
      fourm.name = "gameObject";
      fourm.complete = false;

      objectsInPlay.push(fourm);
      gameObjects.addChild(fourm);

      column++;

    }
  }

  // ------------- INTERACTION ------------------

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
          dropZoneContainer.children[i].alpha = .7;
        }
      }

    } else if (event.currentTarget.type == "action") {

      for (var i = 0; i < dropZoneContainer.children.length; i++) {
        if (dropZoneContainer.children[i].slot == 3 || dropZoneContainer.children[i].slot == 7 || dropZoneContainer.children[i].slot == 11 || dropZoneContainer.children[i].slot == 15) {
          dropZoneContainer.children[i].alpha = .7;
        }
      }
    
    } else {

      for (var i = 0; i < dropZoneContainer.children.length; i++) {
        if ((dropZoneContainer.children[i].slot % 2) == 0) {
         dropZoneContainer.children[i].alpha = .7;
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
    } else if (dropPosition != null && sequence[dropPosition.slot] != null && (event.currentTarget.slotType == dropPosition.type)) {
      returnToOrigin(sequence[dropPosition.slot],sequence[dropPosition.slot].originParent,sequence[dropPosition.slot].originX,sequence[dropPosition.slot].originY);
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
      console.log(andCount);
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
          selectorsBox.addChild(toClear[i]);
          toClear[i].visible = false;
        }
      }
    }

    for (var i = 0; i < sequence.length; i++) {
      if (sequence[i] != null) {
        if (wTurn == true) {
          if (sequence[i].type == "position" || sequence[i].type == "shape" || sequence[i].type == "logic") {
            wConditions++;
          } else if (sequence[i].type == "action") {
            wActions++;
          }
        } else {
          if (sequence[i].type == "position" || sequence[i].type == "shape" || sequence[i].type == "logic") {
            bConditions++;
          } else if (sequence[i].type == "action") {
            bActions++;
          }
        }
      }
      sequence[i] = null;
    }

    for (var i = 0; i < steps; i++) {
        if (trays.children[i].type == "selectors") {
          trays.children[i].graphics
          .clear()
          .beginStroke(green).setStrokeStyle(8).beginFill(black)
          .drawRoundRect(0,0,442,160,5);
       } else {
          trays.children[i].graphics
          .clear()
          .beginStroke(yellow).setStrokeStyle(8).beginFill(black)
          .drawRoundRect(0,0,160,160,5);
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
      playButton.removeAllEventListeners();
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

    selectorsBox.mouseEnabled = false;
    sequenceBox.mouseEnabled = false;
    actionsBox.mouseEnabled = false;

    playButton.alpha = 1;
    playButton.removeAllEventListeners();
    clearLabel.alpha = .5;
    clearButton.removeAllEventListeners();
    newGameLabel.alpha= .5;
    newGameButton.removeAllEventListeners();
    exitLabel.alpha = .5;
    exitButton.removeAllEventListeners();

    if (wTurn == true) { wTurns++; } else { bTurns++; }

    playSequence();

    function playSequence() {

      if (playCount < steps) { 

        highlightSequenceBox(playCount);

        if (!(playCount % 2)) {
          targetGameObjects(playCount);
        } else {
          deliverAction(targetGameObjects(playCount-1),playCount);
        }
      
        window.setTimeout(playSequence,1000);
        playCount++;
      } else {
        updateScores();
        if (gameOver == false) { nextTurn(); }
      }
    }
  }

  function highlightSequenceBox(step) {

    var trayToHighlight = trays.getChildAt(step);

      if (trayToHighlight.type == "selectors") {
        trayToHighlight.graphics
        .clear()
        .beginStroke(black).setStrokeStyle(8).beginFill(black)
        .drawRoundRect(0,0,442,160,5);
      } else {
        trayToHighlight.graphics
        .clear()
        .beginStroke(black).setStrokeStyle(8).beginFill(black)
        .drawRoundRect(0,0,160,160,5);
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
          createjs.Tween.get(objectsInPlay[i], {override:true}).call(addAnim,[0]).to({alpha:1,}, 300, createjs.Ease.cubicIn).call(rmAnim);
        } else {
          createjs.Tween.get(objectsInPlay[i], {override:true}).call(addAnim,[0]).to({alpha:.2,}, 400, createjs.Ease.cubicOut).call(rmAnim);
        }
   
      } else if (ruleSet.length == 1) {

        if (ruleSet[0](objectsInPlay[i])) {
          targets.push(objectsInPlay[i]);
          createjs.Tween.get(objectsInPlay[i], {override:true}).call(addAnim,[0]).to({alpha:1,}, 300, createjs.Ease.cubicIn).call(rmAnim);
        } else {
          createjs.Tween.get(objectsInPlay[i], {override:true}).call(addAnim,[0]).to({alpha:.2,}, 400, createjs.Ease.cubicOut).call(rmAnim);
        }
      } else {
        createjs.Tween.get(objectsInPlay[i], {override:true}).call(addAnim,[0]).to({alpha:.2,}, 400, createjs.Ease.cubicOut).call(rmAnim);
      }

      var findMorph = objectsInPlay[i].getChildByName("morph");
      if (findMorph != null) {
        removeMorph(objectsInPlay[i],findMorph);
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
          if (obj.x == colVal(rule.val,4,180)) {return true;}
        }
      } else {
        ruleComponents = function(obj) {
        if (obj.y == rowVal(rule.val,4,180,890)) {return true;}
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
  
  // --------------- GAME MGMT ------------------

  function updateScores() {

  bScore = 0;
  wScore = 0;

  for (var i = 0; i < objectsInPlay.length; i++) {
    if (objectsInPlay[i].tl == 0 && objectsInPlay[i].tr == 0 && objectsInPlay[i].br == 0 && objectsInPlay[i].bl == 0) {
      if (objectsInPlay[i].complete === false && wTurn == false) {
        bComplete++;
      }
      objectsInPlay[i].complete = 0;
      bScore++;
    } else if (objectsInPlay[i].tl == 1 && objectsInPlay[i].tr == 1 && objectsInPlay[i].br == 1 && objectsInPlay[i].bl == 1) {
      if (objectsInPlay[i].complete === false && wTurn == true) {
        wComplete++;
      }
      wScore++;
      objectsInPlay[i].complete = 1;
      
    } else {
      objectsInPlay[i].complete = false;
    }
  }

  if (bScore > 3 && wScore > 3) {
    checkWin(2);
  } else if (wScore > 3 && bScore <= 3) {
    checkWin(1);
  } else if (bScore > 3 && wScore <= 3) {
    checkWin(0);
  }

  stage.update();

  } 

  function checkWin(n) {

    var completeRows;
    var completeCols;
    var completeDiag;

    var rows = [[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15]];
    var cols = [[0,4,8,12],[1,5,9,13],[2,6,10,14],[3,7,11,15]];
    var diag = [[0,5,10,15],[3,6,9,12]];

    switch(n) {
      case 0:
        if (countCompleteShapes(0)) {
          console.log(completeRows);
          console.log(completeCols);
          console.log(completeDiag);
          endGame(0);
          console.log("black win");
        }
        break;
      case 1:
        if (countCompleteShapes(1)) {
            console.log(completeRows);
            console.log(completeCols);
            console.log(completeDiag);
            endGame(1);
            console.log("white win");
        }
        break;
      case 2:
        if ((countCompleteShapes(0)) && !(countCompleteShapes(1))) {
            console.log(completeRows);
            console.log(completeCols);
            console.log(completeDiag);
            endGame(0);
            console.log("black win");
        } else if (!(countCompleteShapes(0)) && (countCompleteShapes(1))) {
            console.log(completeRows);
            console.log(completeCols);
            console.log(completeDiag);
            endGame(1);
            console.log("white win");
        } else if ((countCompleteShapes(0)) && (countCompleteShapes(1))) {
            countCompleteShapes(0);
            var blackTotal = completeRows.length + completeCols.length + completeDiag.length;
            countCompleteShapes(1);
            var whiteTotal = completeRows.length + completeCols.length + completeDiag.length;
          if (blackTotal > whiteTotal) {
            countCompleteShapes(0);
            console.log(completeRows);
            console.log(completeCols);
            console.log(completeDiag);
            endGame(0);
            console.log("black win");
          } else if (whiteTotal > blackTotal) {
            endGame(1);
            console.log("white win");
            console.log(completeRows);
            console.log(completeCols);
            console.log(completeDiag);
          } else {
            endGame(2);
            console.log("draw");
            console.log(completeRows);
            console.log(completeCols);
            console.log(completeDiag);
            countCompleteShapes(0);
            console.log(completeRows);
            console.log(completeCols);
            console.log(completeDiag);
          }
        }
        break;
    }

    function countCompleteShapes(color) {

      var success = false;
      var rowCounter = 0;
      var colCounter = 0;
      var diagCounter = 0;
      completeRows = [];
      completeCols = [];
      completeDiag = [];

      for (var a = 0; a < 4; a++) {
        for (var b = 0; b < 4; b++) {
          if (objectsInPlay[rows[a][b]].complete === color) {
            rowCounter++;
          }
          if (objectsInPlay[cols[a][b]].complete === color) {
            colCounter++;
          }
          if (a < 2) {
            if (objectsInPlay[diag[a][b]].complete === color) {
              diagCounter++;
            }
          }
        }

        if (rowCounter > 3) {
          success = true;
          completeRows.push(a);
        }

        if (colCounter > 3) {
          success = true;
          completeCols.push(a);
        }
        if (diagCounter > 3) {
          success = true;
          completeDiag.push(a);
        }
        rowCounter = 0;
        colCounter = 0;
        diagCounter = 0;
      }
      return success;
    }
  }

  function endGame(color) {

    newGameLabel.alpha= 1;
    newGameButton.addEventListener("mousedown",newGameHighlight);
    newGameButton.addEventListener("pressup",newGame);
    exitLabel.alpha = 1;
    exitButton.addEventListener("mousedown",exitHighlight);
    exitButton.addEventListener("pressup",exit);

    clearSequence();

    gameOver = true;
    console.log(gameOver);
    createjs.Ticker.setPaused(false);

    for (var i in objectsInPlay) {

      var findMorph = objectsInPlay[i].getChildByName("morph");
        if (findMorph != null) {
        removeMorph(objectsInPlay[i],findMorph);
      }

      createjs.Tween.get(objectsInPlay[i], {override:true}).to({alpha:1,}, 300, createjs.Ease.cubicIn);

    }

    if (color == 0) {
      var winner = "BLACK WINS";
      var victoryColor = black;
    } else if (color == 1) {
      var winner = "WHITE WINS";
      var victoryColor = white;
    } else {
      var winner = "DRAW";
      var victoryColor = lightGray;
    }

    winOverlay.visible = true;
    winGrid.visible = true;
    winOverlay.y = canvas.height;

    var winBG = new createjs.Shape();
    winBG.graphics.beginFill(pink).drawRect(0,0,canvas.width,(canvas.height-890));

    var newGameBanner = new createjs.Shape().set({x:0,y:920});
    newGameBanner.graphics.beginFill("#EAEAEA").drawRect(0,0,canvas.width,200);
    newGameBanner.addEventListener("mousedown",newGameBannerHighlight);
    newGameBanner.addEventListener("pressup",newGame);

    var newGameBannerText = new createjs.Text("NEW GAME","bold 80px Avenir-Heavy",green).set({x:centerX,y:960});
    newGameBannerText.textAlign = "center";

    var victory = new createjs.Text(winner,"bold 100px Avenir-Heavy",victoryColor).set({x:centerX,y:90});
    victory.textAlign = "center";

    var whiteTitle = new createjs.Text("WHITE /","bold 55px Avenir-Heavy",white).set({x:70,y:300});
    whiteTitle.textAlign = "left";
    var whiteTurns = new createjs.Text(wTurns + " TURNS","100 55px Avenir-Book",white).set({x:70,y:400});
    whiteTurns.textAlign = "left"; 
    var whiteConditions = new createjs.Text(wConditions + " CONDITIONS USED","100 55px Avenir-Book",white).set({x:70,y:500});
    whiteConditions.textAlign = "left"; 
    var whiteActions = new createjs.Text(wActions + " ACTIONS USED","100 55px Avenir-Book",white).set({x:70,y:600});
    whiteActions.textAlign = "left";
    var whiteComplete = new createjs.Text(wComplete + " COMPLETED CIRCLES","100 55px Avenir-Book",white).set({x:70,y:700});
    whiteComplete.textAlign = "left"; 

    var blackTitle = new createjs.Text("BLACK /","bold 55px Avenir-Heavy",black).set({x:(canvas.width/2)+60,y:300});
    blackTitle.textAlign = "left";
    var blackTurns = new createjs.Text(bTurns + " TURNS","100 55px Avenir-Book",black).set({x:(canvas.width/2)+50,y:400});
    blackTurns.textAlign = "left"; 
    var blackConditions = new createjs.Text(bConditions + " CONDITIONS USED","100 55px Avenir-Book",black).set({x:(canvas.width/2)+50,y:500});
    blackConditions.textAlign = "left"; 
    var blackActions = new createjs.Text(bActions + " ACTIONS USED","100 55px Avenir-Book",black).set({x:(canvas.width/2)+50,y:600});
    blackActions.textAlign = "left";
    var blackComplete = new createjs.Text(bComplete + " COMPLETED SQUARES","100 55px Avenir-Book",black).set({x:(canvas.width/2)+50,y:700});
    blackComplete.textAlign = "left";

    winOverlay.addChild(winBG,newGameBanner,newGameBannerText,victory,whiteTitle,whiteTurns,whiteConditions,whiteActions,whiteComplete,blackTitle,blackTurns,blackConditions,blackActions,blackComplete);
    selectorsBox.mouseEnabled = false;
    sequenceBox.mouseEnabled = false;
    actionsBox.mouseEnabled = false;
    stage.update();

    createjs.Tween.get(winGrid, {override:true}).call(addAnim,[0]).to({alpha:1}, 200, createjs.Ease.cubicInOut);
    createjs.Tween.get(winOverlay, {override:true}).wait(50).to({y:890}, 300, createjs.Ease.cubicInOut).call(rmAnim);

    function newGameBannerHighlight() {
      newGameBanner.alpha = .9;
      stage.update(); 
    }

  }


  function nextTurn() {

    clearLabel.alpha = 1;
    clearButton.addEventListener("mousedown",clearHighlight);
    clearButton.addEventListener("pressup",clearSequence);
    newGameLabel.alpha= 1;
    newGameButton.addEventListener("mousedown",newGameHighlight);
    newGameButton.addEventListener("pressup",newGame);
    exitLabel.alpha = 1;
    exitButton.addEventListener("mousedown",exitHighlight);
    exitButton.addEventListener("pressup",exit);

    createjs.Ticker.setPaused(false);

    for (var i in objectsInPlay) {

      var findMorph = objectsInPlay[i].getChildByName("morph");
        if (findMorph != null) {
        removeMorph(objectsInPlay[i],findMorph);
      }

      createjs.Tween.get(objectsInPlay[i], {override:true}).to({alpha:1,}, 300, createjs.Ease.cubicIn);

    }

    clearSequence();
    sequenceReady();

    selectorsBox.mouseEnabled = true;
    sequenceBox.mouseEnabled = true;
    actionsBox.mouseEnabled = true;

    if (wTurn == true) {

      if (wTurns == 1) { loadSelectors(selectorsP2,selectorsP1); } else { refreshSelectors(selectorsP1,selectorsP2); }

      wTurn = false;
      whiteTurn.visible = false;
      blackTurn.visible = true;

      selectorsBox.getChildByName("bg").graphics.beginFill(black);
      selectorsBox.getChildByName("bg").graphics.drawRoundRect(0,0,336,1054,10);
      actionsBox.getChildByName("bg").graphics.beginFill(black);
      actionsBox.getChildByName("bg").graphics.drawRoundRect(0,0,336,1054,10);

      for (var i = 0; i < selectorsP1.all.length; i++) {
        if (selectorsP1.all[i].inSlot !== false) {
          var swap = replaceSelectors(selectorsP1.all[i],selectorsP1);
          selectorsP1.all[i] = swap;
        }
      }

    } else {

      if (steps == 2) {

        dropZoneContainer.removeChild(dropZoneContainer.getChildByName(2));
        dropZoneContainer.removeChild(dropZoneContainer.getChildByName(3));

        trays.getChildAt(2).graphics
        .clear()
        .beginStroke(green).setStrokeStyle(8).beginFill(black)
        .drawRoundRect(0,0,442,160,5);
        trays.getChildAt(2).alpha = 1;
      
        trays.getChildAt(3).graphics
        .clear()
        .beginStroke(yellow).setStrokeStyle(8).beginFill(black)
        .drawRoundRect(0,0,160,160,5);
        trays.getChildAt(3).alpha = 1;

        buildSequenceStep(2,4);
        buildNextSequenceLocked(3);

        steps = 4;

      } else if (steps == 4) {

        dropZoneContainer.removeChild(dropZoneContainer.getChildByName(3));
        dropZoneContainer.removeChild(dropZoneContainer.getChildByName(4));

        trays.getChildAt(4).graphics
        .clear()
        .beginStroke(green).setStrokeStyle(8).beginFill(black)
        .drawRoundRect(0,0,442,160,5);
        trays.getChildAt(4).alpha = 1;
      
        trays.getChildAt(5).graphics
        .clear()
        .beginStroke(yellow).setStrokeStyle(8).beginFill(black)
        .drawRoundRect(0,0,160,160,5);
        trays.getChildAt(5).alpha = 1;

        buildSequenceStep(3,8);
        buildNextSequenceLocked(4);

        steps = 6;

      } else if (steps == 6) {

        dropZoneContainer.removeChild(dropZoneContainer.getChildByName(4));

        trays.getChildAt(6).graphics
        .clear()
        .beginStroke(green).setStrokeStyle(8).beginFill(black)
        .drawRoundRect(0,0,442,160,5);
        trays.getChildAt(6).alpha = 1;
      
        trays.getChildAt(7).graphics
        .clear()
        .beginStroke(yellow).setStrokeStyle(8).beginFill(black)
        .drawRoundRect(0,0,160,160,5);
        trays.getChildAt(7).alpha = 1;

        buildSequenceStep(4,12);

        steps = 8;

      }

      refreshSelectors(selectorsP2,selectorsP1);

      wTurn = true;
      whiteTurn.visible = true;
      blackTurn.visible = false;
      
      selectorsBox.getChildByName("bg").graphics.beginFill("#F9F9F9");
      selectorsBox.getChildByName("bg").graphics.drawRoundRect(0,0,336,1054,10);
      actionsBox.getChildByName("bg").graphics.beginFill("#F9F9F9");
      actionsBox.getChildByName("bg").graphics.drawRoundRect(0,0,336,1054,10);

      for (var i = 0; i < selectorsP2.all.length; i++) {
        if (selectorsP2.all[i].inSlot !== false) {
          var swap = replaceSelectors(selectorsP2.all[i],selectorsP2);
          selectorsP2.all[i] = swap;
        }
      }

    }

    stage.update();
  }

  function newGame(event) {

    newGameLabel.alpha = 1;

    if (event.currentTarget.name == "new") {
      showOverlay("NEW GAME",confirmNewGame);
    } else {
      confirmNewGame();
    }

    function confirmNewGame() {

      confirm.removeAllEventListeners();
      cancel.removeAllEventListeners();

      darkOverlay.visible = false;

      if (winOverlay.visible == true) {
        createjs.Ticker.setPaused(false);
        createjs.Tween.get(winGrid, {override:true}).call(addAnim,[0]).to({alpha:0}, 200, createjs.Ease.cubicInOut);
        createjs.Tween.get(winOverlay, {override:true}).to({y:canvas.height}, 300, createjs.Ease.cubicInOut).call(rmAnim);
      }

      objectsInPlay = [];

      for (var i = 0; i < 10; i++) {
        selectorsP1[i] = null;
        selectorsP2[i] = null;
      }

      selectorsBox.mouseEnabled = true;
      sequenceBox.mouseEnabled = true;
      actionsBox.mouseEnabled = true;
      newGameButton.mouseEnabled = true;
      exitButton.mouseEnabled = true;

      clearSequence();

      var toClear = [];

      for (var i = 0; i < selectorsBox.children.length; i++) {
        if (selectorsBox.children[i].slotType != null) {
          if (selectorsBox.children[i].slotType == "condition") {
          toClear.push(selectorsBox.children[i]);
          }
        }
      }

      for (var i = 0; i < toClear.length; i++) {
        selectorsBox.removeChild(toClear[i]);
      }

      winOverlay.visible = false;
      winGrid.visible = false;

      loadGame();
      stage.update();

      loadSelectors(selectorsP1);
    }
  }

  function newGameHighlight() {
    newGameLabel.alpha = .5;
    stage.update();
  }

  function exit() {

    exitLabel.alpha = 1;

    showOverlay("QUIT GAME",confirmExit);

    function confirmExit() {

      confirm.removeAllEventListeners();
      cancel.removeAllEventListeners();

      darkOverlay.visible = false;
      startOverlay.visible = true;

      createjs.Ticker.setPaused(false);

      startOverlay.y = canvas.height;
      loadIntro();
      startOverlay.cache(0,0,canvas.width,canvas.height);

      createjs.Tween.get(startOverlay, {override:true}).call(addAnim,[0]).to({y:0}, 600, createjs.Ease.cubicOut).call(prepNewGame);

      function prepNewGame() {
        rmAnim();
        startOverlay.uncache();

        objectsInPlay = [];
        newGameLabel.alpha = 0;
        exitLabel.alpha = 0;

        board.visible = false;
        sequenceBox.visible = false;
        selectorsBox.visible = false;
        actionsBox.visible = false;
        gameObjects.visible = false;
        darkOverlay.visible = false;

        clearSequence();

        var toClear = [];

        for (var i = 0; i < selectorsBox.children.length; i++) {
          if (selectorsBox.children[i].slotType != null) {
            if (selectorsBox.children[i].slotType == "condition") {
            toClear.push(selectorsBox.children[i]);
            }
          }
        }

        for (var i = 0; i < toClear.length; i++) {
          selectorsBox.removeChild(toClear[i]);
        }

      }
    }
  }

  function exitHighlight() {
    exitLabel.alpha = .5;
    stage.update();
  }

  // SHOW OVERLAY

  var darkOverlayBG = new createjs.Shape();
  darkOverlayBG.graphics.beginFill(black).drawRect(0,0,canvas.width,canvas.height);
  darkOverlayBG.alpha = .95;

  var confirm = new createjs.Shape().set({x:0,y:500});
  confirm.graphics.beginFill(black).drawRect(0,0,canvas.width,300);
  confirm.alpha = 0.01;

  var confirmLabel = new createjs.Text("","bold 100px Avenir-Heavy",white).set({x:centerX,y:600});
  confirmLabel.textAlign = "center";

  var cancel = new createjs.Shape().set({x:0,y:1200});
  cancel.graphics.beginFill(black).drawRect(0,0,canvas.width,300);
  cancel.alpha = 0.01;

  var cancelLabel = new createjs.Text("CANCEL","bold 100px Avenir-Heavy",white).set({x:centerX,y:1300});
  cancelLabel.textAlign = "center";

  darkOverlay.addChild(darkOverlayBG,confirm,cancel,confirmLabel,cancelLabel);
  stage.addChild(darkOverlay);

  function showOverlay(confirmText,confirmAction) {

    createjs.Ticker.setPaused(false);

    darkOverlay.visible = true;

    confirm.addEventListener("mousedown",highlightConfirm);
    confirm.addEventListener("pressup",confirmAction);

    confirmLabel.text = confirmText;
    confirmLabel.alpha = 1;

    cancel.addEventListener("mousedown",highlightCancel);
    cancel.addEventListener("pressup",cancelAction);
    cancelLabel.alpha = 1;

    darkOverlay.mouseEnabled = true;
    selectorsBox.mouseEnabled = false;
    sequenceBox.mouseEnabled = false;
    actionsBox.mouseEnabled = false;
    newGameButton.mouseEnabled = false;
    exitButton.mouseEnabled = false;

    createjs.Tween.get(darkOverlay, {override:true}).call(addAnim,[0]).to({alpha:.95}, 200, createjs.Ease.cubicOut).call(rmAnim);
  
    function highlightConfirm() {
      confirmLabel.alpha = .5;
      stage.update();
    }

    function highlightCancel() {
      cancelLabel.alpha = .5;
      stage.update();
    }

    function cancelAction() {

      confirm.removeAllEventListeners();
      cancel.removeAllEventListeners();

      createjs.Ticker.setPaused(false);
      createjs.Tween.get(darkOverlay, {override:true}).call(addAnim,[0]).to({alpha:0}, 200, createjs.Ease.cubicOut).call(rmAnim);
      darkOverlay.visible = false;
      stage.update();
      selectorsBox.mouseEnabled = true;
      sequenceBox.mouseEnabled = true;
      actionsBox.mouseEnabled = true;
      newGameButton.mouseEnabled = true;
      exitButton.mouseEnabled = true;
    }
  }

  // ---------- ACTION FUNCTIONS ------------------

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

      if (obj.scaleX == 1.8)  {createjs.Tween.get(obj, {override:true}).to({scaleY:-1.8}, 400, createjs.Ease.cubicInOut).call(redraw,[obj]); }
      else { createjs.Tween.get(obj, {override:true}).to({scaleY:-1}, 400, createjs.Ease.cubicInOut).call(redraw,[obj]); }
  }

  function morphWithHighlight(corner,color,x,y,tl,tr,br,bl) {
        
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
    if (obj.scaleX == 1.8 || obj.scaleX == -1.8) {
    obj.scaleX = 1.8; obj.scaleY = 1.8;
    } else {
    obj.scaleX = 1; obj.scaleY = 1; 
    }
    obj.updateCache();
    obj.uncache();
  }

  // ------------ INTRO AND TUTORIAL -----------------------

  var learnActions = false;
  var learnConditions = false;
  var switchCount = 0;
  var targetCount = 0;
  var showLogic = false;
  var triedAnd = false;
  var triedOr = false;
  var triedBoth = false;
  var madeCircle = false;
  var madeSquare = false;

  var startOverlayBG = new createjs.Shape();
  startOverlayBG.graphics.beginFill(green).drawRect(0,0,canvas.width,canvas.height);

  var logo = new createjs.Container();

  var tagline = new createjs.Text("DUAL IS A GAME ABOUT COMPUTATION","bold 50px Avenir-Heavy",black).set({x:centerX,y:900});
  tagline.textAlign = "center";

  var learn = new createjs.Container().set({x:centerX,y:1200});
  var learnButton = new createjs.Shape().set({x:-200,y:-60});
  learnButton.graphics.beginFill(green).drawRect(0,0,400,200);
  learnButton.alpha = 0.1;
  var learnText = new createjs.Text("LEARN","bold 60px Avenir-Heavy",white).set({x:0,y:0});
  learnText.textAlign = "center";

  learn.addChild(learnButton,learnText);

  var start = new createjs.Container().set({x:centerX,y:1450});
  var startButton = new createjs.Shape().set({x:-200,y:-60});
  startButton.graphics.beginFill(green).drawRect(0,0,400,200);
  startButton.alpha = 0.1;
  var startText = new createjs.Text("PLAY","bold 60px Avenir-Heavy",white).set({x:0,y:0});
  startText.textAlign = "center";
  start.name = "start";

  start.addChild(startButton,startText);

  var next = new createjs.Container().set({x:centerX,y:1700});
  var nextButton = new createjs.Shape().set({x:-200,y:-60});
  nextButton.graphics.beginFill(green).drawRect(0,0,400,200);
  nextButton.alpha = 0.1;
  var nextText = new createjs.Text("NEXT","bold 60px Avenir-Heavy",white).set({x:0,y:0});
  nextText.textAlign = "center";

  next.addChild(nextButton,nextText);

  var contact = new createjs.Container().set({x:centerX,y:1900});
  var contactButton = new createjs.Shape().set({x:-200,y:-60});
  contactButton.graphics.beginFill(green).drawRect(0,0,400,200);
  contactButton.alpha = 0.1;
  var contactText = new createjs.Text("hello@samwander.com","100 40px Avenir-Book",white).set({x:0,y:0});
  contactText.textAlign = "center";

  contact.addChild(contactButton,contactText);

  var tutorialGrid = new Grid(2,380,1000,230);

  // TUTORIAL

  var closeTutorial = new createjs.Container().set({x:100,y:100});
  var closeButton = new createjs.Shape();
  closeButton.graphics.beginFill(green).drawRect(-25,-25,125,125);
  var closeX = new createjs.Shape();
  closeX.graphics.beginStroke(white).setStrokeStyle(20,"round");
  closeX.graphics.moveTo(0,0);
  closeX.graphics.lineTo(75,75);
  closeX.graphics.moveTo(0,75);
  closeX.graphics.lineTo(75,0);
  closeTutorial.addChild(closeButton,closeX);
  closeTutorial.alpha = 0;

  var tutorialBG = new createjs.Shape().set({x:0,y:1000});
  tutorialBG.graphics.beginFill("#EAEAEA").drawRect(0,0,canvas.width,canvas.height-1000);
  tutorialBG.alpha = 0;
  var tutorialTray = new createjs.Shape().set({x:0,y:1000});
  tutorialTray.graphics.beginFill("#616060").drawRect(0,0,canvas.width,400);
  tutorialTray.alpha = 0;

  var tutorialText1 = new createjs.Text("DUAL is a two player game about sequential thinking.", "100 60px Avenir-Book", black).set({x:centerX,y:1150});
  tutorialText1.textAlign = "center";
  tutorialText1.lineWidth = 1100;
  tutorialText1.lineHeight = 80;
  tutorialText1.alpha = 0;

  var tutorialText2 = new createjs.Text("Each shape has four segments. These can be switched between round (white) and square (black).", "100 60px Avenir-Book", black).set({x:centerX,y:1400});
  tutorialText2.textAlign = "center";
  tutorialText2.lineWidth = 1100;
  tutorialText2.lineHeight = 80;
  tutorialText2.alpha = 0;

  var tutorialText3 = new createjs.Text("", "100 60px Avenir-Book", white).set({x:centerX,y:280});

  var tutorialNextButton = new createjs.Shape().set({x:centerX-200,y:1740});
  tutorialNextButton.graphics.beginFill("#EAEAEA").drawRect(0,0,400,100);
  tutorialNextButton.alpha = 0;
  tutorialNextButton.name = "next";
  var tutorialNextLabel = new createjs.Text("LET'S TRY IT", "100 60px Avenir-Heavy", green).set({x:centerX,y:1750});
  tutorialNextLabel.textAlign = "center";
  tutorialNextLabel.alpha = 0;

  // SWITCH ITEMS

  var seqBox = new createjs.Container().set({x:(canvas.width/2)+10,y:1125});

  var seqTray = new createjs.Shape().set({x:0,y:-3});
  seqTray.graphics.beginStroke(green).setStrokeStyle(8).beginFill(black);
  seqTray.graphics.drawRoundRect(0,0,442,160,5);

  var actTray = new createjs.Shape().set({x:0,y:-3});
  actTray.graphics.beginStroke(yellow).setStrokeStyle(8).beginFill(black);
  actTray.graphics.drawRoundRect(0,0,160,160,5);

  var dzContainer = new createjs.Container();

  var dropZone0 = new createjs.Shape().set({x:15,y:12});
  var dropZone1 = new createjs.Shape().set({x:15 + buttonSize + (buttonMargin+4),y:12});
  var dropZone2 = new createjs.Shape().set({x:15 + (buttonSize*2) + ((buttonMargin+4)*2),y:12});
  var dropZone3 = new createjs.Shape().set({x:15,y:12});

  dropZone0.graphics.beginFill(green);
  dropZone0.graphics.drawRoundRect(0,0,buttonSize,buttonSize,5);
  dropZone0.alpha = .25;
  dropZone0.type = "condition";
  dropZone0.slot = 0;
  dropZone1.graphics.beginFill(blue);
  dropZone1.graphics.drawRoundRect(0,0,buttonSize,buttonSize,5);
  dropZone1.alpha = .25;
  dropZone1.type = "logic";
  dropZone1.slot = 1;
  dropZone2.graphics.beginFill(green);
  dropZone2.graphics.drawRoundRect(0,0,buttonSize,buttonSize,5);
  dropZone2.alpha = .25;
  dropZone2.type = "condition";
  dropZone2.slot = 2;
  dropZone3.graphics.beginFill(yellow);
  dropZone3.graphics.drawRoundRect(0,0,buttonSize,buttonSize,5);
  dropZone3.alpha = .25;
  dropZone3.type = "action";
  dropZone3.slot = 3;

  var required = new createjs.Text("*","bold 100px Avenir-Heavy", white).set({x:55,y:30});
  required.alpha = .1;

  dzContainer.addChild(dropZone0,dropZone1,dropZone2,dropZone3,required);

  var playButtonLearn = new createjs.Shape().set({x:200,y:40});
  playButtonLearn.graphics.beginFill(gray).drawRoundRect(0,0,200,80,10);
  playButtonLearn.alpha = .5;
  var playLabelLearn = new createjs.Text("PLAY", largeLabelStyle, pink).set({x:300,y:54});
  playLabelLearn.textAlign = "center";

  seqBox.addChild(actTray,seqTray,dzContainer,playButtonLearn,playLabelLearn);

  var switchTutorial = new createjs.Container().set({x:310,y:1068})
  switchTutorial.alpha = 0;

  var transformTLLearn = new TransformButton(50,50,iconRadius,0,0,0,35,35,0,0);
  transformTLLearn.removeAllEventListeners();
  transformTLLearn.originParent = switchTutorial;
  transformTLLearn.name = "transTL";
  transformTLLearn.func = transTL;
  var placeholder1 = new PlaceholderButton(transformTLLearn.x,transformTLLearn.y);
  placeholder1.alpha = .7;
  var transformTRLearn = new TransformButton(35,50,0,iconRadius,0,0,50,35,(buttonSize+buttonMargin),0);
  transformTRLearn.removeAllEventListeners();
  transformTRLearn.originParent = switchTutorial;
  transformTRLearn.name = "transTR";
  transformTRLearn.func = transTR;
  var placeholder2 = new PlaceholderButton(transformTRLearn.x,transformTRLearn.y);
  placeholder2.alpha = .7;
  var transformBLLearn = new TransformButton(50,35,0,0,0,iconRadius,35,50,0,(buttonSize+buttonMargin));
  transformBLLearn.removeAllEventListeners();
  transformBLLearn.originParent = switchTutorial;
  transformBLLearn.name = "transBL";
  transformBLLearn.func = transBL;
  var placeholder3 = new PlaceholderButton(transformBLLearn.x,transformBLLearn.y);
  placeholder3.alpha = .7;
  var transformBRLearn = new TransformButton(35,35,0,0,iconRadius,0,50,50,(buttonSize + buttonMargin),(buttonSize + buttonMargin));
  transformBRLearn.removeAllEventListeners();
  transformBRLearn.originParent = switchTutorial;
  transformBRLearn.name = "transBR";
  transformBRLearn.func = transBR;
  var placeholder4 = new PlaceholderButton(transformBRLearn.x,transformBRLearn.y);
  placeholder4.alpha = .7;

  switchTutorial.addChild(placeholder1,placeholder2,placeholder3,placeholder4,transformTLLearn,transformTRLearn,transformBLLearn,transformBRLearn);

  var tutorialConditions = new createjs.Container().set({x:310,y:1068})
  tutorialConditions.alpha = 0;

  var rowSelectorLearn = new PositionButton("row",100,30,15,50,0,0,0);
  rowSelectorLearn.removeAllEventListeners();
  rowSelectorLearn.originParent = tutorialConditions;
  var placeholder5 = new PlaceholderButton(rowSelectorLearn.x,rowSelectorLearn.y);
  placeholder5.alpha = .7
  var colSelectorLearn = new PositionButton("col",30,100,50,15,1,(buttonSize + buttonMargin),0);
  colSelectorLearn.removeAllEventListeners();
  colSelectorLearn.originParent = tutorialConditions;
  var placeholder6 = new PlaceholderButton(colSelectorLearn.x,colSelectorLearn.y);
  placeholder6.alpha = .7
  var shapeSelector1 = new ShapeButton(0,1,1,0,0,(buttonSize+buttonMargin));
  shapeSelector1.removeAllEventListeners();
  shapeSelector1.originParent = tutorialConditions;
  var placeholder7 = new PlaceholderButton(shapeSelector1.x,shapeSelector1.y);
  placeholder7.alpha = .7
  var shapeSelector2 = new ShapeButton(0,1,0,0,(buttonSize+buttonMargin),(buttonSize+buttonMargin));
  shapeSelector2.removeAllEventListeners();
  shapeSelector2.originParent = tutorialConditions;
  var placeholder8 = new PlaceholderButton(shapeSelector2.x,shapeSelector2.y);
  placeholder8.alpha = .7

  var andLogicLearn = new LogicButton("AND",(2*buttonSize) + (2*buttonMargin),0);
  andLogicLearn.removeAllEventListeners();
  andLogicLearn.originParent = tutorialConditions;
  andLogicLearn.alpha = 0;
  var placeholder9 = new PlaceholderButton(andLogicLearn.x,andLogicLearn.y);
  placeholder9.alpha = 0;
  var orLogicLearn = new LogicButton("OR",(2*buttonSize) + (2*buttonMargin),(buttonSize + buttonMargin));
  orLogicLearn.removeAllEventListeners();
  orLogicLearn.originParent = tutorialConditions;
  orLogicLearn.alpha = 0;
  var placeholder10 = new PlaceholderButton(orLogicLearn.x,orLogicLearn.y);
  placeholder10.alpha = 0;

  var andCheck = new createjs.Text("AND","bold 40px Avenir-Heavy",blue).set({x:centerX+80,y:(canvas.height - 220)});
  andCheck.textAlign = "center";
  andCheck.alpha = 0;
  var orCheck = new createjs.Text("OR","bold 40px Avenir-Heavy",blue).set({x:centerX+80,y:(canvas.height - 140)});
  orCheck.textAlign = "center";
  orCheck.alpha = 0;

  tutorialConditions.addChild(placeholder5,placeholder6,placeholder7,placeholder8,placeholder9,placeholder10,rowSelectorLearn,colSelectorLearn,shapeSelector1,shapeSelector2,andLogicLearn,orLogicLearn);

  var arrow = new createjs.Shape().set({x:(canvas.width/2)-120,y:1170});
  arrow.graphics.beginFill(pink);
  arrow.graphics.moveTo(0,0);
  arrow.graphics.lineTo(60,30);
  arrow.graphics.lineTo(0,60);
  arrow.alpha = 0;

  var whiteCircle = new createjs.Shape().set({x:centerX+210,y:(canvas.height - 215)});
  whiteCircle.graphics.beginFill(white).drawCircle(0,0,iconRadius,iconRadius);
  whiteCircle.alpha = 0;

  var whiteCheck = new createjs.Shape().set({x:centerX+290,y:(canvas.height - 255)});
  whiteCheck.graphics.beginStroke(pink).setStrokeStyle(14,"round","round");
  whiteCheck.graphics.moveTo(0,40);
  whiteCheck.graphics.lineTo(20,55);
  whiteCheck.graphics.lineTo(50,20);
  whiteCheck.alpha = 0;

  var blackSquare = new createjs.Shape().set({x:centerX+170,y:(canvas.height - 155)});
  blackSquare.graphics.beginFill(black).drawRect(0,0,iconRadius*2,iconRadius*2);
  blackSquare.alpha = 0;

  var blackCheck = new createjs.Shape().set({x:centerX+290,y:(canvas.height - 155)});
  blackCheck.graphics.beginStroke(pink).setStrokeStyle(14,"round","round");
  blackCheck.graphics.moveTo(0,40);
  blackCheck.graphics.lineTo(20,55);
  blackCheck.graphics.lineTo(50,20);
  blackCheck.alpha = 0;

  // NEXT SECTION

  var nextOverlay = new createjs.Container().set({x:0,y:canvas.height});

  var nextOverlayBG = new createjs.Shape();
  nextOverlayBG.graphics.beginFill(blue).drawRect(0,0,canvas.width,canvas.height);

  var closeNext = new createjs.Container().set({x:centerX-60,y:100});
  var closeNextButton = new createjs.Shape();
  closeNextButton.graphics.beginFill(blue).drawRect(-25,-25,200,125);
  var closeArrow = new createjs.Shape();
  closeArrow.graphics.beginStroke(white).setStrokeStyle(20,"round", "round");
  closeArrow.graphics.moveTo(0,60);
  closeArrow.graphics.lineTo(60,0);
  closeArrow.graphics.lineTo(120,60);
  closeNext.addChild(closeNextButton,closeArrow);

  var nTitle = new createjs.Text("DUAL was designed to introduce players to basic programming concepts.","400 60px Avenir-Heavy", white).set({x:centerX,y:250});
  nTitle.lineWidth = 1200;
  nTitle.textAlign = "center";

  var nSubTitle = new createjs.Text("All computer programs are built from three simple structures: selection, sequence and loop (and now you know about them all).","200 40px Avenir-Medium", white).set({x:centerX,y:450});
  nSubTitle.lineWidth = 1200;
  nSubTitle.lineHeight = 55;
  nSubTitle.textAlign = "center";

  var nSelection = new createjs.Text("SELECTION","200 60px Avenir-Medium", white).set({x:170,y:640});
  nSelection.textAlign = "left";

  var nSelectionText = new createjs.Text("When you use conditions you\'re testing to see if shapes return TRUE or FALSE. In code these are called conditional statements. You also learned about logical operators: when you use AND a program returns true if both conditions are met. OR returns true if either condition is met.","200 40px Avenir-Medium", white).set({x:650,y:640});
  nSelectionText.lineWidth = 700;
  nSelectionText.lineHeight = 55;
  nSelectionText.textAlign = "left";

  var nSequence = new createjs.Text("SEQUENCE","200 60px Avenir-Medium", white).set({x:170,y:1140});
  nSequence.textAlign = "left";

  var nSeqText = new createjs.Text("A program reads code in sequential order, responding to changing states as it goes along. This is exactly how your sequences work each turn.","200 40px Avenir-Medium", white).set({x:650,y:1140});
  nSeqText.lineWidth = 700;
  nSeqText.lineHeight = 55;
  nSeqText.textAlign = "left";

  var nLoop = new createjs.Text("LOOP","200 60px Avenir-Medium", white).set({x:170,y:1420});
  nLoop.textAlign = "left";

  var nLoopText = new createjs.Text("When you hit play, the program loops through every shape on the grid: first to check if each shape meets your set of conditions and then to perform each action in your sequence.","200 40px Avenir-Medium", white).set({x:650,y:1420});
  nLoopText.lineWidth = 700;
  nLoopText.lineHeight = 55;
  nLoopText.textAlign = "left";

  var nButton = new createjs.Shape().set({x:centerX-400,y:1770});
  nButton.graphics.beginFill("#EAEAEA");
  nButton.graphics.drawRoundRect(0,0,800,160,20);

  var nConclusion = new createjs.Text("LEARN MORE","200 80px Avenir-Heavy", pink).set({x:centerX,y:1800});
  nConclusion.lineWidth = 800;
  nConclusion.lineHeight = 65;
  nConclusion.textAlign = "center";

  nextOverlay.addChild(nextOverlayBG,closeNext,nTitle,nSubTitle,nSelection,nSelectionText,nSequence,nSeqText,nLoop,nLoopText,nButton,nConclusion);

  startOverlay.visible = false;
  stage.addChild(startOverlay);

  loadIntro();

  function loadIntro() {

    learnActions = false;
    learnConditions = false;
    switchCount = 0;
    targetCount = 0;
    showLogic = false;
    triedAnd = false;
    triedOr = false;
    triedBoth = false;
    madeCircle = false;
    madeSquare = false;

    tutorialObjectsInPlay = [];
    logo.removeAllChildren();
    clearSequenceLearn();

    andCheck.visible = false;
    orCheck.visible = false;
    whiteCircle.visible = false;
    whiteCheck.visible = false;
    blackSquare.visible = false;
    blackCheck.visible = false;
    dropZone0.visible = false;
    dropZone1.visible = false;
    dropZone2.visible = false;
    dropZone3.visible = false;
    required.visible = false;
    actTray.visible = false;
    seqTray.visible = false;
    tutorialConditions.visible = false;
    switchTutorial.visible = false;
    andLogicLearn.visible = false;
    orLogicLearn.visible = false;

    playButtonLearn.removeAllEventListeners();

    startOverlay.addChild(startOverlayBG,tutorialGrid,logo,tagline,learn,start,next,closeTutorial,tutorialBG,tutorialTray,tutorialText1,tutorialText2,tutorialText3,tutorialNextButton,tutorialNextLabel,seqBox,switchTutorial,tutorialConditions,arrow,whiteCircle,whiteCheck,andCheck,orCheck,blackSquare,blackCheck);

    var D = new GameObject(0,1,1,0).set({x:centerX-450,y:0});
    D.scaleX = 1.8;
    D.scaleY = 1.8;
    tutorialObjectsInPlay.push(D);

    var U = new GameObject(0,0,1,1).set({x:centerX-150,y:0});
    U.scaleX = 1.8;
    U.scaleY = 1.8;
    tutorialObjectsInPlay.push(U);

    var A = new GameObject(1,1,0,0).set({x:centerX+150,y:0});
    A.scaleX = 1.8;
    A.scaleY = 1.8;
    tutorialObjectsInPlay.push(A);

    var L = new GameObject(0,1,0,0).set({x:centerX+450,y:0});
    L.scaleX = 1.8;
    L.scaleY = 1.8;
    tutorialObjectsInPlay.push(L);

    logo.y = 700;
    logo.alpha = 1;
    logo.addChild(D,U,A,L);

    tagline.alpha = 1;

    tutorialGrid.alpha = 0;
    tutorialBG.alpha = 0;
    tutorialTray.alpha = 0;
    closeTutorial.alpha = 0;

    tutorialNextButton.graphics
    .clear()
    .beginFill("#EAEAEA").drawRect(0,0,400,100);

    tutorialNextLabel.color = green;

    tutorialText1.visible = false;
    tutorialText2.visible = false;
    tutorialText3.visible = false;
    tutorialNextButton.visible = false;
    tutorialNextLabel.visible = false;

    switchTutorial.alpha = 0;
    seqBox.alpha = 0;
    arrow.alpha = 0;

    whiteCircle.x = centerX+210;
    whiteCircle.y = canvas.height-215;
    whiteCircle.alpha = 0;
    whiteCheck.x = centerX+290;
    whiteCheck.y = canvas.height-255;
    whiteCheck.alpha = 0;
    blackSquare.x = centerX+170;
    blackSquare.alpha = 0;
    blackSquare.y = canvas.height-155;
    blackCheck.x = centerX+290;
    blackCheck.y = canvas.height-155;
    blackCheck.alpha = 0;

    learn.removeAllEventListeners();
    learn.addEventListener("mousedown",highlightButton);
    learn.addEventListener("pressup",beginTutorial);
    learn.alpha = 1;

    start.removeAllEventListeners();
    start.addEventListener("mousedown",highlightButton);
    start.addEventListener("pressup",beginGame);
    start.alpha = 1;

    next.removeAllEventListeners();
    next.addEventListener("mousedown",highlightButton);
    next.addEventListener("pressup",showNext);
    next.alpha = 1;

    seqBox.x = (canvas.width/2)+10;
    seqBox.y = 1125;
    arrow.x = (canvas.width/2)-120;
    arrow.y = 1170;

    tutorialConditions.x = 310;
    tutorialConditions.alpha = 0;

    seqBox.visible = false;
    switchTutorial.visible = false;
    tutorialConditions.visible = false;
    arrow.visible = false;

    startOverlay.visible = true;
    stage.update();

    // TUTORIAL

    closeTutorial.addEventListener("mousedown",highlightButton);
    closeTutorial.addEventListener("pressup",returnToStart);

    // SWITCH ITEMS

    transformTLLearn.removeAllEventListeners();
    transformTLLearn.addEventListener("mousedown",grabItemLearn);
    transformTLLearn.addEventListener("pressmove",dragAndDrop);
    transformTLLearn.addEventListener("pressup",snapToLearn);
    
    transformTRLearn.removeAllEventListeners();
    transformTRLearn.addEventListener("mousedown",grabItemLearn);
    transformTRLearn.addEventListener("pressmove",dragAndDrop);
    transformTRLearn.addEventListener("pressup",snapToLearn);
 
    transformBLLearn.removeAllEventListeners();
    transformBLLearn.addEventListener("mousedown",grabItemLearn);
    transformBLLearn.addEventListener("pressmove",dragAndDrop);
    transformBLLearn.addEventListener("pressup",snapToLearn);
   
    transformBRLearn.removeAllEventListeners();
    transformBRLearn.addEventListener("mousedown",grabItemLearn);
    transformBRLearn.addEventListener("pressmove",dragAndDrop);
    transformBRLearn.addEventListener("pressup",snapToLearn);
  
    rowSelectorLearn.removeAllEventListeners();
    rowSelectorLearn.addEventListener("mousedown",grabItemLearn);
    rowSelectorLearn.addEventListener("pressmove",dragAndDrop);
    rowSelectorLearn.addEventListener("pressup",snapToLearn);
  
    colSelectorLearn.removeAllEventListeners();
    colSelectorLearn.addEventListener("mousedown",grabItemLearn);
    colSelectorLearn.addEventListener("pressmove",dragAndDrop);
    colSelectorLearn.addEventListener("pressup",snapToLearn);
    
    shapeSelector1.removeAllEventListeners();
    shapeSelector1.addEventListener("mousedown",grabItemLearn);
    shapeSelector1.addEventListener("pressmove",dragAndDrop);
    shapeSelector1.addEventListener("pressup",snapToLearn);
    
    shapeSelector2.removeAllEventListeners();
    shapeSelector2.addEventListener("mousedown",grabItemLearn);
    shapeSelector2.addEventListener("pressmove",dragAndDrop);
    shapeSelector2.addEventListener("pressup",snapToLearn);
   
    function beginTutorial(event) {

      learn.removeAllEventListeners();
      start.removeAllEventListeners();
      next.removeAllEventListeners();

      tutorialText1.alpha = 0;
      tutorialText1.x = centerX;
      tutorialText1.y = 1150;
      tutorialText1.text = "DUAL is a two player game about sequential thinking.";
      tutorialText1.lineWidth = 1100;
      tutorialText1.lineHeight = 80;
      tutorialText2.alpha = 0;
      tutorialText2.x = centerX;
      tutorialText2.y = 1400;
      tutorialText2.text = "Each shape has four segments. These can be switched between round (white) and square (black).";
      tutorialText2.lineWidth = 1100;
      tutorialText2.lineHeight = 80;
      tutorialNextButton.alpha = 0;
      tutorialNextButton.x = centerX-200;
      tutorialNextButton.y = 1740;
      tutorialNextButton.removeAllEventListeners();
      tutorialNextLabel.alpha = 0;
      tutorialNextLabel.text = "LET'S TRY IT";
      tutorialNextLabel.x = centerX;
      tutorialNextLabel.y = 1750;

      tutorialText1.visible = true;
      tutorialText2.visible = true;
      tutorialNextButton.visible = true;
      tutorialNextLabel.visible = true;

      createjs.Ticker.setPaused(false);

      createjs.Tween.get(learn).call(addAnim,[0]).to({alpha:0}, 300, createjs.Ease.cubicIn);
      createjs.Tween.get(start).wait(300).to({alpha:0}, 300, createjs.Ease.cubicIn);
      createjs.Tween.get(next).wait(300).to({alpha:0}, 300, createjs.Ease.cubicIn);
      createjs.Tween.get(tagline).wait(300).to({alpha:0}, 300, createjs.Ease.cubicIn);

      createjs.Tween.get(tutorialGrid).wait(300).to({alpha:1}, 300, createjs.Ease.cubicIn);
      createjs.Tween.get(tutorialBG).wait(500).to({alpha:1}, 400, createjs.Ease.cubicIn);

      D.cache(-135,-135,270,270);
      U.cache(-135,-135,270,270);
      A.cache(-135,-135,270,270);
      L.cache(-135,-135,270,270);

      createjs.Tween.get(D).wait(1000).to({x:colVal(0,2,380),y:rowVal(0,2,380,1000)-700}, 600, createjs.Ease.backInOut);
      createjs.Tween.get(U).wait(1200).to({x:colVal(1,2,380),y:rowVal(0,2,380,1000)-700}, 600, createjs.Ease.backInOut);
      createjs.Tween.get(A).wait(1400).to({x:colVal(0,2,380),y:rowVal(1,2,380,1000)-700}, 500, createjs.Ease.backOut);
      createjs.Tween.get(L).wait(1600).to({x:colVal(1,2,380),y:rowVal(1,2,380,1000)-700}, 500, createjs.Ease.getBackOut(1)).call(tutorialReady);

      function tutorialReady() {

        addButtonEvent(trySwitchingCorners);

        createjs.Tween.get(tutorialText1).wait(200).to({alpha:1}, 400, createjs.Ease.cubicIn);
        createjs.Tween.get(tutorialText2).wait(400).to({alpha:1}, 400, createjs.Ease.cubicIn);
        createjs.Tween.get(tutorialNextButton).wait(200).to({alpha:1}, 100, createjs.Ease.cubicIn);
        createjs.Tween.get(tutorialNextLabel).wait(1000).to({alpha:1}, 400, createjs.Ease.cubicIn);
        createjs.Tween.get(closeTutorial).wait(1500).to({alpha:.9}, 200, createjs.Ease.cubicIn).call(readyToLoadTutorialItems);

        logo.y = 0;
        D.y = rowVal(0,2,380,1000);
        D.uncache();
        U.y = rowVal(0,2,380,1000);
        U.uncache();
        A.y = rowVal(1,2,380,1000);
        A.uncache();
        L.y = rowVal(1,2,380,1000);
        L.uncache();
        stage.update();

      function readyToLoadTutorialItems() {
        rmAnim();
      }
    }
  }

  function trySwitchingCorners() {

    learnActions = true;

    tutorialNextButton.removeAllEventListeners();

    createjs.Ticker.setPaused(false);

    sequence[3] = null;

    seqBox.visible = true;
    switchTutorial.visible = true;
    arrow.visible = true;

    whiteCircle.visible = true;
    whiteCheck.visible = true;
    blackSquare.visible = true;
    blackCheck.visible = true;

    dropZone3.visible = true;
    actTray.visible = true;
    playButtonLearn.visible = true;
    playLabelLearn.visible = true;
    
    createjs.Tween.get(tutorialText1).call(addAnim,[0]).wait(200).to({alpha:0}, 400, createjs.Ease.cubicOut);
    createjs.Tween.get(tutorialText2).wait(200).to({alpha:0}, 400, createjs.Ease.cubicOut).call(replaceText,[tutorialText2,centerX,1600,"Drag items into the action tray and hit play to see what happens."]).wait(1000).to({alpha:1}, 400, createjs.Ease.cubicIn);
    createjs.Tween.get(tutorialNextButton).wait(200).to({alpha:0}, 100, createjs.Ease.cubicOut);
    createjs.Tween.get(tutorialNextLabel).wait(200).to({alpha:0}, 400, createjs.Ease.cubicOut);
    createjs.Tween.get(tutorialTray).wait(800).to({alpha:1}, 400, createjs.Ease.cubicIn);
    createjs.Tween.get(switchTutorial).wait(1200).to({alpha:1}, 400, createjs.Ease.cubicIn);
    createjs.Tween.get(arrow).wait(1400).to({alpha:1}, 400, createjs.Ease.cubicIn);
    createjs.Tween.get(seqBox).wait(1600).to({alpha:1}, 400, createjs.Ease.cubicIn).wait(200).call(rmAnim);

  }

  function tryConditions() {

    learnActions = false;
    learnConditions = true;

    andLogicLearn.alpha = 0;
    placeholder9.alpha = 0;
    orLogicLearn.alpha = 0;
    placeholder10.alpha = 0;
    andCheck.alpha = 0;
    orCheck.alpha = 0;

    tutorialNextButton.removeAllEventListeners();
    tutorialConditions.visible = true;

    function manualTransformTL() {
      morph(tutorialObjectsInPlay[0].getChildByName("TL"),black,-radius,-radius,0,0,0,0);
      morph(tutorialObjectsInPlay[1].getChildByName("TL"),black,-radius,-radius,0,0,0,0);
      morph(tutorialObjectsInPlay[2].getChildByName("TL"),white,-radius,-radius,radius,0,0,0);
      morph(tutorialObjectsInPlay[3].getChildByName("TL"),black,-radius,-radius,0,0,0,0);
    }

    function manualTransformTR() {
      morph(tutorialObjectsInPlay[0].getChildByName("TR"),white,0,-radius,0,radius,0,0);
      morph(tutorialObjectsInPlay[1].getChildByName("TR"),black,0,-radius,0,0,0,0);
      morph(tutorialObjectsInPlay[2].getChildByName("TR"),white,0,-radius,0,radius,0,0);
      morph(tutorialObjectsInPlay[3].getChildByName("TR"),white,0,-radius,0,radius,0,0);
    }

    function manualTransformBR() {
      morph(tutorialObjectsInPlay[0].getChildByName("BR"),white,0,0,0,0,radius,0);
      morph(tutorialObjectsInPlay[1].getChildByName("BR"),white,0,0,0,0,radius,0);
      morph(tutorialObjectsInPlay[2].getChildByName("BR"),black,0,0,0,0,0,0);
      morph(tutorialObjectsInPlay[3].getChildByName("BR"),black,0,0,0,0,0,0);
    }

    function manualTransformBL() {
      morph(tutorialObjectsInPlay[0].getChildByName("BL"),black,-radius,0,0,0,0,0);
      morph(tutorialObjectsInPlay[1].getChildByName("BL"),white,-radius,0,0,0,0,radius);
      morph(tutorialObjectsInPlay[2].getChildByName("BL"),black,-radius,0,0,0,0,0);
      morph(tutorialObjectsInPlay[3].getChildByName("BL"),black,-radius,0,0,0,0,0);
    }

    createjs.Ticker.setPaused(false);
    createjs.Tween.get(tutorialText1).call(addAnim,[0]).to({alpha:0}, 400, createjs.Ease.cubicOut);
    createjs.Tween.get(whiteCircle).to({alpha:0}, 400, createjs.Ease.cubicOut);
    createjs.Tween.get(blackSquare).to({alpha:0}, 400, createjs.Ease.cubicOut);
    createjs.Tween.get(whiteCheck).to({alpha:.0}, 400, createjs.Ease.cubicOut);
    createjs.Tween.get(blackCheck).to({alpha:.0}, 400, createjs.Ease.cubicOut);
    createjs.Tween.get(tutorialNextButton).wait(200).to({alpha:0}, 100, createjs.Ease.cubicOut);
    createjs.Tween.get(tutorialNextLabel).wait(200).to({alpha:0}, 400, createjs.Ease.cubicOut);
    createjs.Tween.get(D).wait(200).to({alpha:0}, 200, createjs.Ease.cubicOut).call(manualTransforms).to({alpha:.2}, 400, createjs.Ease.cubicIn);
    createjs.Tween.get(U).wait(200).to({alpha:0}, 200, createjs.Ease.cubicOut).to({alpha:.2}, 600, createjs.Ease.cubicIn);
    createjs.Tween.get(A).wait(200).to({alpha:0}, 200, createjs.Ease.cubicOut).to({alpha:.2}, 600, createjs.Ease.cubicIn);
    createjs.Tween.get(L).wait(200).to({alpha:0}, 200, createjs.Ease.cubicOut).to({alpha:.2}, 600, createjs.Ease.cubicIn);
    createjs.Tween.get(tutorialText2).wait(200).to({alpha:0}, 400, createjs.Ease.cubicOut).call(replaceText,[tutorialText2,centerX,1550,"Target shapes on the grid with condition items like these. You can target by row, column, or exactly matching a shape."]).wait(400).to({alpha:1}, 400, createjs.Ease.cubicIn);
    createjs.Tween.get(switchTutorial).wait(400).to({alpha:0}, 400, createjs.Ease.cubicOut);
    createjs.Tween.get(tutorialConditions).wait(600).to({alpha:1}, 400, createjs.Ease.cubicIn);
    createjs.Tween.get(arrow).wait(400).to({alpha:0}, 400, createjs.Ease.cubicOut).to({alpha:1}, 400, createjs.Ease.cubicIn);
    createjs.Tween.get(seqBox).wait(400).to({alpha:0}, 400, createjs.Ease.cubicOut).call(loadConditions).wait(200).to({alpha:1}, 600, createjs.Ease.cubicIn).call(rmAnim);

    function manualTransforms() {
      manualTransformTL();
      manualTransformTR();
      manualTransformBR();
      manualTransformBL();

      tutorialObjectsInPlay[0].tl = 0;
      tutorialObjectsInPlay[0].tr = 1;
      tutorialObjectsInPlay[0].br = 1;
      tutorialObjectsInPlay[0].bl = 0;

      tutorialObjectsInPlay[1].tl = 0;
      tutorialObjectsInPlay[1].tr = 0;
      tutorialObjectsInPlay[1].br = 1;
      tutorialObjectsInPlay[1].bl = 1;

      tutorialObjectsInPlay[2].tl = 1;
      tutorialObjectsInPlay[2].tr = 1;
      tutorialObjectsInPlay[2].br = 0;
      tutorialObjectsInPlay[2].bl = 0;

      tutorialObjectsInPlay[3].tl = 0;
      tutorialObjectsInPlay[3].tr = 1;
      tutorialObjectsInPlay[3].br = 0;
      tutorialObjectsInPlay[3].bl = 0;
    }

    function loadConditions() {

      whiteCircle.visible = false;
      blackSquare.visible = false;
      dropZone3.visible = false;
      actTray.visible = false;
      playButtonLearn.visible = false;
      playLabelLearn.visible = false;

      andCheck.visible = true;
      orCheck.visible = true;
      dropZone0.visible = true;
      dropZone1.visible = true;
      dropZone2.visible = true;
      required.visible = true;
      seqTray.visible = true;
      andLogicLearn.visible = true;
      orLogicLearn.visible = true;

      whiteCheck.x = centerX+170;
      whiteCheck.y = canvas.height-240;
      blackCheck.x = centerX+170;
      blackCheck.y = canvas.height-160;
    }

  }

  function showLogicItems() {

    createjs.Ticker.setPaused(false);

    showLogic = true;

    andLogicLearn.addEventListener("mousedown",grabItemLearn);
    andLogicLearn.addEventListener("pressmove",dragAndDrop);
    andLogicLearn.addEventListener("pressup",snapToLearn);

    orLogicLearn.addEventListener("mousedown",grabItemLearn);
    orLogicLearn.addEventListener("pressmove",dragAndDrop);
    orLogicLearn.addEventListener("pressup",snapToLearn);
    
    createjs.Tween.get(tutorialConditions).call(addAnim,[0]).wait(200).to({x:tutorialConditions.x - 60}, 400, createjs.Ease.cubicInOut);
    createjs.Tween.get(arrow).wait(200).to({x:arrow.x + 90}, 400, createjs.Ease.cubicInOut);
    createjs.Tween.get(seqBox).wait(200).to({x:seqBox.x + 90}, 400, createjs.Ease.cubicInOut);
    createjs.Tween.get(placeholder9).wait(400).to({alpha:.7}, 400, createjs.Ease.cubicIn);
    createjs.Tween.get(placeholder10).wait(400).to({alpha:.7}, 400, createjs.Ease.cubicIn);
    createjs.Tween.get(andLogicLearn).wait(400).to({alpha:1}, 400, createjs.Ease.cubicIn);
    createjs.Tween.get(orLogicLearn).wait(400).to({alpha:1}, 400, createjs.Ease.cubicIn);

    createjs.Tween.get(tutorialText2).to({alpha:0}, 400, createjs.Ease.cubicOut).call(replaceText,[tutorialText2,centerX,1480,"You can use one condition or two. If you want to use two you need to add one of these logic items."]).wait(200).to({alpha:1}, 400, createjs.Ease.cubicIn);
    createjs.Tween.get(tutorialText1).call(replaceText,[tutorialText1,centerX-120,1810,"Try both:"]).wait(800).to({alpha:1}, 400, createjs.Ease.cubicIn);
    createjs.Tween.get(andCheck).wait(800).to({alpha:1}, 400, createjs.Ease.cubicIn);
    createjs.Tween.get(orCheck).wait(800).to({alpha:1}, 400, createjs.Ease.cubicIn);
    createjs.Tween.get(whiteCheck).wait(800).to({alpha:.05}, 400, createjs.Ease.cubicIn);
    createjs.Tween.get(blackCheck).wait(800).to({alpha:.05}, 400, createjs.Ease.cubicIn).call(rmAnim);

    tutorialNextLabel.text = "GO TO GAME"
    tutorialNextButton.y = 1780;
    tutorialNextLabel.y = 1790;

  }

  function finishTutorial() {

    tutorialNextButton.removeAllEventListeners();
    closeTutorial.removeAllEventListeners();
    createjs.Ticker.setPaused(false);

    sequence = [];
    loadGame();

    selectorsBox.mouseEnabled = false;
    sequenceBox.mouseEnabled = false;
    actionsBox.mouseEnabled = false;
    newGameButton.mouseEnabled = false;
    exitButton.mouseEnabled = false;

    createjs.Tween.get(closeTutorial, {override:true}).call(addAnim,[0]).to({alpha:0}, 400, createjs.Ease.cubicOut);
    createjs.Tween.get(logo, {override:true}).to({alpha:0}, 400, createjs.Ease.cubicOut);
    createjs.Tween.get(tutorialGrid, {override:true}).to({alpha:0}, 400, createjs.Ease.cubicOut);
    createjs.Tween.get(tutorialText1, {override:true}).to({alpha:0}, 400, createjs.Ease.cubicOut);
    createjs.Tween.get(tutorialText2, {override:true}).to({alpha:0}, 400, createjs.Ease.cubicOut);
    createjs.Tween.get(tutorialNextButton, {override:true}).to({alpha:0}, 50, createjs.Ease.cubicOut);
    createjs.Tween.get(tutorialNextLabel, {override:true}).to({alpha:0}, 400, createjs.Ease.cubicOut);
    createjs.Tween.get(tutorialBG, {override:true}).to({alpha:0}, 400, createjs.Ease.cubicOut);
    createjs.Tween.get(tutorialTray, {override:true}).to({alpha:0}, 400, createjs.Ease.cubicOut);
    createjs.Tween.get(tutorialConditions, {override:true}).to({alpha:0}, 400, createjs.Ease.cubicOut);
    createjs.Tween.get(arrow, {override:true}).to({alpha:0}, 400, createjs.Ease.cubicOut);
    createjs.Tween.get(seqBox, {override:true}).to({alpha:0}, 400, createjs.Ease.cubicOut);
    createjs.Tween.get(startOverlay, {override:true}).to({y:890}, 600, createjs.Ease.cubicIn).call(handleBeginGame);

    function handleBeginGame() {

      logo.removeAllChildren();

      tutorialText3.visible = true;

      startOverlayBG.graphics
      .clear()
      .beginFill(green).drawRect(0,0,canvas.width,(canvas.height-890));

      tutorialText3.text = "This is the game grid. To win you need to connect four white circles (player one) or black squares (player two) in a row, column or diagonal line.";
      tutorialText3.x = centerX;
      tutorialText3.y = 280;
      tutorialText3.textAlign = "center";
      tutorialText3.lineWidth = 1100;
      tutorialText3.lineHeight = 80;
      tutorialText3.alpha = 0;

      tutorialNextButton.graphics
      .clear()
      .beginFill(green).drawRect(0,0,400,100);
      tutorialNextButton.y = 680;
      tutorialNextLabel.text = "NEXT";
      tutorialNextLabel.y = 690;
      tutorialNextLabel.color = black;
      tutorialNextLabel.alpha = 0;

      createjs.Tween.get(tutorialText3, {override:true}).to({alpha:1}, 400, createjs.Ease.cubicIn);
      createjs.Tween.get(tutorialNextButton, {override:true}).to({alpha:1}, 800, createjs.Ease.cubicIn).call(addButtonEvent,[showConditions]);
      createjs.Tween.get(tutorialNextLabel, {override:true}).to({alpha:1}, 800, createjs.Ease.cubicIn).call(rmAnim);

      function showConditions() {

        tutorialNextButton.removeAllEventListeners();
        createjs.Ticker.setPaused(false);

        createjs.Tween.get(tutorialText3, {override:true}).call(addAnim,[0]).to({alpha:0}, 200, createjs.Ease.cubicIn).wait(200).call(replaceText,[tutorialText3,centerX,500,"You\'ll get a set of conditions to target shapes on the grid. Any you don\'t use will be available on your next turn."]).wait(400).to({alpha:1}, 400, createjs.Ease.cubicOut).call(loadSelectors,[selectorsP1]);
        createjs.Tween.get(tutorialNextButton, {override:true}).to({alpha:0}, 100, createjs.Ease.cubicIn).wait(400).to({y:900},100).to({alpha:1}, 100, createjs.Ease.cubicIn);
        createjs.Tween.get(tutorialNextLabel, {override:true}).to({alpha:0}, 200, createjs.Ease.cubicIn).wait(600).call(replaceText,[tutorialNextLabel,centerX,910,"NEXT"]).to({alpha:1}, 600, createjs.Ease.cubicIn).call(addButtonEvent,[showSeq]).wait(0).call(rmAnim);
        createjs.Tween.get(startOverlay, {override:true}).wait(400).to({y:-224}, 600, createjs.Ease.cubicIn);

        createjs.Tween.get(sequenceBox, {override:true}).to({alpha:.1}, 600, createjs.Ease.cubicIn);
        createjs.Tween.get(actionsBox, {override:true}).to({alpha:.1}, 600, createjs.Ease.cubicIn);

      }

      function showSeq() {

        tutorialNextButton.removeAllEventListeners();
        createjs.Ticker.setPaused(false);

        createjs.Tween.get(tutorialText3, {override:true}).call(addAnim,[0]).to({alpha:0}, 200, createjs.Ease.cubicIn).wait(200).call(replaceText,[tutorialText3,centerX,500,"Drop conditions and actions here then hit play. You can build longer sequences after each turn, up to four steps."]).wait(400).to({alpha:1}, 400, createjs.Ease.cubicOut);
        
        createjs.Tween.get(selectorsBox, {override:true}).to({alpha:.1}, 600, createjs.Ease.cubicIn);
        createjs.Tween.get(sequenceBox, {override:true}).to({alpha:1}, 600, createjs.Ease.cubicIn);
        createjs.Tween.get(actionsBox, {override:true}).to({alpha:.1}, 600, createjs.Ease.cubicIn);

        createjs.Tween.get(tutorialNextButton, {override:true}).to({alpha:0}, 100, createjs.Ease.cubicIn).wait(800).to({alpha:1}, 400, createjs.Ease.cubicIn).call(addButtonEvent,[showActions]);
        createjs.Tween.get(tutorialNextLabel, {override:true}).to({alpha:0}, 200, createjs.Ease.cubicIn).wait(800).to({alpha:1}, 400, createjs.Ease.cubicIn).call(rmAnim);

      }

      function showActions() {

        tutorialNextButton.removeAllEventListeners();
        createjs.Ticker.setPaused(false);

        createjs.Tween.get(tutorialText3, {override:true}).call(addAnim,[0]).to({alpha:0}, 200, createjs.Ease.cubicIn).wait(200).call(replaceText,[tutorialText3,centerX,450,"As well as switching between black and white segments, you can flip and rotate whole shapes. If you don't have a condition you need, see if flipping or rotating shapes helps!"]).wait(400).to({alpha:1}, 400, createjs.Ease.cubicOut);
        
        createjs.Tween.get(selectorsBox, {override:true}).to({alpha:.1}, 600, createjs.Ease.cubicIn);
        createjs.Tween.get(sequenceBox, {override:true}).to({alpha:.1}, 600, createjs.Ease.cubicIn);
        createjs.Tween.get(actionsBox, {override:true}).to({alpha:1}, 600, createjs.Ease.cubicIn);

        createjs.Tween.get(tutorialNextButton, {override:true}).to({alpha:0}, 100, createjs.Ease.cubicIn).wait(800).to({alpha:1}, 400, createjs.Ease.cubicIn).call(addButtonEvent,[closeAndBegin]);
        createjs.Tween.get(tutorialNextLabel, {override:true}).to({alpha:0}, 200, createjs.Ease.cubicIn).call(replaceText,[tutorialNextLabel,centerX,910,"START GAME"]).wait(800).to({alpha:1}, 400, createjs.Ease.cubicIn).call(rmAnim);

      }

      function closeAndBegin() {

        tutorialNextButton.removeAllEventListeners();
        createjs.Ticker.setPaused(false);

        selectorsBox.mouseEnabled = true;
        sequenceBox.mouseEnabled = true;
        actionsBox.mouseEnabled = true;
        newGameButton.mouseEnabled = true;
        exitButton.mouseEnabled = true;

        createjs.Tween.get(tutorialText3, {override:true}).call(addAnim,[0]).to({alpha:0}, 200, createjs.Ease.cubicIn);
        createjs.Tween.get(selectorsBox, {override:true}).to({alpha:1}, 600, createjs.Ease.cubicIn);
        createjs.Tween.get(sequenceBox, {override:true}).to({alpha:1}, 600, createjs.Ease.cubicIn);
        createjs.Tween.get(actionsBox, {override:true}).to({alpha:1}, 600, createjs.Ease.cubicIn);

        createjs.Tween.get(tutorialNextButton, {override:true}).to({alpha:0}, 100, createjs.Ease.cubicIn);
        createjs.Tween.get(tutorialNextLabel, {override:true}).to({alpha:0}, 200, createjs.Ease.cubicIn);
        createjs.Tween.get(startOverlay, {override:true}).wait(200).to({y:-1120}, 600, createjs.Ease.cubicIn);
        createjs.Tween.get(newGameLabel, {override:true}).wait(600).to({alpha:1}, 600, createjs.Ease.cubicIn);
        createjs.Tween.get(exitLabel, {override:true}).wait(600).to({alpha:1}, 600, createjs.Ease.cubicIn).call(removeTutorial);

        function removeTutorial() {
          rmAnim();
          startOverlay.visible = false;
          startOverlayBG.graphics
          .clear()
          .beginFill(green).drawRect(0,0,canvas.width,canvas.height);
        }
      }
    }
  }

  function showNext() {

    learn.removeAllEventListeners();
    start.removeAllEventListeners();
    next.removeAllEventListeners();

    createjs.Ticker.setPaused(false);

    closeNext.addEventListener("mousedown",highlightButton);
    closeNext.addEventListener("pressup",nextToStart);

    next.alpha = 1;

    stage.addChild(nextOverlay);

    createjs.Tween.get(startOverlay, {override:true}).call(addAnim,[0]).to({y:-canvas.height}, 600, createjs.Ease.cubicIn);
    createjs.Tween.get(nextOverlay, {override:true}).to({y:0}, 600, createjs.Ease.cubicIn).call(showLink);

    function showLink() {
      rmAnim();
      document.getElementById("link").style.display="block";
    }

    function nextToStart() {

      document.getElementById("link").style.display="none";

      createjs.Ticker.setPaused(false);
      createjs.Tween.get(startOverlay, {override:true}).call(addAnim,[0]).to({y:0}, 600, createjs.Ease.cubicIn);
      createjs.Tween.get(nextOverlay, {override:true}).to({y:canvas.height}, 600, createjs.Ease.cubicIn).call(cleanNext);

      function cleanNext() {

        learn.addEventListener("mousedown",highlightButton);
        learn.addEventListener("pressup",beginTutorial);

        start.addEventListener("mousedown",highlightButton);
        start.addEventListener("pressup",beginGame);

        next.addEventListener("mousedown",highlightButton);
        next.addEventListener("pressup",showNext);

        rmAnim();
        closeNext.alpha = 1;
        stage.removeChild(nextOverlay);
        stage.update();
      }
    }
  }

  // INTERACTION

  function grabItemLearn(event) {

    // re-opening sequence slot

    if (event.currentTarget.parent == seqBox) {
        sequence[event.currentTarget.inSlot] = null;
        event.currentTarget.inSlot = false;
      } 

    // translate local to global, re-parent to stage

    var pt = event.currentTarget.localToGlobal(event.currentTarget.x,event.currentTarget.y);
    event.currentTarget.x = (pt.x - event.currentTarget.x);
    event.currentTarget.y = (pt.y - event.currentTarget.y);
    stage.addChild(event.currentTarget);

    // slot highlighting

    if (event.currentTarget.type == "logic") {
        dropZone1.alpha = .7;
    } else if (event.currentTarget.type == "action") {
        dropZone3.alpha = .7;
    } else {
        dropZone0.alpha = .7;
        dropZone2.alpha = .7; 
    }
    stage.update();
  }

  function snapToLearn(event) {

    var pt = dzContainer.globalToLocal(event.stageX,event.stageY);

    // determine if dragged over a sequence slot, record which one

    for (var i = 0; i < dzContainer.getObjectsUnderPoint(pt.x,pt.y,0).length; i++) {
      if (dzContainer.getObjectsUnderPoint(pt.x,pt.y,0)[i].slot != null) {
      dropPosition = dzContainer.getObjectsUnderPoint(pt.x,pt.y,0)[i];
      }
    }

    // if slot is open, drop in (otherwise return to item's original position)

    if (dropPosition != null && sequence[dropPosition.slot] == null) {
      addToSlotLearn(event.currentTarget,dropPosition);
    } else if (dropPosition != null && sequence[dropPosition.slot] != null && (event.currentTarget.slotType == dropPosition.type)) {
      returnToOriginLearn(sequence[dropPosition.slot],sequence[dropPosition.slot].originParent,sequence[dropPosition.slot].originX,sequence[dropPosition.slot].originY);
      addToSlotLearn(event.currentTarget,dropPosition);
    } else {
      returnToOriginLearn(event.currentTarget,event.currentTarget.originParent,event.currentTarget.originX,event.currentTarget.originY);
    }

    // unhighlight slots

    for (var i = 0; i < dzContainer.children.length; i++) {
      if (dzContainer.children[i].slot != null) {
        dzContainer.children[i].alpha = .25;
      }
    }

    stage.update();
    dropPosition = null;
    sequenceReadyLearn();
  }

  function addToSlotLearn(item,pos) {

    if (item.type == "position" || item.type == "shape") {

      if (pos.slot % 2 == 0) { 
        seqBox.addChild(item);
        item.x = pos.x; 
        item.y = pos.y;
        item.inSlot = pos.slot;
        sequence[pos.slot] = item;
        targetGameObjectsLearn();
        targetCount++;
        if (showLogic == false && targetCount > 2) { showLogicItems(); }
      } else { 
        returnToOriginLearn(item,item.originParent,item.originX,item.originY);
      }

    } else if (item.type == "logic") {

      if (pos.slot == 1) { 
        seqBox.addChild(item);
        item.x = pos.x; 
        item.y = pos.y; 
        item.inSlot = pos.slot;
        sequence[pos.slot] = item;
        targetGameObjectsLearn();

        if (item.name == "AND") {
          if (triedAnd == false) {
            triedAnd = true;
            createjs.Ticker.setPaused(false);
            createjs.Tween.get(whiteCheck).call(addAnim,[0]).to({alpha:1}, 400, createjs.Ease.cubicIn).call(rmAnim);
          }
        } else {
          if (triedOr == false) {
            triedOr = true;
            createjs.Ticker.setPaused(false);
            createjs.Tween.get(blackCheck).call(addAnim,[0]).to({alpha:1}, 400, createjs.Ease.cubicIn).call(rmAnim);
          }
        }

        if (triedOr && triedAnd) {
          if (triedBoth == false) {
            triedBoth = true;
            createjs.Ticker.setPaused(false);
            createjs.Tween.get(tutorialText2).call(addAnim,[0]).to({alpha:0}, 400, createjs.Ease.cubicOut).call(replaceText,[tutorialText2,centerX,1480,"Using AND targets any shapes that match both conditions. Using OR targets shapes that match either condition."]).wait(200).to({alpha:1}, 400, createjs.Ease.cubicIn).call(handleGoToGame);
            
            function handleGoToGame() {
              createjs.Tween.get(tutorialText1).wait(600).to({alpha:0}, 400, createjs.Ease.cubicOut);
              createjs.Tween.get(andCheck).wait(600).to({alpha:0}, 400, createjs.Ease.cubicOut);
              createjs.Tween.get(orCheck).wait(600).to({alpha:0}, 400, createjs.Ease.cubicOut);
              createjs.Tween.get(whiteCheck).wait(600).to({alpha:0}, 400, createjs.Ease.cubicOut);
              createjs.Tween.get(blackCheck).wait(600).to({alpha:0}, 400, createjs.Ease.cubicOut);
              createjs.Tween.get(tutorialNextButton).wait(1400).to({alpha:1}, 100, createjs.Ease.cubicOut);
              createjs.Tween.get(tutorialNextLabel).wait(1400).to({alpha:1}, 400, createjs.Ease.cubicOut).call(rmAnim);
              
              addButtonEvent(finishTutorial);

            }
          }
        }
      } else { 
        returnToOriginLearn(item,item.originParent,item.originX,item.originY); 
      }

    } else if (item.type == "action") {

      if (pos.slot == 3) { 
        seqBox.addChild(item);
        item.x = pos.x; 
        item.y = pos.y; 
        item.inSlot = pos.slot;
        sequence[pos.slot] = item;
      } else { 
        returnToOriginLearn(item,item.originParent,item.originX,item.originY); 
      }

    }
    stage.update();
  }

  function returnToOriginLearn(item,parent,x,y) {
    parent.addChild(item);
    item.x = x;
    item.y = y;
    item.inSlot = false;
    if (learnConditions == true) { targetGameObjectsLearn(); }
    stage.update();
  }

  function targetGameObjectsLearn() {

    var ruleSet = [];

    // get items from trays

    for (var i = 0; i < 3; i++) {
      if (sequence[i] != null) {
      var rule = extractRuleLearn(sequence[i]);
      ruleSet.push(rule);
      }
    }

    // loop through objects and test for matches

    for (i in tutorialObjectsInPlay) {

      if (ruleSet.length == 3) {

        if (ruleSet[1](ruleSet[0](tutorialObjectsInPlay[i]),ruleSet[2](tutorialObjectsInPlay[i]))) {
          tutorialObjectsInPlay[i].alpha = 1;
        } else {
          tutorialObjectsInPlay[i].alpha = .2;
        }

      } else if (ruleSet.length == 2) {

        if (showLogic == false) { showLogicItems(); }
        tutorialObjectsInPlay[i].alpha = .2;
   
      } else if (ruleSet.length == 1) {

        if (ruleSet[0](tutorialObjectsInPlay[i])) {
          tutorialObjectsInPlay[i].alpha = 1;
        } else {
          tutorialObjectsInPlay[i].alpha = .2;
        }
      } else {
        tutorialObjectsInPlay[i].alpha = .2;
      }
    }
  }

  function extractRuleLearn(rule) {

    var ruleComponents;

    if (rule.type == "position") {

      if (rule.name == "col") {
        ruleComponents = function(obj) {
          if (obj.x == colVal(rule.val,2,380)) {return true;}
        }
      } else {
        ruleComponents = function(obj) {
        if (obj.y == rowVal(rule.val,2,380,1000)) {return true;}
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
  
  function deliverActionLearn(targets) {

    for (i in targets) {
        sequence[3].func(targets[i]);
    }

  }

  function clearSequenceLearn() {

    var toClear = [];

    for (var i = 0; i < seqBox.children.length; i++) {
      if (seqBox.children[i].type != null) {
        toClear.push(seqBox.children[i]);
      }
    }

    for (var i = 0; i < toClear.length; i++) {
      returnToOriginLearn(toClear[i],toClear[i].originParent,toClear[i].originX,toClear[i].originY);
    }

    for (var i = 0; i < 4; i++) {
      sequence[i] = null;
    }

    actTray.graphics
    .clear()
    .beginStroke(yellow).setStrokeStyle(8).beginFill(black)
    .drawRoundRect(0,0,160,160,5);


    for (i in tutorialObjectsInPlay) {

      if (tutorialObjectsInPlay[i].tl == 0 && tutorialObjectsInPlay[i].tr == 0 && tutorialObjectsInPlay[i].br == 0 && tutorialObjectsInPlay[i].bl == 0) {
        madeSquare = true;
      } else if (tutorialObjectsInPlay[i].tl == 1 && tutorialObjectsInPlay[i].tr == 1 && tutorialObjectsInPlay[i].br == 1 && tutorialObjectsInPlay[i].bl == 1) {
        madeCircle = true;
      }

      var findMorph = tutorialObjectsInPlay[i].getChildByName("morph");
        if (findMorph != null) {
          removeMorph(tutorialObjectsInPlay[i],findMorph);
        }
      tutorialObjectsInPlay[i].alpha = 1;
      }

    if (switchCount == 1) { 

      createjs.Ticker.setPaused(false);
      createjs.Tween.get(tutorialText2).call(addAnim,[0]).to({alpha:0}, 400, createjs.Ease.cubicOut).call(replaceText,[tutorialText2,centerX,1470,"Player one's goal is to make complete circles. Player two's goal is to make complete squares."]).wait(200).to({alpha:1}, 400, createjs.Ease.cubicIn);
      createjs.Tween.get(tutorialText1).call(replaceText,[tutorialText1,centerX-100,1800,"Try making both:"]).wait(800).to({alpha:1}, 400, createjs.Ease.cubicIn);
      createjs.Tween.get(whiteCircle).wait(1000).to({alpha:1}, 400, createjs.Ease.cubicIn);
      createjs.Tween.get(blackSquare).wait(1000).to({alpha:1}, 400, createjs.Ease.cubicIn);
      createjs.Tween.get(whiteCheck).wait(1200).to({alpha:.05}, 400, createjs.Ease.cubicIn);
      if (madeSquare == true) {
        createjs.Tween.get(blackCheck).wait(1200).to({alpha:1}, 400, createjs.Ease.cubicIn).call(rmAnim);
      } else {
        createjs.Tween.get(blackCheck).wait(1200).to({alpha:.05}, 400, createjs.Ease.cubicIn).call(rmAnim);
      }
    }

    if (switchCount >= 2 && madeSquare == true && madeCircle == false) { 
      createjs.Ticker.setPaused(false);
      createjs.Tween.get(blackCheck).call(addAnim,[0]).to({alpha:1}, 400, createjs.Ease.cubicIn).call(rmAnim);
    }

    if (switchCount >= 2 && madeSquare == false && madeCircle == true) { 
      createjs.Ticker.setPaused(false);
      createjs.Tween.get(whiteCheck).call(addAnim,[0]).to({alpha:1}, 400, createjs.Ease.cubicIn).call(rmAnim);
    }

    if (switchCount >= 2 && madeSquare == true && madeCircle == true) { 

      addButtonEvent(tryConditions);

      tutorialNextButton.y = 1810;
      tutorialNextLabel.y = 1820;
      tutorialNextLabel.text = "GOT IT";

      createjs.Ticker.setPaused(false);
      createjs.Tween.get(tutorialText2).call(addAnim,[0]).to({alpha:0}, 100, createjs.Ease.cubicOut);
      createjs.Tween.get(tutorialText1).to({y:tutorialText1.y-210},400, createjs.Ease.cubicInOut);
      createjs.Tween.get(whiteCircle).to({y:whiteCircle.y-210},400, createjs.Ease.cubicInOut);
      createjs.Tween.get(whiteCheck).to({y:whiteCheck.y-210},400, createjs.Ease.cubicInOut).to({alpha:1}, 400, createjs.Ease.cubicIn);
      createjs.Tween.get(blackSquare).to({y:blackSquare.y-210},400, createjs.Ease.cubicInOut);
      createjs.Tween.get(blackCheck).to({y:blackCheck.y-210},400, createjs.Ease.cubicInOut).to({alpha:1}, 400, createjs.Ease.cubicIn);
      createjs.Tween.get(tutorialNextButton).wait(600).to({alpha:1}, 100, createjs.Ease.cubicIn);
      createjs.Tween.get(tutorialNextLabel).wait(600).to({alpha:1}, 400, createjs.Ease.cubicIn).call(rmAnim);
  }

    sequenceReadyLearn();
    stage.update();
  }

  // PLAY SEQUENCE

  function sequenceReadyLearn() {

  playReady = false;

  if (learnActions == true) {
    if (sequence[3] != null) {
      playReady = true;
      playButtonLearn.addEventListener("mousedown",highlightButton);
      playButtonLearn.addEventListener("pressup",playLearnAction);
      playButtonLearn.alpha = 1;
      playLabelLearn.alpha = 1;
    } else {
      playReady = false;
    }
  }

  if (playReady == false) {
    playButtonLearn.removeAllEventListeners();
    playButtonLearn.alpha = .5;
    playLabelLearn.alpha = .5;
  }

  stage.update();
}

function playLearnAction() {

  switchCount++;

  playButtonLearn.removeAllEventListeners();

  window.setTimeout(clearSequenceLearn,1000);

  deliverActionLearn([tutorialObjectsInPlay[0],tutorialObjectsInPlay[1],tutorialObjectsInPlay[2],tutorialObjectsInPlay[3]]);

  actTray.graphics
  .clear()
  .beginStroke(black).setStrokeStyle(8).beginFill(black)
  .drawRoundRect(0,0,160,160,5);
  stage.update();

}

  function addButtonEvent(target) {
    tutorialNextButton.addEventListener("mousedown",highlightButton);
    tutorialNextButton.addEventListener("pressup",target);
  }

  function replaceText(toReplace,x,y,newText) {
    toReplace.text = newText;
    toReplace.x = x;
    toReplace.y = y;
  }

  function highlightButton(event) {
    if (event.currentTarget.name == "next") {
      tutorialNextLabel.alpha = .5;
    } else {
      event.currentTarget.alpha = .5;
    }
    stage.update();
  }

  function returnToStart(event) {
    if (createjs.Ticker.paused == true) {

      andCheck.visible = false;
      orCheck.visible = false;
      whiteCircle.visible = false;
      whiteCheck.visible = false;
      blackSquare.visible = false;
      blackCheck.visible = false;
      dropZone0.visible = false;
      dropZone1.visible = false;
      dropZone2.visible = false;
      dropZone3.visible = false;
      required.visible = false;
      actTray.visible = false;
      seqTray.visible = false;
      tutorialConditions.visible = false;
      switchTutorial.visible = false;
      andLogicLearn.visible = false;
      orLogicLearn.visible = false;

      stage.update();
      loadIntro();
    } else {
      window.setTimeout(returnToStart,300);
    }
  }

  // BEGIN GAME

  function beginGame(event) {

    createjs.Ticker.setPaused(false);

    event.currentTarget.alpha = 1;

    sequence = [];
    loadGame();

    stage.update();

    createjs.Tween.get(startOverlay, {override:true}).call(addAnim,[0]).to({y:canvas.height}, 600, createjs.Ease.cubicIn).call(handleBeginGame);
    createjs.Tween.get(newGameLabel, {override:true}).call(addAnim,[0]).to({alpha:1}, 1600, createjs.Ease.cubicIn).call(rmAnim);
    createjs.Tween.get(exitLabel, {override:true}).call(addAnim,[0]).to({alpha:1}, 1600, createjs.Ease.cubicIn).call(rmAnim);

    function handleBeginGame() {
      rmAnim();

      startOverlay.visible = false;

      selectorsBox.mouseEnabled = true;
      sequenceBox.mouseEnabled = true;
      actionsBox.mouseEnabled = true;
      newGameButton.mouseEnabled = true;
      exitButton.mouseEnabled = true;

      loadSelectors(selectorsP1);
    }   
  }
} // end loadIntro

// ------------- ANIMATION -----------------

var endTweenCheck = 0;

function addAnim(t) {
  animations.push(t);
}

function rmAnim(t) {
  animations.pop();
  endTween();
}

function tick(event) {
  if (!event.paused) {
    stage.update(event);
  }
}

function endTween() {
  if (animations.length < 1) {
    endTweenCheck++;
    if (endTweenCheck < 2) {
    window.setTimeout(endTween,500);
    } else {
    createjs.Ticker.setPaused(true);
    console.log("ticker paused");
    endTweenCheck = 0;
    }
  }
}

// ------------- UTILITIES -----------------

function rowVal (r,gridSize,gridSpacing,gridHeight) { // calcs row
  var gridTop = ((gridHeight - ((gridSize-1) * gridSpacing))/2);
  return (gridTop-gridSpacing)+((r+1)*gridSpacing)
  }

function colVal (c,gridSize,gridSpacing) { // calcs col
  var gridLeft = ((canvas.width - ((gridSize-1) * gridSpacing))/2);
  return (gridLeft+(c*gridSpacing))
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

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