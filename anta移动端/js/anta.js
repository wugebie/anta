(function() {
  setLoding()
})()
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
  },1800)
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
  },1800)
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
		var xDeg = Math.round(Math.random()*360)//(360/9)*(i%9);
		var yR = 10+Math.round(Math.random()*240);
		var yDeg = Math.round(Math.random()*360)//(360/9)*(i%9);
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
					target: {translateZ: -1000,scale:20},
					time: 2500,
					type: "easeBoth",
					callBack: function(){
						view.removeChild(logo4);
						//anmt5();
					}
				});
			},300);
		}
  })
}

