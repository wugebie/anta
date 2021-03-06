(function() {
  setLoding()
  setPerc();
})();
//阻止默认行为
document.addEventListener('touchstart', function(e) {
	e.preventDefault();
});
/*根据屏幕大小来计算景深*/
//1.固定视野的角度大小，根据这个角度的大小，计算出景深
//2. 保持我和景物之间的距离不变
function setPerc(){
  resetview();
  window.onresize = resetview;
  function resetview(){
    var view = document.querySelector('#view');
    var main = document.querySelector('#main');
    var deg = 52.5;//45-55之间
    var height = document.documentElement.clientHeight;
    var R = Math.round(Math.tan(deg*Math.PI/180)*height/2);
    console.log(R);
    view.style.WebkitPerspective = view.style.perspective = R+'px';
    css(main,'translateZ',R);
  }
}
/* 做图片预加载 */
function setLoding(){
  var logoText = document.querySelector('.logoText');
  var data = [];
  var num = 0;
  for (var s in imgData) {
    data = data.concat(imgData[s]);
  }
  console.log(data);
  for (var i = 0; i < data.length; i++) {
    var img = new Image();//创建一个图片对象
		img.src = data[i];
    img.onload = function (){
      num++;
      console.log(Math.floor(num/data.length*100));
      logoText.innerHTML = "已加载 "+(Math.floor(num/data.length*100))+"%";
      if(num == data.length){
        //图片加载完成之后，要做的事情
        anmt();
      }
    }
  }
}
/* 隐藏loding动画，开始让logo2显示出来 */
function anmt() {
  var view = document.querySelector('#view');
	var logo1 = document.querySelector('#logo1');
	var logo2 = document.createElement("div");
	var logo3 = document.createElement("div");
  var img = new Image();
	var img2 = new Image();
	img.src = imgData.logo[0];
	img2.src = imgData.logo[1];
	logo2.id = "logo2";
	logo3.id = "logo3";
  logo3.className = logo2.className = "logoImg";
	logo2.appendChild(img);
	logo3.appendChild(img2);
	css(logo2,"opacity",0);
	css(logo3,"opacity",0);
	css(logo2,"translateZ",-1000);
	css(logo3,"translateZ",-1000);
	view.appendChild(logo2);
	view.appendChild(logo3);
  MTween({
    el:logo1,
    target:{opacity:0},
    time: 1000,
		type: "easeOut",
    callBack:function(){
      view.removeChild(logo1);
			css(logo2,"opacity",100);
      MTween({
				el: logo2,
				target: {translateZ:0},
				time: 500,
				type: "easeIn",
				callBack: anmt2
			});
    }
  })
}
/* 隐藏logo2，开始让logo3显示出来 */
function anmt2(){
  var view = document.querySelector('#view');
	var logo2 = document.querySelector('#logo2');
	var logo3 = document.querySelector('#logo3');
  setTimeout(function(){
    MTween({
      el:logo2,
      target:{translateZ:-1000},
      time: 800,
  		type: "easeOut",
      callBack:function(){
        view.removeChild(logo2);
  			css(logo3,"opacity",100);
        MTween({
  				el: logo3,
  				target: {translateZ:0},
  				time: 500,
  				type: "easeIn",
  				callBack:anmt3
  			});
      }
    })
  },2000)
}
/* 隐藏logo3，显示小的爆炸效果 */
function anmt3(){
  var view = document.querySelector('#view');
	var logo2 = document.querySelector('#logo2');
	var logo3 = document.querySelector('#logo3');
  setTimeout(function(){
    MTween({
      el:logo3,
      target:{translateZ:-2000},
      time: 500,
  		type: "easeOut",
      callBack:function(){
        view.removeChild(logo3);
  			anmt4();//爆炸效果
      }
    })
  },2000)
}
/* logo4的生成*/
function anmt4(){
  var view = document.querySelector('#view');
	var logo4 = document.createElement("div");
  var logoIcos = document.createElement("div");
  var logo4Img = new Image();
  logo4.id = "logo4";
  logoIcos.id = "logoIcos";
  logo4Img.id = "logo4Img";
  logo4Img.src = imgData.logo[2];
	css(logo4,"translateZ",-2000);
  iconsLength = 27;//让碎片是27个
  for (var i = 0; i < iconsLength; i++) {
    var span = document.createElement("span");
    span.style.backgroundImage = "url("+imgData.logoIco[i%imgData.logoIco.length]+")";
    var xR = 20+Math.round(Math.random()*240);
		var xDeg = Math.round(Math.random()*360);
		var yR = 10+Math.round(Math.random()*240);
		var yDeg = Math.round(Math.random()*360);
		css(span,"rotateY",xDeg);
		css(span,"translateZ",xR);
		css(span,"rotateX",yDeg);
		css(span,"translateY",yR);
    logoIcos.appendChild(span);
  }
  logo4.appendChild(logoIcos);
	logo4.appendChild(logo4Img);
	view.appendChild(logo4);
  MTween({
    el: logo4,
		target: {translateZ: 0},
		time: 500,
		type: "easeOutStrong",
		callBack:function(){
			setTimeout(function(){
				MTween({
					el: logo4,
					target: {translateZ: -1000,scale:0},
					time: 2500,
					type: "easeBoth",
					callBack: function(){
						view.removeChild(logo4);
						anmt5();
					}
				});
			},500);
		}
  })
}
/* 主体由远到近的开始入场 */
function anmt5(){
  var tZ = document.querySelector('#panoBg-translateZ');
  css(tZ,'translateZ',-2000);
  anmt6();
  anmt7();
  createPano();
  MTween({
		el:tZ,
		target: {translateZ:-160},
		time: 3600,
		type: "easeBoth"
	});
}
/* 添加云朵进场 */
// 如何让云朵不倾斜正着显示，要用到做圆柱的另一个方法
// 先变化角度再推移过去
function anmt6(){
  var cloud = document.querySelector('#cloud');
  css(cloud,'translateZ',-400);//显示的云朵过大，往后移动一下
  for(var i = 0; i < 9; i++){
    var span = document.createElement('span');
    span.style.backgroundImage = 'url('+imgData.cloud[i%3]+')';
    var R = 400+(Math.random()*150);
    var deg = 360/9*i;
    var x = Math.sin(deg*Math.PI/180)*R;
    var z = Math.cos(deg*Math.PI/180)*R;
    var y = (Math.random()-0.5)*200;
    css(span,'translateX',x);
    css(span,'translateZ',z);
    css(span,'translateY',y);
    span.style.display = 'none';
    cloud.appendChild(span);
  }
  var num = 0;
  var timer = setInterval(function(){
    cloud.children[num].style.display = 'block';
    num++;
    if(num>=cloud.children.length){
      clearInterval(timer);
    }
  },50)
  MTween({
    el:cloud,
    target:{rotateY:720},
    time:3500,
    type:'easeIn',
    callIn:function(){//为了旋转的时候云朵也是正面朝向我们
      var deg = -css(cloud,'rotateY');
      for (var i = 0; i < cloud.children.length; i++) {
        css(cloud.children[i],'rotateY',deg);
      }
    },
    callBack:function(){
      cloud.parentNode.removeChild(cloud);
      bgShow();
    }
  })
}
/* 生成主体的背景圆柱,圆柱入场 */
function anmt7(){
  var panoBg = document.querySelector('#panoBg');
  var width = 129;//一个背景图的宽是129px
  var deg = 360/imgData.bg.length;
  var R = parseInt(Math.tan((180-deg)/2*Math.PI/180)*(width/2)) - 3;
  var startDeg = 180;
  css(panoBg,'rotateX',0);//为了圆柱不倾斜
  css(panoBg,'rotateY',-695);
  for(var i = 0; i < imgData.bg.length; i++){
    var span = document.createElement("span");
    css(span,'rotateY',startDeg);
    css(span,'translateZ',-R)
    span.style.backgroundImage = 'url('+imgData.bg[i]+')';
    span.style.display = 'none';
    panoBg.appendChild(span);
    startDeg -= deg;
  }
  var num = 0;
  timer = setInterval(function(){
    panoBg.children[num].style.display = 'block';
    num++;
    if(num>=panoBg.children.length){
      clearInterval(timer);
    }
  },3600/2/20)
  MTween({
    el:panoBg,
    target:{rotateY:25},
    time:3600,
    type:'linear',
    callBack:function(){
      setDarg();
      setTimeout(function(){
          setSensors();
      },300)
    }
  })
}
// 拖拽并且还有拖拽过渡
function setDarg(){
  var panoBg = document.querySelector('#panoBg');
  var tZ = document.querySelector('#panoBg-translateZ');
  var pano = document.querySelector('#pano');
  var startPoint = {x:0,y:0};
  var startDeg = {x:0,y:0};
  var nowPoint = {x:0,y:0};
  var scale = {x:20*129/360,y:1170/80};//拖拽时拖拽距离和角度的比例
  var disDeg = {x:0,y:0};
  var dis = {x:0,y:0};
  var startZ = css(tZ,'translateZ');//拖拽时开始的z轴距离
  document.addEventListener('touchstart',function(e){
    window.isTouch = true;//关闭陀螺仪
    clearInterval(pano.timer);
		clearInterval(panoBg.timer);
		clearInterval(tZ.timer);
    startPoint.x = e.changedTouches[0].pageX;
    startPoint.y = e.changedTouches[0].pageY;
    startDeg.x = css(panoBg,'rotateY');
    startDeg.y = css(panoBg,'rotateX');
    dis.x = 0;
    dis.y = 0;
    disDeg.x = 0;
    disDeg.y = 0;
  });
  document.addEventListener('touchmove',function(e){
    nowPoint.x = e.changedTouches[0].pageX;
    nowPoint.y = e.changedTouches[0].pageY;
    dis.x = nowPoint.x - startPoint.x;
    dis.y = nowPoint.y - startPoint.y;
    disDeg.x = -(dis.x/scale.x);
    disDeg.y = dis.y/scale.y;
    var panoBgdeg = {};
    panoBgdeg.x = startDeg.x+disDeg.x;
    panoBgdeg.y = startDeg.y+disDeg.y;
    var panodeg = {};
    //漂浮层的移动距离不和主体一致，产生交错感
    panodeg.x = startDeg.x+disDeg.x*0.92;
    panodeg.y = startDeg.y+disDeg.y*0.92;
    //上下视角最大给到45度
    if(panoBgdeg.y>45){
      panoBgdeg.y=45
    }else if(panoBgdeg.y<-45){
      panoBgdeg.y=-45
    }
    if(panodeg.y>45){
      panodeg.y=45
    }else if(panodeg.y<-45){
      panodeg.y=-45
    }
    css(panoBg,'rotateY',panoBgdeg.x);
    css(panoBg,'rotateX',panoBgdeg.y);
    css(pano,'rotateY',panodeg.x);
    css(pano,'rotateX',panodeg.y);
    //移动距离大于300时，拖拽时向后的移动最多300；
    var disZ = Math.max(Math.abs(dis.x),Math.abs(dis.y));
    if(Math.abs(disZ) > 300){
			disZ = 300;
		}
    css(tZ,'translateZ',startZ - disZ);
  });
  document.addEventListener('touchend',function(e){
    var nowDeg = {x:css(panoBg,'rotateY'),y:css(panoBg,'rotateX')};
    var Deg = {x:disDeg.x,y:disDeg.y};
    MTween({
      el:tZ,
      target:{translateZ:startZ},
      time:500,
      type:'easeOut'
    });
    MTween({
      el:panoBg,
      target:{rotateY:nowDeg.x+Deg.x},
      time:500,
      type:'easeOut'
    });
    MTween({
      el:pano,
      target:{rotateY:nowDeg.x+Deg.x},
      time:500,
      type:'easeOut',
      callBack:function(){
        window.isTouch = false;
        window.isStart = false;
      }
    });
  });
}
/*显示最后面的红色背景*/
function bgShow(){
  var pageBg = document.querySelector('#pageBg');
	MTween({
		el:pageBg,
		target:{opacity:100},
		time: 500,
		type:"easeBoth"
	});
}
/*生成漂浮层*/
function createPano(){
  var pano = document.querySelector('#pano');
  var deg = 18;
  var width = 129;//一个背景图的宽是129px
  var R = parseInt(Math.tan((180-deg)/2*Math.PI/180)*(width/2)) - 3;
  var num = 0;
  var startDeg = 180;
  css(pano,'rotateX',0);
  css(pano,'rotateY',-60);
  css(pano,'scale',0);
  /*第一漂浮层*/
  var pano1 =document.createElement('div');
  pano1.className = 'pano';
  css(pano1,'translateX',1.564);
	css(pano1,'translateZ',-9.877);
  for (var i = 0; i < 2; i++) {
    var span = document.createElement('span');
    span.style.cssText = 'height:344px;margin-top:-172px;';
    span.style.backgroundImage = 'url('+imgData.pano[num]+')';
    css(span,'translateY',-163);
    css(span,'rotateY',startDeg);
    css(span,'translateZ',-R);
    num++;
    startDeg -= deg;
    pano1.appendChild(span);
  }
  pano.appendChild(pano1);
  /*第二漂浮层*/
  var pano2 =document.createElement('div');
  pano2.className = 'pano';
  css(pano2,'translateX',20.225);
	css(pano2,'translateZ',-14.695);
  for (var i = 0; i < 3; i++) {
    var span = document.createElement('span');
    span.style.cssText = 'height:326px;margin-top:-163px;';
    span.style.backgroundImage = 'url('+imgData.pano[num]+')';
    css(span,'translateY',278);
    css(span,'rotateY',startDeg);
    css(span,'translateZ',-R);
    num++;
    startDeg -= deg;
    pano2.appendChild(span);
  }
  pano.appendChild(pano2);
  /*第三漂浮层*/
  var pano3 =document.createElement('div');
  pano3.className = 'pano';
  css(pano3,'translateX',22.175);
	css(pano3,'translateZ',-11.35);
  for (var i = 0; i < 4; i++) {
    var span = document.createElement('span');
    span.style.cssText = 'height:195px;margin-top:-97.5px;';
    span.style.backgroundImage = 'url('+imgData.pano[num]+')';
    css(span,'translateY',192.5);
    css(span,'rotateY',startDeg);
    css(span,'translateZ',-R);
    num++;
    startDeg -= deg;
    pano3.appendChild(span);
  }
  pano.appendChild(pano3);
  /*第四漂浮层*/
  var pano4 =document.createElement('div');
  pano4.className = 'pano';
  startDeg = 90;
  css(pano4,'translateX',20.225);
	css(pano4,'translateZ',14.695);
  for (var i = 0; i < 5; i++) {
    var span = document.createElement('span');
    span.style.cssText = 'height:468px;margin-top:-234px;';
    span.style.backgroundImage = 'url('+imgData.pano[num]+')';
    css(span,'translateY',129);
    css(span,'rotateY',startDeg);
    css(span,'translateZ',-R);
    num++;
    startDeg -= deg;
    pano4.appendChild(span);
  }
  pano.appendChild(pano4);
  /*第五漂浮层*/
  var pano5 =document.createElement('div');
  pano5.className = 'pano';
  startDeg = 18;
  css(pano5,'translateX',-4.54);
	css(pano5,'translateZ',9.91);
  for (var i = 0; i < 6; i++) {
    var span = document.createElement('span');
    span.style.cssText = 'height:444px;margin-top:-222px;';
    span.style.backgroundImage = 'url('+imgData.pano[num]+')';
    css(span,'translateY',-13);
    css(span,'rotateY',startDeg);
    css(span,'translateZ',-R);
    num++;
    startDeg -= deg;
    pano5.appendChild(span);
  }
  pano.appendChild(pano5);
  /*第六漂浮层*/
  var pano6 =document.createElement('div');
  pano6.className = 'pano';
  css(pano6,'translateX',-11.35);
	css(pano6,'translateZ',22.275);
  startDeg = 18;
  for (var i = 0; i < 6; i++) {
    var span = document.createElement('span');
    span.style.cssText = 'height:582px;margin-top:-291px;';
    span.style.backgroundImage = 'url('+imgData.pano[num]+')';
    css(span,'translateY',256);
    css(span,'rotateY',startDeg);
    css(span,'translateZ',-R);
    num++;
    startDeg -= deg;
    pano6.appendChild(span);
  }
  pano.appendChild(pano6);
  setTimeout(function(){
    MTween({
      el:pano,
      target:{
        rotateY:25,
        scale:100
      },
      time:1000,
      type:'linear',
    })
  },2600)
}


