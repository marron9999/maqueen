const PAGE_MARGIN = 10;
const PAGE_WIDTH = 320;
const PAGE_X1 = PAGE_MARGIN + PAGE_WIDTH + PAGE_MARGIN;
const PAGE_X2 = PAGE_MARGIN + PAGE_WIDTH * 2 + PAGE_MARGIN;
const PAGE_X3 = PAGE_MARGIN + PAGE_WIDTH * 3 + PAGE_MARGIN;
const PAGE_X4 = PAGE_MARGIN + PAGE_WIDTH * 4 + PAGE_MARGIN;
const PAGE_P1 = PAGE_MARGIN
const PAGE_P2 = PAGE_MARGIN - PAGE_WIDTH;
const PAGE_P3 = PAGE_MARGIN - PAGE_WIDTH * 2;
const PAGE_P4 = PAGE_MARGIN - PAGE_WIDTH * 3;

window.onload = function () {
	device_display();
	device_sound();
	device_maqueen();
	device_console();

	let img = selector("#logo1 > img");
	img.style.opacity = "0.4";

	let prev = selector("#prev > span");
	let cent = selector("#cent > span");
	let next = selector("#next > span");
	let page = selector("#page");
	let pages = selector("#pages");
	if (pages.clientWidth >= PAGE_X4) {
		prev.style.display = "none";
		cent.style.display = "none";
		next.style.display = "none";
		page.style.marginLeft = PAGE_P1 + "px";
	} else if (pages.clientWidth >= PAGE_X3) {
		prev.style.display = null;
		prev.className = "left";
		cent.style.display = "none";
		next.style.display = "none";
		page.style.marginLeft = PAGE_P2 + "px";
	} else if (pages.clientWidth >= PAGE_X2) {
		prev.style.display = "none";
		cent.style.display = null;
		cent.className = "left";
		next.style.display = "none";
		page.style.marginLeft = PAGE_P3 + "px";
	} else {
		prev.style.display = "none";
		cent.style.display = null;
		cent.className = "left";
		next.style.display = null;
		next.className = "right";
		page.style.marginLeft = PAGE_P3 + "px";
	}

	MAQUEEN.error = function (error) {
		device_log("Error: " + error);
	};
	MAQUEEN.log = function (text) {
		device_log(text);
	};

	MAQUEEN.mortor_left = function (val) {
		selector("#mortor_left").innerHTML = "" + val;
		selector("#mortor_left2").innerHTML = "" + val;
		selector("#img_tire_left1").style.visibility = (val > 0) ? "visible" : "hidden";
		selector("#img_tire_left2").style.visibility = (val < 0) ? "visible" : "hidden";
		device_maqueen_img();
	};
	MAQUEEN.mortor_right = function (val) {
		selector("#mortor_right").innerHTML = "" + val;
		selector("#mortor_right2").innerHTML = "" + val;
		selector("#img_tire_right1").style.visibility = (val > 0) ? "visible" : "hidden";
		selector("#img_tire_right2").style.visibility = (val < 0) ? "visible" : "hidden";
		device_maqueen_img();
	};
	MAQUEEN.mortor_speed = function (val) {
		selector("#mortor_speed").innerHTML = "" + val;
	};
	MAQUEEN.led_left = function (val) {
		selector("#led_left").style.background = (val > 0) ? "#f88" : "white";
		selector("#img_led_left1").style.visibility = (val > 0) ? "visible" : "hidden";
		selector("#img_led_left0").style.visibility = (val <= 0) ? "visible" : "hidden";
	};
	MAQUEEN.led_right = function (val) {
		selector("#led_right").style.background = (val > 0) ? "#f88" : "white";
		selector("#img_led_right1").style.visibility = (val > 0) ? "visible" : "hidden";
		selector("#img_led_right0").style.visibility = (val <= 0) ? "visible" : "hidden";
	};
	MAQUEEN.sensor_left = function (val) {
		setTimeout(function () {
			selector("#sensor_left").style.background = (val > 0) ? "white" : "black";
			selector("#sensor_left2").style.background = (val > 0) ? "white" : "black";
		}, 1);
	};
	MAQUEEN.sensor_right = function (val) {
		selector("#sensor_right").style.background = (val > 0) ? "white" : "black";
		selector("#sensor_right2").style.background = (val > 0) ? "white" : "black";
	};
	MAQUEEN.sonic = function (val) {
		selector("#sonic").innerHTML = "" + val;
		selector("#sonic2").innerHTML = "" + val;
	};

	MAQUEEN.sound = function (val) {
		selector("#plaing").innerHTML = (val == "S") ? " ♪" : "";
	};

	MAQUEEN.auto = function (val) {
		if (val > 0) {
			selector("#auto").innerHTML = "手動";
			selector("#page").className = "auto";
			return;
		}
		selector("#auto").innerHTML = "自動";
		selector("#page").className = "connect";
	};
	MAQUEEN.connect = async function (val) {
		let mbit = selector("#mbit");
		let ab = selector("#degit_ab");
		let logo = selector("#degit_logo");
		let img = selector("#logo1 > img");
		mbit.innerHTML = "micro:bit";
		logo.style.display = "none";
		logo.className = "";
		ab.innerHTML = ab.innerHTML.replace(/nowidth/g, "degit");
		ab.className = "";
		let play2 = selector("#play2");
		play2.style.display = "none";
		img.style.opacity = "0.4";
	    ab = document.querySelectorAll(".mbit1");
		for(let i=0; i<ab.length; i++) {
			ab[i].style.display = null;
		}
	    ab = document.querySelectorAll(".mbit2");
		for(let i=0; i<ab.length; i++) {
			ab[i].style.display = null;
		}
		if (val > 0) {
			await MAQUEEN.post({ ver: 1 });
			await MAQUEEN.post({ sensor: device_req_sensor() });
			await MAQUEEN.post({ sonic: device_req_sonic() });
			await MAQUEEN.post({ mode: device_req_mbit() });
			await MAQUEEN.post({ accele: device_req_accele() });
			await MAQUEEN.post({ force: device_req_force() });
			await MAQUEEN.post({ rotate: device_req_rotate() });
			selector("#conn").innerHTML = "切断";
			selector("#page").className = "connect";
			img.style.opacity = "1";
			if (MAQUEEN.mbit.length > 0) {
				let n = MAQUEEN.mbit;
				let p = n.indexOf("[");
				if(p > 0) n = n.substr(0, p).trim() + "<br>" + n.substr(p);
				mbit.innerHTML = n;
			}
			return;
		}
		device_log("切断されました");
		selector("#conn").innerHTML = "接続";
		selector("#page").className = "";
	};
	MAQUEEN.ver = function (val) {
		if (val >= "2") {
			let ab = selector("#degit_ab");
			let logo = selector("#degit_logo");
			let play2 = selector("#play2");
			logo.className = "degit";
			logo.style.display = "inline-block";
			ab.className = "degit";
			ab.innerHTML = ab.innerHTML.replace(/degit/g, "nowidth");
			play2.style.display = "inline";
		    ab = document.querySelectorAll(".mbit1");
			for(let i=0; i<ab.length; i++) {
				ab[i].style.display = "table-row";
			}
		    ab = document.querySelectorAll(".mbit2");
			for(let i=0; i<ab.length; i++) {
				ab[i].style.display = "block";
			}
		}
	};

	MAQUEEN.button_a = function (val) {
		selector("#button_a").style.background = (val > 0) ? "#0ff" : "white";
	};
	MAQUEEN.button_b = function (val) {
		selector("#button_b").style.background = (val > 0) ? "#0ff" : "white";
	};
	MAQUEEN.button_logo = function (val) {
		selector("#button_logo").style.background = (val > 0) ? "#0ff" : "white";
	};
	MAQUEEN.light_level = function (val) {
		selector("#light_level").innerHTML = "" + val;
	};
	MAQUEEN.temperature = function (val) {
		selector("#temperature").innerHTML = "" + val;
	};
	MAQUEEN.magnetic_force = function (val) {
		selector("#force_x").innerHTML = "" + val[0];
		selector("#force_y").innerHTML = "" + val[1];
		selector("#force_z").innerHTML = "" + val[2];
	};
	MAQUEEN.acceleration = function (val) {
		selector("#accele_x").innerHTML = "" + val[0];
		selector("#accele_y").innerHTML = "" + val[1];
		selector("#accele_z").innerHTML = "" + val[2];
	};
	MAQUEEN.rotation = function (val) {
		selector("#rotate_roll").innerHTML = "" + val[0];
		selector("#rotate_pitch").innerHTML = "" + val[1];
	};

	MAQUEEN.start();
	MAQUEEN.post({ mortor_speed: 0 });
};

