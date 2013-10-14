void function(){
        
    // start 函数库 =======================================
    function g(id){
        return document.getElementById(id);
    }
    /**
     * 格式化函数
     * @param {String} template 模板
     * @param {Object} json 数据项
     */
    function format(template, json){
        return template.replace(/#\{(.*?)\}/g, function(all, key){
            return json && (key in json) ? json[key] : "";
        });
    }
 
    function on(element, type, listener){
        if (element.addEventListener) {
            element.addEventListener(type, listener, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, listener);
        }
    }
	//页面宽度
	function pageWidth() {
        var doc = document,
            body = doc.body,
            html = doc.documentElement,
            client = doc.compatMode == 'BackCompat' ? body : doc.documentElement;
        return Math.max(html.scrollWidth, body.scrollWidth, client.clientWidth);
    };
	
	/*
     * 贝赛尔曲线
     * @param{Array[Array[Number, Number],...]} curve 曲线每个参考点
     * @param{Number} rate 比率
     */
    function bezier(curve, rate){
        if (!curve || !curve.length) return [];
        if (curve.length == 1) return [curve[0][0], curve[0][1]];
        if (curve.length == 2) return [
            curve[0][0] + (curve[1][0] - curve[0][0]) * rate,
            curve[0][1] + (curve[1][1] - curve[0][1]) * rate
        ];
        var temp = [];
        for (var i = 1; i < curve.length; i++){
            temp.push(bezier([curve[i - 1], curve[i]], rate));
        }
        return bezier(temp, rate);
    }
	
	function nStatistics2013(params) {
        var param_url = [];
        for (param in params) {
            param_url.push(param + '=' + encodeURIComponent(params[param]));
        }
		var n = "springLog_"+ (new Date()).getTime();
        var c = window[n] = new Image();
        c.onload = (c.onerror=function(){window[n] = null;});
        c.src = "http://nsclick.baidu.com/v.gif?pid=201&pj=springcaidan2013&p=mini&" + param_url.join('&') + '&t=' + (+new Date());
        c = null;
    }

    // end 函数库 =======================================

    var
        //version = '?v=11', // 资源发生升级时修改
        version = '',
        PI=Math.PI,
        head = document.getElementsByTagName("head")[0],
        lm = g('lm'),
        s_wrap = g('s_wrap'), // 新首页
        /*
         * 图片host路径
         */
        // 真实路径
        imghost = 'http://s1.bdstatic.com/r/www/cache/spring2013/',
        
        /* lan start */
        // 内网测试
        //imghost = 'http://wuyaoquan.fe.baidu.com/spring/static/',
        /* lan end */

        // 本机测试
        /* debug start */
        //imghost = 'static/',
        /* debug end */
        
        /*
         * 红包页面
         */
        //prizeurl = 'http://yun.baidu.com/huodong/christmas',
        
        /*
         * 相关的dom节点
         */
		logoContainer = g('lg'),
        lg_img = logoContainer.getElementsByTagName('img')[0],
		lg_snake,
		springLgSnakeA,
		gameStageOuter,
		gameStage,
		gameStageClose,
		gameStageTip1,
		gameStageTip1a,
		gameStageCountDown,
		gameStageCountDown3,
		gameStageCountDown2,
		gameStageCountDown1,
		gameStageTip2,
		gameStageTip3,
		gameStageInner,
		gameShare,
		gameShareHongbao,
		gameShareWeibo,
		gameRegion,
        //wrapper = g('wrapper'),
        /*
         * 是否ie
         */
        ie = document.all && window.attachEvent,
        firefox = /firefox\/\d+\.\d+/i.test(navigator.userAgent),
        opera = /opera(\/| )\d+/i.test(navigator.userAgent),
        ogg = firefox || opera,
        /*
         * 是否ie9+
         */
        ie9plus = ie && window.XMLHttpRequest && window.addEventListener, 
        /*
         * 是否ie6
         */
        ie6 = ie && !window.XMLHttpRequest,
        supportedCSS,
        /*
         * 游戏的进度
         */
        chapter,
        /*
         * 开始时间
         */
        starttime,
        /*
         * 动画计时器
         */
        timer,
      
        soundElement,
		snakeIsLoad,//蛇是否已加载过
		logoAnimationTick,
		logoAnimationTick2,
		countDownTick,
		isPause,//暂停标志
		life,//生命值=3
		life2,//第一关的碰壁生命值=1
		readyToEat,//准备要吃的祝福字序号
		addSnakePos,//记录在蛇的哪个位置添加祝福字
		specialOrder,//处理蒸蒸日上重字的问题
		lastDir,//记录上一次的蛇头运动方向，解决见闻色预判问题
		/**
		  * 通行令牌
		  */
		goNext=false,
		curLevel=0,
		curSubLevel=0,
		curBlessPos,//存放当前出现四字的位置标号
		//记录祝福字的dom节点 
		blessTextArr=[],
		//标记已使用占用的tile，空间换取时间，1代表已占用，0代表未占用，长度180
		usedTile=[],
		//蛇身dom
		snakeBodyArr=[],//0放节点,1放运动方向,2放所在tile编号,3基本蛇身还是祝福字,4存放i,5存放j,空间换时间
		
        gameConfig = {
		    "logo":[0,136,276,414,552,690,830,969],
			"blessText":[
			         //新春快乐
			         [
					    [0,0],[-35,0],[-70,0],[-106,0]
					 ],
					 //万象更新、紫气东来
					 [
					    [0,-34],[-35,-34],[-70,-34],[-106,-34],[-144,-34],[-181,-34],[-218,-34],[-255,-34]
					 ],
					 //合家欢乐、福如东海、财源广进
					 [
					    [0,-68],[-35,-68],[-70,-68],[-106,-68],[-144,-68],[-181,-68],[-218,-68],[-255,-68],[-291,-68],[-325,-68],[-359,-68],[-393,-68]
					 ],
					 //心想事成、金玉满堂、福寿双全、蒸蒸日上
					 [
					    [0,-102],[-35,-102],[-70,-102],[-106,-102],[-144,-102],[-181,-102],[-218,-102],[-255,-102],[-291,-102],[-325,-102],[-359,-102],[-393,-102],[-431,-102],[-466,-102],[-500,-102],[-533,-102]
					 ],
					 //七星高照、财运亨通、幸福安康、前程似锦、花开富贵、万事如意
					 [
					    [0,-137],[-35,-137],[-70,-137],[-106,-137],[-144,-137],[-181,-137],[-218,-137],[-255,-137],[-291,-137],[-325,-137],[-359,-137],[-393,-137],[-431,-137],[-466,-137],[-500,-137],[-533,-137],[-567,-137],[-600,-137],[-633,-137],[-667,-137],[-700,-137],[-733,-137],[-767,-137],[-800,-137]
					 ]
			  ],//记录每个祝福字的backgroundPosition
		      level:[1,2,3,4,6],
			  share:["images/shareyhdzcdqd1.jpg","images/sharejyznxsdl2.jpg","images/sharezyldlzyt3.jpg","images/sharezmsdlmp4.jpg","images/sharewshylj5.jpg"],
			  levelSpeed:[300,280,260,240,220]
		};

    
    /*
	 * n个球里面不重复取出m个球,算法二
	 */
	 
	function NM(n,m){
		var t,ans=[],total=[];
		getUsedTile();
		for(var i=0;i<n;i++){
			if(usedTile[i]) continue;
		    total.push(i);
		}
		for(i=0;i<m;i++){
			t=Math.floor(Math.random()*total.length);
			ans.push(total[t]);
		    total.splice(t,1);
		}
		return ans;
	}

    function getUsedTile(){
		clearUsedTile();
		var i=0;
		//四周边框附近不放字
		for(i=0;i<20;i++){
		    usedTile[i]=1;
		}
		for(i=160;i<180;i++){
		    usedTile[i]=1;
		}
		usedTile[20]=1;
		usedTile[40]=1;
		usedTile[60]=1;
		usedTile[80]=1;
		usedTile[100]=1;
		usedTile[120]=1;
		usedTile[140]=1;
		usedTile[39]=1;
		usedTile[59]=1;
		usedTile[79]=1;
		usedTile[99]=1;
		usedTile[119]=1;
		usedTile[139]=1;
		usedTile[159]=1;
		
	    for(i=0,len=snakeBodyArr.length;i<len;i++){
		    usedTile[snakeBodyArr[i][2]]=1;
		}
		//蛇头的上下左右不能放字避免逼死蛇
		//up
		if(snakeBodyArr[0][2]-20>=0){
			usedTile[snakeBodyArr[0][2]-20]=1; 
		}
		//down
		if(snakeBodyArr[0][2]+20<=179){
			usedTile[snakeBodyArr[0][2]+20]=1; 
		}
		//left
		if(snakeBodyArr[0][2]-1>=0){
			usedTile[snakeBodyArr[0][2]-1]=1; 
		}
		//right
		if(snakeBodyArr[0][2]+1<=179){
			usedTile[snakeBodyArr[0][2]+1]=1;
		}
	}

    function clearUsedTile(){
	    for(var i=0;i<180;i++){
		    usedTile[i]=0;
		}
	}
	
	/*
	 * 音乐函数
	 */
	function playSound(file, loop, pause){
        if (supportedCSS){ // 用audio播放
            soundElement = soundElement || {};
            try{
                if (!soundElement[file]){
                    soundElement[file] = new Audio(
                        imghost + 'sound/' + (ogg ? file.replace(/\.mp3/, '.ogg') : file)
                    );
                    loop && soundElement[file].addEventListener('ended', function(){
                        this.currentTime = 0;
                        this.play();
                    }, false);
                }
                !pause && soundElement[file].play();
            }catch(ex){}
        } else { // 用bgsound播放
            if (!soundElement){
                soundElement = document.createElement('bgsound');
                document.body.appendChild(soundElement);
            }
            if (!pause){
                soundElement.src = imghost + 'sound/' + file;
            }
            soundElement.loop = loop ? -1 : 0;
        }
    }

    function stopSound(){
        if (!soundElement) return;
        if (supportedCSS){ // 用audio播放
            try{
                for (var p in soundElement){
                    soundElement[p].pause();
                }
            }catch(ex){}
        } else { // 用bgsound播放
            soundElement.src = '';
        }
    }
	
	function rotate(element, angle){
        if (!element) return;
        var t = parseInt(angle / (2 * PI) * 360) % 360;
        if (supportedCSS){
            element.style[supportedCSS] = format('rotate(#{0}deg)', [t]);
        } else {
            element.style['rotation'] = t + 'deg';
        }
    }


    /*
     * 计算css3支持的名字
     */
    if (!ie || document.documentMode >= 9){
        var styles = head.style;
        for (var p in {
            transformProperty: 1,
            WebkitTransform: 1,
            OTransform: 1,
            msTransform: 1,
            MozTransform: 1
        }){
            if (/^[^u]/.test(typeof styles[p])) {
                supportedCSS = p;
                break;
            }
        };
        /*
         * 不支持css3...
         */
        if (!supportedCSS) return;
    }


