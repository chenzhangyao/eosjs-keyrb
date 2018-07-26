<template>
  <div id="app">
    <img src="./assets/timg.gif" style="width:240px" v-if="ste !== 'loading'">
	<img src="./assets/loading.gif" style="width:240px" v-else-if="ste === 'loading'">

	<div class="res" v-if="ste === 'ready'">
		<div>{{ ckr }}</div>
	</div>
	<div class="res" v-else-if="ste === 'loading'">
		<div>正在玩命儿加载中,请稍后...</div>
	</div>
	<div class="res" v-else-if="ste === 'f'">
		<div>抱歉，没有找到格式正确的私钥</div>
	</div>
	<div class="res" v-else-if="ste === 'w'">
		<div v-if="ste === 'w'" style="font-size: 14px;line-height: 22px;">恭喜已经找回了你的私钥（如下所示）</div>
		<p style="font-family: Futura;font-weight: bold;"> {{ vpk }} </p>
	</div>
	<div class="res" v-else-if="ste === 'search'">
		<div>正在搜索中...请耐心等待...</div>
	</div>

    <div class="yz" style="margin-top: 20px" v-show="ste === 'w'">
    	<p>程序开发不易！如果可以，请用下列方式来支持我的工作，感激不尽！</p>
    	<ul>
    		<li v-for="q in qrDetail">
		      <canvas :id="q[2]"></canvas><p>{{ q[0] }}</p>
		    </li>
    	</ul>
    </div>
	
	<div class="rbpz" style="margin-top: 20px;">
		<div>
	        <span>指定搜索位置：</span>
			<input style="width:75px" type="text" v-model="sft" id="inputWZ" :disabled="ste === 'search'">
			<span id="sftEx"></span>
		</div>
    </div>

    <div style="margin-top: 20px">
    	<label>分不清字符<input type="radio" v-model="searchType" value="fbqzf" :disabled="ste === 'search'"></label>
		<label>分不清大小写<input type="radio" v-model="searchType" value="fbqdxx" :disabled="ste === 'search'"></label>
    </div>

    <div class="eospk" style="margin-top: 20px;">
      <div>
        <input type="text" id="inputPK" v-model="puk" placeholder="[必填]此处填入映射的EOS公钥地址..." :disabled="ste === 'search'">
		<input id="inputZF" v-if="searchType === 'fbqdxx'" style="width:15%" type="text" v-model="qfAz" placeholder="分不清的字符..." :disabled="ste === 'search'">
        <input type="text" v-model="ivpk" placeholder="[必填]此处填入有误的EOS私钥..." style="margin-top:10px" :disabled="ste === 'search'">
        <button v-show="ste !== 'search'" class="primary" @click="sr">查找正确的EOS私钥</button>
        <button v-show="ste === 'search'" class="primary" style="background:darkred" @click="ss">停止搜索</button>
      </div>
      <p style="font-weight:bold; font-size:14px">已匹配私钥：<i id="tn" style="margin-right:10px">0</i> 待验证总量: {{ pkmb.length }} 已验证次数：{{ vn }}</p>
      <p class="notice"><br/>为了你的私钥安全，推荐在页面加载后，断网操作。（<a href="https://www.jianshu.com/p/49ec5603fc5b" target="_blank" style="text-decoration: none;">使用方法</a>）<br/></p>
	  <p style="font-size:12px;font-weight:bold;">因着十架爱，程序已开源。愿我们的上帝能帮助你找回！<a href="https://www.jianshu.com/p/67e8160615b5" target="_blank" style="text-decoration: none;color:green"> 程序更新日志</a></p>
      <p style="font-size:12px;font-weight:bold;">如果还不能解决您的问题的，可以加入{{ atr }} 或联系微信ID：XYstars 获取帮助</p>
    </div>
  </div>
</template>

<script>
import ecc from 'eosjs-ecc'
import QRCode from 'qrcode'

