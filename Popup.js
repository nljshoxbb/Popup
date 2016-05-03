(function (window,undefined) {
	function Popup(config) {
		return new Popup.prototype.init(config);
	}
	Popup.prototype = {
		/**
		 * 创建弹出层
		 */
		createPopup:function (config) {
			var body = document.getElementsByTagName('body')[0],
				section = document.createElement('section'),
				header = document.createElement('header'),
				h3 = document.createElement('h3'),
				a = document.createElement('a'),
				article = document.createElement('article'),
				p = document.createElement('p'),
				footer = document.createElement('footer'),
				input = document.createElement('input'),
				cover = document.createElement('section');

			section.className = 'pop-wrap';
			header.className = 'pop-header';
			header.appendChild(h3);
			a.innerHTML = 'X';
			a.href = 'javascript:;';
			a.className = 'close';
			header.appendChild(a);
			article.className = 'pop-content';
			article.appendChild(p);
			footer.className = "pop-control";
			input.type = "button";
            input.className = "confirm";
            input.value = "确认";
            footer.appendChild(input);
            input = document.createElement("input");
            input.type = "button";
            input.className = "cancel";
            input.value = "取消";
            footer.appendChild(input);
            section.appendChild(header);
            section.appendChild(article);
            section.appendChild(footer);
            cover.className = "pop-up";
            body.appendChild(section);
            body.appendChild(cover);

            if (config.allowResize) {
            	var div = document.createElement("div");
            	div.className = "resizeL";
            	section.appendChild(div);
            	div = document.createElement("div");
            	div.className = "resizeT";
            	section.appendChild(div);
            	div = document.createElement("div");
            	div.className = "resizeR";
            	section.appendChild(div);
            	div = document.createElement("div");
            	div.className = "resizeB";
            	section.appendChild(div);
            	div = document.createElement("div");
            	div.className = "resizeLT";
            	section.appendChild(div);
            	div = document.createElement("div");
            	div.className = "resizeTR";
            	section.appendChild(div);
            	div = document.createElement("div");
            	div.className = "resizeBR";
            	section.appendChild(div);
            	div = document.createElement("div");
            	div.className = "resizeLB";
            	section.appendChild(div);
            }
		},
		/**
		 * 初始化
		 */
		init:function (config) {
			this.createPopup(config);
			this.cover = document.querySelector('.pop-up');
			this.wrap = document.querySelector('.pop-wrap');

			this.wrap.width = config.width;
			this.wrap.height = config.height;
			this.wrap.style.width = config.width + 'px';
			this.wrap.style.height = config.height + 'px';
			this.wrap.style.marginLeft = -parseInt(tool.getCss(this.wrap,'width')) / 2 + 'px';
			this.wrap.style.marginTop = -parseInt(tool.getCss(this.wrap,'height')) / 2 + 'px';

			this.header = this.wrap.querySelector('.pop-header');
			this.header.querySelector('h3').innerHTML = config.title;

			this.wrap.querySelector(".pop-content").querySelector("p").innerHTML = config.content;

			this.type = config.type;
			this.wrap.className += " " + this.type;
			this.status = false;
			this.allowPageWheel = config.allowPageWheel;
			this.allowDrag = config.allowDrag;
			this.allowResize = config.allowResize;

			var that = this;
			tool.addEvent(this.wrap.querySelector('.confirm'),'click',function () {
				config.confirm();
				that.hide();
			});
			tool.addEvent(this.wrap.querySelector('.cancel'),'click',function () {
				config.cancel();
				that.hide();
			});
			tool.addEvent(this.header.querySelector('.close'),'click',function (event) {
				tool.getEvent(event);
				that.hide(); 
			});
			tool.addEvent(this.cover,'click',function (event) {
				event = tool.getEvent(event);
				var target = event.target || event.srcElement;
				tool.preventDefault(event);
				if (target.className!== 'pop-wrap' ) {
					that.hide();
				}
			})
			// 拖拽开关
			if (this.allowDrag) {
				this.drag(this.wrap,this.header);
			}
			//缩放开关
			
			
			return this;
		},
		/**
		 * 弹出层缩放
		 */
		

		/**
		 *拖拽功能 
		 */
		 drag: function (dom, handler) {//只为标题区添加拖拽
            handler.style.cursor = "move";
            tool.addEvent(handler, "mousedown", function (event) {
                event = tool.getEvent(event);
                tool.preventDefault(event);
                var disY,
                    disX;
                disX = event.clientX - dom.offsetLeft;
                disY = event.clientY - dom.offsetTop;
                document.onmousemove = function (event) {
                    event = tool.getEvent(event);
                    tool.preventDefault(event);
                    var tempX = event.clientX - disX + dom.width / 2,
                        tempY = event.clientY - disY + dom.height / 2;
                    //拖拽时不能超过视窗边界
                    if (tempX > document.documentElement.offsetWidth - dom.offsetWidth + dom.width / 2) {
                        tempX = document.documentElement.offsetWidth - dom.offsetWidth + dom.width / 2;
                    } else if (tempX < dom.width / 2) {
                        tempX = dom.width / 2;
                    }
                    if (tempY > document.documentElement.offsetHeight - dom.offsetHeight + dom.height / 2) {
                        tempY = document.documentElement.offsetHeight - dom.offsetHeight + dom.height / 2;
                    } else if (tempY < dom.height / 2) {
                        tempY = dom.height / 2;
                    }
                    dom.style.left = tempX + "px";
                    dom.style.top = tempY + "px";
                };
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
                return false;
            });
        },
		/**
		 * 阻止页面滚动回调事件
		 */
		stopScroll: function (event) {
            tool.preventDefault(event);
        },
        /**
         * 阻止页面滚动
         */
        stopPageWheel: function () {
            tool.addEvent(window, "mousewheel", this.stopScroll);
            tool.addEvent(window, "DOMMouseScroll", this.stopScroll);//兼容FF
        },
        /**
         * 移除阻止页面滚动
         */
        removeStopPageWheel : function () {
            tool.removeEvent(window, "mousewheel", this.stopScroll);
            tool.removeEvent(window, "DOMMouseScroll", this.stopScroll);//兼容FF
        },
		/**
		 * 显示弹出层
		 */
		show: function () {
            this.cover.style.display = 'block';
            this.wrap.className += " show";
            this.status = true;
            //是否允许页面滚动，在弹出层显示的时候才运行
            if (!this.allowPageWheel) {
                this.stopPageWheel();
            }
            return this;
        },
		/**
		 * 隐藏弹出层
		 */
		hide: function () {
            this.cover.style.display = 'none';
            this.wrap.className = this.wrap.className.replace(/show/g, "").trim();
            this.status = false;
            //弹出层消失后移除阻止页面滚动事件
            if (!this.allowPageWheel) {
                this.removeStopPageWheel();
            }
            return this;
        },
		/**
		 * 触发按钮
		 */
		toggle:function () {
			if (this.status) {
				this.hide();
			}else{
				this.show();
			}
			return this;
		}
	};
	Popup.prototype.init.prototype = Popup.prototype;
	window.Popup = Popup;
})(window,undefined);