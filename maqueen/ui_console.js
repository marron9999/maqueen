function device_console() {
	let ee = ["req_button", "req_temp", "req_light",
		"req_rotate", "req_force", "req_accele",
		"req_autoline", "req_autotone", "req_autoled",
		"req_sensor", "req_sonic", "req_debug",];
	for (let i = 0; i < ee.length; i++) {
		let e = selector("#" + ee[i]);
		e.addEventListener("change", device_checkbox);
	}
}

function device_cls() {
	selector("#log").innerHTML = "";
}

async function device_connect() {
	if (MAQUEEN._connect != 0) {
		await MAQUEEN.post({ init: true });
		await MAQUEEN.post({ connect: 0 });
		return;
	}
	selector("#log").innerHTML = "";
	await MAQUEEN.post({ connect: 1 });
}
async function device_auto() {
	if (MAQUEEN._auto != 0) {
		await MAQUEEN.post({ auto: 0 });
		return;
	}
	await MAQUEEN.post({ auto: device_req_auto() });
}

async function device_ope() {
	let text = selector("#ope").value;
	if (text.length > 0) {
		await MAQUEEN.post({ send: text });
	}
}

async function device_speed(val) {
	await MAQUEEN.post({ mortor_speed: val });
}

function device_log(text) {
	text = text.replace(/</g, "&lt;");
	text = text.replace(/>/g, "&gt;");
	let height = selector("#logx").clientHeight - 10;
	//if(MAQUEEN.trace) height *= 10;
	let element = selector("#log");
	let html = element.innerHTML;
	html += "<div>" /*+ time() + ": "*/ + text + "</div>";
	element.innerHTML = html;
	while (element.scrollHeight >= height) {
		let pos = html.indexOf("</div>");
		html = html.substring(pos + 1 + 1 + 3 + 1);
		element.innerHTML = html;
	}
}

async function device_checkbox() {
	let e = event.currentTarget;
	if (e.id == "req_debug") {
		MAQUEEN.trace = e.checked;
		return;
	}

	if (e.id == "req_button"
		|| e.id == "req_temp"
		|| e.id == "req_light"
	) {
		await MAQUEEN.post({ mode: device_req_mbit() });
		return;
	}
	if (e.id == "req_autoled"
		|| e.id == "req_autotone"
	) {
		if (MAQUEEN._auto > 0) {
			await MAQUEEN.post({ auto: device_req_auto() });
		}
		return;
	}
	if (e.id == "req_sensor") {
		await MAQUEEN.post({ sensor: device_req_sensor() });
		return;
	}
	if (e.id == "req_sonic") {
		await MAQUEEN.post({ sonic: device_req_sonic() });
		return;
	}
	if (e.id == "req_accele") {
		await MAQUEEN.post({ accele: device_req_accele() });
		return;
	}
	if (e.id == "req_force") {
		await MAQUEEN.post({ force: device_req_force() });
		return;
	}
	if (e.id == "req_rotate") {
		await MAQUEEN.post({ rotate: device_req_rotate() });
		return;
	}
}


function device_req_mbit() {
	// R	M	マスク	Micro:bit [NOTIFY要求] 1-ボタン、2-温度、4-明るさ
	let m = 0;
	m += (selector("#req_button").checked) ? 1 : 0;
	m += (selector("#req_temp").checked) ? 2 : 0;
	m += (selector("#req_light").checked) ? 4 : 0;
	return m;
}
function device_req_auto() {
	// R	A	マスク	Maqueen [自動モード=1] 2-黒ライン復帰、4-旋回時:点灯、8-旋回時:音鳴らす
	let m = 1;
	m += (selector("#req_autoline").checked) ? 2 : 0;
	m += (selector("#req_autoled").checked) ? 4 : 0;
	m += (selector("#req_autotone").checked) ? 8 : 0;
	return m;
}
function device_req_sensor() {
	// R	S	0/1	Maqueen	[NOTIFY要求] ラインセンサー
	let m = (selector("#req_sensor").checked) ? 1 : 0;
	return m;
}
function device_req_sonic() {
	// R	U	0/丸め値	Maqueen　[NOTIFY要求] 距離センサー
	let m = (selector("#req_sonic").checked) ? 10 : 0;
	return m;
}
function device_req_force() {
	// R	F	0/丸め値	Micro:bit [NOTIFY要求] 磁力計
	let m = (selector("#req_force").checked) ? 10 : 0;
	return m;
}
function device_req_accele() {
	// R	G	0/丸め値	Micro:bit [NOTIFY要求] 加速計
	let m = (selector("#req_accele").checked) ? 10 : 0;
	return m;
}
function device_req_rotate() {
	// R	R	0/丸め値	Micro:bit [NOTIFY要求] 回転計
	let m = (selector("#req_rotate").checked) ? 10 : 0;
	return m;
}
