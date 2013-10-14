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
    /*
     * 绑定事件
     */
    function on(element, type, listener){
        if (element.addEventListener) {
            element.addEventListener(type, listener, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, listener);
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
    // end 函数库 =======================================

    var
        //version = '?v=11', // 资源发生升级时修改
        version = '',
      
        head = document.getElementsByTagName("head")[0],
        lm = g('lm'),
        s_wrap = g('s_wrap'), // 新首页
        /*
         * 图片host路径
         */
        // 真实路径
        imghost = 'http://s1.bdstatic.com/r/www/cache/xmas2012',
        
        /* lan start */
        // 内网测试
        imghost = 'http://wangjihu.fe.baidu.com/xmas/',
        /* lan end */

        // 本机测试
        /* debug start */
        imghost = '',
        /* debug end */
        
        /*
         * 红包页面
         */
        prizeurl = 'http://yun.baidu.com/huodong/christmas',
        
        /*
         * logo图片
         */
        lg_img = g('lg').getElementsByTagName('img')[0],
        wrapper = g('wrapper'),
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
      
        soundElement;
        
    /*
     * 计算css3支持的名字
     */
    if (!ie){
        var styles = head.style;
        for (var p in {
            transformProperty: 1,
            WebkitTransform: 1,
            OTransform: 1,
            //msTransform: 1,
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


    
    
    
    function buildBody(){
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
  
        var css = format('\
#xmas_panel{width:270px;height:130px;position:relative;margin:0 auto;#{sel}}\
#xmas_panel .xmas_layer{width:270px;height:130px;position:absolute;behavior:url(#default#VML);}\
#xmas_panel img,#xmas_panel .xmas_img{position:absolute;}\
#xmas_groundLayer{background:url("#{host}images/tgb.png#{ver}") repeat-x;background-position:0 #{groundTop}px;left:0}\
#xmas_treeLayer{background:url("#{host}images/tgb.png#{ver}") repeat-x;background-position:0 #{treeTop}px;left:0}\
#xmas_imgs{position:absolute;}\
#xmas_clock_back .xmas_img,#xmas_panel .xmas_img,#xmas_lock_panel .xmas_img{behavior:url(#default#VML);}\
#xmas_lock_panel{margin:0 auto;position:relative;background:url("#{host}images/w3.png#{ver}") 0 -1000px no-repeat;#{sel}}\
#xmas_game_bright{position:absolute;background:url("#{host}images/bright.png#{ver}") no-repeat;}\
#xmas_lock_panel .xmas_img{position:absolute;}\
#xmas_game_close{display:inline-block;width:33px;height:33px;background:url("#{host}images/w3.png#{ver}") -1724px 0 no-repeat;cursor:pointer;}\
#xmas_prize{position:absolute;left:310px;top:237px;}\
#xmas_prize span{display:inline-block;width:75px;height:26px;cursor:pointer;}\
#xmas_rect{left:-5px;top:0;width:280px;height:130px;#{gr}}\
#xmas_ufo{z-index:10;}\
#xmas_path{position:absolute;left:0;top:0;width:1px;height:1px;}\
#xmas_thunder{position:absolute;}\
#xmas_thunder *{behavior:url(#default#VML);}\
#xmas_lock_button{position:absolute;left:73px;top:178px;display:inline-block;width:117px;height:52px;cursor:pointer;}\
', { 
            groundTop: groundTop,
            treeTop: treeTop,
            host: imghost,
            ie6: ie6 ? 'ie6' : '',
            sel: sel,
            gr: gr
            /* version start */
            , ver: version
            /* version end */
        });

        if (ie){
            document.createStyleSheet().cssText = css;
        } else {
            var style = document.createElement("style");
            style.setAttribute("type", "text/css");
            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
        }
    }
   
    function updateRect(){
        imgRect = lg_img.getBoundingClientRect();
    }
    
    
    function start(){
        starttime = new Date,
        buildBody();
        updateRect();
        on(window, 'resize', function(){
            updateRect();
        });

        timer = setInterval(function(){
            var tick = new Date - starttime;
            if (tick < -1){
                unit = -2;
                changeUnit();
            }
            switch(unit){
               
                
            }
        }, 50);
    }
    
    function nextUnit(){
        starttime = new Date;
        setUnit(unit + 1);
    }
    function setUnit(value){
        if (unit == value) return;
        unit = value;
        changeUnit();
    }
    var XMAS = window.XMAS2013 = {};
    function loader(file){
        XMAS.caches = XMAS.caches || {};
        if (XMAS.caches[file]){
            return;
        }
        (XMAS.caches[file] = new Image()).src = imghost + file;
    }
    
    function changeUnit(){
        starttime = new Date;
        
        // 修正ie6、ie9布局
        if (ie9plus){
            document.documentElement.style.height = '';
            document.documentElement.style.height = '100%';
        } else if (ie){
            wrapper.style.minHeight = '100px';
            wrapper.style.minHeight = '100%';
        }
    }
    
    start();
}();