/**
 * @module game/revealAllButton
 * @description reveal all button control
 */
define([
    'skbJet/component/gameMsgBus/GameMsgBus',
    'skbJet/component/gladPixiRenderer/gladPixiRenderer'
], function (msgBus, gr) {

    function revealAll() {
        msgBus.publish('startReveallAll');
        msgBus.publish('disableUI');
    }

    function onOneFlipTriggered(count) {
        if (count >= 5) {
            gr.lib._buttonAutoPlay.show(false);
        }
    }
        
    msgBus.subscribe('oneFlipTriggered', onOneFlipTriggered);
    msgBus.subscribe('stopRevealAll', function(){
        gr.lib._buttonAutoPlay.show(true);
    });

    return {
        revealAll:revealAll
    };
});