//隐藏祝福字和蛇
function hideBlessText(){
	for(var i=0,len=blessTextArr.length;i<len;i++){
		for(var j=0;j<blessTextArr[i].length;j++){
			blessTextArr[i][j].style.display="none";
		}
	}
	
	for(i=0,len=snakeBodyArr.length;i<len;i++){
	    snakeBodyArr[i][0].style.display="none";
	}
}

    function resetSnake(){
		snakeBodyArr=[];
		for(var i=0;i<5;i++){
			snakeBodyArr.push([g("snake-body-"+(i+1))]);  
			snakeBodyArr[i].push(3); //方向 0-up, 1-right, 2-down, 3-left
			snakeBodyArr[i].push(88+i);  //所在的tile编号
			snakeBodyArr[i].push(0); //0代表基本蛇身，1代表祝福字
			snakeBodyArr[i].push(Math.floor(snakeBodyArr[i][2]/20));  //i
			snakeBodyArr[i].push(snakeBodyArr[i][2]%20);  //j
			
			snakeBodyArr[i][0].style.left=snakeBodyArr[i][5]*30+"px";
		    snakeBodyArr[i][0].style.top=snakeBodyArr[i][4]*30+"px";
			rotate(snakeBodyArr[i][0],0);
		}
    }

function checkCollision(){
	//1-碰到墙壁，2-碰到蛇身，3吃对祝福字，4吃错祝福字,0继续
    //是否碰墙壁
	if(snakeBodyArr[0][4]<0||snakeBodyArr[0][4]>8||snakeBodyArr[0][5]<0||snakeBodyArr[0][5]>19){
	    return 1;
	}
	//是否碰到蛇身
	for(var i=1,len=snakeBodyArr.length;i<len;i++){
	    if(snakeBodyArr[0][2]==snakeBodyArr[i][2]) return 2;
	}
	//是否吃到字
	for(i=0,len=curBlessPos.length;i<len;i++){
	    if(snakeBodyArr[0][2]==curBlessPos[i]){
			//处理蒸蒸日上重字问题
			if(readyToEat==36||readyToEat==37){
			    if(snakeBodyArr[0][2]==curBlessPos[0]){
				    curBlessPos[0]=-1;
					specialOrder=0;
					return 3;
				}
				else if(snakeBodyArr[0][2]==curBlessPos[1]){
				    curBlessPos[1]=-1;
					specialOrder=1;
					return 3;
				}
				else return 4;
			}

			if(snakeBodyArr[0][2]==curBlessPos[readyToEat%4]){
			    curBlessPos[readyToEat%4]=-1;
				return 3;
			}
			else return 4;
		}
	}
	return 0;
}


