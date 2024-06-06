/*
 * Floaty.js v1.0.3
 *
 * Copyright (C) 2024 wjjwkwindy
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Floaty = factory();
  }
})(this, function () {
  var Floaty = function (options) {
    return new Floaty.lib.init(options);
  },
    version = '1.0.1';

  // 默认配置
  Floaty.defaults = {
    speed: 20, // 移动速度
    statusX: 1, // x轴变化幅度
    statusY: 1, // y轴变化幅度
    randomStatus: true, // 是否随机移动方向
    x: 0, // x轴初始位置
    y: 0, // y轴初始位置
    randomPosition: true, // 是否随机位置
    closeButton: true, // 是否显示关闭按钮
    closeButtonPosition: 'inner', // 关闭按钮位置 inner: 内部, outer: 外部
    img: 'https://placehold.co/600x400/EEE/31343C', // 图片地址
    url: '', // 点击图片跳转地址
  };

  Floaty.lib = Floaty.prototype = {
    version: version,
    constructor: Floaty,
    // 初始化
    init: function (options) {
      if (!options) {
        options = {};
      }
      this.options = {};
      this.maxW = 0;
      this.maxH = 0;
      this.interval = null;
      this.FloatyElement = null;

      this.options.speed = options.speed || Floaty.defaults.speed;
      this.options.statusX = options.statusX || Floaty.defaults.statusX;
      this.options.statusY = options.statusY || Floaty.defaults.statusY;
      this.options.randomStatus = options.randomStatus !== undefined ? options.randomStatus : Floaty.defaults.randomStatus;
      this.options.x = options.x || Floaty.defaults.x;
      this.options.y = options.y || Floaty.defaults.y;
      this.options.randomPosition = options.randomPosition !== undefined ? options.randomPosition : Floaty.defaults.randomPosition;
      this.options.closeButton = options.closeButton !== undefined ? options.closeButton : Floaty.defaults.closeButton;
      this.options.closeButtonPosition = options.closeButtonPosition || Floaty.defaults.closeButtonPosition;
      this.options.img = options.img || Floaty.defaults.img;
      this.options.url = options.url || Floaty.defaults.url;

      this.showFloaty();

      return this;
    },
    // 创建元素
    buildFloaty: function () {
      if (!this.options) {
        throw 'Floaty is not initialized';
      }

      var divElement, imgElement, closeElement, linkElement;

      // 容器
      divElement = document.createElement('div');
      divElement.className = 'floaty';
      divElement.setAttribute('style', 'opacity:0;display:inline-block;position:fixed;top:0;left:0;width:200px;z-index:9999;');
      divElement.addEventListener('mouseover', function () {
        clearInterval(this.interval);
      }.bind(this));
      divElement.addEventListener('mouseout', function () {
        this.intervalFloaty();
      }.bind(this));

      // 图片元素
      imgElement = document.createElement('img');
      imgElement.src = this.options.img;
      imgElement.addEventListener('load', function () {
        this.calcRange(); // 图片加载完成后重新计算移动范围
      }.bind(this))
      imgElement.setAttribute('style', 'width:100%;height:auto;vertical-align:bottom;');

      // 关闭按钮元素
      if (this.options.closeButton) {
        closeElement = document.createElement('button');
        closeElement.type = 'button';
        closeElement.className = 'floaty-close';
        closeElement.innerHTML = '&#10006;';
        switch (this.options.closeButtonPosition) {
          case 'inner':
            closeElement.setAttribute('style', 'position:absolute;right:0;top:0;background:#eee;border:0;cursor:pointer;padding: 8px 10px;text-align: center;line-height: 1;font-size: 16px;');
            break;
          case 'outer':
            closeElement.setAttribute('style', 'position:absolute;right:0;top:0;transform:translateX(100%);background:#eee;border:0;cursor:pointer;padding: 8px 10px;text-align: center;line-height: 1;font-size: 16px;');
            break;

          default:
            break;
        }

        closeElement.addEventListener('click', function (event) {
          event.stopPropagation();
          this.removeElement(divElement);
        }.bind(this));
      }

      // 链接元素
      if (this.options.url) {
        linkElement = document.createElement('a');
        linkElement.href = this.options.url;
        linkElement.target = '_blank';
      }

      if (linkElement) {
        divElement.appendChild(linkElement);
        linkElement.appendChild(imgElement);
        closeElement ? linkElement.appendChild(closeElement) : null;
      } else {
        divElement.appendChild(imgElement);
        closeElement ? divElement.appendChild(closeElement) : null;
      }

      return divElement;
    },
    // append元素
    showFloaty: function () {
      this.FloatyElement = this.buildFloaty();

      var rootElement = document.body;
      rootElement.appendChild(this.FloatyElement);

      // 设置定时器
      this.intervalFloaty();

      return this;
    },
    // 计算
    calcRange: function () {
      // 计算可移动的最大宽度和高度
      this.maxW = window.innerWidth - this.FloatyElement.offsetWidth;
      this.maxH = window.innerHeight - this.FloatyElement.offsetHeight;

      // 计算初始位置
      if (this.options.randomPosition) {
        this.options.x = Math.floor(Math.random() * this.maxW);
        this.options.y = Math.floor(Math.random() * this.maxH);
      }

      // 随机移动方向
      if (this.options.randomStatus) {
        this.options.statusX = Math.random() > 0.5 ? this.options.statusX : -this.options.statusX;
        this.options.statusY = Math.random() > 0.5 ? this.options.statusY : -this.options.statusY;
      }

      // 开始移动时设置透明度（否则会闪屏）
      setTimeout(function () {
        this.FloatyElement.style.opacity = 1;
      }.bind(this), this.options.speed);
    },
    // 定时器
    intervalFloaty: function () {
      this.interval = setInterval(this.dirveFloaty.bind(this), this.options.speed);
    },
    // 移动元素
    dirveFloaty: function () {
      this.FloatyElement.style.left = this.options.x + 'px';
      this.FloatyElement.style.top = this.options.y + 'px';
      this.options.x = this.options.x + this.options.statusX;
      this.options.y = this.options.y + this.options.statusY;

      if (this.options.x > this.maxW || this.options.x < 0) {
        this.options.statusX = -this.options.statusX;
      }
      if (this.options.y > this.maxH || this.options.y < 0) {
        this.options.statusY = -this.options.statusY;
      }
    },
    // 移除元素
    removeElement: function (floatyElement) {
      if (floatyElement.parentNode) {
        floatyElement.parentNode.removeChild(floatyElement);
      }
      clearInterval(this.interval);
    }
  }

  Floaty.lib.init.prototype = Floaty.lib;

  return Floaty;
});