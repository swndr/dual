
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

  var tutorialObjectsInPlay = [];
  var objectsInPlay = [];

  var wScore = 0;
  var bScore = 0;
  var gameOver = false;

  var stage = new createjs.Stage(canvas);
  createjs.Touch.enable(stage);
  stage.enableMouseOver(20);

  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", tick);
  createjs.Ticker.setPaused(true);

  // INTRO AND TUTORIAL

  var startOverlay = new createjs.Container();

  function loadIntro() {

    var startOverlayBG = new createjs.Shape();
    startOverlayBG.graphics.beginFill(green).drawRect(0,0,canvas.width,canvas.height);

    var topBorder = new createjs.Shape();
    topBorder.graphics.beginStroke(white).setStrokeStyle(10);
    topBorder.graphics.moveTo(0,5);
    topBorder.graphics.lineTo(canvas.width,5);

    var tutorialGrid = new Grid(2,380,1000,230);
    tutorialGrid.alpha = 0;

    var logo = new createjs.Container();
    logo.y = 700;

    var D = new GameObject(0,1,1,0).set({x:centerX-450,y:0});
    D.scaleX = 1.8;
    D.scaleY = 1.8;
    D.cache(-135,-135,270,270);
    tutorialObjectsInPlay.push(D);

    var U = new GameObject(0,0,1,1).set({x:centerX-150,y:0});
    U.scaleX = 1.8;
    U.scaleY = 1.8;
    U.cache(-135,-135,270,270);
    tutorialObjectsInPlay.push(U);

    var A = new GameObject(1,1,0,0).set({x:centerX+150,y:0});
    A.scaleX = 1.8;
    A.scaleY = 1.8;
    A.cache(-135,-135,270,270);
    tutorialObjectsInPlay.push(A);

    var L = new GameObject(0,1,0,0).set({x:centerX+450,y:0});
    L.scaleX = 1.8;
    L.scaleY = 1.8;
    L.cache(-135,-135,270,270);
    tutorialObjectsInPlay.push(L);

    var pathForD = new createjs.Shape();
    pathForD.graphics.beginStroke(lightGray).setStrokeStyle(20,"butt");
    pathForD.graphics.moveTo((centerX-450-(75*1.8))+10,(-(75*1.8))+10);
    pathForD.graphics.lineTo((centerX-450)+10,(-(75*1.8))+10);
    pathForD.graphics.arc((centerX-450),0,(75*1.8)-10,270*(Math.PI/180),90*(Math.PI/180));
    pathForD.graphics.lineTo((centerX-450-(75*1.8)+10),(75*1.8)-10);
    pathForD.graphics.lineTo((centerX-450-(75*1.8)+10),-(75*1.8));

    var pathForU = new createjs.Shape();
    pathForU.graphics.beginStroke(lightGray).setStrokeStyle(20,"butt");
    pathForU.graphics.moveTo((centerX-150-(75*1.8))+10,-(75*1.8));
    pathForU.graphics.lineTo((centerX-150-(75*1.8)+10),0);
    pathForU.graphics.arc((centerX-150),0,(75*1.8)-10,180*(Math.PI/180),360*(Math.PI/180),true);
    pathForU.graphics.lineTo((centerX-150+(75*1.8))-10,-(75*1.8));

    var pathForA = new createjs.Shape();
    pathForA.graphics.beginStroke(lightGray).setStrokeStyle(20,"butt");
    pathForA.graphics.moveTo((centerX+150-(75*1.8))+10,(75*1.8));
    pathForA.graphics.lineTo((centerX+150-(75*1.8))+10,0);
    pathForA.graphics.arc((centerX+150),0,(75*1.8)-10,180*(Math.PI/180),360*(Math.PI/180));
    pathForA.graphics.lineTo((centerX+150+(75*1.8))-10,(75*1.8));

    var pathForL = new createjs.Shape();
    pathForL.graphics.beginStroke(lightGray).setStrokeStyle(20,"butt");
    pathForL.graphics.moveTo((centerX+450-(75*1.8))+10,-(75*1.8));
    pathForL.graphics.lineTo((centerX+450-(75*1.8))+10,(75*1.8)-10);
    pathForL.graphics.lineTo((centerX+450+(75*1.8)),(75*1.8)-10);

    logo.addChild(D,pathForD,U,pathForU,A,pathForA,L,pathForL);

    var tagline = new createjs.Text("A GAME ABOUT COMPUTATION","bold 60px Avenir-Heavy",black).set({x:centerX,y:900});
    tagline.textAlign = "center";

    var learn = new createjs.Container().set({x:centerX,y:1200});
    var learnButton = new createjs.Shape().set({x:-200,y:-60});
    learnButton.graphics.beginFill(green).drawRect(0,0,400,200);
    learnButton.alpha = 0.1;
    var learnText = new createjs.Text("LEARN","bold 60px Avenir-Heavy",white).set({x:0,y:0});
    learnText.textAlign = "center";

    learn.addChild(learnButton,learnText);
    learn.addEventListener("mousedown",highlightButton);
    learn.addEventListener("pressup",beginTutorial);

    var start = new createjs.Container().set({x:centerX,y:1500});
    var startButton = new createjs.Shape().set({x:-200,y:-60});
    startButton.graphics.beginFill(green).drawRect(0,0,400,200);
    startButton.alpha = 0.1;
    var startText = new createjs.Text("START","bold 60px Avenir-Heavy",white).set({x:0,y:0});
    startText.textAlign = "center";

    start.addChild(startButton,startText);
    start.addEventListener("mousedown",highlightButton);
    start.addEventListener("pressup",beginGame);

    startOverlay.addChild(startOverlayBG,topBorder,tutorialGrid,logo,tagline,learn,start);
    stage.addChild(startOverlay);
    stage.update();

    // TUTORIAL

    function beginTutorial(event) {

      createjs.Ticker.setPaused(false);

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
      closeTutorial.addEventListener("mousedown",highlightButton);
      closeTutorial.addEventListener("pressup",returnToStart);

      var tutorialBG = new createjs.Shape().set({x:0,y:1000});
      tutorialBG.graphics.beginFill("#EAEAEA").drawRect(0,0,canvas.width,canvas.height-1000);
      tutorialBG.alpha = 0;
      var tutorialTray = new createjs.Shape().set({x:0,y:1000});
      tutorialTray.graphics.beginFill("#616060").drawRect(0,0,canvas.width,300);
      tutorialTray.alpha = 0;

      var tutorialText1 = new createjs.Text("DUAL is a two player game about sequential thinking.", "100 60px Avenir-Book", black).set({x:centerX,y:1150});
      tutorialText1.textAlign = "center";
      tutorialText1.lineWidth = 1100;
      tutorialText1.lineHeight = 80;
      tutorialText1.alpha = 0;

      var tutorialText2 = new createjs.Text("Your aim is to complete a row or column by transforming the four-part shapes into complete white circles (player one) or black squares (player two).", "100 60px Avenir-Book", black).set({x:centerX,y:1400});
      tutorialText2.textAlign = "center";
      tutorialText2.lineWidth = 1100;
      tutorialText2.lineHeight = 80;
      tutorialText2.alpha = 0;

      var tutorialNextButton = new createjs.Shape().set({x:centerX-200,y:1790});
      tutorialNextButton.graphics.beginFill("#EAEAEA").drawRect(0,0,400,100);
      tutorialNextButton.alpha = 0;
      // tutorialNextButton.addEventListener("mousedown",highlightButton);
      // tutorialNextButton.addEventListener("pressup",loadTutorialItems);
      var tutorialNextLabel = new createjs.Text("NEXT", "100 60px Avenir-Heavy", green).set({x:centerX,y:1800});
      tutorialNextLabel.textAlign = "center";
      tutorialNextLabel.alpha = 0;

      startOverlay.addChild(closeTutorial,tutorialBG,tutorialTray,tutorialText1,tutorialText2,tutorialNextButton,tutorialNextLabel);

      createjs.Tween.get(learn).to({alpha:0}, 300, createjs.Ease.cubicIn);
      createjs.Tween.get(start).wait(300).to({alpha:0}, 300, createjs.Ease.cubicIn);
      createjs.Tween.get(tagline).wait(300).to({alpha:0}, 300, createjs.Ease.cubicIn);

      createjs.Tween.get(tutorialGrid).wait(300).to({alpha:1}, 300, createjs.Ease.cubicIn);
      createjs.Tween.get(tutorialBG).wait(500).to({alpha:1}, 400, createjs.Ease.cubicIn);
      createjs.Tween.get(closeTutorial).wait(500).to({alpha:.9}, 400, createjs.Ease.cubicIn);

      createjs.Tween.get(pathForD).wait(500).to({alpha:0}, 200, createjs.Ease.cubicOut);
      createjs.Tween.get(pathForU).wait(600).to({alpha:0}, 200, createjs.Ease.cubicOut);
      createjs.Tween.get(pathForA).wait(700).to({alpha:0}, 200, createjs.Ease.cubicOut);
      createjs.Tween.get(pathForL).wait(800).to({alpha:0}, 200, createjs.Ease.cubicOut);

      createjs.Tween.get(D).wait(1000).to({x:colVal(0,2,380),y:rowVal(0,2,380,1000)-700}, 600, createjs.Ease.backInOut);
      createjs.Tween.get(U).wait(1200).to({x:colVal(1,2,380),y:rowVal(0,2,380,1000)-700}, 600, createjs.Ease.backInOut);
      createjs.Tween.get(A).wait(1400).to({x:colVal(0,2,380),y:rowVal(1,2,380,1000)-700}, 500, createjs.Ease.backOut);
      createjs.Tween.get(L).wait(1600).to({x:colVal(1,2,380),y:rowVal(1,2,380,1000)-700}, 500, createjs.Ease.backOut).call(tutorialReady);


      function tutorialReady() {

        createjs.Tween.get(tutorialText1).wait(200).to({alpha:1}, 400, createjs.Ease.cubicIn);
        createjs.Tween.get(tutorialText2).wait(400).to({alpha:1}, 400, createjs.Ease.cubicIn);
        createjs.Tween.get(tutorialNextButton).wait(200).to({alpha:1}, 100, createjs.Ease.cubicIn);
        createjs.Tween.get(tutorialNextLabel).wait(1000).to({alpha:1}, 400, createjs.Ease.cubicIn).call(readyToLoadTutorialItems);

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
          createjs.Ticker.setPaused(true);
          tutorialNextButton.addEventListener("mousedown",highlightButton);
          tutorialNextButton.addEventListener("pressup",loadTutorialItems);
        }

      }

      function loadTutorialItems() {

        tutorialNextButton.removeAllEventListeners();

        var showLogic = false;
        var triedAnd = false;
        var triedOr = false;

        createjs.Ticker.setPaused(false);

        createjs.Tween.get(tutorialText1).wait(200).to({alpha:0}, 400, createjs.Ease.cubicOut);
        createjs.Tween.get(tutorialText2).wait(400).to({alpha:0}, 400, createjs.Ease.cubicOut);
        createjs.Tween.get(tutorialNextButton).wait(600).to({alpha:0}, 100, createjs.Ease.cubicOut);
        createjs.Tween.get(tutorialNextLabel).wait(600).to({alpha:0}, 400, createjs.Ease.cubicOut);

        var tutorialText3 = new createjs.Text("Target shapes on the grid by matching specific conditions, like position or shape. Drag conditions into the sequence tray above to see what happens.", "100 60px Avenir-Book", black).set({x:centerX,y:1600});
        tutorialText3.textAlign = "center";
        tutorialText3.lineWidth = 1150;
        tutorialText3.lineHeight = 80;
        tutorialText3.alpha = 0;

        // SEQUENCE TRAY

        // fill sequence array with null

        for (var i = 0; i < 4; i++) {
          sequence[i] = null;
        }

        var sequenceBox = new createjs.Container().set({x:(canvas.width-442)/2,y:1073});
        sequenceBox.alpha = 0;

        var trays = new createjs.Container();

        var sequenceTray = new createjs.Shape();
        sequenceTray.graphics.beginStroke(green).setStrokeStyle(8).beginFill(black);
        sequenceTray.graphics.drawRoundRect(0,0,442,154,5);
        
        var actionTray = new createjs.Shape();
        actionTray.graphics.beginStroke(yellow).setStrokeStyle(8).beginFill(black);
        actionTray.graphics.drawRoundRect(0,0,160,154,5);
        actionTray.x = 472;
        actionTray.alpha = 0;

        trays.addChild(sequenceTray,actionTray);

        var dropZoneContainer = new createjs.Container();

        var dropZone0 = new createjs.Shape().set({x:14,y:12});
        var dropZone1 = new createjs.Shape().set({x:14 + buttonSize + (buttonMargin+4),y:12});
        var dropZone2 = new createjs.Shape().set({x:14 + (buttonSize*2) + ((buttonMargin+4)*2),y:12});
        var dropZone3 = new createjs.Shape().set({x:487,y:12});

        dropZone0.graphics.beginFill(green);
        dropZone0.graphics.drawRoundRect(0,0,buttonSize,buttonSize,5);
        dropZone0.alpha = .25;
        dropZone0.slot = 0; // to determine which slot items dropped in
        dropZone1.graphics.beginFill(blue);
        dropZone1.graphics.drawRoundRect(0,0,buttonSize,buttonSize,5);
        dropZone1.alpha = .25;
        dropZone1.slot = 1; // to determine which slot items dropped in
        dropZone2.graphics.beginFill(green);
        dropZone2.graphics.drawRoundRect(0,0,buttonSize,buttonSize,5);
        dropZone2.alpha = .25;
        dropZone2.slot = 2; // to determine which slot items dropped in
        dropZone3.graphics.beginFill(yellow);
        dropZone3.graphics.drawRoundRect(0,0,buttonSize,buttonSize,5);
        dropZone3.alpha = 0;
        dropZone3.slot = 3; // to determine which slot items dropped in
  
        dropZoneContainer.addChild(dropZone0,dropZone1,dropZone2);
        // need to add dropZone3 when add action
        sequenceBox.addChild(trays,dropZoneContainer);

        var tutorialConditions = new createjs.Container().set({x:460,y:1400});
        tutorialConditions.alpha = 0;

        var rowSelector = new PositionButton("row",100,30,15,50,0,34,0);
        rowSelector.originParent = tutorialConditions;
        rowSelector.removeAllEventListeners();
        rowSelector.addEventListener("mousedown",grabItemLearn);
        rowSelector.addEventListener("pressmove",dragAndDrop);
        rowSelector.addEventListener("pressup",snapToLearn);
        var placeholder1 = new PlaceholderButton(rowSelector.x,rowSelector.y)
        var colSelector = new PositionButton("col",30,100,50,15,1,(34 + buttonSize + buttonMargin),0);
        colSelector.removeAllEventListeners();
        colSelector.addEventListener("mousedown",grabItemLearn);
        colSelector.addEventListener("pressmove",dragAndDrop);
        colSelector.addEventListener("pressup",snapToLearn);
        colSelector.originParent = tutorialConditions;
        var placeholder2 = new PlaceholderButton(colSelector.x,colSelector.y)
        var shapeSelector1 = new ShapeButton(0,1,1,0,(34 + (2*buttonSize) + (2*buttonMargin)),0);
        shapeSelector1.removeAllEventListeners();
        shapeSelector1.addEventListener("mousedown",grabItemLearn);
        shapeSelector1.addEventListener("pressmove",dragAndDrop);
        shapeSelector1.addEventListener("pressup",snapToLearn);
        shapeSelector1.originParent = tutorialConditions;
        var placeholder3 = new PlaceholderButton(shapeSelector1.x,shapeSelector1.y)
        var shapeSelector2 = new ShapeButton(0,1,0,0,(34 + (3*buttonSize) + (3*buttonMargin)),0);
        shapeSelector2.removeAllEventListeners();
        shapeSelector2.addEventListener("mousedown",grabItemLearn);
        shapeSelector2.addEventListener("pressmove",dragAndDrop);
        shapeSelector2.addEventListener("pressup",snapToLearn);
        shapeSelector2.originParent = tutorialConditions;
        var placeholder4 = new PlaceholderButton(shapeSelector2.x,shapeSelector2.y);

        var andLogic = new LogicButton("AND",48 + (4*buttonSize) + (4*buttonMargin),0);
        andLogic.removeAllEventListeners();
        andLogic.addEventListener("mousedown",grabItemLearn);
        andLogic.addEventListener("pressmove",dragAndDrop);
        andLogic.addEventListener("pressup",snapToLearn);
        andLogic.originParent = tutorialConditions;
        andLogic.alpha = 0;
        var placeholder5 = new PlaceholderButton(andLogic.x,andLogic.y);
        placeholder5.alpha = 0;
        var orLogic = new LogicButton("OR",48 + (5*buttonSize) + (5*buttonMargin),0);
        orLogic.removeAllEventListeners();
        orLogic.addEventListener("mousedown",grabItemLearn);
        orLogic.addEventListener("pressmove",dragAndDrop);
        orLogic.addEventListener("pressup",snapToLearn);
        orLogic.originParent = tutorialConditions;
        orLogic.alpha = 0;
        var placeholder6 = new PlaceholderButton(orLogic.x,orLogic.y);
        placeholder6.alpha = 0;

        tutorialConditions.addChild(placeholder1,placeholder2,placeholder3,placeholder4,placeholder5,placeholder6,rowSelector,colSelector,shapeSelector1,shapeSelector2,andLogic,orLogic);
        startOverlay.addChild(sequenceBox,tutorialConditions,tutorialText3);

        createjs.Tween.get(tutorialTray).wait(800).to({alpha:1}, 400, createjs.Ease.cubicIn);
        createjs.Tween.get(sequenceBox).wait(1000).to({alpha:1}, 400, createjs.Ease.cubicIn);
        createjs.Tween.get(tutorialConditions).wait(1200).to({alpha:1}, 400, createjs.Ease.cubicIn);
        createjs.Tween.get(tutorialText3).wait(1200).to({alpha:1}, 400, createjs.Ease.cubicIn).call(endTween);

        function showLogicItems() {

          createjs.Ticker.setPaused(false);

          showLogic = true;

          tutorialText3.text = "If you use two conditions you need to add logic. Use AND to target shapes matching both conditions. Use OR to match either condition. Try it out!"
          
          createjs.Tween.get(tutorialConditions).wait(800).to({x:320}, 400, createjs.Ease.cubicInOut);
          createjs.Tween.get(placeholder5).wait(1200).to({alpha:1}, 400, createjs.Ease.cubicIn);
          createjs.Tween.get(placeholder6).wait(1200).to({alpha:1}, 400, createjs.Ease.cubicInOut);
          createjs.Tween.get(andLogic).wait(1200).to({alpha:1}, 400, createjs.Ease.cubicInOut);
          createjs.Tween.get(orLogic).wait(1200).to({alpha:1}, 400, createjs.Ease.cubicInOut).call(endTween);


        }


        // INTERACTION

        function grabItemLearn(event) {

          // re-opening sequence slot

          if (event.currentTarget.parent == sequenceBox) {
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
              dropZone1.alpha = .5;
          } else if (event.currentTarget.type == "action") {
              dropZone3.alpha = .5;
          } else {
              dropZone0.alpha = .5;
              dropZone2.alpha = .5; 
          }
          stage.update();
        }

        function snapToLearn(event) {

          var pt = dropZoneContainer.globalToLocal(event.stageX,event.stageY);

          // determine if dragged over a sequence slot, record which one

          for (var i = 0; i < dropZoneContainer.getObjectsUnderPoint(pt.x,pt.y,0).length; i++) {
            if (dropZoneContainer.getObjectsUnderPoint(pt.x,pt.y,0)[i].slot != null) {
            dropPosition = dropZoneContainer.getObjectsUnderPoint(pt.x,pt.y,0)[i];
            }
          }

          // if slot is open, drop in (otherwise return to item's original position)

          if (dropPosition != null && sequence[dropPosition.slot] == null) {
            addToSlotLearn(event.currentTarget,dropPosition);
          } else {
            returnToOriginLearn(event.currentTarget,event.currentTarget.originParent,event.currentTarget.originX,event.currentTarget.originY);
          } 

          // unhighlight slots

          for (var i = 0; i < dropZoneContainer.children.length; i++) {
            if (dropZoneContainer.children[i].slot != null) {
              dropZoneContainer.children[i].alpha = .25;
            }
          }

          stage.update();
          dropPosition = null;
          // sequenceReady();
        }

        function addToSlotLearn(item,pos) {

          if (item.type == "position" || item.type == "shape") {

            if (pos.slot % 2 == 0) { 
              sequenceBox.addChild(item);
              item.x = pos.x; 
              item.y = pos.y;
              item.inSlot = pos.slot;
              sequence[pos.slot] = item;
              targetGameObjectsLearn();
            } else { 
              returnToOriginLearn(item,item.originParent,item.originX,item.originY); 
            }

          } else if (item.type == "logic") {

            if (pos.slot == 1) { 
              sequenceBox.addChild(item);
              item.x = pos.x; 
              item.y = pos.y; 
              item.inSlot = pos.slot;
              sequence[pos.slot] = item;
              targetGameObjectsLearn();
            } else { 
              returnToOriginLearn(item,item.originParent,item.originX,item.originY); 
            }

          } else {

            if (pos.slot == 3) { 
              sequenceBox.addChild(item);
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
          targetGameObjectsLearn();
          stage.update();
        }

        function targetGameObjectsLearn() {

          var ruleSet = [];
          var targets = [];

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
                targets.push(tutorialObjectsInPlay[i]);
                tutorialObjectsInPlay[i].alpha = 1;
              } else {
                tutorialObjectsInPlay[i].alpha = .2;
              }

            } else if (ruleSet.length == 2) {

              if (showLogic == false) { showLogicItems(); }
              tutorialObjectsInPlay[i].alpha = .2;
         
            } else if (ruleSet.length == 1) {

              if (ruleSet[0](tutorialObjectsInPlay[i])) {
                targets.push(tutorialObjectsInPlay[i]);
                tutorialObjectsInPlay[i].alpha = 1;
              } else {
                tutorialObjectsInPlay[i].alpha = .2;
              }
            } else {
              tutorialObjectsInPlay[i].alpha = .2;
            }

            var findMorph = tutorialObjectsInPlay[i].getChildByName("morph");
            if (findMorph != null) {
              removeMorph(tutorialObjectsInPlay[i],findMorph);
            }

          }

          return targets;

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
          
          function deliverActionLearn(targets,step) {

            for (i in targets) {
                sequence[3].func(targets[i]);
            }
          }
        }
    }

    function returnToStart(event) {
      tutorialObjectsInPlay = [];
      startOverlay.removeAllChildren();
      stage.update();
      loadIntro();
    }

    function highlightButton(event) {
      event.currentTarget.alpha = .5;
      stage.update();
    }

    // BEGIN GAME

    function beginGame(event) {

      createjs.Ticker.setPaused(false);

      event.currentTarget.alpha = 1;
      startOverlay.cache(0,0,canvas.width,canvas.height);
      stage.removeAllChildren();
      sequence = [];
      loadGame();
      stage.addChild(startOverlay);
      stage.update();

      createjs.Tween.get(startOverlay, {override:true}).to({y:canvas.height}, 600, createjs.Ease.cubicIn).call(handleBeginGame);

      function handleBeginGame() {
        startOverlay.uncache();
        startOverlay.removeAllChildren();
        stage.removeChild(startOverlay);
        loadSelectors(selectorsP1);
      }   
    }
  }

  loadIntro();

  // BOARD

  var board = new createjs.Container();

  // BACKGROUND

  var bg = new createjs.Shape();
  bg.graphics.beginFill("#AAA5A5");
  bg.graphics.rect(0,0,canvas.width,890);
  bg.cache(0,0,canvas.width,890);

  // BUILD GRID

  var boardGrid = new Grid(4,180,890,150);
  board.addChild(bg,boardGrid);

  // GAME MGMT & SCORES

  var newGameButton = new createjs.Shape().set({x:60,y:35});
  newGameButton.graphics.beginFill("#AAA5A5").drawRect(0,0,300,100);
  newGameButton.addEventListener("click",newGame);
  newGameButton.name = "new";
  var newGameLabel = new createjs.Text("NEW GAME", mediumLabelStyle, white).set({x:206,y:65});
  newGameLabel.textAlign = "center";

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

  board.addChild(newGameButton,newGameLabel,whiteTurn,whiteIcon,blackTurn,blackIcon);

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

