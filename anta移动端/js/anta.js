(function() {
  //setLoding()
  anmt5();
})();
document.addEventListener('touchstart',function(ev) {
  ev.preventDefault;
})
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
				type: "easeBoth",
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
  				type: "easeBoth",
  				callBack:anmt3
  			});
      }
    })
  },1500)
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
  },1500)
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
			},300);
		}
  })
}
/* 主体由远到近的开始入场 */
function anmt5(){
  var tZ = document.querySelector('#panoBg-translateZ');
  css(tZ,'translateZ',-2000);
  anmt6();
  anmt7();
  MTween({
		el:tZ,
		target: {translateZ:200},
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
  css(panoBg,'rotateY',-695)
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
    callBack:setDarg
  })
}
// 拖拽并且还有拖拽过渡
function setDarg(){
  var panoBg = document.querySelector('#panoBg');
  var tZ = document.querySelector('#panoBg-translateZ');
  var startPoint = {x:0,y:0};
  var startDeg = {x:0,y:0};
  var nowPoint = {x:0,y:0};
  var scale = {x:20*129/360,y:1170/30};//拖拽时拖拽距离和角度的比例
  var disDeg = {x:0,y:0};
  var dis = {x:0,y:0};
  var startZ = css(tZ,'translateZ');//拖拽时开始的z轴距离
  document.addEventListener('touchstart',function(e){
    startPoint.x = e.changedTouches[0].pageX;
    startPoint.y = e.changedTouches[0].pageY;
    startDeg.x = css(panoBg,'rotateY');
    startDeg.y = css(panoBg,'rotateX');
  });
  document.addEventListener('touchmove',function(e){
    nowPoint.x = e.changedTouches[0].pageX;
    nowPoint.y = e.changedTouches[0].pageY;
    dis.x = nowPoint.x - startPoint.x;
    dis.y = nowPoint.y - startPoint.y;
    disDeg.x = -(dis.x/scale.x);
    disDeg.y = dis.y/scale.y;
    var deg = {};
    deg.x = startDeg.x+disDeg.x;
    deg.y = startDeg.y+disDeg.y;
    if(deg.y>40){
      deg.y=40
    }else if(deg.y<-40){
      deg.y=-40
    }
    css(panoBg,'rotateY',deg.x);
    css(panoBg,'rotateX',deg.y);
    if(Math.abs(dis.x) > 300){
			dis.x = 300;
		}
    css(tZ,'translateZ',startZ - Math.abs(dis.x));
  });
  document.addEventListener('touchend',function(e){
    var nowDeg = {x:css(panoBg,'rotateY'),y:css(panoBg,'rotateX')};
    var Deg = {x:disDeg.x,y:disDeg.y};
    var Y = nowDeg.y+Deg.y;
    if(Y>40){
      Y=40
    }else if(Y<-40){
      Y=-40
    }
    MTween({
      el:tZ,
      target:{translateZ:startZ},
      time:600,
      type:'easeOut'
    });
    // MTween({
    //   el:panoBg,
    //   target:{rotateY:nowDeg.x+Deg.x,rotateX:Y},
    //   time:600,
    //   type:'easeOut'
    // });
  });
}
function bgShow(){
  var pageBg = document.querySelector('#pageBg');
	MTween({
		el:pageBg,
		target:{opacity:100},
		time: 500,
		type:"easeBoth"
	});
}



