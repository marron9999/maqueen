function device_sound() {
	let v;
	let ee = ["", "", ""];
	let e2 = ["", "", ""];
	for (let j = 0; j < SOUND.label.length; j++) {
		for (let i = 0; i < SOUND.label[0].length; i++) {
			v = "<span class='key' onclick='device_key(this)' id="
				+ j + i + "><b>" + SOUND.label[j][i] + "</b></span>";
			if (SOUND.label[j][i].indexOf("#") >= 0) {
				e2[j] += v.replace("#", "");
			} else {
				if (SOUND.label[j][i].indexOf("ミ") >= 0
					//|| SOUND.label[j][i].indexOf("シ") >= 0
				) {
					e2[j] += "<span class='key null'> </span>";
				}
				ee[j] += v;
			}
		}
	}
	v = "<div><div class=key1>" + e2[2] + "</div><div class=key2>" + ee[2] + "</div></div>";
	v += "<div><div class=key1>" + e2[1] + "</div><div class=key2>" + ee[1] + "</div></div>";
	v += "<div><div class=key1>" + e2[0] + "</div><div class=key2>" + ee[0] + "</div></div>";
	selector("#key").innerHTML = v;

	v = "";
	for (n in SOUND) {
		if (n == "label") continue;
		if (n == "value") continue;
		if (n == "values") continue;
		v += ' <button class=push onclick="device_play(this)">' + n + '</button>';
	}
	v += "<span id=plaing></span>";
	v += "<span id=play2><br>";
	ee = ["giggle", "happy", "hello", "mysterious", "sad",
		"slide", "soaring", "spring", "twinkle", "yawn",];
	for (let i = 0; i < ee.length; i++) {
		v += ' <button class=push onclick="device_play2(this)">' + ee[i] + '</button>';
	}
	v += "</span>";
	selector("#play").innerHTML = v;
}

async function device_key(e) {
	e.style.background = "rgba(0,255,0,0.2)";
	var j = parseInt(e.id.charAt(0));
	var i = parseInt(e.id.substr(1));
	j = SOUND.value[j][i];
	await MAQUEEN.post({ sound: j });
	setTimeout(function () {
		e.style.background = null;
	}, 500);
}

async function device_play2(e) {
	e = e.innerHTML;
	await MAQUEEN.post({ express: e });
}

var _device_play = null;
function device_play(e) {
	e = e.innerHTML;
	_device_play = SOUND.values(SOUND[e]);
	_device_play.i = 0;
	_device_play.j = 0;
	selector("#plaing").innerHTML = "♪";
	setTimeout(device_play_, 1);
}
async function device_play_() {
	if (_device_play.i >= _device_play.val.length) {
		selector("#plaing").innerHTML = "";
		return;
	}
	if (_device_play.j >= _device_play.val[_device_play.i].length) {
		_device_play.j = 0;
		_device_play.i++;
		setTimeout(device_play_, 1);
		return;
	}
	let len = _device_play.len[_device_play.i][_device_play.j];
	let val = _device_play.val[_device_play.i][_device_play.j];
	let key = _device_play.key[_device_play.i][_device_play.j];
	if (len == 0) {
		_device_play.j++;
		setTimeout(device_play_, 1);
		return;
	}
	if (val == 0) {
		_device_play.j++;
		if (len == 2) {
			setTimeout(device_play_, parseInt(1000 / 8));
			return;
		}
		setTimeout(device_play_, parseInt(1000 / 4));
		return;
	}
	_device_play.j++;
	let e = document.getElementById("" + key);
	let f = function () { e.style.background = null; };
	if (e != undefined)
		e.style.background = "rgba(0,255,0,0.2)";
	if (len == 1) {
		await MAQUEEN.post({ sound: val });
		if (e != undefined) setTimeout(f, parseInt(1000 / 16));
		setTimeout(device_play_, parseInt(1000 / 16));
		return;
	}
	if (len == 2) {
		await MAQUEEN.post({ sound8: val });
		if (e != undefined) setTimeout(f, parseInt(1000 / 8));
		setTimeout(device_play_, parseInt(1000 / 8));
		return;
	}
	if (len == 8) {
		await MAQUEEN.post({ sound2: val });
		if (e != undefined) setTimeout(f, parseInt(1000 / 2));
		setTimeout(device_play_, parseInt(1000 / 2));
		return;
	}
	await MAQUEEN.post({ sound4: val });
	if (e != undefined) setTimeout(f, parseInt(1000 / 4));
	setTimeout(device_play_, parseInt(1000 / 4));
}
