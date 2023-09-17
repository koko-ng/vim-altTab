/* -*- mode: js; js-basic-offset: 4; indent-tabs-mode: nil -*- */

import Clutter from "gi://Clutter";

import * as AltTab from "resource:///org/gnome/shell/ui/altTab.js";

let injections = {
  WindowSwitcherPopup: {},
  AppSwitcherPopup: {},
};

function init(metadata) {}

function mapVimKeys(cb) {
  return function (keysym, action) {
    switch (keysym) {
      case Clutter.KEY_h:
        keysym = Clutter.Left || Clutter.KEY_Left;
        break;
      case Clutter.KEY_l:
        keysym = Clutter.Right || Clutter.KEY_Right;
        break;
      case Clutter.KEY_k:
        keysym = Clutter.Up || Clutter.KEY_Up;
        break;
      case Clutter.KEY_j:
        keysym = Clutter.Down || Clutter.KEY_Down;
        break;
    }
    cb.call(this, keysym, action);
  };
}

export default class VimAltTab {
  enable() {
    for (let switcherPopup in injections) {
      injections[switcherPopup]["_keyPressHandler"] =
        AltTab[switcherPopup].prototype._keyPressHandler;
      AltTab[switcherPopup].prototype._keyPressHandler = mapVimKeys(
        injections[switcherPopup]["_keyPressHandler"]
      );
    }
  }

  disable() {
    for (let switcherPopup in injections) {
      for (let prop in switcherPopup)
        AltTab[switcherPopup].prototype[prop] = switcherPopup[prop];
    }
  }
}