function countDown(){
	var _i=2;
    gameStageTip1.style.display="";
	gameStageTip1a.style.display="none";
	gameStageCountDown.style.display="";
	gameStageCountDown3.style.display="";
	gameStageCountDown2.style.display="none";
	gameStageCountDown1.style.display="none";
	nStatistics2013({"action":"countdown"});
	countDownTick=setInterval(function(){
		if(_i==0){
		    countDownTick && clearInterval(countDownTick);
			countDownTick=null;  
			//跳关外挂
			curLevel=1;
	        curSubLevel=1;
			//readyToEat=24;
			//
	        goNext=true;
	        gameStageTip1.style.display="none";
	        gameStageTip1a.style.display="none";
	        gameStageCountDown.style.display="none";
			gameStageInner.style.display="";
	        //显示蛇身
	        for(var i=0,len=snakeBodyArr.length;i<len;i++){
	            snakeBodyArr[i][0].style.display="";
	        }
			isPause=0;
			playSound('spring.mp3',true);
			return ;  
		}
		gameStageCountDown3.style.display="none";
	    gameStageCountDown2.style.display="none";
	    gameStageCountDown1.style.display="none";
		switch (_i){
			case 2:
			    gameStageCountDown2.style.display="";
		    break;
			case 1:
			    gameStageCountDown1.style.display="";
		    break;
		}
		--_i;
	},700);
}