/*添加手机旋转角度变化事件*/
function setSensors(){
  var panoBg = document.querySelector('#panoBg');
  var pano = document.querySelector('#pano');
  var tZ = document.querySelector('#panoBg-translateZ');
  var last = {x:0,y:0,z:0};
  var start = {};
  var now  = {};
  var startEl = {};
  var lastTime = Date.now();
  var scale = 129/18;
  var startZ = -160;
  var num = 0;
  var lastZ = null;
  window.isTouch = false;//陀螺仪开关，当touchstart的时候关闭，
  window.isStart = false;//当每次陀螺仪打开的时候，让陀螺仪从新获取角度；
  var dir = window.orientation; //检测横竖屏
/*  注意 用户切换了横屏之后，左右旋转就不再是e.gamma，
  上下旋转也不再是e.beta，所以陀螺仪记得检测横竖屏*/
  window.addEventListener('orientationchange', function(e) {
		dir = window.orientation;//用户切换了横竖之后，重置方向
	});
  window.addEventListener('deviceorientation', function(e) {
    if (window.isTouch) {
      return;
    }
    var beta = Math.round(e.beta);
    var gamma = Math.round(e.gamma);
    var alpha = Math.round(e.alpha);
    switch(dir){
			case 0:
				var x = beta;
				var y = gamma;
        var z = alpha;
				break;
      case 180:
				var x = -beta;
				var y = -gamma;
        var z = alpha;
				break;
			case 90:
				var x = gamma;
				var y = beta;
        var z = alpha;
				break;
			case -90:
				var x = -gamma;
				var y = -beta;
        var z = alpha;
				break;
		}
		
    if (lastZ >= 358 && z <= 2){
      num++;
    }
    if (lastZ <= 2 && z >= 358){
      num--;
    }
    lastZ = z;
    z = z+360*num;
    
    
    var nowTime = Date.now();
    
    /*deviceorientation执行的间隔 有可能小于20ms，MTween动画封装
    的setInterval执行间隔是20ms，这样的话，上个还没有执行，
    下一个就把上一个清除了*/
    if(nowTime - lastTime < 30){
      return;
    }
    lastTime = nowTime;
    
    if(!isStart){
      //start
      window.isStart = true;
      start.x = x;
      start.y = y;
      start.z = z;
      startEl.x = css(panoBg,'rotateX');
      startEl.y = css(panoBg,'rotateY');
    }else{
      //move
      now.x = x;
      now.y = y;
      now.z = z;
      var dis = {};
      dis.x = now.x - start.x;
      dis.y = now.y - start.y;
      dis.z = now.z - start.z;
      var deg = {};
      deg.x = startEl.x + dis.x;
      deg.y = startEl.y + dis.y;
      deg.z = dis.z;
      if(deg.x>45){
        deg.x=45
      }else if(deg.x<-45){
        deg.x=-45
      }
      var rotY = deg.y - deg.z;
      var disXZ =Math.abs(Math.round(deg.x - css(panoBg,'rotateX')) * scale);
      var disYZ =Math.abs(Math.round(rotY - css(panoBg,'rotateY')) * scale);
      var disZ = Math.max(disXZ,disYZ);
      if (disZ>300) {
        disZ = 300;
      }
      MTween({
        el:tZ,
        target:{translateZ:startZ - disZ},
        time:120,
        type:'easeOut',
        callBack:function(){
          MTween({
            el:tZ,
            target:{translateZ:startZ},
            time:120,
            type:'easeOut'
          });
        }
      });
      MTween({
        el:pano,
        target:{rotateX:deg.x,rotateY:rotY},
        time:240,
        type:'easeOut'
      });
      MTween({
        el:panoBg,
        target:{rotateX:deg.x,rotateY:rotY},
        time:280,
        type:'easeOut'
      });
      
    }
  });
}