export default {
  name: 'App',
  data () {
    return {
		ivpk : "",	//错误私钥
		vpk : "",	//找回的正确私钥
		atr : "QQ群：724652569",	
		puk : "",	//EOS公钥
		ste : "loading",	//程序状态
		srID : null,		//定时器ID
		vn : 0,				//已验证次数
		zm : 1,				//搜索字母数
		sft : '0-0',		//搜索范围
		ckr : '请填入 [ 必填项 ] 开始搜索',			//验证结果
		pkmb : [],			//后台返回所有格式正确的私钥
		myDate : null,		//日期
		searchType : 'fbqzf',	//搜索类型
		qfAz : '',				//大小写分不清的字符
		mw_zfs : null,			//Worker 字符搜索
		mw_zms : null,			//Worker 字母搜索
		debug : false,			//debug模式
		qrDetail : [			//支援地址
			['EOS Account','eos:ha3tsmzsgyge?contractAddress=EOS%40eosio.token&decimal=0&value=0','EosQR'],
			['ETH Address','0xE5f0e448938d1300eB05039560F7D51E998AE538','EthQR'],
			['BTC Address','35tzAjQA19NzZW2kP7bVfNKAWVFxoCJ5Li','BtcQR'],
			['微信 WeChat','wxp://f2f0epm_REcp9ZXH7_3RlUhqVM4ZPUyh-rLn','WechatQR'],
			['支付宝 Alipay','HTTPS://QR.ALIPAY.COM/FKX03083IVSUUGWBSFHX2D?t=1529249088151','AlipayQR'],
		]
    }
  },
  mounted : function () 
  {
  	  this.ii();
	  this.UserQrcode();
  },
  watch : {
	ivpk : function(val,oldval){
		if(val === '') {return false;}
		this.sft = '1' + '-' + val.length;
	},
	sft : function(val,oldval) {
		if(val.split('-').length != 2){	return false; }

		if(parseInt(val.split('-')[0]) < 1 || parseInt(val.split('-')[1]) > this.ivpk.length)
		{
			this.sft = '1-' + this.ivpk.length;
		}
		else if(parseInt(val.split('-')[0]) > parseInt(val.split('-')[1]))
		{
			this.sft = val.split('-')[1] + '-' + val.split('-')[1];
		}
		
		var ipkEx = this.ivpk.concat();
		ipkEx = ipkEx.splice(val.split('-')[1],"</span>");
		ipkEx = ipkEx.splice(val.split('-')[0] - 1,"<span>");
		document.getElementById("sftEx").innerHTML = ipkEx;
	},
	searchType : function (val,oldval) {
		this.ste = 'ready';
	}
  },
  methods: {
  	//初始化，加载Worker文件。
  	ii : function(){
  		if(this.debug) {
  			this.ivpk = "5K1zxV7XaTzeNgu4bViuBPk9u8D7ZDf4J2DJdHuBHBzbSU2SJkC";
  			this.puk = "EOS5qbJLbPb155166MqYdo1vxzQaPxKB4AEL7LykifPq4fcxdJDpr";
  		}
		var zfs_pl = false,zms_pl = false;
		this.mw_zfs = new Worker('./static/zfs.js');
		this.mw_zfs.onmessage = function(){
			zfs_pl = true;
		};
		this.mw_zfs.postMessage([]);
		this.mw_zms = new Worker('./static/zms.js');
		this.mw_zms.onmessage = function(){
			zms_pl = true;
		};
		this.mw_zfs.postMessage([]);
		var id = setInterval(()=>{
			if(zfs_pl || zms_pl)
			{
				this.ste = 'ready';
				clearInterval(id);
			}
		},100);
  	},
  	// 验证 搜索条件的输入 是否正确
	cd : function(){
		if(this.ivpk === ''){
			this.ckr = "你不填EOS私钥怎么帮你找？！";
			return false;
		}
		if(this.ivpk.length != 51){
			this.ckr = "私钥为51位数 输入不规范";
			return false;
		}
		if(this.ivpk.indexOf('0') != -1 || this.ivpk.indexOf('l') != -1 || this.ivpk.indexOf('I') != -1 || this.ivpk.indexOf('O') != -1)
		{
			this.ckr = "私钥中不能包含 0、l、I、O"
			return false;
		}
		if(this.puk === ''){
			this.ckr = "EOS公钥不能为空！";
			return false;
		}
		if(this.sft.split('-').length != 2){
			this.ckr = "搜索位置 输入不规范";
			return false;
		}
		return true;
	},
	//搜索初始化
	si : function(){
		this.ckr = '请填入 [ 必填项 ] 开始搜索';
		this.ste = "search";
		this.pkmb = [];
		this.vn = 0;
		this.myDate = new Date();
	},
	//停止搜索
	ss : function(){
		if(this.searchType === 'fbqzf'){
			this.mw_zfs.terminate();
		}
		else
		{
			this.mw_zms.terminate();
		}
		clearInterval(this.srID);	
		this.ste = 'ready';
	},
	// 开始搜索
    sr : function(){
		if(this.cd()){
			this.si();
			
			if(this.searchType === 'fbqzf'){
				this.mw_zfs = new Worker('./static/zfs.js');
				this.mw_zfs.onmessage = this.parr;
				this.mw_zfs.postMessage([this.ivpk,this.sft.split('-'),this.zm]);
			}
			else
			{
				this.mw_zms = new Worker('./static/zms.js');
				this.mw_zms.onmessage = this.parr;
				this.mw_zms.postMessage([this.ivpk,this.sft.split('-'),this.qfAz]);
			}
			this.srID = setInterval(
				this.vrf,
				300		//验证速度 
			);
		}
	},
	// 开始验证数组中的私钥与公钥
	vrf : function() 
	{
		var s = this.pkmb.shift();
		if( s === 'done!' )
		{
			clearInterval(this.srID);
			this.f("f");
		}
		else if(typeof(s) !== 'undefined')
		{
			this.vn++;
			if(ecc.privateToPublic(s) === this.puk)
			{
				this.ss();
				this.vpk = s;
				this.f("w");
			}
		}
	},
	//每当Worker发送消息，则push到数组末尾。
	parr : function(e) {
		if(typeof e.data === "string") {
			this.pkmb.push(e.data);
		}
		else if(typeof e.data === "number") {
			document.getElementById("tn").innerHTML = e.data;
		}
	},
	//最后的搜索结果
	f : function(e) {
		this.ste = e;
	},
	//我的打赏地址
	UserQrcode : function(){
		for(var i = 0; i < this.qrDetail.length; i ++)
		{
　　　　		this.QueryDetail= this.qrDetail[i][1];
			var canvas = document.getElementById(this.qrDetail[i][2]);
			QRCode.toCanvas(canvas, this.QueryDetail)
		}
    }
  }
}
</script>
<style>
body {
	min-width: 1024px;
	margin:auto;
}

