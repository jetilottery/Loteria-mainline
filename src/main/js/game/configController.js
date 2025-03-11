/**
 * @module control some game config
 * @description control the customized data of paytable&help page and other customized config
 */
define({
    style:{
        win_Text:{dropShadow: true, dropShadowDistance: 5,dropShadowAlpha: 0.8, dropShadowAngle: Math.PI/3, dropShadowBlur:20,dropShadowColor: "#5f300a"},
        win_Try_Text:{dropShadow: true, dropShadowDistance: 5,dropShadowAlpha: 0.8, dropShadowAngle: Math.PI/3, dropShadowBlur:20,dropShadowColor: "#5f300a"},
        win_Value:{dropShadow: true, dropShadowDistance: 5,dropShadowAlpha: 0.8, dropShadowAngle: Math.PI/3, dropShadowBlur:20,dropShadowColor: "#5f300a"},
        nonWin_Text:{dropShadow: true, dropShadowDistance: 5,dropShadowAlpha: 0.8, dropShadowAngle: Math.PI/3, dropShadowBlur:20,dropShadowColor: "#5f300a"},
        errorText:{dropShadow: true, dropShadowDistance: 5,dropShadowAlpha: 0.8, dropShadowBlur:10},
        warningText:{dropShadow: true, dropShadowDistance: 5,dropShadowAlpha: 0.8, dropShadowBlur:10}
    },
    backgroundStyle:{
        "splashSize":"100% 100%",
        "gameSize":"100% 100%"        
    },
    winMaxValuePortrait: true,
    winUpToTextFieldSpace: 10,
    textAutoFit:{
        "autoPlayText":{
            "isAutoFit": true
        },
        "autoPlayMTMText":{
            "isAutoFit": true
        },
        "buyText":{
            "isAutoFit": true
        },
        "tryText":{
            "isAutoFit": true
        },
        "warningExitText":{
            "isAutoFit": true
        },
        "warningContinueText":{
            "isAutoFit": true
        },
        "warningText":{
            "isAutoFit": true
        },
        "errorExitText":{
            "isAutoFit": true
        },
        "errorTitle":{
            "isAutoFit": true
        },
        "errorText":{
            "isAutoFit": false
        },
        "exitText":{
            "isAutoFit": true
        },
        "playAgainText":{
            "isAutoFit": true
        },
        "playAgainMTMText":{
            "isAutoFit": true
        },
        "MTMText":{
            "isAutoFit": true
        }, 
        "win_Text":{
            "isAutoFit": true
        },
        "win_Try_Text":{
            "isAutoFit": true
        }, 
        "win_Value":{
            "isAutoFit": true
        },
        "closeWinText":{
            "isAutoFit": true
        }, 
        "nonWin_Text":{
            "isAutoFit": true
        },
        "closeNonWinText":{
            "isAutoFit": true
        }, 
        "win_Value_color":{
            "isAutoFit": true
        },
        "ticketCostText":{
            "isAutoFit": true
        },
        "ticketCostValue":{
            "isAutoFit": true
        }, 
        "tutorialTitleText":{
            "isAutoFit": true
        }, 
        "closeTutorialText":{
            "isAutoFit": true
        },
        "winUpToText":{
            "isAutoFit": true
        },
        "winUpToValue":{
            "isAutoFit": true
        }
    },
    audio:{
        "gameLoop":{
            "name":"Lotteria_BGM",
            "channel":"0"
        },
        "gameWin":{
            "name":"Lotteria_BGM_Term",
            "channel":"0"
        },
        "gameNoWin":{
            "name":"Lotteria_BGM_Term",
            "channel":"0"
        },
        "ButtonGeneric":{
            "name":"UiClick",
            "channel":"2"
        },
        "PaytableOpen":{
            "name":"UiClick",
            "channel":"2"
        },
        "PaytableClose":{
            "name":"UiClick",
            "channel":"2"
        },
        "ButtonBetMax":{
            "name":"BetMax",
            "channel":"0"
        },
        "ButtonBetUp":{
            "name":"BetUp",
            "channel":"0"
        },
        "ButtonBetDown":{
            "name":"BetDown",
            "channel":"0"
        }
    },
    gladButtonImgName:{
        //audioController
        "buttonAudioOn":"buttonAudioOn",
        "buttonAudioOff":"buttonAudioOff",        
        //buyAndTryController
        "buttonTry":"buttonCommon",
        "buttonBuy":"buttonCommon",
        //errorWarningController
        "warningContinueButton":"buttonClose",
        "warningExitButton":"buttonClose",
        "errorExitButton":"buttonClose",
        //exitAndHomeController
        "buttonExit":"buttonCommon",
        "buttonHome":"buttonHome",
        //playAgainController
        "buttonPlayAgain":"buttonCommon",
        "buttonPlayAgainMTM":"buttonCommon",
        //playWithMoneyController
        "buttonMTM":"buttonCommon",
        //resultController
        "buttonWinClose":"buttonClose",
        "buttonNonWinClose":"buttonClose",
        //ticketCostController
        "ticketCostPlus":"arrowPlus",
        "ticketCostMinus":"arrowMinus",
        //tutorialController
        "iconOff":"tutorialPageIconOff",
        "iconOn":"tutorialPageIconOn",
        //revealAllController
        "buttonAutoPlay":"buttonCommon",
        "buttonAutoPlayMTM":"buttonCommon"

    },
    gameParam:{
        //tutorialController
        "pageNum":1,
		"arrowPlusSpecial":true,
        "popUpDialog":false
    },
    predefinedStyle:{
		landscape:{
			loadDiv:{
				width:960,
				height:600,
				position:'absolute',
				left: "50%",
				top: "50%"
			},
            gameLogoDiv:{
				width:670,
				height:217,
				top: 44,
				left: 145,
				position:'absolute',
                backgroundSize:'100% 100%'
			},
			progressBarDiv:{
				top: 480,
				left: 200,
				width:564,
				height:88,
				padding:0,
				position:'absolute'
			},
			loadingBarButton:{
				top: -20,
				left: "0%",
				width:46,
				height:50,
				padding:0,
				position:'absolute',
				backgroundRepeat:'no-repeat'
			},
			progressDiv:{
				top: 25,
                left:-3,
				height:42,
				width:"0%",
				position:'absolute',
				backgroundRepeat:'no-repeat'
			}
		},
		portrait:{
			loadDiv:{
				width:600,
				height:960,
				position:'absolute',
				left: "50%",
				top: "50%"
			},
            gameLogoDiv:{
				width:500,
				height:200,
				top: 144,
				left: 50,
				position:'absolute',
                backgroundSize:'100% 100%'
			},
			progressBarDiv:{
				top:780,
				left:18,
				width:564,
				height:88,
				padding:0,
				position:'absolute'
			},
			loadingBarButton:{
				top: -20,
				left: "0%",
				width:46,
				height:50,
				padding:0,
				position:'absolute',
				backgroundRepeat:'no-repeat'
			},
			progressDiv:{
				top: 25,
				left: -3,
				height:42,
				width:"0%",
				position:'absolute',
				backgroundRepeat:'no-repeat'
			}
		}
	}
    
});
