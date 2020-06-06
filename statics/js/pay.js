var Pay = /** @class */ (function () {
    function Pay(options) {
        // 支付二维码配置，需要使用二维码解析出来的网址
        this.qqQrcode = "";
        this.wechatQrcode = "";
        this.alipayQrcode = "";
        // 其他配置
        this.contact = ""; // 联系方式
        this.alipayID = ""; //支付宝id，用户直接跳转
        this.alipayMoney = this.getQuery('money'); //支付宝直接跳转时金额，支持query获取
        this.alipayNote = this.getQuery('note'); //支付宝直接跳转时显示的备注，支持query获取
        this.qrcodeDOM = document.getElementById("qrcode");
        this.payContentDOM = document.getElementById("pay-content");
        this.pcTipDOM = document.getElementById("pc-tip");
        this.mobileTipDOM = document.getElementById("mobile-tip");
        this.qqQrcode = options.qqQrcode;
        this.wechatQrcode = options.wechatQrcode;
        this.alipayQrcode = options.alipayQrcode;
        this.contact = options.contact;
        this.alipayID = options.alipayID;
        this.alipayMoney = options.alipayMoney;
        this.alipayNote = options.alipayNote;
        var deviceType = this.getDeviceType();
        console.log(deviceType);
        if (deviceType.qq) {
            this.startQQ();
        }
        else if (deviceType.wechat) {
            this.startWechat();
        }
        else if (deviceType.alipay) {
            this.startAlipay();
        }
        else if (deviceType.mobile) {
            this.startMobile();
        }
        else {
            this.startPC();
        }
    }
    // 获取设备UA，判断是否符合
    Pay.prototype.getDeviceType = function (type) {
        if (type === void 0) { type = ''; }
        var UA = navigator.userAgent.toLowerCase();
        var uaObj = {
            qq: UA.indexOf('qq/') !== -1,
            wechat: UA.indexOf('micromessenger') !== -1,
            alipay: UA.indexOf("Alipayclient") !== -1,
            mobile: UA.indexOf("mobile") !== -1,
        };
        return type ? uaObj[type] : uaObj;
    };
    // 获取地址栏参数
    Pay.prototype.getQuery = function (key) {
        var search = location.search;
        var searchParams = new URLSearchParams(search);
        return key ? searchParams.get(key) : searchParams;
    };
    // 使用支付宝模式，显示loading提示，唤醒支付
    Pay.prototype.startAlipay = function () {
        document.title = "loading...";
        var url = this.alipayQrcode;
        if (this.alipayID) {
            url = "alipays://platformapi/startapp?appId=09999988&actionType=toAccount&goBack=NO&amount=" + this.alipayMoney + "&userId=" + this.alipayID + "&memo=" + this.alipayNote;
        }
        window.location.replace(url);
    };
    // 使用QQ模式，显示二维码提示长按支付
    Pay.prototype.startQQ = function () {
        document.title = "请长按识别继续完成支付";
        this.payContentDOM.style.display = "block";
        this.mobileTipDOM.style.display = "block";
        this.setQrcode(this.qqQrcode);
    };
    // 使用微信模式，显示二维码提示长按支付
    Pay.prototype.startWechat = function () {
        var _this = this;
        document.title = "请长按识别继续完成支付";
        this.payContentDOM.style.display = "block";
        this.mobileTipDOM.style.display = "block";
        setTimeout(function () {
            _this.mobileTipDOM.textContent = _this.contact;
        }, 8000);
        this.setQrcode(this.wechatQrcode);
    };
    // 使用移动端浏览器模式，提示用户选择一种支付模式
    Pay.prototype.startMobile = function () {
        document.title = "正在发起支付宝付款...";
        this.startAlipay();
    };
    // 使用pc模式，显示当前网页二维码，提示手机扫码打开
    Pay.prototype.startPC = function () {
        document.title = "请使用手机微信/QQ/支付宝扫码完成支付";
        this.payContentDOM.style.display = "block";
        this.pcTipDOM.style.display = "block";
        this.setQrcode(location.href);
    };
    Pay.prototype.setQrcode = function (text) {
        this.qrcode = new QRCode(this.qrcodeDOM, {
            text: text,
            width: 140,
            height: 140,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        //获取网页中的canvas对象
        var mycanvas1 = document.getElementsByTagName('canvas')[0];
        //将转换后的img标签插入到html中
        var img = this.convertCanvasToImage(mycanvas1);
        this.qrcodeDOM.getElementsByTagName('img')[0].remove();
        this.qrcodeDOM.appendChild(img); //imagQrDiv表示你要插入的容器id
    };
    //从 canvas 提取图片 image
    Pay.prototype.convertCanvasToImage = function (canvas) {
        //新Image对象，可以理解为DOM
        var image = new Image();
        // canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持
        // 指定格式 PNG
        image.src = canvas.toDataURL("image/png");
        return image;
    };
    return Pay;
}());
