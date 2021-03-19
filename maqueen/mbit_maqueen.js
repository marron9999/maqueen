var MBIT_MAQUEEN = {
	notify: function (val) { },
	trace: function (val) { },

	log: function (val) {
		MBIT_MAQUEEN.notify("DL" + val);
	},
	error: function (error) {
		MBIT_MAQUEEN.notify("DE" + error);
	},
	closed: function () {
		MBIT_MAQUEEN.notify("DC0");
		//MBIT_MAQUEEN.notify("DL" + "切断されました");
	},

	disconnect: function () {
		MBIT_BLE.disconnect();
	},
	connect: async function () {
		MBIT_BLE.trace = MBIT_MAQUEEN.trace;
		MBIT_BLE.error = MBIT_MAQUEEN.error;
		MBIT_BLE.log = MBIT_MAQUEEN.log;
		MBIT_BLE.closed = MBIT_MAQUEEN.closed;
		MBIT_BLE.notify = MBIT_MAQUEEN.notify;
		if (MBIT_BLE._device != null) {
			MBIT_MAQUEEN.log("強制切断します");
			MBIT_BLE.disconnect();
		}
		MBIT_MAQUEEN._speed = 60;
		MBIT_MAQUEEN._mode = 0;
		MBIT_MAQUEEN._auto = 0;
		await MBIT_BLE.connect();
		if (MBIT_BLE._device != null) {
			if (MBIT_BLE._name == null) MBIT_MAQUEEN.notify("DC1");
			else MBIT_MAQUEEN.notify("DC1" + MBIT_BLE._name);
			MBIT_MAQUEEN.notify("DL" + "接続しました");
			MBIT_MAQUEEN.notify("DA0");
			MBIT_MAQUEEN.notify("MS" + MBIT_MAQUEEN._speed);
		}
	},

	send: async function (text) { await MBIT_BLE.write(text); },
	init: async function () { await MBIT_BLE.write("RI"); },

	// O	F		Maqueen 前に進む
	// O	B		Maqueen 後ろに戻る
	// O	L	1	Maqueen 前左へ回転
	// O	L	2	Maqueen 後左へ回転
	// O	R	1	Maqueen 前右へ回転
	// O	R	2	Maqueen 後右へ回転
	forward: async function () { await MBIT_MAQUEEN.mortor(MBIT_MAQUEEN._speed); },
	backward: async function () { await MBIT_MAQUEEN.mortor(0 - MBIT_MAQUEEN._speed); },
	turn1_left: async function () {
		await MBIT_MAQUEEN.mortor_left(0);
		await MBIT_MAQUEEN.mortor_right(MBIT_MAQUEEN._speed);
	},
	turn1_right: async function () {
		await MBIT_MAQUEEN.mortor_right(0);
		await MBIT_MAQUEEN.mortor_left(MBIT_MAQUEEN._speed);
	},
	turn2_left: async function () {
		await MBIT_MAQUEEN.mortor_left(0);
		await MBIT_MAQUEEN.mortor_right(0 - MBIT_MAQUEEN._speed);
	},
	turn2_right: async function () {
		await MBIT_MAQUEEN.mortor_right(0);
		await MBIT_MAQUEEN.mortor_left(0 - MBIT_MAQUEEN._speed);
	},
	turn3_left: async function () {
		await MBIT_MAQUEEN.mortor_left(MBIT_MAQUEEN._speed);
		await MBIT_MAQUEEN.mortor_right(0 - MBIT_MAQUEEN._speed);
	},
	turn3_right: async function () {
		await MBIT_MAQUEEN.mortor_right(MBIT_MAQUEEN._speed);
		await MBIT_MAQUEEN.mortor_left(0 - MBIT_MAQUEEN._speed);
	},

	// M	L	-255～255	Maqueen 左モーターを動かす
	// M	R	-255～255	Maqueen 右モーターを動かす
	// M	B	-255～255	Maqueen 両方のモーターを動かす
	// M	S	-255～255	Maqueen 速度の増減
	mortor_left: async function (val) { await MBIT_BLE.write("ML" + val); },
	mortor_right: async function (val) { await MBIT_BLE.write("MR" + val); },
	mortor: async function (val) { await MBIT_BLE.write("MB" + val); },
	_speed: 60,
	mortor_speed: async function (val) {
		val += MBIT_MAQUEEN._speed;
		if (val < 25) val = 25;
		else if (val > 255) val = 255;
		MBIT_MAQUEEN._speed = val;
		MBIT_MAQUEEN.notify("MS" + val);
	},

	// L	L	0/1	Maqueen 左LEDを消す/点ける
	// L	R	0/1	Maqueen 右LEDを消す/点ける
	// L	B	0/1	Maqueen 両方のLEDを消す/点ける
	led_left: async function (val) { await MBIT_BLE.write("LL" + val); },
	led_right: async function (val) { await MBIT_BLE.write("LR" + val); },
	led: async function (val) { await MBIT_BLE.write("LB" + val); },

	// R	S	0/1	Maqueen	[MBIT_MAQUEEN要求] ラインセンサー
	// R	U	0/丸め値	Maqueen　[MBIT_MAQUEEN要求] 距離センサー
	// R	A	0/マスク	Maqueen [自動モード=1] 2-黒ライン復帰、4-旋回時:点灯、8-// R	V	1/2			バージョン
	sensor: async function (val) { await MBIT_BLE.write("RS" + ((val) ? 1 : 0)); },
	sonic: async function (val) { await MBIT_BLE.write("RU" + val); },
	_auto: 0,
	auto: async function (val) {
		if (MBIT_BLE._device == null) return;
		MBIT_MAQUEEN.notify("DA" + val);
		if (val == 0) {
			MBIT_MAQUEEN._auto = 0;
			await MBIT_BLE.write("RA0");
			return;
		}
		MAQUEEN_AUTO._left = 0;
		MAQUEEN_AUTO._right = 0;
		MBIT_MAQUEEN._auto = val;
		await MBIT_BLE.write("RA" + val);
		await MBIT_MAQUEEN.forward();
	},
	ver: async function (val) { await MBIT_BLE.write("RV" + val); },

	// R	M	マスク	Micro:bit [MBIT_MAQUEEN要求] 1-ボタン、2-温度、4-明るさ
	// R	F	0/丸め値	Micro:bit [MBIT_MAQUEEN要求] 磁力計
	// R	G	0/丸め値	Micro:bit [MBIT_MAQUEEN要求] 加速計
	// R	R	0/丸め値	Micro:bit [MBIT_MAQUEEN要求] 回転計
	_mode: 0,
	mode: async function (val) {
		if (MBIT_BLE._device == null) return;
		MBIT_MAQUEEN._mode = val;
		await MBIT_BLE.write("RM" + val);
	},
	force: async function (val) { await MBIT_BLE.write("RF" + val); },
	accele: async function (val) { await MBIT_BLE.write("RG" + val); },
	rotate: async function (val) { await MBIT_BLE.write("RR" + val); },


	// G	-	1/2/4/8	Micro:bit 加速レンジ設定
	accele_range: async function (str) {
		let val = str.substr(2);
		await MBIT_BLE.write("G-" + val);
	},

	// T	X	音色	Maqueen 音を鳴らす(1/16符)
	// T	8	音色	Maqueen 音を鳴らす(1/8符)
	// T	4	音色	Maqueen 音を鳴らす(1/4符)
	// T	2	音色	Maqueen 音を鳴らす(1/2符)
	// T	1	音色	Maqueen 音を鳴らす(1符)
	// T	M	名前	Micr:bit V2 メロディを鳴らす
	sound: async function (val) { await MBIT_BLE.write("TX" + val); },
	sound8: async function (val) { await MBIT_BLE.write("T8" + val); },
	sound4: async function (val) { await MBIT_BLE.write("T4" + val); },
	sound2: async function (val) { await MBIT_BLE.write("T2" + val); },
	sound1: async function (val) { await MBIT_BLE.write("T1" + val); },
	express: async function (val) { await MBIT_BLE.write("TT" + val); },

	// C	T	文字列	Micro:bit LEDに文字列表示
	// C	0	XY	Micro:bit LED(X,Y座標）を消灯
	// C	1	XY	Micro:bit LED(X,Y座標）を点灯
	// C	M	パターン	Micro:bit LED(マトリクス)にパターン表示(5文字)
	//			0 - ・・・・・
	//			1 - ・・・・点
	//			     :
	//			9 - ・点・・点
	//			A - ・点・点・
	//			     :
	//			F - ・点点点点
	//			G - 点・・・・
	//			     :
	//			V - 点点点点点
	text: async function (val) { await MBIT_BLE.write("CT" + val); },
	plot: async function (val) { await MBIT_BLE.write("C1" + val); },
	unplot: async function (val) { await MBIT_BLE.write("C0" + val); },
	matrix: async function (val) {
		let m = "0123456789ABCDEFGHIJKLMNOPQRSTUV";
		let s = ["0", "0", "0", "0", "0"];
		for (let i = 0; i < val.length; i++) {
			val[i] = parseInt(val[i], 2);
			if (val[i] < m.length)
				s[i] = m.charAt(val[i]);
		}
		await MBIT_BLE.write("CM" + s[0] + s[1] + s[2] + s[3] + s[4]);
	},
};
