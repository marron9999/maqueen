function device_display(e) {
	let v = "";
	for (let i = 0; i < 5; i++) {
		v += "<div>";
		for (let j = 0; j < 5; j++) {
			v += ' <span class=led0 onclick="device_led55(this)" id=led' + i + j + '></span>';
		}
		v += "</div>";
	}
	selector("#leds").innerHTML = v;
	device_matrix();
}

var _device_matrix;
function device_matrix(m) {
	if (m != undefined) _device_matrix = m;
	else _device_matrix = [
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],];
	for (let i = 0; i < 5; i++) {
		for (let j = 0; j < 5; j++) {
			let e = selector("#led" + i + j);
			e.className = (_device_matrix[i][j] > 0) ? "led1" : "led0";
		}
	}
}

var _device_anime = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4],
[1, 4],
[2, 4],
[3, 4],
[4, 4], [4, 3], [4, 2], [4, 1], [4, 0],
[3, 0],
[2, 0],
[1, 0], [1, 1], [1, 2], [1, 3],
[2, 3],
[3, 3], [3, 2], [3, 1],
[2, 1], [2, 2],
];
var _device_point1 = -1;
var _device_point2 = -1;
var _device_point3 = -1;
async function _device_plot(p, v) {
	let yx;
	if (0 <= p && p < _device_anime.length) {
		yx = "" + _device_anime[p][0] + _device_anime[p][1];
		let e = selector("#led" + yx);
		e.className = "led" + v;
		_device_matrix[_device_anime[p][0], _device_anime[p][1]] = v;
		if (v == 0) await MAQUEEN.post({ unplot: yx });
		else await MAQUEEN.post({ plot: yx });
	}
	await sleep(100);
}
async function device_plot() {
	await _device_plot(_device_point1, 0);
	_device_point1++;
	await _device_plot(_device_point1, 1);
	await _device_plot(_device_point2, 0);
	_device_point2++;
	await _device_plot(_device_point2, 1);
	await _device_plot(_device_point3, 0);
	_device_point3++;
	await _device_plot(_device_point3, 1);
	if (_device_point1 < _device_anime.length
		|| _device_point2 < _device_anime.length
		|| _device_point3 < _device_anime.length
	) {
		setTimeout(device_plot);
	}
}

async function device_led55(e) {
	let i = parseInt(e.id.charAt(3));
	let j = parseInt(e.id.charAt(4));
	if (e.className == "led0") {
		e.className = "led1";
		_device_matrix[i][j] = 1;
		await MAQUEEN.post({ plot: e.id.substr(3) });
	} else {
		e.className = "led0";
		_device_matrix[i][j] = 0;
		await MAQUEEN.post({ unplot: e.id.substr(3) });
	}
}

async function device_leds(val) {
	if (val == 0) {
		device_matrix();
		await MAQUEEN.post({ text: "" });
		return;
	}
	if (val == -1) {
		device_matrix();
		await MAQUEEN.post({ text: "" });
		let text = selector("#text").value;
		if (text.length > 0) {
			await MAQUEEN.post({ text: text });
		}
		return
	}
	if (val == 1) {
		device_matrix();
		await MAQUEEN.post({ text: "" });
		_device_point1 = -1;
		_device_point2 = -4;
		_device_point3 = -7;
		setTimeout(device_plot, 1);
		return;
	}
	if (val == 2) {
		device_matrix([
			[0, 1, 0, 1, 0],
			[0, 1, 0, 1, 0],
			[0, 0, 0, 0, 0],
			[1, 0, 0, 0, 1],
			[0, 1, 1, 1, 0],]);
	} else if (val == 3) {
		device_matrix([
			[0, 1, 0, 1, 0],
			[1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1],
			[0, 1, 1, 1, 0],
			[0, 0, 1, 0, 0],]);
	}

	val = [];
	for (let i = 0; i < 5; i++) {
		val[i] = "";
		for (let j = 0; j < 5; j++) {
			val[i] += _device_matrix[i][j];
		}
	}
	await MAQUEEN.post({ matrix: val });
}
