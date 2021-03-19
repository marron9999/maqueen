function device_maqueen() {
	var ee = ["button_forward", "button_backward",
		"button_turn1_left", "button_turn1_right",
		"button_turn2_left", "button_turn2_right",
		"button_turn3_left", "button_turn3_right",];
	for (let i = 0; i < ee.length; i++) {
		let e = selector("#" + ee[i]);
		e.addEventListener("mousedown", device_mousedown);
		e.addEventListener("mouseup", device_mouseup);
		e.addEventListener("touchstart", device_mousedown);
		e.addEventListener("touchend", device_mouseup);
	}
}

async function device_led(e) {
	e.style.background = "rgba(0,255,0,0.2)";
	if (e.id == "button_led_left") {
		await MAQUEEN.post({ led_left: (MAQUEEN._led_left) ? 0 : 1 });
	}
	if (e.id == "button_led_right") {
		await MAQUEEN.post({ led_right: (MAQUEEN._led_right) ? 0 : 1 });
	}
	setTimeout(function () {
		e.style.background = null;
	}, 500);
}

async function device_mouseup() {
	event.preventDefault();
	event.stopPropagation();
	if (MAQUEEN._auto > 0) {
		await MAQUEEN.auto(0);
	}
	let e = event.currentTarget;
	e.style.background = null;
	await MAQUEEN.post({ mortor: 0 });
}

async function device_mousedown() {
	event.preventDefault();
	event.stopPropagation();
	if (MAQUEEN._auto > 0) {
		await MAQUEEN.auto(0);
	}
	let e = event.currentTarget;
	e.style.background = "rgba(0,255,0,0.2)";
	if (e.id == "button_forward") {
		await MAQUEEN.post({ forward: true });
		return;
	}
	if (e.id == "button_turn1_right") {
		await MAQUEEN.post({ turn1_right: true });
		return;
	}
	if (e.id == "button_turn1_left") {
		await MAQUEEN.post({ turn1_left: true });
		return;
	}
	if (e.id == "button_turn2_right") {
		await MAQUEEN.post({ turn2_right: true });
		return;
	}
	if (e.id == "button_turn2_left") {
		await MAQUEEN.post({ turn2_left: true });
		return;
	}
	if (e.id == "button_turn3_right") {
		await MAQUEEN.post({ turn3_right: true });
		return;
	}
	if (e.id == "button_turn3_left") {
		await MAQUEEN.post({ turn3_left: true });
		return;
	}
	if (e.id == "button_backward") {
		await MAQUEEN.post({ backward: true });
		return;
	}
}
