var MAQUEEN = {
	trace: false,
	mbit: "",
	ver: function (log) { },
	error: function (error) { },
	log: function (log) { },

	//
	// Callback: Maqueen
	//
	sensor_left: function (val) { },
	sensor_right: function (val) { },
	mortor_left: function (val) { },
	mortor_right: function (val) { },
	mortor_speed: function (val) { },
	led_left: function (val) { },
	led_right: function (val) { },
	sonic: function (val) { },
	auto: function (val) { },
	connect: function (val) { },
	sound: function (val) { },

	//
	// Callback: Micro:bit
	//
	button_a: function (val) { },
	button_b: function (val) { },
	button_logo: function (val) { },
	light_level: function (val) { },
	temperature: function (val) { },
	magnetic_force: function (val) { },
	acceleration: function (val) { },
	rotation: function (val) { },

	_start: false,
	start: function () {
		if (!MAQUEEN._start) {
			MAQUEEN._start = true;
			NOTIFY.start();
			MBIT_MAQUEEN.notify = NOTIFY.notify;
			MBIT_MAQUEEN.trace = NOTIFY.trace;
			setTimeout(NOTIFY.reader, 100);
		}
	},
	post: async function (data) {
		if (data.connect != undefined) {
			if (data.connect == 0) {
				MBIT_MAQUEEN.disconnect();
				return;
			}
			NOTIFY.clear();
			if (MBIT_BLE._device != null) {
				MBIT_MAQUEEN.disconnect();
			}
			await MBIT_MAQUEEN.connect();
			return;
		}
		if (data.diconnect != undefined) {
			MBIT_MAQUEEN.disconnect();
			return;
		}
		let ope = [
			"auto", "forward", "backward",
			"turn1_left", "turn1_right",
			"turn2_left", "turn2_right",
			"turn3_left", "turn3_right",
			"mortor_left", "mortor_right", "mortor",
			"mortor_speed",
			"led_left", "led_right", "led",
			"sensor", "sonic", "mode",
			"accele", "force", "rotate",
			"accele_range",
			"sound", "sound8", "sound4", "sound2", "sound1",
			"express",
			"text", "plot", "unplot", "matrix",
			"send", "init", "ver",
		];
		for (let i = 0; i < ope.length; i++) {
			if (data[ope[i]] != undefined) {
				try {
					await MBIT_MAQUEEN[ope[i]](data[ope[i]]);
				} catch (e) {
					MBIT_MAQUEEN[ope[i]](data[ope[i]]);
				}
				break;
			}
		}
	},
};

var MAQUEEN_AUTO = {
	left: 0,
	right: 0,
	sensor: async function (val) {
		if (MAQUEEN_AUTO.left == 0
			&& MAQUEEN_AUTO.right == 0) {
			await MBIT_MAQUEEN.forward();
			return;
		}
		if (MAQUEEN_AUTO.left == 1
			&& MAQUEEN_AUTO.right == 0) {
			await MBIT_MAQUEEN.turn1_right();
			return;
		}
		if (MAQUEEN_AUTO.left == 0
			&& MAQUEEN_AUTO.right == 1) {
			await MBIT_MAQUEEN.turn1_left();
			return;
		}
	},

	parse: async function (data) {
		let vals = data.split(",");
		for (let i = 0; i < vals.length; i++) {
			let str = vals[i];
			let c0 = str.charAt(0);
			if (c0 == 'S') {
				// S	L	0/1	左ラインセンサーの値
				// S	R	0/1	左ラインセンサーの値
				// S	B	0/1	左と右ラインセンサーの値
				let c1 = str.charAt(1);
				let val = parseInt(str.substr(2));
				if (c1 == 'L') {
					MAQUEEN_AUTO.left = val;
					await MAQUEEN_AUTO.sensor();
					continue;
				}
				if (c1 == 'R') {
					MAQUEEN_AUTO.right = val;
					await MAQUEEN_AUTO.sensor();
					continue;
				}
				if (c1 == 'B') {
					MAQUEEN_AUTO.left = val;
					MAQUEEN_AUTO.right = val;
					await MAQUEEN_AUTO.sensor();
					continue;
				}
			}
		}
	},
};

