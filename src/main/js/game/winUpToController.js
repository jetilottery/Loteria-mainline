/**
 * @module game/winUpToController
 * @description WinUpTo control
 */
define([
    'skbJet/component/gameMsgBus/GameMsgBus',
    'skbJet/component/gladPixiRenderer/gladPixiRenderer',
    'skbJet/component/pixiResourceLoader/pixiResourceLoader',
    'skbJet/component/SKBeInstant/SKBeInstant',
    'skbJet/componentCRDC/IwGameControllers/gameUtils',
    'game/configController'
], function (msgBus, gr, loader, SKBeInstant,gameUtils, config) {
    
    // In portrait mode, these two textfields in one line but in lanscape mode, they're positioned in two lines. 
    function fix(){
		var len = gr.lib._textContainer._currentStyle._width;
		var winUpToValueLeft = 0;
        if (config.winUpToTextFieldSpace){
            gr.lib._winUpToText.updateCurrentStyle({'_left': (len - (Number(gr.lib._winUpToText.pixiContainer.$text.width) + Number(gr.lib._winUpToValue.pixiContainer.$text.width+ config.winUpToTextFieldSpace))) / 2});
            winUpToValueLeft = gr.lib._winUpToText._currentStyle._left + gr.lib._winUpToText.pixiContainer.$text.width + config.winUpToTextFieldSpace;
        }else{
            gr.lib._winUpToText.updateCurrentStyle({'_left': (len - (Number(gr.lib._winUpToText.pixiContainer.$text.width) + Number(gr.lib._winUpToValue.pixiContainer.$text.width))) / 2});
            winUpToValueLeft = gr.lib._winUpToText._currentStyle._left + gr.lib._winUpToText.pixiContainer.$text.width;
        }
        
        gr.lib._winUpToValue.updateCurrentStyle({'_left': winUpToValueLeft});           
    }

    function onGameParametersUpdated(){
        if (config.style.winUpToText) {
            gameUtils.setTextStyle(gr.lib._winUpToText, config.style.winUpToText);
        }
        if (config.textAutoFit.winUpToText){
            gr.lib._winUpToText.autoFontFitText = config.textAutoFit.winUpToText.isAutoFit;
        }
        gr.lib._winUpToText.setText(loader.i18n.Game.win_up_to);
        if (config.style.winUpToValue) {
            gameUtils.setTextStyle(gr.lib._winUpToValue, config.style.winUpToValue);
        }
        if (config.textAutoFit.winUpToValue){
            gr.lib._winUpToValue.autoFontFitText = config.textAutoFit.winUpToValue.isAutoFit;
        }
        gr.lib._winUpToValue.autoFontFitText = true;

        fix();
    }
    
    function onTicketCostChanged(prizePoint){
        var rc = SKBeInstant.config.gameConfigurationDetails.revealConfigurations;
        for (var i = 0; i < rc.length; i++) {
            if (Number(prizePoint) === Number(rc[i].price)) {
                var ps = rc[i].prizeStructure;
                var maxPrize = 0;
                for (var j = 0; j < ps.length; j++) {
                    var prize = Number(ps[j].prize);
                    if (maxPrize < prize) {
                        maxPrize = prize;
                    }
                }
				gr.lib._winUpToValue.autoFontFitText = true;
                gr.lib._winUpToValue.setText(SKBeInstant.formatCurrency(maxPrize).formattedAmount + loader.i18n.Game.win_up_to_mark);
                fix();
                return;
            }
        }        
    }

    msgBus.subscribe('ticketCostChanged',onTicketCostChanged);
    msgBus.subscribe('SKBeInstant.gameParametersUpdated', onGameParametersUpdated);

    return {};
});