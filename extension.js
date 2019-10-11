/* -*- mode: js; js-basic-offset: 4; indent-tabs-mode: nil -*- */

const Clutter = imports.gi.Clutter;
const Meta = imports.gi.Meta;
const Shell = imports.gi.Shell;

const AltTab = imports.ui.altTab;
const Main = imports.ui.main;
const WindowManager = imports.ui.windowManager;

let injections = {
	'WindowSwitcherPopup': {},
	'AppSwitcherPopup': {}
};

function init(metadata) {
}

function mapVimKeys(cb) {
	return function(keysym, action) {
		switch(keysym) {
			case Clutter.KEY_h:
				keysym = Clutter.Left;
				break;
			case Clutter.KEY_l:
				keysym = Clutter.Right;
				break;
			case Clutter.KEY_k:
				keysym = Clutter.Up;
				break;
			case Clutter.KEY_j:
				keysym = Clutter.Down;
				break;
		}
		cb.call(this, keysym, action);
	}
}

function enable() {
	for (let switcherPopup in injections) {
		global.log(AltTab);
		global.log(switcherPopup);
		global.log(AltTab['WindowSwitcherPopup']);
		global.log(AltTab.WindowSwitcherPopup);
		injections[switcherPopup]['_keyPressHandler'] = AltTab[switcherPopup].prototype._keyPressHandler;
		AltTab[switcherPopup].prototype._keyPressHandler = mapVimKeys(injections[switcherPopup]['_keyPressHandler']);
	}
}

function disable() {
	for (let switcherPopup in injections) {
		for (let prop in switcherPopup )
			AltTab[switcherPopup].prototype[prop] = switcherPopup[prop];
	}
}