var NOTIFY = {
	result: [],

	notify: function (data) {
		NOTIFY.result[NOTIFY.result.length] = data;
		if (MAQUEEN._auto > 0) {
			MAQUEEN_AUTO.parse(data);
		}
	},
	trace: function (data) {
		if (MAQUEEN.trace) {
			NOTIFY.result[NOTIFY.result.length] = data;
		}
	},
	clear: function (data) {
		NOTIFY.result = [];
	},

	start: function () {
		for (let name in MAQUEEN) {
			if (name == "log") continue;
			if (name == "error") continue;
			if (name == "trace") continue;
			if (name == "post") continue;
			if (name == "start") continue;
			if (name == "mbit") continue;
			if (name == "ver") continue;
			if (name == "sound") continue;
			if (name.charAt(0) != '_') {
				MAQUEEN["_" + name] = 0;
			}
		}
		MAQUEEN._mortor_speed = 60;
	},
	reader: function () {
		let _result = NOTIFY.result;
		NOTIFY.result = [];
		if (_result.length > 0) {
			for (let i = 0; i < _result.length; i++) {
				NOTIFY.parse(_result[i]);
			}
			setTimeout(NOTIFY.reader, 1);
			return;
		}
		setTimeout(NOTIFY.reader, 100);
	},
	parse: function (data) {
		//MAQUEEN.log(data);
		let c0 = data.charAt(0);
		if (c0 == '<') { MAQUEEN.log(data); return; }
		if (c0 == '>') { MAQUEEN.log(data); return; }
		let vals = data.split(",");
		for (let i = 0; i < vals.length; i++) {
			let str = vals[i];
			c0 = str.charAt(0);
			try {
				NOTIFY["parse_" + c0](str);
			} catch (e) {
				MAQUEEN.log("?: " + str);
			}
		}
	},

	HEX2DEC: function (val) {
		let d = parseInt(val, 16);
		if (d & 0x00008000) {
			d |= 0xffff0000;
		}
		return d;
	},
	HEX_ARRAY: function (val) {
		let v = [];
		if (val.length >= 4)
			v[0] = NOTIFY.HEX2DEC(val.substring(0, 4));
		if (val.length >= 8)
			v[1] = NOTIFY.HEX2DEC(val.substring(4, 8));
		if (val.length >= 12)
			v[2] = NOTIFY.HEX2DEC(val.substring(8, 12));
		return v;
	},

	// D	C	0/1 名前	接続
	// D	V	1/2		バージョン
	// D	A	0/マスク	自動
	// D	T	X		演奏終了
	// D	E	文字列	エラー
	// D	L	文字列	ログ
	parse_D: function (str) {
		let c1 = str.charAt(1);
		if (c1 == 'C') {
			let val = parseInt(str.charAt(2))
			MAQUEEN.mbit = str.substr(3).trim();
			if (MAQUEEN._connect != val) {
				MAQUEEN._connect = val;
				MAQUEEN.connect(val);
			}
			return;
		}
		if (c1 == 'V') {
			MAQUEEN.ver(str.substr(2));
			return;
		}
		if (c1 == 'A') {
			let val = parseInt(str.substr(2))
			MAQUEEN._auto = val;
			MAQUEEN.auto(val);
			return;
		}
		if (c1 == 'T') {
			MAQUEEN.sound(str.substr(2));
			return;
		}
		if (c1 == 'E') {
			MAQUEEN.error(str.substr(2));
			return;
		}
		if (c1 == 'L') {
			MAQUEEN.log(str.substr(2));
			return;
		}
		MAQUEEN.log("?: " + str);
	},

	// S	L	0/1	左ラインセンサーの値
	// S	R	0/1	左ラインセンサーの値
	// S	B	0/1	左と右ラインセンサーの値
	parse_S: function (str) {
		let c1 = str.charAt(1);
		let val = parseInt(str.substr(2));
		if (c1 == 'L') {
			MAQUEEN._sensor_left = val;
			MAQUEEN.sensor_left(val);
			return;
		}
		if (c1 == 'R') {
			MAQUEEN._sensor_right = val;
			MAQUEEN.sensor_right(val);
			return;
		}
		if (c1 == 'B') {
			MAQUEEN._sensor_left = val;
			MAQUEEN._sensor_right = val;
			MAQUEEN.sensor_left(val);
			MAQUEEN.sensor_right(val);
			return;
		}
		MAQUEEN.log("?: " + str);
	},

	// U	-	整数	距離センサーの丸め後の値
	parse_U: function (str) {
		let val = parseInt(str.substr(2));
		MAQUEEN._sonic = val;
		MAQUEEN.sonic(val);
	},

	// M	L	-255～255	左モーターの値
	// M	R	-255～255	右モーターの値
	// M	B	-255～255	左と右モーターの値
	// M	S	速度	速度(次の適用予定値)
	parse_M: function (str) {
		let c1 = str.charAt(1);
		let val = parseInt(str.substr(2));
		if (c1 == 'L') {
			MAQUEEN._mortor_left = val;
			MAQUEEN.mortor_left(val);
			return;
		}
		if (c1 == 'R') {
			MAQUEEN._mortor_right = val;
			MAQUEEN.mortor_right(val);
			return;
		}
		if (c1 == 'B') {
			MAQUEEN._mortor_left = val;
			MAQUEEN._mortor_right = val;
			MAQUEEN.mortor_left(val);
			MAQUEEN.mortor_right(val);
			return;
		}
		if (c1 == 'S') {
			MAQUEEN._mortor_speed = val;
			MAQUEEN.mortor_speed(val);
			return;
		}
		MAQUEEN.log("?: " + str);
	},

	// L	L	0/1	左LEDの値
	// L	R	0/1	右LEDの値
	// L	B	0/1	左と右LEDの値
	parse_L: function (str) {
		//WORKER.log("WORKER: " + str);
		let c1 = str.charAt(1);
		let val = parseInt(str.substr(2));
		if (c1 == 'L') {
			MAQUEEN._led_left = val;
			MAQUEEN.led_left(val);
			return;
		}
		if (c1 == 'R') {
			MAQUEEN._led_right = val;
			MAQUEEN.led_right(val);
			return;
		}
		if (c1 == 'B') {
			MAQUEEN._led_left = val;
			MAQUEEN._led_right = val;
			MAQUEEN.led_left(val);
			MAQUEEN.led_right(val);
			return;
		}
		MAQUEEN.log("?: " + str);
	},

	// B	A	0/1	ボタンAの状態
	// B	B	0/1	ボタンBの状態
	// B	L	0/1		ロゴの状態 (Micro:bit v2)
	parse_B: function (str) {
		//WORKER.log("WORKER: " + str);
		let c1 = str.charAt(1);
		let val = parseInt(str.substr(2));
		if (c1 == 'A') {
			MAQUEEN._button_a = val;
			MAQUEEN.button_a(val);
			return;
		}
		if (c1 == 'B') {
			MAQUEEN._button_b = val;
			MAQUEEN.button_b(val);
			return;
		}
		if (c1 == 'L') {
			MAQUEEN._button_logo = val;
			MAQUEEN.button_logo(val);
			return;
		}
		MAQUEEN.log("?: " + str);
	},

	// T	-	整数	温度の値
	parse_T: function (str) {
		let val = parseInt(str.substr(2));
		MAQUEEN._temperature = val;
		MAQUEEN.temperature(val);
	},

	// V	-	整数	明るさの値
	parse_V: function (str) {
		let val = parseInt(str.substr(2));
		MAQUEEN._light_level = val;
		MAQUEEN.light_level(val);
	},

	// F	-	HEX	磁力計の値:HEX4桁 X 3
	parse_F: function (str) {
		let val = NOTIFY.HEX_ARRAY(str.substr(2));
		MAQUEEN._magnetic_force = val;
		MAQUEEN.magnetic_force(val);
	},

	// G	-	HEX	加速計の値:HEX4桁 X 3
	parse_G: function (str) {
		let val = NOTIFY.HEX_ARRAY(str.substr(2));
		MAQUEEN._acceleration = val;
		MAQUEEN.acceleration(val);
	},

	// R	-	HEX	回転計の値:HEX4桁 X 2
	parse_R: function (str) {
		let val = NOTIFY.HEX_ARRAY(str.substr(2));
		MAQUEEN._rotation = val;
		MAQUEEN.rotation(val);
	},
};