function popSelectors(set) {

  shuffledSelectors = [];

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

  function buildSet(set) {

    if (comparePosSets(shuffledSelectors,set,0,2)) {
      shuffledRowSelectors = shuffle(rowSelectors); // randomize pos selectors
      for (var i = 0; i < 2; i++) { shuffledSelectors[i] = shuffledRowSelectors[i];}
      buildSet(set);
    }
    
    else if (comparePosSets(shuffledSelectors,set,2,4)) {
      shuffledColSelectors = shuffle(colSelectors); // randomize pos selectors
      for (var i = 2; i < 4; i++) { shuffledSelectors[i] = shuffledColSelectors[i];}
      buildSet(set);
    }

    else if (compareShapeSets(shuffledSelectors,set,4,10)) {
      shuffledShapeSelectors = shuffle(shapeSelectors); // randomize shape selectors
      for (var i = 4; i < 10; i++) { shuffledSelectors[i] = new ShapeButton(shuffledShapeSelectors[i][0],shuffledShapeSelectors[i][1],shuffledShapeSelectors[i][2],shuffledShapeSelectors[i][3],0,0);}
      buildSet(set);
    }

  function comparePosSets(newSet,currentSet,start,end) {

    var duplicate = false;

    for (var i = start; i < end; i++) {
        for (var n = start; n < end; n++) {
          if (currentSet[i] != null && (currentSet[i].val == newSet[n].val)) {
            duplicate = true;
          }
        }
      }
      return duplicate;
    }

    function compareShapeSets(newSet,currentSet,start,end) {

    var duplicate = false;

    for (var i = start; i < end; i++) {
        for (var n = start; n < end; n++) {
          if (currentSet[i] != null && ((currentSet[i].val[0] == newSet[n].val[0]) && (currentSet[i].val[1] == newSet[n].val[1]) && (currentSet[i].val[2] == newSet[n].val[2]) && (currentSet[i].val[3] == newSet[n].val[3]))) {
            duplicate = true;
          }
        }
      }
      return duplicate;
    }

  }

  buildSet(set);
}