p{
  margin: 5px 0px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}

#sftEx 
{
    font-size: 12px;
    color: darkgrey;
}

#sftEx span 
{
    color: red;
    margin:0px 5px;
    font-size:16px;
}

div.res div
{
	background: cadetblue;
    width: 30%;
    position: relative;
    left: 35%;
    color: honeydew;
    padding: 5px;
    border-radius: 10px;
}

.notice
{
  font-size: 14px;
  font-weight:bold;
  font-family : "微软雅黑";
  color: red;
}


ul
{
    list-style:none; /* 去掉ul前面的符号 */
    margin: 0px; /* 与外界元素的距离为0 */
    padding: 0px; /* 与内部元素的距离为0 */
    width: auto; /* 宽度根据元素内容调整 */
    position: relative;
}

div.yz ul 
{
	display: inline-block;
}

div.yz p 
{
	width: 70%;
    position: relative;
    right: -15%;
    padding: 5px;
    background: darkslategrey;
    color: aliceblue;
    border-radius: 10px;
}

div.yz ul li 
{
    float:left; /* 向左漂移，将竖排变为横排 */
    width:165px;
	cursor: pointer;
}

div.yz ul li canvas {
	width:148px !important;
	height:148px !important;
    position: relative;
    left: 3%;
}

input[type='text'] {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: none;
  padding: 0 15px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  width: 60%;
  mix-width: 500px;	
}
input[type='text']:focus {
    outline: none;
    border-color: #409eff;
}
.primary {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
}
.primary:active {
  background: #3a8ee6;
  border-color: #3a8ee6;
  color: #fff;
}
.primary:hover {
    background: #66b1ff;
    border-color: #66b1ff;
    color: #fff;
}
button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-color: #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: .1s;
  font-weight: 500;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  padding: 12px 10px;
  font-size: 14px;
  border-radius: 4px;
  min-width: 150px;
}

</style>