function device_maqueen_img() {
	let m = selector("#maqueen-img");
	if(MAQUEEN._mortor_left < 0
	&& MAQUEEN._mortor_right < 0) {
		
		m.style.transform="rotate(0deg)";
		return;
	}
	if(MAQUEEN._mortor_left > 0
	&& MAQUEEN._mortor_right > 0) {
		m.style.transform="rotate(0deg)";
		return;
	}
	if(MAQUEEN._mortor_left < 0
	&& MAQUEEN._mortor_right > 0) {
		m.style.transform="rotate(-60deg)";
		return;
	}
	if(MAQUEEN._mortor_left > 0
	&& MAQUEEN._mortor_right < 0) {
		m.style.transform="rotate(60deg)";
		return;
	}
	if(MAQUEEN._mortor_left == 0
	&& MAQUEEN._mortor_right < 0) {
		m.style.transform="rotate(20deg)";
		return;
	}
	if(MAQUEEN._mortor_left == 0
	&& MAQUEEN._mortor_right > 0) {
		m.style.transform="rotate(-20deg)";
		return;
	}
	if(MAQUEEN._mortor_left > 0
	&& MAQUEEN._mortor_right == 0) {
		m.style.transform="rotate(20deg)";
		return;
	}
	if(MAQUEEN._mortor_left < 0
	&& MAQUEEN._mortor_right == 0) {
		m.style.transform="rotate(-20deg)";
		return;
	}
	m.style.transform="rotate(0deg)";
}