function loadSelectors(set) {

  createjs.Ticker.setPaused(false);

  var toClear = [];
  buttonRow = 0;

  for (i in selectorsBox.children) {
    if (selectorsBox.children[i].type == "position" || selectorsBox.children[i].type == "shape" || selectorsBox.children[i].type == "placeholder") {
      toClear.push(selectorsBox.children[i]);
    } 
  }

  for (var i = 0; i < toClear.length; i++) {
      selectorsBox.removeChild(toClear[i]);
    }

  for (var i = 0; i < 10; i++) {

    if (set[i] == null) {

        animateDuration = getRandomInt(200,500);
        elasticOriginX = getRandomInt(-200,200);
        elasticOriginY = getRandomInt(50,700);
        elasticRotation = getRandomInt(-80,80);

      if (!(i % 2)) {

        shuffledSelectors[i].x = elasticOriginX;
        shuffledSelectors[i].y = elasticOriginY;
        shuffledSelectors[i].rotation = elasticRotation;
        shuffledSelectors[i].originX = 34;
        shuffledSelectors[i].originY = 110 + (buttonRow * (buttonSize + buttonMargin));

      } else {

        shuffledSelectors[i].x = elasticOriginX;
        shuffledSelectors[i].y = elasticOriginY;
        shuffledSelectors[i].rotation = elasticRotation;
        shuffledSelectors[i].originX = (34 + buttonSize + buttonMargin);
        shuffledSelectors[i].originY = 110 + (buttonRow * (buttonSize + buttonMargin));
      }

      var placeholder = new PlaceholderButton(shuffledSelectors[i].originX,shuffledSelectors[i].originY);

      selectorsBox.addChild(placeholder,shuffledSelectors[i]);
      createjs.Tween.get(shuffledSelectors[i], {override:true}).to({rotation:0,x:shuffledSelectors[i].originX,y:shuffledSelectors[i].originY}, animateDuration, createjs.Ease.backOut);

      set[i] = shuffledSelectors[i];

    } else {

      if (!(i % 2)) {
        set[i].x = 34;
        set[i].y = 110 + (buttonRow * (buttonSize + buttonMargin));
        set[i].originX = set[i].x
        set[i].originY = set[i].y
      } else {
        set[i].x = (34 + buttonSize + buttonMargin);
        set[i].y = 110 + (buttonRow * (buttonSize + buttonMargin));
        set[i].originX = set[i].x
        set[i].originY = set[i].y
      }

      var placeholder = new PlaceholderButton(set[i].x,set[i].y);
      selectorsBox.addChild(placeholder,set[i]);
    }

    if (i % 2) { buttonRow++; }

  }
    stage.update();
    window.setTimeout(endTween,1500);
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


  // CONSTRUCTORS

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


  // ADD BOARD & GAME OBJECTS

  function loadGame() {
    stage.addChild(board,sequenceBox,selectorsBox,actionsBox);
    popSelectors(selectorsP1);
    popSelectors(selectorsP2);
    loadGameObjects(4);
    //loadSelectors(selectorsP1);
    //stage.update();
  }

  function loadGameObjects(gridSize) {

    var row = 0;
    var column = 0;

    var startObjects = shuffle([[0,0,1,1],[0,0,1,1],[0,1,1,0],[0,1,1,0],[1,1,0,0],[1,1,0,0],[1,0,0,1],[1,0,0,1],[1,0,1,1],[0,1,1,1],[0,1,0,0],[1,0,0,0],[1,0,1,0],[1,0,1,0],[0,1,0,1],[0,1,0,1]]);

    for (var i = 0; i < (gridSize*gridSize); i++) {

      if (i/(row+1) == gridSize) { row++; column = 0; }

      var fourm = new GameObject(startObjects[i][0],startObjects[i][1],startObjects[i][2],startObjects[i][3]);
      fourm.x = colVal(column,4,180);
      fourm.y = rowVal(row,4,180,890);
      fourm.id = i;
      fourm.complete = false;

      objectsInPlay.push(fourm);
      stage.addChild(fourm);

      column++;

    }

    stage.update();
  }

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
        updateScores();
        if (gameOver == false) { nextTurn(); }
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

  
  // GAME MGMT

  function updateScores() {

  bScore = 0;
  wScore = 0;

  for (var i = 0; i < objectsInPlay.length; i++) {
    if (objectsInPlay[i].tl == 0 && objectsInPlay[i].tr == 0 && objectsInPlay[i].br == 0 && objectsInPlay[i].bl == 0) {
      objectsInPlay[i].complete = 0;
      bScore++;
    } else if (objectsInPlay[i].tl == 1 && objectsInPlay[i].tr == 1 && objectsInPlay[i].br == 1 && objectsInPlay[i].bl == 1) {
      objectsInPlay[i].complete = 1;
      wScore++;
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

  // console.log(bScore);
  // console.log(wScore);
  stage.update();

  } 

  function checkWin(n) {

    var completeRows;
    var completeCols;

    //console.log("checking for win");

    var rows = [[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15]];
    var cols = [[0,4,8,12],[1,5,9,13],[2,6,10,14],[3,7,11,15]];

    switch(n) {
      case 0:
        if (countCompleteShapes(0)) {
          console.log(completeRows);
          console.log(completeCols);
          endGame(0);
          console.log("black win");
        }
        break;
      case 1:
        if (countCompleteShapes(1)) {
            console.log(completeRows);
            console.log(completeCols);
            endGame(1);
            console.log("white win");
        }
        break;
      case 2:
        if ((countCompleteShapes(0)) && !(countCompleteShapes(1))) {
            console.log(completeRows);
            console.log(completeCols);
            endGame(0);
            console.log("black win");
        } else if (!(countCompleteShapes(0)) && (countCompleteShapes(1))) {
            console.log(completeRows);
            console.log(completeCols);
            endGame(1);
            console.log("white win");
        } else if ((countCompleteShapes(0)) && (countCompleteShapes(1))) {
            countCompleteShapes(0);
            var blackTotal = completeRows.length + completeCols.length;
            countCompleteShapes(1);
            var whiteTotal = completeRows.length + completeCols.length;
          if (blackTotal > whiteTotal) {
            countCompleteShapes(0);
            console.log(completeRows);
            console.log(completeCols);
            endGame(0);
            console.log("black win");
          } else if (whiteTotal > blackTotal) {
            endGame(1);
            console.log("white win");
            console.log(completeRows);
            console.log(completeCols);
          } else {
            endGame(2);
            console.log("draw");
            console.log(completeRows);
            console.log(completeCols);
            countCompleteShapes(0);
            console.log(completeRows);
            console.log(completeCols);
          }
        }
        break;
    }

    function countCompleteShapes(color) {

      var success = false;
      var rowCounter = 0;
      var colCounter = 0;
      completeRows = [];
      completeCols = [];

      for (var a = 0; a < 4; a++) {
        for (var b = 0; b < 4; b++) {
          if (objectsInPlay[rows[a][b]].complete === color) {
            rowCounter++;
          }
          if (objectsInPlay[cols[a][b]].complete === color) {
            colCounter++;
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
        rowCounter = 0;
        colCounter = 0;
      }
      return success;
    }
  }

  function endGame(color) {

    gameOver = true;
    console.log(gameOver);
    createjs.Ticker.setPaused(false);

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

    var winOverlay = new createjs.Container().set({x:0,y:canvas.height});

    var winBG = new createjs.Shape();
    winBG.graphics.beginFill(pink).drawRect(0,0,canvas.width,(canvas.height-890));

    var victory = new createjs.Text(winner,"bold 80px Avenir-Heavy",victoryColor).set({x:centerX,y:100});
    victory.textAlign = "center";

    winOverlay.addChild(winBG,victory);
    stage.addChild(winOverlay);
    selectorsBox.mouseEnabled = false;
    sequenceBox.mouseEnabled = false;
    actionsBox.mouseEnabled = false;
    stage.update();

    createjs.Tween.get(winOverlay, {override:true}).to({y:890}, 300, createjs.Ease.cubicInOut).call(endTween);

  }


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

      loadSelectors(selectorsP2);

      whiteTurn.visible = false;
      blackTurn.visible = true;

      selectorsBox.getChildByName("bg").graphics.beginFill(black);
      selectorsBox.getChildByName("bg").graphics.drawRoundRect(0,0,336,1054,10);
      actionsBox.getChildByName("bg").graphics.beginFill(black);
      actionsBox.getChildByName("bg").graphics.drawRoundRect(0,0,336,1054,10);

      for (var i = 0; i < selectorsP1.length; i++) {
        if (selectorsP1[i].inSlot !== false) {
          selectorsP1[i] = null;
        }
      }

      window.setTimeout(popSelectors,2000,selectorsP1);

    } else {

      loadSelectors(selectorsP1);

      whiteTurn.visible = true;
      blackTurn.visible = false;
      
      selectorsBox.getChildByName("bg").graphics.beginFill("#F9F9F9");
      selectorsBox.getChildByName("bg").graphics.drawRoundRect(0,0,336,1054,10);
      actionsBox.getChildByName("bg").graphics.beginFill("#F9F9F9");
      actionsBox.getChildByName("bg").graphics.drawRoundRect(0,0,336,1054,10);

      for (var i = 0; i < selectorsP2.length; i++) {
        if (selectorsP2[i].inSlot !== false) {
          selectorsP2[i] = null;
        }
      }
      
      window.setTimeout(popSelectors,2000,selectorsP2);

    }

    stage.update();
  }

  function newGame() {

    stage.removeAllChildren();

    objectsInPlay = [];

    for (var i = 0; i < 10; i++) {
      selectorsP1[i] = null;
      selectorsP2[i] = null;
    }

    selectorsBox.mouseEnabled = true;
    sequenceBox.mouseEnabled = true;
    actionsBox.mouseEnabled = true;

    clearSequence();
    loadGame();
    updateScores();

    whiteTurn.visible = true;
    blackTurn.visible = false;

    stage.update();

    loadSelectors(selectorsP1);
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
    obj.scaleX = 1;
    obj.scaleY = 1;
    obj.updateCache();
    obj.uncache();
  }

  // ANIMATION

  function tick(event) {
    if (!event.paused) {
      stage.update(event);
    }
  }

  function endTween() {
    window.setTimeout(function() {    createjs.Ticker.setPaused(true);
    console.log("ticker paused");},1000);
  }

  // UTILITIES

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