/*
 * 下面游戏正式开始
 */   

    function init(){
		lg_img.src=imghost+"images/logo.gif";
		lg_snake = document.createElement("div");
		lg_snake.id = "spring-lg-snake";
		logoContainer.appendChild(lg_snake);
		lg_img.style.display="none";
		lg_snake.setAttribute("title","\u6293\u4F4F\u4F60\u76842013\u5E78\u8FD0\u86C7\uFF01"); //抓住你的2013幸运蛇！
		
		springLgSnakeA=document.createElement("div");
		springLgSnakeA.id="spring-lg-snake-a";
		lg_snake.appendChild(springLgSnakeA);
	    
		
		//舞台，提示词，关闭按钮
		gameStageOuter = document.createElement("div");
		gameStageOuter.id="game-stage-outer";
		//lm.parentNode.insertBefore(gameStageOuter,lm);
		document.body.appendChild(gameStageOuter);
		updateRect();
		
		gameRegion = document.createElement("div");
		gameRegion.id="game-region";
		lm.parentNode.insertBefore(gameRegion,lm);
		
		gameStageOuter.innerHTML='<div id="game-stage"><div id="game-stage-inner" style="display:none;"></div><div id="game-stage-close"></div><div id="game-stage-tip1"></div><div id="game-stage-tip1a"></div><div id="game-stage-count-down" style="display:none;"><div id="game-stage-count-down3"></div><div id="game-stage-count-down2"></div><div id="game-stage-count-down1"></div></div><div id="game-stage-tip2" style="display:none;"></div><div id="game-stage-tip3" style="display:none;"></div></div><div id="game-share" style="display:none;"><a id="share-hongbao" href="http://www.baidu.com/s?wd=%BA%EC%B0%FC" target="_blank"></a><a id="share-weibo" href="#" target="_blank"></a><div id="share-repeat"></div><div id="share-close"></div><img src="" id="card1" /><img src="" id="card2" /><img src="" id="card3" /><img src="" id="card4" /><img src="" id="card5" /></div>';
		gameStage=g("game-stage");
		gameStageClose=g("game-stage-close");
		gameStageTip1=g("game-stage-tip1");
		gameStageTip1a=g("game-stage-tip1a");
		gameStageCountDown=g("game-stage-count-down");
		gameStageCountDown3=g("game-stage-count-down3");
		gameStageCountDown2=g("game-stage-count-down2");
		gameStageCountDown1=g("game-stage-count-down1");
		gameStageTip2=g("game-stage-tip2");
		gameStageTip3=g("game-stage-tip3");
		gameStageInner=g("game-stage-inner");
		gameShare=g("game-share");
		gameShareHongbao=g("share-hongbao");
		gameShareWeibo=g("share-weibo");
		
		snakeIsLoad=false;
		//ie8下v:image的src不能setAttribute,shit
		//初始化蛇蛇
		/*
		var imgTag = supportedCSS ? 'img' : 'v:image';
		var html = [],i,j,k,dom;
		for(i=1;i<=5;i++){
		    html.push(format('<#{tag} id="snake-body-#{index}" class="snake-body" src="#{host}images/snake#{index}.png" style="display:none;"></#{tag}>',{tag:imgTag,index:i,host:imghost,ver:version}));
		}
		gameStageInner.innerHTML+=html.join('');
		*/
        //resetSnake();
		
	    //添加祝福字dom
		/*
		for(i=0,dom;i<5;i++){
		    blessTextArr[i] = [];
			for(j=0;j<gameConfig.blessText[i].length;j++){
			    dom = document.createElement("div");
			    dom.className = "game-bless-text";
			    dom.id="game-bless-text-"+i+"-"+j;
				dom.style.display="none";
				dom.style.backgroundPosition=gameConfig.blessText[i][j][0]+"px "+gameConfig.blessText[i][j][1]+"px";
				gameStageInner.appendChild(dom);
				blessTextArr[i].push(dom);
			}
		}
		*/
		
		on(lg_snake,"click",function(e){
			e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
			gameStage.style.backgroundImage='url("'+imghost+'images/stagebg.jpg")';
			if(chapter!=0||logoAnimationTick) return ;
			var _i=0;
			logoAnimationTick2 && clearTimeout(logoAnimationTick2);
			logoAnimationTick2=null;
			nStatistics2013({"trigger":"click"});
			logoAnimationTick=setInterval(function(){
			    springLgSnakeA.style.backgroundPosition = "0 -"+gameConfig.logo[_i++]+"px";
			    if(_i>7) {
				    clearInterval(logoAnimationTick);
					logoAnimationTick=null;
					changeChapter(1);
			    }
		    },80);
		});
		
        on(lg_snake,"mouseover",function(e){
			e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
			gameStage.style.backgroundImage='url("'+imghost+'images/stagebg.jpg")';
			if(chapter!=0||logoAnimationTick||logoAnimationTick2) return ;
			var _i=0;
			
			logoAnimationTick2 = setTimeout(function(){
				clearTimeout(logoAnimationTick2);
				logoAnimationTick2=null;
				if(logoAnimationTick || chapter!=0) return ;
				nStatistics2013({"trigger":"mouseover"});
				logoAnimationTick=setInterval(function(){
			        springLgSnakeA.style.backgroundPosition = "0 -"+gameConfig.logo[_i++]+"px";
			        if(_i>7) {
				        clearInterval(logoAnimationTick);
					    logoAnimationTick=null;
						changeChapter(1);
				        //goNext=true;
			        }
		        },80);
			},1000);
		});
		
		on(lg_snake,"mouseout",function(e){
			logoAnimationTick2 && clearTimeout(logoAnimationTick2);
			logoAnimationTick2=null;
		});
		
		on(gameStageClose,"click",function(e){
			e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
			//ie6下写在changeChapter(1)里面无效
			countDownTick && clearInterval(countDownTick);
			countDownTick=null;
			gameStageTip1a.style.display="";
			gameStageCountDown.style.display="none";
			gameStageCountDown3.style.display="";
			gameStageCountDown2.style.display="none";
			gameStageCountDown1.style.display="none";
		    //
			changeChapter(0);
			nStatistics2013({"action":"close"});
		});


		on(gameStageTip1,"click",function(e){
			e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
			if(countDownTick) return ;
			countDown();
		});
		
		on(gameStageTip1a,"click",function(e){
			e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
			if(countDownTick) return ;
			countDown();
		});
		
        on(gameShareHongbao,"click",function(e){
		    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
	        nStatistics2013({"action":"hongbao"});
		});
	    on(gameShareWeibo,"click",function(e){
		    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
			nStatistics2013({"action":"weibo"});
	    });
		
		on(g("share-repeat"),"click",function(e){
		    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
		    changeChapter(1,1);
			nStatistics2013({"action":"repeat"});
			countDown();
	    });
		
        on(g("share-close"),"click",function(e){
		    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
			nStatistics2013({"action":"shareclose"});
		    changeChapter(0);
	    });
		on(g("kw"),"click",function(e){
			//ie6下写在changeChapter(1)里面无效
			countDownTick && clearInterval(countDownTick);
			countDownTick=null;
			gameStageTip1a.style.display="";
			gameStageCountDown.style.display="none";
			gameStageCountDown3.style.display="";
			gameStageCountDown2.style.display="none";
			gameStageCountDown1.style.display="none";
		    //
		    changeChapter(0);
		});
		on(document,"keydown",function(event){
		    event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
			if(document.activeElement.tagName.toLowerCase()=="input") {
				//ie6下写在changeChapter(1)里面无效
			    countDownTick && clearInterval(countDownTick);
			    countDownTick=null;
			    gameStageTip1a.style.display="";
			    gameStageCountDown.style.display="none";
			    gameStageCountDown3.style.display="";
			    gameStageCountDown2.style.display="none";
			    gameStageCountDown1.style.display="none";
		        //
				changeChapter(0);
				return ;
			}
			
			if(chapter==1){
				if(countDownTick) return ;
			    countDown();
				return ;
			}
			if(chapter!=2){
			    return ;
			}
			var e = event || window.event;     
		    var keycode = e.which ? e.which : e.keyCode;
			lastDir=snakeBodyArr[0][1];
			switch (keycode){
			    case 37:
				    if(snakeBodyArr[0][1]!=1){
				        snakeBodyArr[0][1]=3;
					}
					isPause=0;
			    break;
				case 38:
				    if(snakeBodyArr[0][1]!=2){
				        snakeBodyArr[0][1]=0;
					}
					isPause=0;
			    break;
				case 39:
				    if(snakeBodyArr[0][1]!=3){
				        snakeBodyArr[0][1]=1;
					}
					isPause=0;
			    break;
				case 40:
				    if(snakeBodyArr[0][1]!=0){
				        snakeBodyArr[0][1]=2;
					}
					isPause=0;
			    break;
			}
			event.preventDefault ? event.preventDefault() : event.returnValue = false;
			//isPause=0;
		});
		/*
        var cssdict = {
            webkit: 1,
            moz: 1,
            ms: 1,
            o: 1,
            '': 1
        }, sel = '', gr = '';
        for (var p in cssdict){
            p = p ? '-' + p + '-' : '';
            sel += format('#{0}user-select:none;', [p]);
            gr += format('background-image:#{0}linear-gradient(left,rgba(255,255,255,255)0,rgba(255,255,255,0)50%),#{0}linear-gradient(right,rgba(255,255,255,255)0,rgba(255,255,255,0)50%);', [p])
        }
        */
var css = format('\
#spring-lg-snake{width:270px;height:130px;margin:0 auto;position:relative;background:url("#{host}images/logo.gif")0 0 no-repeat;cursor:pointer;}\
#spring-lg-snake-a{width:118px;height:130px;position:absolute;left:79px;top:0;background:url("#{host}images/logoa.jpg")0 0 no-repeat;}\
#game-stage-outer{width:1015px;height:342px;position:absolute;top:270px;overflow:hidden;}\
#game-region{width:600px;height:352px;}\
#game-stage{width:1015px;height:342px;background-position:0 0;position:absolute;left:0;}\
#game-stage-close{width:30px;height:30px;cursor:pointer;position:absolute;left:773px;top:14px;}\
#game-stage-tip1{width:423px;height:108px;cursor:pointer;position:absolute;left:275px;top:57px;background-position:0 0;}\
#game-stage-tip1a{width:238px;height:102px;cursor:pointer;position:absolute;left:376px;top:167px;background-position:0 -119px;}\
#game-stage-count-down{width:238px;height:102px;position:absolute;left:376px;top:167px;}\
#game-stage-count-down3{width:238px;height:102px;background-position:0 -420px;}\
#game-stage-count-down2{width:238px;height:101px;background-position:0 -533px;}\
#game-stage-count-down1{width:238px;height:98px;background-position:0 -649px;}\
#game-stage-tip2{width:172px;height:99px;position:absolute;left:408px;top:105px;background-position:0 -323px;}\
#game-stage-tip3{width:159px;height:89px;position:absolute;left:412px;top:120px;background-position:0 -231px;}\
#game-stage-inner{width:600px;height:270px;position:absolute;left:186px;top:34px;overflow:hidden;}\
.game-bless-text{width:29px;height:29px;position:absolute;left:-30px;top:-30px;background:url("#{host}images/bless_text.jpg") 0 0 no-repeat;}\
#game-bless-text-0-0{background:url("#{host}images/bless_text.jpg")0 0 no-repeat;}\
.snake-body{width:29px;height:29px;position:absolute;behavior:url(#default#VML);}\
#game-share{width:600px;height:270px;position:absolute;left:184px;}\
#game-share img{position:absolute;}\
#card1{top:68px;left:100px;}\
#card2{top:36px;left:180px;}\
#card3{top:31px;left:133px;}\
#card4{top:35px;left:53px;}\
#card5{top:30px;left:39px;}\
#share-hongbao{display:block;width:100px;height:24px;position:absolute;left:123px;top:192px;}\
#share-weibo{display:block;width:156px;height:23px;position:absolute;left:223px;top:192px;}\
#share-repeat{width:98px;height:25px;position:absolute;left:383px;top:192px;cursor:pointer;}\
#share-close{width:22px;height:22px;position:absolute;right:0;top:0;cursor:pointer;}\
',{
	host:imghost,
	ver:version,
    ie6:ie6?'ie6':''
  });


        if (ie){
            document.createStyleSheet().cssText = css;
        } else {
            var style = document.createElement("style");
            style.setAttribute("type", "text/css");
            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
        }
		if(s_wrap){
		    gameStageOuter.style.top="240px";//新首页的往上挪一点
		}
    }
   
    function updateRect(){
        imgRect = lg_img.getBoundingClientRect();
		var left=pageWidth()-1015;
		left=(left>=0)?(left+40):0;
		gameStageOuter.style.left=Math.floor(left/2)+"px";
    }
    

    function start(){
		goNext = false;
        init();
        updateRect();
        on(window, 'resize', function(){
            updateRect();
        });
		changeChapter(0);
		starttime=0;
		var i,len,tick,t,td=[],tdd2=[],tdd1=[];
        timer = setInterval(function(){
			if(goNext){
			    goNext = false;
				nextChapter();
				return ;
			}
            switch(chapter){
               case 0:
			     //do nothing
			   break;
			   case 1:
			       //每次都要重新初始化蛇头位置
			       td[4]=snakeBodyArr[0][4];
		           td[5]=snakeBodyArr[0][5];
			   break;
               case 2:
			     //吞吃蛇过程
				 tick = new Date().getTime() - starttime;
				 if(tick>gameConfig.levelSpeed[curLevel-1]&&!isPause){
					 gameStageTip2.style.display="none";
					 gameStageTip3.style.display="none";
					 
					 //见闻色霸气，用于提前预判是否碰到错字
					 if(snakeBodyArr[0][1]==0){
					     td[4]=snakeBodyArr[0][4]-1;//up
						 td[5]=snakeBodyArr[0][5];	 
					 }
					 else if(snakeBodyArr[0][1]==1){
					     td[5]=snakeBodyArr[0][5]+1;//right
						 td[4]=snakeBodyArr[0][4];
					 }
					 else if(snakeBodyArr[0][1]==2){
					     td[4]=snakeBodyArr[0][4]+1;//down
						 td[5]=snakeBodyArr[0][5];
					 }
					 else if(snakeBodyArr[0][1]==3){
					     td[5]=snakeBodyArr[0][5]-1;//left
						 td[4]=snakeBodyArr[0][4];
					 }
					 td[2]=td[4]*20+td[5];
					 //第一关给一次机会碰壁
					 if(curLevel==1){
					     if(td[4]<0||td[4]>8||td[5]<0||td[5]>19){
						     if(life2==1){
							     gameStageTip3.style.display="";
								 snakeBodyArr[0][1]=lastDir;
						         isPause=1;
						         --life2;
								 nStatistics2013({"action":"tipframe"});
						         return ;   
							 }
					     }
					 }
					 
					 for(i=0,len=curBlessPos.length;i<len;i++){
	                    if(td[2]==curBlessPos[i]){
							//蒸蒸日上，重字问题
							
		                    if(readyToEat==36||readyToEat==37){
							    if(td[2]!=curBlessPos[0]&&td[2]!=curBlessPos[1]){
									nStatistics2013({"action":"overorder","level":curLevel,"subLevel":curSubLevel});
								    changeChapter(3);
									return ;
								}
							}
							else{
							  if(td[2]!=curBlessPos[readyToEat%4]){
							    --life;
						        if(curLevel>1||life==0){
									nStatistics2013({"action":"overorder","level":curLevel,"subLevel":curSubLevel});
									changeChapter(3);
						        }
								gameStageTip2.style.display="";
								snakeBodyArr[0][1]=lastDir;
						        isPause=1;
								nStatistics2013({"action":"tiporder"});
								return ;
							  }
							}
		                }
	                 }
					 lastDir=snakeBodyArr[0][1];
					 //以上是见闻色霸气，对蛇身没有影响，以下是移动蛇身
					 tdd0=snakeBodyArr[snakeBodyArr.length-1];
				     for(len=snakeBodyArr.length,i=len-1;i>=1;i--){
					     snakeBodyArr[i][1]=snakeBodyArr[i-1][1];
						 snakeBodyArr[i][2]=snakeBodyArr[i-1][2];
						 snakeBodyArr[i][4]=snakeBodyArr[i-1][4];
						 snakeBodyArr[i][5]=snakeBodyArr[i-1][5];
						 snakeBodyArr[i][0].style.left=snakeBodyArr[i][5]*30+"px";
				         snakeBodyArr[i][0].style.top=snakeBodyArr[i][4]*30+"px";
					 }
					 
					 if(snakeBodyArr[0][1]==0){
					     --snakeBodyArr[0][4];//up	 
					 }
					 else if(snakeBodyArr[0][1]==1){
					     ++snakeBodyArr[0][5];//right
					 }
					 else if(snakeBodyArr[0][1]==2){
					     ++snakeBodyArr[0][4];//down
					 }
					 else {
					     snakeBodyArr[0][5]=snakeBodyArr[0][5]-1;//left
					 }
					 snakeBodyArr[0][2]=snakeBodyArr[0][4]*20+snakeBodyArr[0][5];
                     snakeBodyArr[0][0].style.left=snakeBodyArr[0][5]*30+"px";
				     snakeBodyArr[0][0].style.top=snakeBodyArr[0][4]*30+"px";
					 
					 for(i=0,len=snakeBodyArr.length;i<len;i++){
					     if(snakeBodyArr[i][3]==1) continue;
						 if(snakeBodyArr[i][1]==0) {
						     rotate(snakeBodyArr[i][0],PI/2);
						 }
						 else if(snakeBodyArr[i][1]==1){
						     rotate(snakeBodyArr[i][0],PI);
						 }
						 else if(snakeBodyArr[i][1]==2){
						     rotate(snakeBodyArr[i][0],1.5*PI);
						 }
						 else{
						     rotate(snakeBodyArr[i][0],0);
						 }
					 }
					 
					 t=checkCollision();
					 if(t==1){
						 nStatistics2013({"action":"overframe","level":curLevel,"subLevel":curSubLevel});
						 changeChapter(3);
					 }
					 else if(t==2){
						 nStatistics2013({"action":"overbody","level":curLevel,"subLevel":curSubLevel});
						 changeChapter(3);
					 }
					 else if(t==3){
						 if(snakeBodyArr[2][3]==0){
							 td=snakeBodyArr[2];
							 snakeBodyArr[2][0].style.display="none";
							 blessTextArr[curLevel-1][(curSubLevel-1)*4+(readyToEat%4)].style.left=td[5]*30+"px";
							 blessTextArr[curLevel-1][(curSubLevel-1)*4+(readyToEat%4)].style.top=td[4]*30+"px";
							 snakeBodyArr.splice(addSnakePos++,1,[blessTextArr[curLevel-1][(curSubLevel-1)*4+(readyToEat%4)],td[1],td[2],1,td[4],td[5]]); 
                         }
						 else{
							 tdd2=snakeBodyArr[snakeBodyArr.length-2];
							 tdd1=snakeBodyArr[snakeBodyArr.length-1];
							 //蒸蒸日上重字问题
							 if(readyToEat==36||readyToEat==37){
						         snakeBodyArr.splice(addSnakePos++,0,[blessTextArr[curLevel-1][(curSubLevel-1)*4+specialOrder],tdd2[1],tdd2[2],1,tdd2[4],tdd2[5]]);    
							 }
							 else{
								 snakeBodyArr.splice(addSnakePos++,0,[blessTextArr[curLevel-1][(curSubLevel-1)*4+(readyToEat%4)],tdd2[1],tdd2[2],1,tdd2[4],tdd2[5]]);
							 }
							 
							 snakeBodyArr[snakeBodyArr.length-2][1]=tdd1[1];
							 snakeBodyArr[snakeBodyArr.length-2][2]=tdd1[2];
							 snakeBodyArr[snakeBodyArr.length-2][4]=tdd1[4];
							 snakeBodyArr[snakeBodyArr.length-2][5]=tdd1[5];
							 snakeBodyArr[snakeBodyArr.length-1][1]=tdd0[1];
							 snakeBodyArr[snakeBodyArr.length-1][2]=tdd0[2];
							 snakeBodyArr[snakeBodyArr.length-1][4]=tdd0[4];
							 snakeBodyArr[snakeBodyArr.length-1][5]=tdd0[5];
						 }
					     ++readyToEat;
						 if(readyToEat%4==0){
							 ++curSubLevel;
							 if(curSubLevel>gameConfig.level[curLevel-1]){
							     curSubLevel=1;
								 ++curLevel;
							 }
							 if(curLevel==6) {
								 changeChapter(3);
								 nStatistics2013({"level":6,"subLevel":1});
								 return ;
							 }
							 changeChapter();
						 }
					 }
					 starttime=new Date().getTime();
				 }
			   break;
			   case 3:
			   //gameover,do nothing
			   break;
            }
        }, 33);
    }
    
    function nextChapter(){
        setChapter(chapter + 1);
    }
    function setChapter(value){
        if (chapter == value) return;
        changeChapter(value);
    }
	var SPRING=window.SPRING={};
    function loader(file){
        SPRING.caches = SPRING.caches || {};
        if (SPRING.caches[file]){
            return;
        }
        (SPRING.caches[file] = new Image()).src = imghost + file;
    }
    
    function changeChapter(c,dh){
		if(typeof(c)!="undefined") chapter = c;
        
		switch(chapter){
			//初始化页面
		    case 0:
			    springLgSnakeA.style.backgroundPosition="0 0";
				lg_snake.style.background='url("'+imghost+'images/logo.gif")';  //解决ie下不出背景图的问题
				springLgSnakeA.style.background='url("'+imghost+'images/logoa.jpg")';  //解决ie下不出背景图的问题
				gameStageOuter.style.display="none";
				gameRegion.style.display="none";
				countDownTick && clearInterval(countDownTick);
			    countDownTick=null;
				gameStageTip1a.style.display="";
				gameStageCountDown.style.display="none";
				gameStageCountDown3.style.display="";
				gameStageCountDown2.style.display="none";
				gameStageCountDown1.style.display="none";
				stopSound();
			break;
			//gameStage弹出动画
			case 1:
			    //游戏舞台下来动画
				//加载提示语图片
				gameStageTip1.style.backgroundImage='url("'+imghost+'images/tip.jpg")';
				gameStageTip1a.style.backgroundImage='url("'+imghost+'images/tip.jpg")';
				gameStageTip2.style.backgroundImage='url("'+imghost+'images/tip.jpg")';
				gameStageTip3.style.backgroundImage='url("'+imghost+'images/tip.jpg")';
				gameStageCountDown3.style.backgroundImage='url("'+imghost+'images/tip.jpg")';
				gameStageCountDown2.style.backgroundImage='url("'+imghost+'images/tip.jpg")';
				gameStageCountDown1.style.backgroundImage='url("'+imghost+'images/tip.jpg")';
				//加载音乐但是不播放
				playSound('spring.mp3',true,true);
				if(!snakeIsLoad){
				  //加载蛇身图片,把蛇身和祝福字放在这里init是因为ie8下的src不能setAttribute,shit
				  snakeIsLoad=true;
				  var imgTag = supportedCSS ? 'img' : 'v:image';
		          var html = [],i,j,k,dom;
		          for(i=1;i<=5;i++){
		            html.push(format('<#{tag} id="snake-body-#{index}" class="snake-body" src="#{host}images/snake#{index}.png" style="display:none;"></#{tag}>',{tag:imgTag,index:i,host:imghost,ver:version}));
		        }
		          gameStageInner.innerHTML+=html.join('');
				  //祝福字
				  for(i=0,dom;i<5;i++){
		              blessTextArr[i] = [];
			          for(j=0;j<gameConfig.blessText[i].length;j++){
			              dom = document.createElement("div");
			              dom.className = "game-bless-text";
			              dom.id="game-bless-text-"+i+"-"+j;
				          dom.style.display="none";
				          dom.style.backgroundPosition=gameConfig.blessText[i][j][0]+"px "+gameConfig.blessText[i][j][1]+"px";
				          gameStageInner.appendChild(dom);
				          blessTextArr[i].push(dom);
			          }
		          }
				}
				/*ie8下不能setAttribute
				for(var _jj=1;_jj<=5;_jj++){
				    g("snake-body-"+_jj).setAttribute("src",imghost+"images/snake"+_jj+".png");
				}
				*/
				loader("images/bless_text.jpg");//提前加载祝福字图片
				
				resetSnake();
				gameStage.style.top="-342px";
			    gameStageOuter.style.display="";
				gameRegion.style.display="";
				gameStageTip1.style.display="";
				gameStageTip1a.style.display="";
				gameStageClose.style.display="";
				gameStageTip2.style.display="none";
				gameStageTip3.style.display="none";
				
				hideBlessText();
				gameStage.style.display="";
				gameShare.style.display="none";
				
				g("card1").style.visibility="hidden";
				g("card2").style.visibility="hidden";
				g("card3").style.visibility="hidden";
				g("card4").style.visibility="hidden";
				g("card5").style.visibility="hidden";
				life=3;
				life2=1;
				isPause=1;
				readyToEat=0;
				addSnakePos=2;
				specialOrder=0;
				lastDir=3;
		      if(!dh){
				var st=new Date().getTime(),lt;
				var pp=[],t;
				t=setInterval(function(){
					lt=new Date().getTime();
				    pp=bezier([[0,-342],[0,0]],(lt-st)/1000);
					gameStage.style.top=pp[1]+"px";
					if(pp[1]>0){
						gameStage.style.top="0px";
					    clearInterval(t);
						t=null;
						return ;
					}
				},20);
			  }
			  else{
			    gameStage.style.top="0px";
			  }
		    break;
			case 2:
			    loader("images/card"+curLevel+".jpg");
				loader("images/sharebg.jpg");
			    hideBlessText();
				curBlessPos = NM(180,4);
				for(var i=0,_i,_j;i<4;i++){
					_i=Math.floor(curBlessPos[i]/20);
					_j=Math.floor(curBlessPos[i]%20);
					
					blessTextArr[curLevel-1][(curSubLevel-1)*4+i].style.left = _j*30+"px";
					blessTextArr[curLevel-1][(curSubLevel-1)*4+i].style.top = _i*30+"px";
					blessTextArr[curLevel-1][(curSubLevel-1)*4+i].style.display = "";
				}
				var len=snakeBodyArr.length;
				for(i=0;i<len;i++){
	                snakeBodyArr[i][0].style.display="";
	            }
				nStatistics2013({"level":curLevel,"subLevel":curSubLevel});
			break;
			//3是gameover
			case 3:
				/*
                var st=new Date().getTime(),lt;
	            var pp=[],t1;
	            t1=setInterval(function(){
	                lt=new Date().getTime();
	                pp=bezier([[0,0],[0,-342]],(lt-st)/1000);
	                gameStage.style.left=pp[0]+"px";
	                gameStage.style.top=pp[1]+"px";
	                if(pp[1]<-342){
	                    gameStage.style.top="-342px";
			            clearInterval(t1);
			            //share();
			            console.log(12);
		                return ;
	                }
               },20);
               */
	           //share();
			   gameShare.style.backgroundImage='url("'+imghost+'images/sharebg.jpg")';
			   stopSound();
			   hideBlessText();
	           gameStage.style.display="none";
	           gameShare.style.display="";
			   var xl;
			   xl=(curLevel>1)?gameConfig["share"][curLevel-2]:gameConfig["share"][0];
	           g("share-weibo").setAttribute("href",'http://service.weibo.com/share/share.php?url='+encodeURIComponent(document.location.href)+'&title='+encodeURIComponent("IQ\u7834\u8868RP\u7206\u68DA\uFF01\u52A8\u52A8\u624B\u6307\u5C31\u902E\u4F4F\u4E00\u67612013\u5E78\u8FD0\u86C7\uFF01\u65B0\u5E74\u5FC5\u987B\u4ECE\u5934\u65FA\u5230\u5C3E\uFF0C\u5FEB\u7ED9\u81EA\u5DF1\u6293\u4E00\u67612013\u5E78\u8FD0\u86C7\u5427\uFF01\u731B\u51FB\u8FD9\u91CChttp%3A//www.baidu.com%20\u795D\u798F\u4E0D\u5ACC\u591A\uFF01\u8FD8\u6709\u53F2\u4E0A\u6700\u8C6A\u534E\u7EA2\u5305\u554A\uFF01\u6709\u623F\u6709\u8F66\u6709\u94BB\u77F3\uFF01")+'&pic='+encodeURIComponent(imghost+xl));//IQ破表RP爆棚！动动手指就逮住一条2013幸运蛇！新年必须从头旺到尾，快给自己抓一条2013幸运蛇吧！猛击这里http://www.baidu.com 祝福不嫌多！还有史上最豪华红包啊！有房有车有钻石！
			   
			   g("card1").style.visibility="hidden";
			   g("card2").style.visibility="hidden";
			   g("card3").style.visibility="hidden";
			   g("card4").style.visibility="hidden";
			   g("card5").style.visibility="hidden";
			   
			   if(curLevel==1){
			       g("card1").src=imghost+"images/card1.jpg";
				   g("card1").style.visibility="visible";
			   }
			   else{
			       g("card"+(curLevel-1)).src=imghost+"images/card"+(curLevel-1)+".jpg";
				   g("card"+(curLevel-1)).style.visibility="visible";   
			   }
			break;
		}
		
		
        // 修正ie6、ie9布局
        if (ie9plus){
            document.documentElement.style.height = '';
            document.documentElement.style.height = '100%';
        } else if (ie){
            //wrapper.style.minHeight = '100px';
            //wrapper.style.minHeight = '100%';
        }
    }
	
    start();
}();