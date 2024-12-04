/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*******************!*\
  !*** ./script.ts ***!
  \*******************/


var _a, _b;
// const msg: string = "Hello!";
// alert(msg);
var stylesDictionary = {
  style0: 'style/style.css',
  style1: 'style/style1.css'
};
function changeStyle(styleKey) {
  var currentStyleLink = document.getElementById('current-style');
  var newStyleLink = stylesDictionary[styleKey];
  if (newStyleLink && currentStyleLink) {
    currentStyleLink.href = newStyleLink;
  }
}
(_a = document.getElementById('style1-link')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
  return changeStyle('style0');
});
(_b = document.getElementById('style2-link')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
  return changeStyle('style1');
});
/******/ })()
;