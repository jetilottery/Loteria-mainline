
define([
    'skbJet/component/gameMsgBus/GameMsgBus',
    'skbJet/component/howlerAudioPlayer/howlerAudioSpritePlayer',
    'skbJet/component/gladPixiRenderer/gladPixiRenderer',
    'skbJet/component/SKBeInstant/SKBeInstant',
    'skbJet/componentCRDC/IwGameControllers/gameUtils',
    'skbJet/componentCRDC/gladRenderer/gladButton',
    'skbJet/component/pixiResourceLoader/pixiResourceLoader',
    'game/configController'
], function (msgBus, audio, gr, SKBeInstant, gameUtils, gladButton, loader, config) {
var PIXI = require('com/pixijs/pixi');
var winValue = 0;
var flipCount = 0;
var revealAll = false;
var revealInterval = 1000;
var toRevealSymbol = [];
var winBoardLightSymbol = null;
var winAudioNum = 1;
var oneFlipAudioPlayed=false;
var addMask = false;
var prizeValue = 0;
var winboxErrorExit = false;
var gridSymbolWinLineMap = [//static
    [3, 5, 9], //grid symbol 0
    [3, 8], //1
    [3, 7], //2
    [3, 4, 6], //3
    [2, 9], //4
    [2, 5, 8], //5
    [2, 4, 7], //6
    [2, 6], //7
    [1, 9], //8
    [1, 4, 8], //9
    [1, 5, 7], //10
    [1, 6], //11
    [0, 4, 9], //12
    [0, 8], //13
    [0, 7], //14
    [0, 5, 6]//15        
];
    
    var winLineSymbol=[//every line contain which grid symbol
        [12,13,14,15], //0
        [8,9,10,11], //1
        [4,5,6,7], //2
        [0,1,2,3], //3
        [3,6,9,12], //4
        [0,5,10,15], //5
        [3,7,11,15], //6
        [2,6,10,14], //7
        [1,5,9,13], //8
        [0,4,8,12] //9
    ];
    var prizeTableValue = [];
    var flipButton; 
       
    var linesData = {}; //to track anim.
    
    var revealSymbolArray = new Array(15);
    var oneFlipFinished = 0;
    
    function setGridOriginSymbol() {
        for (var i = 0; i < 16; i++) {
            var index = i+1;
            console.log("index " + i + " symbol " + index);
            gr.lib['_symbolNormal_' + i].setImage('symbol_' + index);
            gr.lib['_symbolGray_' + i].setImage('symbolGray_' + index);
            gr.lib['_symbolGray_' + i].show(true);
            gr.lib['_winSymbolLight_' + i].show(false);
            gr.lib['_winSymbolLight_' + i].phash = 0;
        }
    }
    
    function setGirdSymbol(array) {
        for (var i = 0; i < array.length; i++) {
            console.log("index " + i + " symbol " + array[i]);
            gr.lib['_symbolNormal_' + i].setImage('symbol_' + array[i]);
            gr.lib['_symbolGray_' + i].setImage('symbolGray_' + array[i]);
            gr.lib['_symbolGray_' + i].show(true);
            gr.lib['_winSymbolLight_' + i].show(false);
            gr.lib['_winSymbolLight_' + i].phash = 0;
        }
    }
    
    function hideWinline(){
        winAudioNum = 1;
        winBoardLightSymbol = null;
        for(var i=0; i<10; i++){
            gr.lib['_winLin'+i].show(false);
            gr.lib['_winBoardLight_'+i].stopPlay();
            gr.lib['_winBoardLight_'+i].show(false);
        }
    }
    
    function resetPlayTimes() {
        for (var i = 0; i < 5; i++) {
            gr.lib['_gameTime0' + i].setImage('gameTimeDisappear_0000');
        }
    }
    
    function revealRevealSymbol(){
        function goOut(i) {
            gr.getTimer().setTimeout(function () {
                gr.animMap['_gameCardGo' + i + 'Ani'].play();
            }, i * 75);
        }
        oneFlipFinished = 0;
        oneFlipAudioPlayed = false;
        if (flipCount === 0) {
            gr.lib['_gameTime0' + flipCount].gotoAndPlay('gameTimeDisappear',0.5);
        }else{
            audio.play(config.audio.ButtonGeneric.name, config.audio.ButtonGeneric.channel);
        }
        
        flipButton.show(false);
        toRevealSymbol = [];
        for(var i = flipCount*3; i < flipCount*3 +3; i++){
            toRevealSymbol.push(i);
        }
        
        flipCount++;        
        msgBus.publish('oneFlipTriggered', flipCount);
        if (flipCount === 1) {
            openCard();
        } else {
            for (i = 0; i < 3; i++) {
                goOut(i);
            }
        }
        
        if(flipCount === 5){
            gr.lib._buttonAutoPlay.show(false);
            gr.lib._buttonStop.show(false);
            gr.lib._buttonInfo.show(false);
        }
        
    }
    
    function checkCardFinished(){
        oneFlipFinished++;
        if(oneFlipFinished < 3){
            return;
        }        
        if (flipCount < 5) {
            if (revealAll) {
                    gr.getTimer().setTimeout(function () {
                        if (revealAll) {
                            revealRevealSymbol();
                        }else{
                            flipButton.show(true);
                        }
                    }, revealInterval);
            } else {
                flipButton.show(true);
            }
        } else {
            revealAll = false;
            if (winValue < prizeValue) {
                msgBus.publish('winboxError', {errorCode: '29000'});
				winboxErrorExit = true;
                return;
            }else if(winValue > prizeValue){
                return;
            }
            for (var i = 0; i < 10; i++) {
                if (linesData[i].count === 3) {
                    stopWinBoardAnim(i);
                }
            }
            msgBus.publish('allRevealed');
        }
    }
    
    function stopWinBoardAnim(lineNum) {
        if (gr.animMap['_winBoard' + lineNum + 'Ani'].timer) {
            gr.getTimer().clearTimeout(gr.animMap['_winBoard' + lineNum + 'Ani'].timer);
        }
        gr.animMap['_winBoard' + lineNum + 'Ani'].stop();
        if (lineNum === 4) {
            gr.lib['_winBoard_' + lineNum].updateCurrentStyle({'_transform': {'_rotate': -180}});
        } else {
            gr.lib['_winBoard_' + lineNum].updateCurrentStyle({'_transform': {'_rotate': 0}});
        }
    }
    
    function setComplete(){
        function setCardComplete(symbol){
            symbol.onComplete = function(){ //card anim finished.
                if(symbol.animPhash === 1){
                    if (symbol.symbolData.gridSymbolIndex || symbol.symbolData.gridSymbolIndex === 0) {//matched
                        symbol.animPhash = 2;
                        gr.getTimer().setTimeout(function () {
                            if (!oneFlipAudioPlayed) {
                                audio.play('Match', 5);
                                oneFlipAudioPlayed = true;
                            }
                            symbol.gotoAndPlay('gameCardWin' + symbol.symbolData.artIndex, 0.3);
                            gr.lib['_symbolGray_'+ symbol.symbolData.gridSymbolIndex].gotoAndPlay('symbolDisappear'+symbol.symbolData.artIndex, 0.5);
                        }, 300);

                    } else { //this card didn't match anything.
                        gr.lib['_gameCardDim0' + symbol.cardIndex].show(true);
                        checkCardFinished();
                    }
                }else{
                    gr.lib['_cardLight0' + symbol.cardIndex].show(true);
                    gr.lib['_cardLight0' + symbol.cardIndex].gotoAndPlay('cardLight',0.75);
                }
            };
        }
        
        function setLightComplete(symbol){
            symbol.onComplete = function(){ //card light finished.
              gr.lib['_cardLight0' + symbol.cardIndex].show(false);
              gr.lib['_cardEffect0'+symbol.cardIndex].show(true);
              gr.lib['_cardEffect0'+symbol.cardIndex].gotoAndPlay('cardEffect',0.75);
            };
        }
        
        function setCardEffectComplete(symbol){
            symbol.onComplete = function(){ //card effect anim finished
                gr.lib['_cardEffect0'+symbol.cardIndex].show(false);
                checkCardFinished();
            };
        }
        
        
        function setGridSymbolComplete(gridSymbol){
            gridSymbol.onComplete = function(){
                gridSymbol.show(false);
                gr.lib['_winSymbolLight_'+gridSymbol.gridIndex].show(true);
                gr.lib['_winSymbolLight_'+gridSymbol.gridIndex].gotoAndPlay('winSymbolLight', 0.25);
                audio.play('Highlight' + Math.ceil(Math.random()*3),4);
            };
        }
        
        function setGridWinLightComplete(gridWineLightSymbol){ //grid win light complete
            gridWineLightSymbol.onComplete = function(){
                gridWineLightSymbol.show(false);
                if(gridWineLightSymbol.phash ===0){
                    gridWineLightSymbol.phash = 1;
                    var lineNum;
                    for (var key in gridWineLightSymbol.inLines) {
                        lineNum = gridWineLightSymbol.inLines[key];
                        if(linesData[lineNum].winShown){
                            continue;
                        }
                        linesData[lineNum].count++;
                        if(linesData[lineNum].count === 3){
                            gr.animMap['_winBoard'+ lineNum +'Ani'].play();
                        }else if(linesData[lineNum].count === 4){
                            linesData[lineNum].winShown = true;
                            stopWinBoardAnim(lineNum);
                            winValue += Number(prizeTableValue[Number(lineNum)]);
                            gr.animMap['_symbolWinAni' + lineNum].play();
                            for (var k in winLineSymbol[lineNum]) {
                                gr.lib['_winSymbolLight_' + winLineSymbol[lineNum][k]].show(true);
                                gr.lib['_winSymbolLight_' + winLineSymbol[lineNum][k]].gotoAndPlay('winSymbolLight', 0.25);
                            }
                            audio.play('Win' + winAudioNum++, 3);
                        }
                    }
                }
            };
        }
        for(var i=0; i<3; i++){
            gr.lib['_gameCard0'+i].cardIndex = i;
            setCardComplete(gr.lib['_gameCard0'+i]);
            
            gr.lib['_cardLight0'+i].cardIndex = i;
            setLightComplete(gr.lib['_cardLight0'+i]);
            
            gr.lib['_cardEffect0'+i].cardIndex = i;
            setCardEffectComplete(gr.lib['_cardEffect0'+i]);            
        }
        
        for(i = 0; i<16; i++){
            gr.lib['_symbolGray_'+i].gridIndex = i;
            setGridSymbolComplete(gr.lib['_symbolGray_'+i]);
            
            gr.lib['_winSymbolLight_'+i].gridIndex = i;
            gr.lib['_winSymbolLight_'+i].inLines = gridSymbolWinLineMap[i];
            setGridWinLightComplete(gr.lib['_winSymbolLight_'+i]);
        }
    }
    
    function setGladAnimComplete(){
        function gridSymbolWinComplete(gladAnim){
            gladAnim._onComplete = function(){
                if(winValue > prizeValue){
                    msgBus.publish('winboxError',{errorCode:'29000'});
                    flipButton.show(false);
                    revealAll = false;
					winboxErrorExit = true;
                    return;
                }
				if(winboxErrorExit){
					return;
				}
                gr.lib._winsValue.setText(SKBeInstant.formatCurrency(winValue).formattedAmount);
                gameUtils.fixMeter(gr);
                var index = gladAnim.winIndex;
                gr.lib['_winLin'+ index].updateCurrentStyle({'_opacity': 0});
                gr.lib['_winLin'+ index].show(true);
                gr.animMap['_winLin'+ index + 'Ani'].play();
                gr.lib['_winBoardLight_'+index].show(true);
                
                gr.lib['_winBoardLight_'+index].gotoAndPlay('winBoardLight_'+index, 0.3, true, winBoardLightSymbol?winBoardLightSymbol.pixiContainer.$sprite.currentFrame:0);
                if (!winBoardLightSymbol) {
                    winBoardLightSymbol = gr.lib['_winBoardLight_' + index];
                }
            };
        }
        
        function winBoardComplete(gladAnim){
            gladAnim._onComplete = function(){
                gladAnim.timer = gr.getTimer().setTimeout(function(){
                    gladAnim.play();
                },300);
            };
        }
        
        for (var i = 0; i < 10; i++) {
            gr.animMap['_symbolWinAni' + i].winIndex = i;
            gridSymbolWinComplete(gr.animMap['_symbolWinAni' + i]);
            winBoardComplete(gr.animMap['_winBoard'+ i +'Ani']);
        }
        
        gr.animMap['_gameCardGo2Ani']._onComplete = function(){
            function goIn(i) {
                if (flipCount > 1) {
                    gr.lib['_gameTime0' + (flipCount - 1)].gotoAndPlay('gameTimeDisappear',0.5);
                }
                gr.getTimer().setTimeout(function () {
                    gr.animMap['_gameCardBack' + i + 'Ani'].play();
                }, i * 60);
            }
            gr.getTimer().setTimeout(function () {
                for (i = 0; i < 3; i++) {
                    gr.lib['_gameCard0' + i].setImage('gameCardNormal1_0000');
                    gr.lib['_gameCardDim0' + i].show(false);
                    goIn(i);
                }
            }, 80);
        };
        
        gr.animMap['_gameCardBack2Ani']._onComplete = function () {
            gr.getTimer().setTimeout(function () {
                openCard();
            }, 300);
        };
        
    }
    
    function openCard() {
        audio.play('TileReveal', 1);
        for (var i = 0; i < 3; i++) {
            var symbol = revealSymbolArray[toRevealSymbol[i]];
            gr.lib['_gameCard0' + i].symbolData = symbol;
            gr.lib['_gameCard0' + i].animPhash = 1;
            gr.lib['_gameCard0' + i].gotoAndPlay('gameCardNormal' + symbol.artIndex, 0.4);
        }
    }

    function resetCardSymbol(){
        for(var i=0; i<3; i++){
            gr.lib['_gameCardDim0'+i].show(false);
            gr.lib['_cardLight0' + i].show(false);
            gr.lib['_cardEffect0' + i].show(false);
            gr.lib['_gameCard0'+i].setImage('gameCardNormal1_0000');
        }
    }
    
    
    function onGameParametersUpdated(){
        if(SKBeInstant.config.customBehaviorParams){
           revealInterval = SKBeInstant.config.customBehaviorParams.flipInterval || revealInterval;
        }
        
        var scaleType = {'scaleXWhenClick': 0.92, 'scaleYWhenClick': 0.92, 'avoidMultiTouch':true};
        gr.lib._flipButton_Text.autoFontFitText = true;
        gr.lib._flipButton_Text.setText(loader.i18n.Game.flip);
        
        flipButton = new gladButton(gr.lib._flipButton, "flipButton", scaleType);
        flipButton.show(false);
        flipButton.click(function(){
            revealRevealSymbol();
        });

        for(var i = 0; i<10; i++){
            gr.lib['_winBoard_Text_'+i].autoFontFitText = true;
        }
        
        setGridOriginSymbol();
        for(i = 0; i <15; i++){
            var symbol = {};
            symbol.gridSymbolIndex = null;
            symbol.artIndex = null;
            revealSymbolArray[i] = symbol;
        }
        hideWinline();
        resetCardSymbol();
        setComplete();
        setGladAnimComplete();
        
    }
    
    
    function addCardMask(){
        if(addMask){
            return;
        }else{
            addMask = true;
        }
        var maskWidth = gr.lib._gameCardMask._currentStyle._width;
        var maskHeight = gr.lib._gameCardMask._currentStyle._height;
        var cardMask = new PIXI.Graphics();
        cardMask.beginFill();
        cardMask.drawRect(0, 0, maskWidth, maskHeight);
        cardMask.endFill();
        gr.lib._gameCardMask.pixiContainer.addChild(cardMask);
        gr.lib._gameCard.pixiContainer.mask = cardMask;
        gr.lib._gameCardDim.pixiContainer.mask = cardMask;
    }
    
    function onStartUserInteraction(data){
         if (!data.scenario) {
             return;
         }
        addCardMask();
        handleData(data);
    }
    
    function handleData(data){
        function numberArray(array){
            for(var i=0; i<array.length; i++){
                array[i] = Number(array[i]);
            }
        }
        
        winValue = 0;
        flipCount = 0;
        revealAll = false;
        var gridSymbolData, revealSymbolData;
        if (data.scenario) {
            var splitArray = data.scenario.split('|');
            gridSymbolData = splitArray[0].split(',');
            numberArray(gridSymbolData);
            revealSymbolData = splitArray[1].split(',');
            numberArray(revealSymbolData);
            // if (data.playResult === "WIN") {
                prizeValue = data.prizeValue;
            // } else {
            //     prizeValue = 0;
            // }
        } else {
            return;
        }
        
        setGirdSymbol(gridSymbolData);

        for (var i = 0; i < revealSymbolData.length; i++) {
            revealSymbolArray[i].gridSymbolIndex = null;
            revealSymbolArray[i].artIndex = revealSymbolData[i];
            
            for (var j = 0; j < gridSymbolData.length; j++) {
                if(revealSymbolData[i] === gridSymbolData[j]){
                    revealSymbolArray[i].gridSymbolIndex = j;
                    console.log("card index " + i + " match grid " + j );
                    continue;
                }
            }
        }
        
        linesData = {};
        for (i = 0; i < 10; i++){
            linesData[i]={};
            linesData[i].count = 0;
            linesData[i].winShown = false; 
        }
        flipButton.show(true);
    }


    function onPlayerWantsPlayAgain(){
        flipButton.show(false);
        setGridOriginSymbol();
        hideWinline();
        resetCardSymbol();
        resetPlayTimes();
    }
    
    function onReInitialize(){
        flipButton.show(false);
        setGridOriginSymbol();
        resetCardSymbol();
        hideWinline();
        resetPlayTimes();
    }
    
    function onTicketCostChanged(prizePoint){
        prizeTableValue = [];
        var rc = SKBeInstant.config.gameConfigurationDetails.revealConfigurations;
        for (var i = 0; i < rc.length; i++) {
            if (Number(prizePoint) === Number(rc[i].price)) {
                var pt = rc[i].prizeTable;
                for (var j = 0; j < pt.length; j++) {
                    prizeTableValue.push([pt[j].prize]);
                    gr.lib['_winBoard_Text_' + j].setText(SKBeInstant.formatCurrency(pt[j].prize).formattedAmount);
                }
                break;
            }
        }
    }
    
    msgBus.subscribe('SKBeInstant.gameParametersUpdated', onGameParametersUpdated);
    msgBus.subscribe('jLottery.reInitialize', onReInitialize);
    msgBus.subscribe('jLottery.reStartUserInteraction', handleData);
    msgBus.subscribe('jLottery.startUserInteraction', onStartUserInteraction);
    msgBus.subscribe('ticketCostChanged', onTicketCostChanged);
    msgBus.subscribe('playerWantsPlayAgain', onPlayerWantsPlayAgain);
    msgBus.subscribe('startReveallAll',function(){
        revealAll = true;
        if (gr.lib._flipButton.pixiContainer.visible) {
            revealRevealSymbol();
        }
    });
    msgBus.subscribe('stopRevealAll', function () {
        revealAll = false;
    });
});