function device_prev() {
	let prev = selector("#prev > span");
	let pages = selector("#pages");
	if (pages.clientWidth >= PAGE_X4) return;
	device_shift.e = selector("#page");
	device_shift.v = parseInt(device_shift.e.style.marginLeft.replace("px", ""));
	device_shift.c = PAGE_WIDTH / 5;
	device_shift.a = 5;
	if (prev.style.display == "none") return;
	if (prev.className != "left")
		device_shift.a = 0 - device_shift.a;
	setTimeout(device_shift.s, 1);
}
function device_cent() {
	let cent = selector("#cent > span");
	let pages = selector("#pages");
	if (pages.clientWidth >= PAGE_X4) return;
	device_shift.e = selector("#page");
	device_shift.v = parseInt(device_shift.e.style.marginLeft.replace("px", ""));
	device_shift.c = PAGE_WIDTH / 5;
	device_shift.a = 5;
	if (cent.style.display == "none") return;
	if (cent.className != "left")
		device_shift.a = 0 - device_shift.a;
	setTimeout(device_shift.s, 1);
}
function device_next() {
	let next = selector("#next > span");
	let pages = selector("#pages");
	if (pages.clientWidth >= PAGE_X4) return;
	device_shift.e = selector("#page");
	device_shift.v = parseInt(device_shift.e.style.marginLeft.replace("px", ""));
	device_shift.c = PAGE_WIDTH / 5;
	device_shift.a = 5;
	if (next.style.display == "none") return;
	if (next.className != "left")
		device_shift.a = 0 - device_shift.a;
	setTimeout(device_shift.s, 1);
}
var device_shift = {
	e: null,
	v: 0,
	c: 0,
	a: 0,
	s: function() {
		device_shift.c--;
		device_shift.v += device_shift.a;
		device_shift.e.style.marginLeft = device_shift.v + "px";
		if (device_shift.c > 0) {
			setTimeout(device_shift.s, 1);
			return;
		}
		let prev = selector("#prev > span");
		let cent = selector("#cent > span");
		let next = selector("#next > span");
		let pages = selector("#pages");
		if (pages.clientWidth == PAGE_X1) {
			if (device_shift.v == PAGE_P1) {
				prev.style.display = null;
				prev.className = "right";
				return;
			}
			if (device_shift.v == PAGE_P2) {
				prev.style.display = null;
				prev.className = "left";
				cent.style.display = null;
				cent.className = "right";
				return;
			}
			if (device_shift.v == PAGE_P3) {
				cent.style.display = null;
				cent.className = "left";
				next.style.display = null;
				next.className = "right";
				return;
			}
			next.style.display = null;
			next.className = "left";
			return;
		}
		if (pages.clientWidth == PAGE_X2) {
			if (device_shift.v == PAGE_P1) {
				prev.style.display = "none";
				cent.style.display = null;
				cent.className = "right";
				return;
			}
			if (device_shift.v == PAGE_P2) {
				prev.style.display = null;
				prev.className = "left";
				cent.style.display = "none";
				next.style.display = null;
				next.className = "right";
				return;
			}
			cent.style.display = null;
			cent.className = "left";
			next.style.display = "none";
			return;
		}

		if (device_shift.v == PAGE_P1) {
			prev.style.display = "none";
			cent.style.display = "none";
			next.style.display = null;
			next.className = "right";
			return;
		}
		prev.style.display = null;
		prev.className = "left";
		cent.style.display = "none";
		next.style.display = "none";
	}
};

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
function time() {
	let date = new Date();
	let hour = "0" + date.getHours();
	let min = "0" + date.getMinutes();
	let sec = "0" + date.getSeconds();
	let msec = "000" + date.getMilliseconds();
	hour = hour.substring(hour.length - 2);
	min = min.substring(min.length - 2);
	sec = sec.substring(sec.length - 2);
	msec = msec.substring(msec.length - 3);
	return hour + ":" + min + ":" + sec + "." + msec;
}
function selector(val) {
	return document.querySelector(val);
}
