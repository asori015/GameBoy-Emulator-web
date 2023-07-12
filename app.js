/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Machine: () => (/* binding */ Machine)
/* harmony export */ });
/* harmony import */ var _cpu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _gpu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _mmu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
/* harmony import */ var _timer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6);
/* harmony import */ var _keyboard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7);





var Machine = /** @class */ (function () {
    function Machine(m_file) {
        this.m_file = m_file;
        this.m_frame = new Array(160 * 144).fill(0);
        this.m_mmu = new _mmu__WEBPACK_IMPORTED_MODULE_2__.MMU(m_file);
        this.m_cpu = new _cpu__WEBPACK_IMPORTED_MODULE_0__.CPU(this.m_mmu);
        this.m_gpu = new _gpu__WEBPACK_IMPORTED_MODULE_1__.GPU(this.m_mmu, this.m_frame);
        this.m_timer = new _timer__WEBPACK_IMPORTED_MODULE_3__.Timer(this.m_mmu);
        this.m_keyboard = new _keyboard__WEBPACK_IMPORTED_MODULE_4__.Keyboard(this.m_mmu);
        this.m_inVBLANK = false;
        this.m_keyboard;
    }
    Machine.prototype.getFrame = function () {
        while (!this.m_mmu.m_isRomLoaded) {
            return this.m_frame;
        }
        while (this.m_mmu.read(0xFF44) >= 0x90 && this.m_inVBLANK) {
            this.m_cpu.step();
            this.m_gpu.step();
            this.m_timer.step();
            this.m_keyboard.step();
        }
        this.m_inVBLANK = false;
        while (this.m_mmu.read(0xFF44) < 0x90 && !this.m_inVBLANK) {
            this.m_cpu.step();
            this.m_gpu.step();
            this.m_timer.step();
            this.m_keyboard.step();
        }
        this.m_inVBLANK = true;
        return this.m_frame;
    };
    return Machine;
}());



/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CPU: () => (/* binding */ CPU)
/* harmony export */ });
var CPU = /** @class */ (function () {
    function CPU(m_mmu) {
        var _this = this;
        this.m_mmu = m_mmu;
        this.m_instructionMethods1 = [
            function () {
                return 4;
            },
            function () {
                _this.m_registers[_this.R.C] = _this.m_mmu.read(++_this.m_PC[0]);
                _this.m_registers[_this.R.B] = _this.m_mmu.read(++_this.m_PC[0]);
                return 12;
            },
            function () {
                _this.m_mmu.write(_this.getBC(), _this.m_registers[_this.R.A]);
                return 8;
            },
            function () {
                _this.setBC(_this.getBC() + 1);
                return 8;
            },
            function () {
                _this.m_registers[_this.R.B] += 1;
                _this.setZ(_this.m_registers[_this.R.B] == 0x00);
                _this.setH((_this.m_registers[_this.R.B] & 0x0F) == 0x00);
                _this.setN(false);
                return 4;
            },
            function () {
                _this.m_registers[_this.R.B] -= 1;
                _this.setZ(_this.m_registers[_this.R.B] == 0x00);
                _this.setH((_this.m_registers[_this.R.B] & 0x0F) == 0x0F);
                _this.setN(true);
                return 4;
            },
            function () {
                _this.m_registers[_this.R.B] = _this.m_mmu.read(++_this.m_PC[0]);
                return 8;
            },
            function () {
                _this.setC(_this.m_registers[_this.R.A] >= 128);
                _this.m_registers[_this.R.A] = ((_this.m_registers[_this.R.A] << 1) + Number(_this.getC())) & 0xFF;
                _this.setZ(false);
                _this.setH(false);
                _this.setN(false);
                return 4;
            },
            function () {
                var addr = _this.m_mmu.read(++_this.m_PC[0]) + (_this.m_mmu.read(++_this.m_PC[0]) << 8);
                _this.m_mmu.write(addr, _this.m_SP[0] & 0x00FF);
                _this.m_mmu.write(addr + 1, (_this.m_SP[0] & 0xFF00) >> 8);
                return 20;
            },
            function () {
                var rVal = _this.getHL();
                _this.setHL(_this.getHL() + _this.getBC());
                _this.setN(false);
                _this.setH((_this.getHL() & 0x0FFF) < (rVal & 0x0FFF));
                _this.setC(_this.getHL() < rVal);
                return 8;
            },
            function () {
                _this.m_registers[_this.R.A] = _this.m_mmu.read(_this.getBC());
                return 8;
            },
            function () {
                _this.setBC(_this.getBC() - 1);
                return 8;
            },
            function () {
                _this.m_registers[_this.R.C] += 1;
                _this.setZ(_this.m_registers[_this.R.C] == 0x00);
                _this.setH((_this.m_registers[_this.R.C] & 0x0F) == 0x00);
                _this.setN(false);
                return 4;
            },
            function () {
                _this.m_registers[_this.R.C] -= 1;
                _this.setZ(_this.m_registers[_this.R.C] == 0x00);
                _this.setH((_this.m_registers[_this.R.C] & 0x0F) == 0x0F);
                _this.setN(true);
                return 4;
            },
            function () {
                _this.m_registers[_this.R.C] = _this.m_mmu.read(++_this.m_PC[0]);
                return 8;
            },
            function () {
                _this.setC((_this.m_registers[_this.R.A] % 2) > 0);
                _this.m_registers[_this.R.A] = (_this.m_registers[_this.R.A] >> 1) + (Number(_this.getC()) << 7);
                _this.setZ(false);
                _this.setH(false);
                _this.setN(false);
                return 4;
            },
            this.STOP,
            function () {
                _this.m_registers[_this.R.E] = _this.m_mmu.read(++_this.m_PC[0]);
                _this.m_registers[_this.R.D] = _this.m_mmu.read(++_this.m_PC[0]);
                return 12;
            },
            function () {
                _this.m_mmu.write(_this.getDE(), _this.m_registers[_this.R.A]);
                return 8;
            },
            function () {
                _this.setDE(_this.getDE() + 1);
                return 8;
            },
            function () {
                _this.m_registers[_this.R.D] += 1;
                _this.setZ(_this.m_registers[_this.R.D] == 0x00);
                _this.setH((_this.m_registers[_this.R.D] & 0x0F) == 0x00);
                _this.setN(false);
                return 4;
            },
            function () {
                _this.m_registers[_this.R.D] -= 1;
                _this.setZ(_this.m_registers[_this.R.D] == 0x00);
                _this.setH((_this.m_registers[_this.R.D] & 0x0F) == 0x0F);
                _this.setN(true);
                return 4;
            },
            function () {
                _this.m_registers[_this.R.D] = _this.m_mmu.read(++_this.m_PC[0]);
                return 8;
            },
            this.RL,
            this.JR,
            function () {
                var rVal = _this.getHL();
                _this.setHL(_this.getHL() + _this.getDE());
                _this.setN(false);
                _this.setH((_this.getHL() & 0x0FFF) < (rVal & 0x0FFF));
                _this.setC(_this.getHL() < rVal);
                return 8;
            },
            function () {
                _this.m_registers[_this.R.A] = _this.m_mmu.read(_this.getDE());
                return 8;
            },
            function () {
                _this.setDE(_this.getDE() - 1);
                return 8;
            },
            function () {
                _this.m_registers[_this.R.E] += 1;
                _this.setZ(_this.m_registers[_this.R.E] == 0x00);
                _this.setH((_this.m_registers[_this.R.E] & 0x0F) == 0x00);
                _this.setN(false);
                return 4;
            },
            function () {
                _this.m_registers[_this.R.E] -= 1;
                _this.setZ(_this.m_registers[_this.R.E] == 0x00);
                _this.setH((_this.m_registers[_this.R.E] & 0x0F) == 0x0F);
                _this.setN(true);
                return 4;
            },
            function () {
                _this.m_registers[_this.R.E] = _this.m_mmu.read(++_this.m_PC[0]);
                return 8;
            },
            this.RR,
            this.JR,
            function () {
                _this.m_registers[_this.R.L] = _this.m_mmu.read(++_this.m_PC[0]);
                _this.m_registers[_this.R.H] = _this.m_mmu.read(++_this.m_PC[0]);
                return 12;
            },
            function () {
                _this.m_mmu.write(_this.getHL(), _this.m_registers[_this.R.A]);
                _this.setHL(_this.getHL() + 1);
                return 8;
            },
            function () {
                _this.setHL(_this.getHL() + 1);
                return 8;
            },
            function () {
                _this.m_registers[_this.R.H] += 1;
                _this.setZ(_this.m_registers[_this.R.H] == 0x00);
                _this.setH((_this.m_registers[_this.R.H] & 0x0F) == 0x00);
                _this.setN(false);
                return 4;
            },
            function () {
                _this.m_registers[_this.R.H] -= 1;
                _this.setZ(_this.m_registers[_this.R.H] == 0x00);
                _this.setH((_this.m_registers[_this.R.H] & 0x0F) == 0x0F);
                _this.setN(true);
                return 4;
            },
            function () {
                _this.m_registers[_this.R.H] = _this.m_mmu.read(++_this.m_PC[0]);
                return 8;
            },
            this.DAA,
            this.JR,
            function () {
                var rVal = _this.getHL();
                _this.setHL(_this.getHL() + _this.getHL());
                _this.setN(false);
                _this.setH((_this.getHL() & 0x0FFF) < (rVal & 0x0FFF));
                _this.setC(_this.getHL() < rVal);
                return 8;
            },
            function () {
                _this.m_registers[_this.R.A] = _this.m_mmu.read(_this.getHL());
                _this.setHL(_this.getHL() + 1);
                return 8;
            },
            function () {
                _this.setHL(_this.getHL() - 1);
                return 8;
            },
            function () {
                _this.m_registers[_this.R.L] += 1;
                _this.setZ(_this.m_registers[_this.R.L] == 0x00);
                _this.setH((_this.m_registers[_this.R.L] & 0x0F) == 0x00);
                _this.setN(false);
                return 4;
            },
            function () {
                _this.m_registers[_this.R.L] -= 1;
                _this.setZ(_this.m_registers[_this.R.L] == 0x00);
                _this.setH((_this.m_registers[_this.R.L] & 0x0F) == 0x0F);
                _this.setN(true);
                return 4;
            },
            function () {
                _this.m_registers[_this.R.L] = _this.m_mmu.read(++_this.m_PC[0]);
                return 8;
            },
            function () {
                _this.m_registers[_this.R.A] = 0xFF - _this.m_registers[_this.R.A];
                _this.setN(true);
                _this.setH(true);
                return 4;
            },
            this.JR,
            function () {
                _this.m_SP[0] = _this.m_mmu.read(++_this.m_PC[0]) + (_this.m_mmu.read(++_this.m_PC[0]) << 8);
                return 12;
            },
            function () {
                _this.m_mmu.write(_this.getHL(), _this.m_registers[_this.R.A]);
                _this.setHL(_this.getHL() - 1);
                return 8;
            },
            function () {
                _this.m_SP[0] += 1;
                return 8;
            },
            function () {
                _this.m_mmu.write(_this.getHL(), _this.m_mmu.read(_this.getHL()) + 1);
                _this.setZ(_this.m_mmu.read(_this.getHL()) == 0x00);
                _this.setH((_this.m_mmu.read(_this.getHL()) & 0x0F) == 0x00);
                _this.setN(false);
                return 12;
            },
            function () {
                _this.m_mmu.write(_this.getHL(), _this.m_mmu.read(_this.getHL()) - 1);
                _this.setZ(_this.m_mmu.read(_this.getHL()) == 0x00);
                _this.setH((_this.m_mmu.read(_this.getHL()) & 0x0F) == 0x0F);
                _this.setN(true);
                return 12;
            },
            function () {
                _this.m_mmu.write(_this.getHL(), _this.m_mmu.read(++_this.m_PC[0]));
                return 8;
            },
            function () {
                _this.setN(false);
                _this.setH(false);
                _this.setC(true);
                return 4;
            },
            this.JR,
            function () {
                var rVal = _this.getHL();
                _this.setHL(_this.getHL() + _this.m_SP[0]);
                _this.setN(false);
                _this.setH((_this.getHL() & 0x0FFF) < (rVal & 0x0FFF));
                _this.setC(_this.getHL() < rVal);
                return 8;
            },
            function () {
                _this.m_registers[_this.R.A] = _this.m_mmu.read(_this.getHL());
                _this.setHL(_this.getHL() - 1);
                return 8;
            },
            function () {
                _this.m_SP[0] -= 1;
                return 8;
            },
            function () {
                _this.m_registers[_this.R.A] += 1;
                _this.setZ(_this.m_registers[_this.R.A] == 0x00);
                _this.setH((_this.m_registers[_this.R.A] & 0x0F) == 0x00);
                _this.setN(false);
                return 4;
            },
            function () {
                _this.m_registers[_this.R.A] -= 1;
                _this.setZ(_this.m_registers[_this.R.A] == 0x00);
                _this.setH((_this.m_registers[_this.R.A] & 0x0F) == 0x0F);
                _this.setN(true);
                return 4;
            },
            function () {
                _this.m_registers[_this.R.A] = _this.m_mmu.read(++_this.m_PC[0]);
                return 8;
            },
            function () {
                _this.setN(false);
                _this.setH(false);
                _this.setC(!_this.getC());
                return 4;
            },
            function () {
                _this.m_registers[_this.R.B] = _this.m_registers[_this.R.B];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.B] = _this.m_registers[_this.R.C];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.B] = _this.m_registers[_this.R.D];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.B] = _this.m_registers[_this.R.E];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.B] = _this.m_registers[_this.R.H];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.B] = _this.m_registers[_this.R.L];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.B] = _this.m_mmu.read(_this.getHL());
                return 8;
            },
            function () {
                _this.m_registers[_this.R.B] = _this.m_registers[_this.R.A];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.C] = _this.m_registers[_this.R.B];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.C] = _this.m_registers[_this.R.C];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.C] = _this.m_registers[_this.R.D];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.C] = _this.m_registers[_this.R.E];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.C] = _this.m_registers[_this.R.H];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.C] = _this.m_registers[_this.R.L];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.C] = _this.m_mmu.read(_this.getHL());
                return 8;
            },
            function () {
                _this.m_registers[_this.R.C] = _this.m_registers[_this.R.A];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.D] = _this.m_registers[_this.R.B];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.D] = _this.m_registers[_this.R.C];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.D] = _this.m_registers[_this.R.D];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.D] = _this.m_registers[_this.R.E];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.D] = _this.m_registers[_this.R.H];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.D] = _this.m_registers[_this.R.L];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.D] = _this.m_mmu.read(_this.getHL());
                return 8;
            },
            function () {
                _this.m_registers[_this.R.D] = _this.m_registers[_this.R.A];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.E] = _this.m_registers[_this.R.B];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.E] = _this.m_registers[_this.R.C];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.E] = _this.m_registers[_this.R.D];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.E] = _this.m_registers[_this.R.E];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.E] = _this.m_registers[_this.R.H];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.E] = _this.m_registers[_this.R.L];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.E] = _this.m_mmu.read(_this.getHL());
                return 8;
            },
            function () {
                _this.m_registers[_this.R.E] = _this.m_registers[_this.R.A];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.H] = _this.m_registers[_this.R.B];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.H] = _this.m_registers[_this.R.C];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.H] = _this.m_registers[_this.R.D];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.H] = _this.m_registers[_this.R.E];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.H] = _this.m_registers[_this.R.H];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.H] = _this.m_registers[_this.R.L];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.H] = _this.m_mmu.read(_this.getHL());
                return 8;
            },
            function () {
                _this.m_registers[_this.R.H] = _this.m_registers[_this.R.A];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.L] = _this.m_registers[_this.R.B];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.L] = _this.m_registers[_this.R.C];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.L] = _this.m_registers[_this.R.D];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.L] = _this.m_registers[_this.R.E];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.L] = _this.m_registers[_this.R.H];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.L] = _this.m_registers[_this.R.L];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.L] = _this.m_mmu.read(_this.getHL());
                return 8;
            },
            function () {
                _this.m_registers[_this.R.L] = _this.m_registers[_this.R.A];
                return 4;
            },
            function () {
                _this.m_mmu.write(_this.getHL(), _this.m_registers[_this.R.B]);
                return 8;
            },
            function () {
                _this.m_mmu.write(_this.getHL(), _this.m_registers[_this.R.C]);
                return 8;
            },
            function () {
                _this.m_mmu.write(_this.getHL(), _this.m_registers[_this.R.D]);
                return 8;
            },
            function () {
                _this.m_mmu.write(_this.getHL(), _this.m_registers[_this.R.E]);
                return 8;
            },
            function () {
                _this.m_mmu.write(_this.getHL(), _this.m_registers[_this.R.H]);
                return 8;
            },
            function () {
                _this.m_mmu.write(_this.getHL(), _this.m_registers[_this.R.L]);
                return 8;
            },
            function () {
                _this.m_isHalted = true;
                return 4;
            },
            function () {
                _this.m_mmu.write(_this.getHL(), _this.m_registers[_this.R.A]);
                return 8;
            },
            function () {
                _this.m_registers[_this.R.A] = _this.m_registers[_this.R.B];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.A] = _this.m_registers[_this.R.C];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.A] = _this.m_registers[_this.R.D];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.A] = _this.m_registers[_this.R.E];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.A] = _this.m_registers[_this.R.H];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.A] = _this.m_registers[_this.R.L];
                return 4;
            },
            function () {
                _this.m_registers[_this.R.A] = _this.m_mmu.read(_this.getHL());
                return 8;
            },
            function () {
                _this.m_registers[_this.R.A] = _this.m_registers[_this.R.A];
                return 4;
            },
            this.ADD,
            this.ADD,
            this.ADD,
            this.ADD,
            this.ADD,
            this.ADD,
            this.ADD,
            this.ADD,
            this.ADD,
            this.ADD,
            this.ADD,
            this.ADD,
            this.ADD,
            this.ADD,
            this.ADD,
            this.ADD,
            this.SUB,
            this.SUB,
            this.SUB,
            this.SUB,
            this.SUB,
            this.SUB,
            this.SUB,
            this.SUB,
            this.SUB,
            this.SUB,
            this.SUB,
            this.SUB,
            this.SUB,
            this.SUB,
            this.SUB,
            this.SUB,
            this.AND,
            this.AND,
            this.AND,
            this.AND,
            this.AND,
            this.AND,
            this.AND,
            this.AND,
            this.XOR,
            this.XOR,
            this.XOR,
            this.XOR,
            this.XOR,
            this.XOR,
            this.XOR,
            this.XOR,
            this.OR,
            this.OR,
            this.OR,
            this.OR,
            this.OR,
            this.OR,
            this.OR,
            this.OR,
            this.CP,
            this.CP,
            this.CP,
            this.CP,
            this.CP,
            this.CP,
            this.CP,
            this.CP,
            this.RET,
            function () {
                _this.m_registers[_this.R.C] = _this.m_mmu.read(_this.m_SP[0]++);
                _this.m_registers[_this.R.B] = _this.m_mmu.read(_this.m_SP[0]++);
                return 12;
            },
            this.JP,
            this.JP,
            this.CALL,
            function () {
                _this.m_mmu.write(--_this.m_SP[0], _this.m_registers[_this.R.B]);
                _this.m_mmu.write(--_this.m_SP[0], _this.m_registers[_this.R.C]);
                return 16;
            },
            this.ADD,
            this.RST,
            this.RET,
            this.RET,
            this.JP,
            function () {
                _this.m_cbPrefix = true;
                var x = _this.m_instructionMethods2[_this.m_mmu.read(++_this.m_PC[0])].call(_this);
                _this.m_cbPrefix = false;
                return x;
            },
            this.CALL,
            this.CALL,
            this.ADD,
            this.RST,
            this.RET,
            function () {
                _this.m_registers[_this.R.E] = _this.m_mmu.read(_this.m_SP[0]++);
                _this.m_registers[_this.R.D] = _this.m_mmu.read(_this.m_SP[0]++);
                return 12;
            },
            this.JP,
            this.opcode00,
            this.CALL,
            function () {
                _this.m_mmu.write(--_this.m_SP[0], _this.m_registers[_this.R.D]);
                _this.m_mmu.write(--_this.m_SP[0], _this.m_registers[_this.R.E]);
                return 16;
            },
            this.SUB,
            this.RST,
            this.RET,
            this.RET,
            this.JP,
            this.opcode00,
            this.CALL,
            this.opcode00,
            this.SUB,
            this.RST,
            function () {
                _this.m_mmu.write(0xFF00 + _this.m_mmu.read(++_this.m_PC[0]), _this.m_registers[_this.R.A]);
                return 12;
            },
            function () {
                _this.m_registers[_this.R.L] = _this.m_mmu.read(_this.m_SP[0]++);
                _this.m_registers[_this.R.H] = _this.m_mmu.read(_this.m_SP[0]++);
                return 12;
            },
            function () {
                _this.m_mmu.write(0xFF00 + _this.m_registers[_this.R.C], _this.m_registers[_this.R.A]);
                return 8;
            },
            this.opcode00,
            this.opcode00,
            function () {
                _this.m_mmu.write(--_this.m_SP[0], _this.m_registers[_this.R.H]);
                _this.m_mmu.write(--_this.m_SP[0], _this.m_registers[_this.R.L]);
                return 16;
            },
            this.AND,
            this.RST,
            function () {
                var nVal = _this.m_mmu.read(++_this.m_PC[0]) << 24 >> 24;
                var rVal = _this.m_SP[0];
                _this.m_SP[0] += nVal;
                _this.setZ(false);
                _this.setN(false);
                _this.setH(((_this.m_SP[0] ^ rVal ^ nVal) & 0x0010) == 0x0010);
                _this.setC(((_this.m_SP[0] ^ rVal ^ nVal) & 0x0100) == 0x0100);
                return 16;
            },
            this.JP,
            function () {
                _this.m_mmu.write(_this.m_mmu.read(++_this.m_PC[0]) + (_this.m_mmu.read(++_this.m_PC[0]) << 8), _this.m_registers[_this.R.A]);
                return 16;
            },
            this.opcode00,
            this.opcode00,
            this.opcode00,
            this.XOR,
            this.RST,
            function () {
                _this.m_registers[_this.R.A] = _this.m_mmu.read(0xFF00 + _this.m_mmu.read(++_this.m_PC[0]));
                return 12;
            },
            function () {
                _this.m_registers[_this.R.F] = _this.m_mmu.read(_this.m_SP[0]++) & 0xF0;
                _this.m_registers[_this.R.A] = _this.m_mmu.read(_this.m_SP[0]++);
                return 12;
            },
            function () {
                _this.m_registers[_this.R.A] = _this.m_mmu.read(0xFF00 + _this.m_registers[_this.R.C]);
                return 8;
            },
            function () {
                _this.IME = false;
                return 4;
            },
            this.opcode00,
            function () {
                _this.m_mmu.write(--_this.m_SP[0], _this.m_registers[_this.R.A]);
                _this.m_mmu.write(--_this.m_SP[0], _this.m_registers[_this.R.F]);
                return 16;
            },
            this.OR,
            this.RST,
            function () {
                var val = (_this.m_mmu.read(++_this.m_PC[0]) << 24 >> 24);
                _this.setHL(_this.m_SP[0] + val);
                _this.setZ(false);
                _this.setN(false);
                _this.setH(((_this.m_SP[0] ^ _this.getHL() ^ val) & 0x0010) == 0x0010);
                _this.setC(((_this.m_SP[0] ^ _this.getHL() ^ val) & 0x0100) == 0x0100);
                return 12;
            },
            function () {
                _this.m_SP[0] = _this.getHL();
                return 8;
            },
            function () {
                _this.m_registers[_this.R.A] = _this.m_mmu.read(_this.m_mmu.read(++_this.m_PC[0]) + (_this.m_mmu.read(++_this.m_PC[0]) << 8));
                return 16;
            },
            function () {
                _this.IME = true;
                return 4;
            },
            this.opcode00,
            this.opcode00,
            this.CP,
            this.RST
        ];
        this.m_instructionMethods2 = [
            this.RLC,
            this.RLC,
            this.RLC,
            this.RLC,
            this.RLC,
            this.RLC,
            this.RLC,
            this.RLC,
            this.RRC,
            this.RRC,
            this.RRC,
            this.RRC,
            this.RRC,
            this.RRC,
            this.RRC,
            this.RRC,
            this.RL,
            this.RL,
            this.RL,
            this.RL,
            this.RL,
            this.RL,
            this.RL,
            this.RL,
            this.RR,
            this.RR,
            this.RR,
            this.RR,
            this.RR,
            this.RR,
            this.RR,
            this.RR,
            this.SLA,
            this.SLA,
            this.SLA,
            this.SLA,
            this.SLA,
            this.SLA,
            this.SLA,
            this.SLA,
            this.SRA,
            this.SRA,
            this.SRA,
            this.SRA,
            this.SRA,
            this.SRA,
            this.SRA,
            this.SRA,
            this.SWAP,
            this.SWAP,
            this.SWAP,
            this.SWAP,
            this.SWAP,
            this.SWAP,
            this.SWAP,
            this.SWAP,
            this.SRL,
            this.SRL,
            this.SRL,
            this.SRL,
            this.SRL,
            this.SRL,
            this.SRL,
            this.SRL,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.BIT,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.RES,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET,
            this.SET
        ];
        this.IF = 0xFF0F;
        this.IE = 0xFFFF;
        this.R = {
            A: 7,
            B: 0,
            C: 1,
            D: 2,
            E: 3,
            F: 6,
            H: 4,
            L: 5
        };
        this.debug = false;
        this.counter = 1;
        this.m_BIOSMapped = true;
        this.m_PC = new Uint16Array([0]);
        this.m_SP = new Uint16Array([0]);
        this.m_clock = 0;
        this.m_sysClock = 0;
        this.m_registers = new Uint8Array(8);
        this.IME = false;
        this.m_cbPrefix = false;
        this.m_isHalted = false;
    }
    CPU.prototype.step = function () {
        // If an interrupt is pending, turn off halt mode
        if (this.m_mmu.read(this.IE) & this.m_mmu.read(this.IF)) {
            this.m_isHalted = false;
        }
        if (!this.m_isHalted) {
            if (this.m_clock == 0) {
                if (!this.checkForInterupts()) {
                    this.execute(this.m_mmu.read(this.m_PC[0]));
                }
            }
            this.m_clock -= 1;
        }
    };
    CPU.prototype.checkForInterupts = function () {
        if (!this.IME) {
            return false;
        }
        var mask = 0x01;
        for (var i = 0; i < 5; i++) {
            if ((this.m_mmu.read(this.IF) & this.m_mmu.read(this.IE) & mask) == 0x00) {
                mask = mask << 1;
                continue;
            }
            this.IME = false;
            this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) & (0xFF - mask));
            this.m_mmu.write(--this.m_SP[0], this.m_PC[0] >> 8);
            this.m_mmu.write(--this.m_SP[0], this.m_PC[0] & 0x00FF);
            this.m_PC[0] = 0x0040 + (i * 8);
            this.m_clock = 4;
            return true;
        }
        return false;
    };
    CPU.prototype.execute = function (instruction) {
        if (this.m_PC[0] == 0x01DB) {
            this.debug = true;
        }
        if (this.m_mmu.read(0xFF44) == 140) {
            if (this.counter == 0) {
                this.debug = false;
            }
            this.counter -= 1;
        }
        if (this.debug) {
            // console.log('PC: 0x' + this.m_PC[0]!.toString(16))
            // console.log('inst: 0x' + instruction.toString(16))
            // console.log("A:" + this.m_registers[this.R.A]!.toString(16) + " F:" + this.m_registers[this.R.F]!.toString(16))
            // console.log("B:" + this.m_registers[this.R.B]!.toString(16) + " C:" + this.m_registers[this.R.C]!.toString(16))
            // console.log("D:" + this.m_registers[this.R.D]!.toString(16) + " E:" + this.m_registers[this.R.E]!.toString(16))
            // console.log("H:" + this.m_registers[this.R.H]!.toString(16) + " L:" + this.m_registers[this.R.L]!.toString(16))
            // console.log('SP: 0x' + this.m_SP[0]!.toString(16));
            // console.log('')
            // console.log(this.m_mmu.read(0xFF44).toString(16))
            // console.log(this.m_mmu.read(0xFF45).toString(16))
            //this.counter -= 1;
        }
        this.m_clock = this.m_instructionMethods1[instruction].call(this);
        this.m_PC[0] += 1;
    };
    CPU.prototype.JP = function () {
        var instruction = this.m_mmu.read(this.m_PC[0]);
        var reg1 = (instruction & 56) >> 3;
        var reg2 = instruction & 7;
        if (reg2 == 0x01) {
            this.m_PC[0] = (this.getHL() - 1) & 0xFFFF;
            return 4;
        }
        else {
            var lVal = this.m_mmu.read(++this.m_PC[0]);
            var hVal = this.m_mmu.read(++this.m_PC[0]);
            if (reg2 == 0x02) {
                switch (reg1) {
                    case 0x00:
                        if (this.getZ()) {
                            return 12;
                        }
                        break;
                    case 0x01:
                        if (!this.getZ()) {
                            return 12;
                        }
                        break;
                    case 0x02:
                        if (this.getC()) {
                            return 12;
                        }
                        break;
                    case 0x03:
                        if (!this.getC()) {
                            return 12;
                        }
                        break;
                    default:
                        break;
                }
            }
            this.m_PC[0] = ((hVal << 8) + lVal - 1) & 0xFFFF;
            ;
            return 16;
        }
    };
    CPU.prototype.JR = function () {
        var instruction = this.m_mmu.read(this.m_PC[0]);
        var reg1 = (instruction & 56) >> 3;
        var nVal = this.m_mmu.read(++this.m_PC[0]);
        if (reg1 != 0x03) {
            switch (reg1) {
                case 0x04:
                    if (this.getZ()) {
                        return 8;
                    }
                    break;
                case 0x05:
                    if (!this.getZ()) {
                        return 8;
                    }
                    break;
                case 0x06:
                    if (this.getC()) {
                        return 8;
                    }
                    break;
                case 0x07:
                    if (!this.getC()) {
                        return 8;
                    }
                    break;
                default:
                    break;
            }
        }
        this.m_PC[0] += (nVal << 24 >> 24);
        return 12;
    };
    CPU.prototype.ADD = function () {
        var rVal = this.m_registers[this.R.A];
        var nVal = 0;
        var carry = 0;
        var instruction = this.m_mmu.read(this.m_PC[0]);
        var op = (instruction & 192) >> 6;
        var reg1 = (instruction & 56) >> 3;
        var reg2 = instruction & 7;
        // Check if carry bit will be used
        if (reg1 == 0x01) {
            carry = Number(this.getC());
        }
        // Get the value being used for the calculation with Register A
        if (op == 0x03) {
            nVal = this.m_mmu.read(++this.m_PC[0]);
            this.m_clock = 8;
        }
        else {
            if (reg2 == 0x06) {
                nVal = this.m_mmu.read(this.getHL());
                this.m_clock = 8;
            }
            else {
                nVal = this.m_registers[reg2];
                this.m_clock = 4;
            }
        }
        // Perform addition to A register
        this.m_registers[this.R.A] = (rVal + nVal + carry) & 0xFF;
        // Calculate if Zero flag needs to be set
        this.setZ(this.m_registers[this.R.A] == 0);
        // Set N flag to 0
        this.setN(false);
        // Calculate if Half-Carry flag needs to be set
        this.setH(((rVal & 0x0F) + (nVal & 0x0F) + carry) > 0x0F);
        // Calculate if Full-Carry flag needs to be set
        this.setC((rVal + nVal + carry) > 0xFF);
        return 4;
    };
    CPU.prototype.SUB = function () {
        var rVal = this.m_registers[this.R.A];
        var nVal = 0;
        var carry = 0;
        var instruction = this.m_mmu.read(this.m_PC[0]);
        var op = (instruction & 192) >> 6;
        var reg1 = (instruction & 56) >> 3;
        var reg2 = instruction & 7;
        if (reg1 == 0x03) {
            carry = Number(this.getC());
        }
        if (op == 0x03) {
            nVal = this.m_mmu.read(++this.m_PC[0]);
            this.m_clock = 8;
        }
        else {
            if (reg2 == 0x06) {
                nVal = this.m_mmu.read(this.getHL());
                this.m_clock = 8;
            }
            else {
                nVal = this.m_registers[reg2];
                this.m_clock = 4;
            }
        }
        // Calculate if Half-Carry flag needs to be set
        this.setH((rVal & 0x0F) < (nVal & 0x0F) + carry);
        // Perform subtraction to A register
        this.m_registers[this.R.A] = (rVal - nVal - carry) & 0xFF;
        // Calculate if Full-Carry flag needs to be set
        this.setC(nVal + carry > rVal);
        // Calculate if Zero flag needs to be set
        this.setZ(this.m_registers[this.R.A] == 0);
        // Set N flag to 1
        this.setN(true);
        return 4;
    };
    CPU.prototype.AND = function () {
        var instruction = this.m_mmu.read(this.m_PC[0]);
        var op = (instruction & 192) >> 6;
        var reg2 = instruction & 7;
        if (op == 0x03) {
            this.m_registers[this.R.A] &= this.m_mmu.read(++this.m_PC[0]);
            this.m_clock = 8;
        }
        else {
            if (reg2 == 0x06) {
                this.m_registers[this.R.A] &= this.m_mmu.read(this.getHL());
                this.m_clock = 8;
            }
            else {
                this.m_registers[this.R.A] &= this.m_registers[reg2];
                this.m_clock = 4;
            }
        }
        // Calculate if Zero flag needs to be set
        this.setZ(this.m_registers[this.R.A] == 0);
        // Set C and N flags to 0, H flag to 1
        this.setC(false);
        this.setH(true);
        this.setN(false);
        return 4;
    };
    CPU.prototype.XOR = function () {
        var instruction = this.m_mmu.read(this.m_PC[0]);
        var op = (instruction & 192) >> 6;
        var reg2 = instruction & 7;
        if (op == 0x03) {
            this.m_registers[this.R.A] ^= this.m_mmu.read(++this.m_PC[0]);
            this.m_clock = 8;
        }
        else {
            if (reg2 == 0x06) {
                this.m_registers[this.R.A] ^= this.m_mmu.read(this.getHL());
                this.m_clock = 8;
            }
            else {
                this.m_registers[this.R.A] ^= this.m_registers[reg2];
                this.m_clock = 4;
            }
        }
        // Calculate if Zero flag needs to be set
        this.setZ(this.m_registers[this.R.A] == 0);
        // Set C, H, and N flags to 0
        this.setC(false);
        this.setH(false);
        this.setN(false);
        return 4;
    };
    CPU.prototype.OR = function () {
        var instruction = this.m_mmu.read(this.m_PC[0]);
        var op = (instruction & 192) >> 6;
        var reg2 = instruction & 7;
        if (op == 0x03) {
            this.m_registers[this.R.A] |= this.m_mmu.read(++this.m_PC[0]);
            this.m_clock = 8;
        }
        else {
            if (reg2 == 0x06) {
                this.m_registers[this.R.A] |= this.m_mmu.read(this.getHL());
                this.m_clock = 8;
            }
            else {
                this.m_registers[this.R.A] |= this.m_registers[reg2];
                this.m_clock = 4;
            }
        }
        // Calculate if Zero flag needs to be set
        this.setZ(this.m_registers[this.R.A] == 0);
        // Set C, H, and N flags to 0
        this.setC(false);
        this.setH(false);
        this.setN(false);
        return 4;
    };
    CPU.prototype.CP = function () {
        var rVal = this.m_registers[this.R.A];
        var nVal = 0;
        var instruction = this.m_mmu.read(this.m_PC[0]);
        var op = (instruction & 192) >> 6;
        var reg2 = instruction & 7;
        if (op == 0x03) {
            nVal = this.m_mmu.read(++this.m_PC[0]);
            this.m_clock = 8;
        }
        else {
            if (reg2 == 0x06) {
                nVal = this.m_mmu.read(this.getHL());
                this.m_clock = 8;
            }
            else {
                nVal = this.m_registers[reg2];
                this.m_clock = 4;
            }
        }
        // Calculate if Half-Carry flag needs to be set
        this.setH(((rVal - nVal) & 0x0F) > (rVal & 0x0F));
        // Calculate if Full-Carry flag needs to be set
        this.setC(nVal > rVal);
        // Calculate if Zero flag needs to be set
        this.setZ(nVal == rVal);
        // Set N flag to 1
        this.setN(true);
        return 4;
    };
    CPU.prototype.RLC = function () {
        var instruction = this.m_mmu.read(this.m_PC[0]);
        var reg2 = instruction & 7;
        if (reg2 == 0x06) {
            var rVal = this.m_mmu.read(this.getHL());
            // Calculate if Carry flag needs to be set
            this.setC(rVal >= 128);
            this.m_mmu.write(this.getHL(), ((rVal << 1) + Number(this.getC())) & 0xFF);
            // Calculate if Zero flag needs to be set
            this.setZ(this.m_mmu.read(this.getHL()) == 0x00);
            this.m_clock = 16;
        }
        else {
            var rVal = this.m_registers[reg2];
            // Calculate if Carry flag needs to be set
            this.setC(rVal >= 128);
            this.m_registers[reg2] = ((rVal << 1) + Number(this.getC())) & 0xFF;
            // Calculate if Zero flag needs to be set
            if (this.m_cbPrefix) {
                this.setZ(this.m_registers[reg2] == 0);
                this.m_clock = 8;
            }
            else {
                this.setZ(false);
                this.m_clock = 4;
            }
        }
        // Set H and N flags to 0
        this.setH(false);
        this.setN(false);
        return 8;
    };
    CPU.prototype.RRC = function () {
        var instruction = this.m_mmu.read(this.m_PC[0]);
        var reg2 = instruction & 7;
        if (reg2 == 0x06) {
            var rVal = this.m_mmu.read(this.getHL());
            // Calculate if Carry flag needs to be set
            this.setC((rVal % 2) > 0);
            this.m_mmu.write(this.getHL(), (rVal >> 1) + (Number(this.getC()) << 7));
            // Calculate if Zero flag needs to be set
            this.setZ(this.m_mmu.read(this.getHL()) == 0x00);
            this.m_clock = 16;
        }
        else {
            var rVal = this.m_registers[reg2];
            // Calculate if Carry flag needs to be set
            this.setC((rVal % 2) > 0);
            this.m_registers[reg2] = (rVal >> 1) + (Number(this.getC()) << 7);
            // Calculate if Zero flag needs to be set
            if (this.m_cbPrefix) {
                this.setZ(this.m_registers[reg2] == 0);
                this.m_clock = 8;
            }
            else {
                this.setZ(false);
                this.m_clock = 4;
            }
        }
        // Set H and N flags to 0
        this.setH(false);
        this.setN(false);
        return 4;
    };
    CPU.prototype.RL = function () {
        var instruction = this.m_mmu.read(this.m_PC[0]);
        var reg2 = instruction & 7;
        if (reg2 == 0x06) {
            var rVal = this.m_mmu.read(this.getHL());
            this.m_mmu.write(this.getHL(), (rVal << 1) + Number(this.getC()));
            // Calculate if Carry flag needs to be set
            this.setC(rVal >= 128);
            // Calculate if Zero flag needs to be set
            this.setZ(this.m_mmu.read(this.getHL()) == 0x00);
            this.m_clock = 16;
        }
        else {
            var rVal = this.m_registers[reg2];
            this.m_registers[reg2] = ((rVal << 1) + Number(this.getC())) & 0xFF;
            // Calculate if Carry flag needs to be set
            this.setC(rVal >= 128);
            // Calculate if Zero flag needs to be set
            if (this.m_cbPrefix) {
                this.setZ(this.m_registers[reg2] == 0);
                this.m_clock = 8;
            }
            else {
                this.setZ(false);
                this.m_clock = 4;
            }
        }
        // Set H and N flags to 0
        this.setH(false);
        this.setN(false);
        return 8;
    };
    CPU.prototype.RR = function () {
        var instruction = this.m_mmu.read(this.m_PC[0]);
        var reg2 = instruction & 7;
        if (reg2 == 0x06) {
            var rVal = this.m_mmu.read(this.getHL());
            this.m_mmu.write(this.getHL(), (rVal >> 1) + (Number(this.getC()) << 7));
            // Calculate if Carry flag needs to be set
            this.setC((rVal % 2) > 0);
            // Calculate if Zero flag needs to be set
            this.setZ(this.m_mmu.read(this.getHL()) == 0x00);
            this.m_clock = 16;
        }
        else {
            var rVal = this.m_registers[reg2];
            this.m_registers[reg2] = (rVal >> 1) + (Number(this.getC()) << 7);
            // Calculate if Carry flag needs to be set
            this.setC((rVal % 2) > 0);
            // Calculate if Zero flag needs to be set
            if (this.m_cbPrefix) {
                this.setZ(this.m_registers[reg2] == 0);
                this.m_clock = 8;
            }
            else {
                this.setZ(false);
                this.m_clock = 4;
            }
        }
        // Set H and N flags to 0
        this.setH(false);
        this.setN(false);
        return 8;
    };
    CPU.prototype.SLA = function () {
        var instruction = this.m_mmu.read(this.m_PC[0]);
        var reg2 = instruction & 7;
        if (reg2 == 0x06) {
            var rVal = this.m_mmu.read(this.getHL());
            // Calculate if Carry flag needs to be set
            this.setC(rVal >= 128);
            this.m_mmu.write(this.getHL(), rVal << 1);
            // Calculate if Zero flag needs to be set
            this.setZ(this.m_mmu.read(this.getHL()) == 0x00);
            this.m_clock = 16;
        }
        else {
            var rVal = this.m_registers[reg2];
            // Calculate if Carry flag needs to be set
            this.setC(rVal >= 128);
            this.m_registers[reg2] = (rVal << 1) & 0xFF;
            // Calculate if Zero flag needs to be set
            this.setZ(this.m_registers[reg2] == 0);
            this.m_clock = 8;
        }
        // Set H and N flags to 0
        this.setH(false);
        this.setN(false);
        return 8;
    };
    CPU.prototype.SRA = function () {
        var instruction = this.m_mmu.read(this.m_PC[0]);
        var reg2 = instruction & 7;
        if (reg2 == 0x06) {
            var rVal = this.m_mmu.read(this.getHL());
            // Calculate if Carry flag needs to be set
            this.setC(rVal >= 128);
            this.m_mmu.write(this.getHL(), (rVal >> 1) + (Number(this.getC()) << 7));
            this.setC((rVal % 2) > 0);
            // Calculate if Zero flag needs to be set
            this.setZ(this.m_mmu.read(this.getHL()) == 0x00);
            this.m_clock = 16;
        }
        else {
            var rVal = this.m_registers[reg2];
            // Calculate if Carry flag needs to be set
            this.setC(rVal >= 128);
            this.m_registers[reg2] = (rVal >> 1) + (Number(this.getC()) << 7);
            this.setC((rVal % 2) > 0);
            // Calculate if Zero flag needs to be set
            this.setZ(this.m_registers[reg2] == 0);
            this.m_clock = 8;
        }
        // Set H and N flags to 0
        this.setH(false);
        this.setN(false);
        return 8;
    };
    CPU.prototype.SWAP = function () {
        var instruction = this.m_mmu.read(this.m_PC[0]);
        var reg2 = instruction & 7;
        if (reg2 == 0x06) {
            var rVal = this.m_mmu.read(this.getHL());
            this.m_mmu.write(this.getHL(), (rVal << 4) + (rVal >> 4));
            // Calculate if Zero flag needs to be set
            this.setZ(this.m_mmu.read(this.getHL()) == 0x00);
            this.m_clock = 16;
        }
        else {
            var rVal = this.m_registers[reg2];
            this.m_registers[reg2] = ((rVal << 4) + (rVal >> 4)) & 0xFF;
            // Calculate if Zero flag needs to be set
            this.setZ(this.m_registers[reg2] == 0);
            this.m_clock = 8;
        }
        // Set C, H and N flags to 0
        this.setC(false);
        this.setH(false);
        this.setN(false);
        return 8;
    };
    CPU.prototype.SRL = function () {
        var instruction = this.m_mmu.read(this.m_PC[0]);
        var reg2 = instruction & 7;
        if (reg2 == 0x06) {
            var rVal = this.m_mmu.read(this.getHL());
            // Calculate if Carry flag needs to be set
            this.setC((rVal % 2) > 0);
            this.m_mmu.write(this.getHL(), (rVal >> 1));
            // Calculate if Zero flag needs to be set
            this.setZ(this.m_mmu.read(this.getHL()) == 0x00);
            this.m_clock = 16;
        }
        else {
            var rVal = this.m_registers[reg2];
            // Calculate if Carry flag needs to be set
            this.setC((rVal % 2) > 0);
            this.m_registers[reg2] = (rVal >> 1);
            // Calculate if Zero flag needs to be set
            this.setZ(this.m_registers[reg2] == 0);
            this.m_clock = 8;
        }
        // Set H and N flags to 0
        this.setH(false);
        this.setN(false);
        return 8;
    };
    CPU.prototype.BIT = function () {
        var instruction = this.m_mmu.read(this.m_PC[0]);
        var reg1 = (instruction & 56) >> 3;
        var reg2 = instruction & 7;
        var mask = 0x01 << reg1;
        if (reg2 == 0x06) {
            // Calculate if Zero flag needs to be set
            this.setZ((this.m_mmu.read(this.getHL()) & mask) == 0);
            this.m_clock = 12;
        }
        else {
            // Calculate if Zero flag needs to be set
            this.setZ((this.m_registers[reg2] & mask) == 0);
            this.m_clock = 8;
        }
        // Set H flag to 1, N flag to 0
        this.setH(true);
        this.setN(false);
        return 8;
    };
    CPU.prototype.RES = function () {
        var instruction = this.m_mmu.read(this.m_PC[0]);
        var reg1 = (instruction & 56) >> 3;
        var reg2 = instruction & 7;
        var mask = (0x01 << reg1) ^ 0xFF;
        if (reg2 == 0x06) {
            this.m_mmu.write(this.getHL(), this.m_mmu.read(this.getHL()) & mask);
            this.m_clock = 16;
        }
        else {
            this.m_registers[reg2] &= (mask & 0xFF);
            this.m_clock = 8;
        }
        return 8;
    };
    CPU.prototype.SET = function () {
        var instruction = this.m_mmu.read(this.m_PC[0]);
        var reg1 = (instruction & 56) >> 3;
        var reg2 = instruction & 7;
        var mask = 0x01 << reg1;
        if (reg2 == 0x06) {
            this.m_mmu.write(this.getHL(), this.m_mmu.read(this.getHL()) | mask);
            this.m_clock = 16;
        }
        else {
            this.m_registers[reg2] |= (mask & 0xFF);
            this.m_clock = 8;
        }
        return 8;
    };
    CPU.prototype.CALL = function () {
        var instruction = this.m_mmu.read(this.m_PC[0]);
        var reg1 = (instruction & 56) >> 3;
        var reg2 = instruction & 7;
        var lAddr = this.m_mmu.read(++this.m_PC[0]);
        var hAddr = this.m_mmu.read(++this.m_PC[0]);
        if (reg2 == 0x04) {
            switch (reg1) {
                case 0x00:
                    if (this.getZ()) {
                        return 12;
                    }
                    break;
                case 0x01:
                    if (!this.getZ()) {
                        return 12;
                    }
                    break;
                case 0x02:
                    if (this.getC()) {
                        return 12;
                    }
                    break;
                case 0x03:
                    if (!this.getC()) {
                        return 12;
                    }
                    break;
                default:
                    break;
            }
        }
        this.m_PC[0] += 1;
        this.m_mmu.write(--this.m_SP[0], (0xFF00 & this.m_PC[0]) >> 8);
        this.m_mmu.write(--this.m_SP[0], 0x00FF & this.m_PC[0]);
        this.m_PC[0] = (hAddr << 8) + lAddr - 1;
        return 24;
    };
    CPU.prototype.RET = function () {
        var instruction = this.m_mmu.read(this.m_PC[0]);
        var reg1 = (instruction & 56) >> 3;
        var reg2 = instruction & 7;
        if (reg2 == 0x00) {
            this.m_clock = 8;
            switch (reg1) {
                case 0x00:
                    if (this.getZ()) {
                        return 8;
                    }
                    break;
                case 0x01:
                    if (!this.getZ()) {
                        return 8;
                    }
                    break;
                case 0x02:
                    if (this.getC()) {
                        return 8;
                    }
                    break;
                case 0x03:
                    if (!this.getC()) {
                        return 8;
                    }
                    break;
                default:
                    break;
            }
            this.m_clock = 20;
        }
        else {
            if (reg1 == 0x03) {
                this.IME = true;
            }
            this.m_clock = 16;
        }
        var lAddr = this.m_mmu.read(this.m_SP[0]++);
        var hAddr = this.m_mmu.read(this.m_SP[0]++);
        this.m_PC[0] = (hAddr << 8) + lAddr - 1;
        return 16;
    };
    CPU.prototype.RST = function () {
        var instruction = this.m_mmu.read(this.m_PC[0]);
        var reg1 = (instruction & 56) >> 3;
        this.m_PC[0] += 1;
        this.m_mmu.write(--this.m_SP[0], (0xFF00 & this.m_PC[0]) >> 8);
        this.m_mmu.write(--this.m_SP[0], 0x00FF & this.m_PC[0]);
        this.m_PC[0] = (reg1 * 8) - 1;
        return 16;
    };
    CPU.prototype.DAA = function () {
        if (!this.getN()) {
            if (this.getC() || this.m_registers[this.R.A] > 0x99) {
                this.m_registers[this.R.A] = (this.m_registers[this.R.A] + 0x60) & 0xFF;
                this.setC(true);
            }
            if (this.getH() || (this.m_registers[this.R.A] & 0x0F) > 0x09) {
                this.m_registers[this.R.A] = (this.m_registers[this.R.A] + 0x06) & 0xFF;
            }
        }
        else if (this.getC()) {
            if (this.getH()) {
                this.m_registers[this.R.A] = (this.m_registers[this.R.A] + 0x9A) & 0xFF;
            }
            else {
                this.m_registers[this.R.A] = (this.m_registers[this.R.A] + 0xA0) & 0xFF;
            }
        }
        else if (this.getH()) {
            this.m_registers[this.R.A] = (this.m_registers[this.R.A] + 0xFA) & 0xFF;
        }
        // Calculate if Zero flag needs to be set
        this.setZ(this.m_registers[this.R.A] == 0);
        // Set Half-Carry flag to 0
        this.setH(false);
        return 4;
    };
    CPU.prototype.STOP = function () {
        return 4;
    };
    // NOP
    CPU.prototype.opcode00 = function () {
        return 4;
    };
    // private getAF(){
    //     return (this.m_registers[this.R.A]!) << 8 + this.m_registers[this.R.F]!;
    // }
    CPU.prototype.getBC = function () {
        return (this.m_registers[this.R.B] << 8) + this.m_registers[this.R.C];
    };
    CPU.prototype.getDE = function () {
        return (this.m_registers[this.R.D] << 8) + this.m_registers[this.R.E];
    };
    CPU.prototype.getHL = function () {
        return (this.m_registers[this.R.H] << 8) + this.m_registers[this.R.L];
    };
    // private setAF(value: number): void{
    //     let hVal = (value >> 8) & 0x00FF;
    //     let lVal = value & 0x00F0;
    //     this.m_registers[this.R.A] = hVal;
    //     this.m_registers[this.R.F] = lVal;
    // }
    CPU.prototype.setBC = function (value) {
        var hVal = (value >> 8) & 0x00FF;
        var lVal = value & 0x00FF;
        this.m_registers[this.R.B] = hVal;
        this.m_registers[this.R.C] = lVal;
    };
    CPU.prototype.setDE = function (value) {
        var hVal = (value >> 8) & 0x00FF;
        var lVal = value & 0x00FF;
        this.m_registers[this.R.D] = hVal;
        this.m_registers[this.R.E] = lVal;
    };
    CPU.prototype.setHL = function (value) {
        var hVal = (value >> 8) & 0x00FF;
        var lVal = value & 0x00FF;
        this.m_registers[this.R.H] = hVal;
        this.m_registers[this.R.L] = lVal;
    };
    CPU.prototype.getC = function () {
        return (this.m_registers[this.R.F] & 16) > 0;
    };
    CPU.prototype.getH = function () {
        return (this.m_registers[this.R.F] & 32) > 0;
    };
    CPU.prototype.getN = function () {
        return (this.m_registers[this.R.F] & 64) > 0;
    };
    CPU.prototype.getZ = function () {
        return (this.m_registers[this.R.F] & 128) > 0;
    };
    CPU.prototype.setC = function (val) {
        if (val) {
            this.m_registers[this.R.F] |= 16;
        }
        else {
            this.m_registers[this.R.F] &= 239;
        }
    };
    CPU.prototype.setH = function (val) {
        if (val) {
            this.m_registers[this.R.F] |= 32;
        }
        else {
            this.m_registers[this.R.F] &= 223;
        }
    };
    CPU.prototype.setN = function (val) {
        if (val) {
            this.m_registers[this.R.F] |= 64;
        }
        else {
            this.m_registers[this.R.F] &= 191;
        }
    };
    CPU.prototype.setZ = function (val) {
        if (val) {
            this.m_registers[this.R.F] |= 128;
        }
        else {
            this.m_registers[this.R.F] &= 127;
        }
    };
    return CPU;
}());



/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GPU: () => (/* binding */ GPU)
/* harmony export */ });
var GPU = /** @class */ (function () {
    function GPU(m_mmu, m_frame) {
        this.m_mmu = m_mmu;
        this.m_frame = m_frame;
        this.VRAM_1 = 0x8000;
        this.VRAM_2 = 0x9000;
        this.TILE_MAP1 = 0x9800;
        this.TILE_MAP2 = 0x9C00;
        this.OAM = 0xFE00;
        this.IF = 0xFF0F;
        this.STAT = 0xFF41;
        this.LY = 0xFF44;
        this.OBP0 = 0xFF48;
        this.OBP1 = 0xFF49;
        this.colorValues = [0xFFFF, 0x56B5, 0x29AA, 0x0000];
        this.state = {
            Mode0: 0,
            Mode1: 1,
            Mode2: 2,
            Mode3: 3,
        };
        this.m_state = this.state.Mode2;
        this.m_clock = 0;
        this.m_windowLineCounter = 0;
        this.m_bgDotVals = new Array(160).fill(0);
    }
    // LCD Register
    GPU.prototype.LCDC = function () { return this.m_mmu.read(0xFF40); };
    GPU.prototype.SCY = function () { return this.m_mmu.read(0xFF42); };
    GPU.prototype.SCX = function () { return this.m_mmu.read(0xFF43); };
    GPU.prototype.LYC = function () { return this.m_mmu.read(0xFF45); };
    //private readonly DMA = 0xFF46;
    GPU.prototype.BGP = function () { return this.m_mmu.read(0xFF47); };
    GPU.prototype.WY = function () { return this.m_mmu.read(0xFF4A); };
    GPU.prototype.WX = function () { return this.m_mmu.read(0xFF4B); };
    GPU.prototype.step = function () {
        // If LCD is on
        if ((this.LCDC() & 0x80) > 0) {
            switch (this.m_state) {
                case this.state.Mode0: // H-Blank
                    if (this.m_clock >= 455) {
                        if (this.m_mmu.read(this.LY) >= 143) {
                            this.m_state = this.state.Mode1; // Transition into Mode 1
                            this.m_mmu.write(this.STAT, this.m_mmu.read(this.STAT) & 0xFC); // Set mode on STAT register
                            this.m_mmu.write(this.STAT, this.m_mmu.read(this.STAT) | 0x01);
                            this.incrementLineCounters();
                            this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x01);
                            if ((this.m_mmu.read(this.STAT) & 0x10) > 0) { // Check if STAT interrupt enabled, request interrupt
                                this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x02);
                            }
                            this.m_windowLineCounter = 0;
                        }
                        else {
                            this.m_state = this.state.Mode2; // Transition into Mode 2
                            this.m_mmu.write(this.STAT, this.m_mmu.read(this.STAT) & 0xFC); // Set mode on STAT register
                            this.m_mmu.write(this.STAT, this.m_mmu.read(this.STAT) | 0x02);
                            this.incrementLineCounters();
                            if ((this.m_mmu.read(this.STAT) & 0x20) > 0) { // Check if STAT interrupt enabled, request interrupt
                                this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x02);
                            }
                        }
                        this.m_clock = -1;
                    }
                    break;
                case this.state.Mode1: // V-Blank
                    if (this.m_clock >= 455) {
                        this.incrementLineCounters();
                        if (this.m_mmu.read(this.LY) == 0x9A) {
                            this.m_state = this.state.Mode2; // Transition into Mode 2
                            this.m_mmu.write(this.STAT, this.m_mmu.read(this.STAT) & 0xFC); // Set mode on STAT register
                            this.m_mmu.write(this.STAT, this.m_mmu.read(this.STAT) | 0x02);
                            this.m_mmu.write(this.LY, 0);
                            this.m_windowLineCounter = 0;
                            if ((this.m_mmu.read(this.STAT) & 0x20) > 0) { // Check if STAT interrupt enabled, request interrupt
                                this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x02);
                            }
                        }
                        this.m_clock = -1;
                    }
                    break;
                case this.state.Mode2: // OAM Scan
                    if (this.m_clock >= 79) {
                        this.m_state = this.state.Mode3; // Transition into Mode 3
                        this.m_mmu.write(this.STAT, this.m_mmu.read(this.STAT) | 0x03); // Set mode on STAT register
                    }
                    break;
                case this.state.Mode3: // Drawing Pixels
                    if (this.m_clock >= 251) {
                        // Transition into H-Blank
                        this.m_state = this.state.Mode0; // Transition into Mode 0
                        this.m_mmu.write(this.STAT, this.m_mmu.read(this.STAT) & 0xFC); // Set mode on STAT register
                        if ((this.m_mmu.read(this.STAT) & 0x80) > 0) { // Check if STAT interrupt enabled, request interrupt
                            this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x02);
                        }
                        this.renderLine();
                    }
                    break;
                default:
                    break;
            }
            if (this.m_mmu.read(this.LY) == this.LYC()) {
                if ((this.m_mmu.read(this.STAT) & 0x04) == 0) {
                    if ((this.m_mmu.read(this.STAT) & 0x40) > 0) {
                        this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x02);
                    }
                    this.m_mmu.write(this.STAT, this.m_mmu.read(this.STAT) | 0x04);
                }
            }
            else {
                this.m_mmu.write(this.STAT, this.m_mmu.read(this.STAT) & 0xFB);
            }
            this.m_clock += 1;
        }
    };
    GPU.prototype.renderLine = function () {
        // clearLine();
        if ((this.LCDC() & 0x01) > 0) {
            this.renderBackgroundLine();
            if ((this.LCDC() & 0x20) > 0) {
                this.renderWindowLine();
            }
        }
        if ((this.LCDC() & 0x02) > 0) {
            this.renderObjectLine();
        }
    };
    GPU.prototype.renderBackgroundLine = function () {
        var backgroundTileVRAM = (this.LCDC() & 0x10) > 0x00 ? this.VRAM_1 : this.VRAM_2;
        var backgroundTileMap = (this.LCDC() & 0x08) > 0x00 ? this.TILE_MAP2 : this.TILE_MAP1;
        var y = (this.SCY() + this.m_mmu.read(this.LY)) & 0xFF;
        for (var i = 0; i <= 20; i++) {
            var x = (this.SCX() + (i << 3)) & 0xFF;
            var tileIndex = ((y >> 3) * 32) + (x >> 3);
            var tileVal = this.m_mmu.read(backgroundTileMap + tileIndex);
            if ((this.LCDC() & 0x10) == 0x00) {
                tileVal = (tileVal << 24) >> 24;
            }
            var VRAM_Pointer = backgroundTileVRAM + (tileVal * 16);
            var lBits = this.m_mmu.read(VRAM_Pointer + ((y & 0x07) * 2));
            var hBits = this.m_mmu.read(VRAM_Pointer + ((y & 0x07) * 2) + 1);
            for (var j = 7; j >= 0; j--) {
                var screenX_1 = j - (this.SCX() & 0x07) + (i << 3);
                if (screenX_1 < 0) {
                    break;
                }
                var palid = ((hBits & 0x01) << 1) | (lBits & 0x01);
                lBits = lBits >> 1;
                hBits = hBits >> 1;
                if (screenX_1 >= 160) {
                    continue;
                }
                var color = this.colorValues[(this.BGP() & (0x03 << (palid * 2))) >> (palid * 2)];
                this.m_bgDotVals[(this.m_mmu.read(this.LY) * 160) + screenX_1] = palid;
                this.m_frame[(this.m_mmu.read(this.LY) * 160) + screenX_1] = color;
            }
        }
    };
    GPU.prototype.renderWindowLine = function () {
        var wx = this.WX();
        var wy = this.WY();
        if (wx < 0 || wx > 166 || wy < 0 || wy > 143) {
            return;
        }
        var windowTileVRAM = (this.LCDC() & 0x10) > 0x00 ? this.VRAM_1 : this.VRAM_2;
        var windowTileMap = (this.LCDC() & 0x40) > 0x00 ? this.TILE_MAP2 : this.TILE_MAP1;
        var y = this.m_windowLineCounter - wy;
        if (y < 0) {
            return;
        }
        for (var i = 0; i <= 20; i++) {
            var tileIndex = ((y >> 3) * 32) + i;
            var tileMapAddr = windowTileMap + tileIndex;
            if (tileMapAddr >= 0xA000) {
                continue;
            }
            var tileVal = this.m_mmu.read(tileMapAddr);
            if ((this.LCDC() & 0x10) == 0x00) {
                tileVal = (tileVal << 24) >> 24;
            }
            var VRAM_Pointer = windowTileVRAM + (tileVal * 16);
            var lBits = this.m_mmu.read(VRAM_Pointer + ((y & 0x07) * 2));
            var hBits = this.m_mmu.read(VRAM_Pointer + ((y & 0x07) * 2) + 1);
            for (var j = 7; j >= 0; j--) {
                var screenX_2 = j - 7 + wx + (i << 3);
                var palid = ((hBits & 0x01) << 1) | (lBits & 0x01);
                lBits = lBits >> 1;
                hBits = hBits >> 1;
                if (screenX_2 < 0 || screenX_2 >= 160) {
                    continue;
                }
                var color = this.colorValues[(this.BGP() & (0x03 << (palid * 2))) >> (palid * 2)];
                this.m_bgDotVals[(this.m_mmu.read(this.LY) * 160) + screenX_2] = palid;
                this.m_frame[(this.m_mmu.read(this.LY) * 160) + screenX_2] = color;
            }
        }
    };
    GPU.prototype.renderObjectLine = function () {
        var yCount = 0;
        for (var i = 0; i < 40; i++) {
            var x = this.m_mmu.read(this.OAM + (i * 4) + 1) - 8;
            var y = this.m_mmu.read(this.OAM + (i * 4)) - this.m_mmu.read(this.LY);
            var attributes = this.m_mmu.read(this.OAM + (i * 4) + 3);
            var VRAM_Pointer = 0;
            if ((this.LCDC() & 0x04) > 0x00) {
                if (y < 1 || y > 16) {
                    continue;
                }
                if (y < 9) {
                    if (attributes & 0x40) {
                        VRAM_Pointer = this.VRAM_1 + ((this.m_mmu.read(this.OAM + (i * 4) + 2) & 0xFE) * 16);
                    }
                    else {
                        VRAM_Pointer = this.VRAM_1 + ((this.m_mmu.read(this.OAM + (i * 4) + 2) | 0x01) * 16);
                    }
                }
                else {
                    if (attributes & 0x40) {
                        VRAM_Pointer = this.VRAM_1 + ((this.m_mmu.read(this.OAM + (i * 4) + 2) | 0x01) * 16);
                    }
                    else {
                        VRAM_Pointer = this.VRAM_1 + ((this.m_mmu.read(this.OAM + (i * 4) + 2) & 0xFE) * 16);
                    }
                }
            }
            else {
                if (y < 9 || y > 16) {
                    continue;
                }
                VRAM_Pointer = this.VRAM_1 + (this.m_mmu.read(this.OAM + (i * 4) + 2) * 16);
            }
            if (attributes & 0x40) {
                y -= 1;
            }
            else {
                y = 16 - y;
            }
            var lBits = this.m_mmu.read(VRAM_Pointer + ((y % 8) * 2));
            var hBits = this.m_mmu.read(VRAM_Pointer + ((y % 8) * 2) + 1);
            var mask = 0;
            if ((attributes & 0x20) > 0x00) {
                mask = 0x01;
            }
            else {
                mask = 0x80;
            }
            for (var j = 0; j < 8; j++) {
                if (x >= 0 || x < 160) {
                    var color = 0;
                    var pallete = 0;
                    if (attributes & 0x10) {
                        pallete = this.OBP1;
                    }
                    else {
                        pallete = this.OBP0;
                    }
                    if (hBits & mask) {
                        if (lBits & mask) {
                            color = this.colorValues[(this.m_mmu.read(pallete) & 0xC0) >> 6];
                        }
                        else {
                            color = this.colorValues[(this.m_mmu.read(pallete) & 0x30) >> 4];
                        }
                    }
                    else {
                        if (lBits & mask) {
                            color = this.colorValues[(this.m_mmu.read(pallete) & 0x0C) >> 2];
                        }
                        else {
                            if (attributes & 0x20) {
                                mask = mask << 1;
                            }
                            else {
                                mask = mask >> 1;
                            }
                            x += 1;
                            continue;
                        }
                    }
                    if ((attributes & 0x80) > 0x00) {
                        if (this.m_bgDotVals[(this.m_mmu.read(this.LY) * 160) + x] == 0) {
                            this.m_frame[(this.m_mmu.read(this.LY) * 160) + x] = color;
                        }
                    }
                    else {
                        this.m_frame[(this.m_mmu.read(this.LY) * 160) + x] = color;
                    }
                }
                if ((attributes & 0x20) > 0x00) {
                    mask = mask << 1;
                }
                else {
                    mask = mask >> 1;
                }
                x += 1;
            }
            yCount += 1;
            if (yCount == 10) {
                break;
            }
        }
    };
    GPU.prototype.incrementLineCounters = function () {
        this.m_mmu.write(this.LY, this.m_mmu.read(this.LY) + 1);
        var wx = this.WX();
        var wy = this.WY();
        if (wx >= 0 && wx <= 166 && wy >= 0 && wy <= 143) {
            this.m_windowLineCounter += 1;
        }
    };
    return GPU;
}());



/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MMU: () => (/* binding */ MMU)
/* harmony export */ });
/* harmony import */ var _bootroms__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);

var MMU = /** @class */ (function () {
    function MMU(file) {
        var _this = this;
        this.file = file;
        this.m_BIOS = new Uint8Array(0x0100).fill(0);
        this.m_addrBus = new Uint8Array(0x10000).fill(0);
        this.m_rom = new Uint8Array(0x800000).fill(0);
        this.m_ram = new Uint8Array(0x020000).fill(0);
        this.m_isRomLoaded = false;
        this.m_isBIOSMapped = true;
        this.m_isGBC = false; // TODO
        this.m_ramEnabled = false;
        this.m_mbc1BankMode = false;
        this.m_romSize = 0;
        this.m_ramSize = 0;
        this.m_cartridgeType = 0;
        this.m_mbcValue = 0;
        this.m_romBank = 1;
        this.m_ramBank = 0;
        this.m_mbc3RtcReg = 0;
        this.m_mbc3RtcLatch = 0;
        var reader = new FileReader();
        reader.onload = function () { return _this.loadROM(reader.result); };
        reader.readAsArrayBuffer(this.file);
        this.loadBIOS();
    }
    /**
     * Read from RAM at requested address
     * @param addr Address to RAM
     * @return value at requested address
     */
    MMU.prototype.read = function (addr) {
        switch (addr >> 13) {
            case 0:
                if (this.m_isBIOSMapped) {
                    if (addr == 0x0100) {
                        this.m_isBIOSMapped = false;
                    }
                    else if (this.m_isGBC) {
                        if (addr < 0x0100) {
                            return _bootroms__WEBPACK_IMPORTED_MODULE_0__.BootROMS.BIOS_CGB[addr];
                        }
                        else if (addr >= 0x0200 && addr < 0x0900) {
                            return _bootroms__WEBPACK_IMPORTED_MODULE_0__.BootROMS.BIOS_CGB[addr - 0x0100];
                        }
                    }
                    else {
                        if (addr < 0x0100) {
                            return _bootroms__WEBPACK_IMPORTED_MODULE_0__.BootROMS.BIOS_DMG[addr];
                        }
                    }
                }
            case 1: // 0x0000 -> 0x3FFF
                if (this.m_mbcValue == 1) {
                    if (this.m_mbc1BankMode) {
                        return this.m_rom[addr | ((this.m_romBank & ~0x1F) << 14)];
                    }
                }
                else {
                    return this.m_rom[addr];
                }
            case 2:
            case 3: // 0x4000 -> 0x7FFF
                return this.m_rom[(addr & 0x3FFF) | (this.m_romBank << 14)];
            case 4: // 0x8000 -> 0x9FFF
                return this.m_addrBus[addr];
            case 5: // 0xA000 -> 0xBFFF
                switch (this.m_mbcValue) {
                    case 1:
                        return 0xFF;
                    case 2:
                        return 0xFF;
                    case 3:
                        switch (this.m_mbc3RtcReg) {
                            case 0:
                                return this.m_ram[(this.m_ramBank << 13) | (addr & 0x1FFF)];
                            case 8:
                            case 9:
                            case 10:
                            case 11:
                            case 12:
                                return 0xFF;
                        }
                        return 0xFF;
                    case 5:
                        if (this.m_ramEnabled) {
                            return this.m_ram[(this.m_ramBank << 13) | (addr & 0x1FFF)];
                        }
                }
                return 0xFF;
            case 6:
            case 7: // 0xC000 -> 0xFFFF
                return this.m_addrBus[addr];
            default:
                return 0xFF;
        }
    };
    MMU.prototype.write = function (addr, val) {
        switch (addr >> 13) {
            case 0: // 0x0000->0x1fff
                switch (this.m_mbcValue) {
                    case 1:
                    case 3:
                    case 5: // Enable RAM if low nibble is 0x0A, else disable
                        this.m_ramEnabled = (val & 0x0F) == 0x0A;
                        break;
                    case 2: // Enable/disable RAM if high address byte is even
                        if (((addr >> 8) & 0x01) == 0) {
                            this.m_ramEnabled = (val & 0x0F) == 0x0A;
                        }
                        else {
                            val &= 0x0F;
                            if (val == 0) {
                                val = 1;
                            }
                            this.m_romBank = val;
                        }
                        break;
                }
                break;
            case 1: // 0x2000 -> 0x3fff
                switch (this.m_mbcValue) {
                    case 1: // Set ROM bank, or at least lower 5 bits
                        val &= 0x1F;
                        if (val == 0) {
                            val = 1;
                        }
                        this.m_romBank &= ~0x1F;
                        this.m_romBank |= val;
                        break;
                    case 2: // Set ROM bank, but only if high address byte is odd
                        if (((addr >> 8) & 0x01) == 0) {
                            this.m_ramEnabled = (val & 0x0F) == 0x0A;
                        }
                        else {
                            val &= 0x0F;
                            if (val == 0) {
                                val = 1;
                            }
                            this.m_romBank = val;
                        }
                        break;
                    case 3: // Set ROM bank
                        val &= 0x7F;
                        if (val == 0) {
                            val = 1;
                        }
                        this.m_romBank = val;
                        break;
                    case 5: // Set low 8 bits of ROM bank (allow 0)
                        if ((addr & 0x1000) == 0) {
                            this.m_romBank &= ~0xFF;
                            this.m_romBank |= val;
                        }
                        else {
                            this.m_romBank &= 0xFF;
                            this.m_romBank |= (val & 0x01) << 8;
                        }
                        break;
                }
                this.m_romBank %= this.m_romSize;
                break;
            case 2: // 0x4000 -> 0x5fff
                switch (this.m_mbcValue) {
                    case 1:
                        break; //TODO
                    case 3: // Write RAM bank if <= 3 or enable RTC registers
                        if (val <= 0x03) {
                            this.m_ramBank = val;
                            this.m_mbc3RtcReg = 0;
                        }
                        else if (val >= 0x08 && val <= 0x0C) {
                            this.m_mbc3RtcReg = val;
                        }
                        break;
                    case 5: // Write RAM bank
                        this.m_ramBank = val & 0x0F;
                        break;
                }
                this.m_romBank %= this.m_romSize;
                this.m_ramBank %= Math.max(1, this.m_ramSize);
                break;
            case 3:
                switch (this.m_mbcValue) {
                    case 1: // Set ROM/RAM mode
                        this.m_mbc1BankMode = (val & 0x01) != 0;
                        break;
                    case 3: // Latch RTC
                        if ((this.m_mbc3RtcLatch & 0x01) == 0 && val == 0) {
                            this.m_mbc3RtcLatch += 1;
                        }
                        else if ((this.m_mbc3RtcLatch & 1) != 0 && val == 1) {
                            this.m_mbc3RtcLatch = (this.m_mbc3RtcLatch + 1) & 0x03;
                        }
                        break;
                }
                break;
            case 4:
            case 5:
            case 6:
            case 7:
                if (addr == 0xFF46) { // DMA transfer
                    addr = val << 8;
                    for (var i = 0; i < 160; i++) {
                        this.m_addrBus[0xFE00 + i] = this.m_addrBus[addr + i];
                    }
                }
                else {
                    this.m_addrBus[addr] = val;
                }
        }
    };
    MMU.prototype.loadBIOS = function () {
        for (var i = 0; i < _bootroms__WEBPACK_IMPORTED_MODULE_0__.BootROMS.BIOS_DMG.length; i++) {
            this.m_BIOS[i] = _bootroms__WEBPACK_IMPORTED_MODULE_0__.BootROMS.BIOS_DMG[i];
        }
    };
    MMU.prototype.loadROM = function (buffer) {
        var view = new Uint8Array(buffer);
        this.m_cartridgeType = view[0x0147];
        this.m_romSize = view[0x0148];
        this.m_ramSize = view[0x0149];
        this.m_romSize = (1 << (this.m_romSize + 1));
        switch (this.m_ramSize) {
            case 2:
                this.m_ramSize = 1;
                break;
            case 3:
                this.m_ramSize = 4;
                break;
            case 4:
                this.m_ramSize = 16;
                break;
            case 5:
                this.m_ramSize = 8;
                break;
            default:
                this.m_ramSize = 0;
                break;
        }
        console.log(this.m_cartridgeType);
        if (this.m_cartridgeType == 3) {
            this.m_mbcValue = 1;
        }
        if (this.m_cartridgeType == 19) {
            this.m_mbcValue = 3;
        }
        for (var i = 0; i < view.length; i++) {
            this.m_rom[i] = view[i];
        }
        this.m_isRomLoaded = true;
    };
    return MMU;
}());



/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BootROMS: () => (/* binding */ BootROMS)
/* harmony export */ });
var BootROMS = /** @class */ (function () {
    function BootROMS() {
    }
    BootROMS.BIOS_DMG = [
        0x31, 0xfe, 0xff, 0xaf, 0x21, 0xff, 0x9f, 0x32, 0xcb, 0x7c, 0x20, 0xfb, 0x21, 0x26, 0xff, 0x0e,
        0x11, 0x3e, 0x80, 0x32, 0xe2, 0x0c, 0x3e, 0xf3, 0xe2, 0x32, 0x3e, 0x77, 0x77, 0x3e, 0xfc, 0xe0,
        0x47, 0x11, 0x04, 0x01, 0x21, 0x10, 0x80, 0x1a, 0xcd, 0x95, 0x00, 0xcd, 0x96, 0x00, 0x13, 0x7b,
        0xfe, 0x34, 0x20, 0xf3, 0x11, 0xd8, 0x00, 0x06, 0x08, 0x1a, 0x13, 0x22, 0x23, 0x05, 0x20, 0xf9,
        0x3e, 0x19, 0xea, 0x10, 0x99, 0x21, 0x2f, 0x99, 0x0e, 0x0c, 0x3d, 0x28, 0x08, 0x32, 0x0d, 0x20,
        0xf9, 0x2e, 0x0f, 0x18, 0xf3, 0x67, 0x3e, 0x64, 0x57, 0xe0, 0x42, 0x3e, 0x91, 0xe0, 0x40, 0x04,
        0x1e, 0x02, 0x0e, 0x0c, 0xf0, 0x44, 0xfe, 0x90, 0x20, 0xfa, 0x0d, 0x20, 0xf7, 0x1d, 0x20, 0xf2,
        0x0e, 0x13, 0x24, 0x7c, 0x1e, 0x83, 0xfe, 0x62, 0x28, 0x06, 0x1e, 0xc1, 0xfe, 0x64, 0x20, 0x06,
        0x7b, 0xe2, 0x0c, 0x3e, 0x87, 0xe2, 0xf0, 0x42, 0x90, 0xe0, 0x42, 0x15, 0x20, 0xd2, 0x05, 0x20,
        0x4f, 0x16, 0x20, 0x18, 0xcb, 0x4f, 0x06, 0x04, 0xc5, 0xcb, 0x11, 0x17, 0xc1, 0xcb, 0x11, 0x17,
        0x05, 0x20, 0xf5, 0x22, 0x23, 0x22, 0x23, 0xc9, 0xce, 0xed, 0x66, 0x66, 0xcc, 0x0d, 0x00, 0x0b,
        0x03, 0x73, 0x00, 0x83, 0x00, 0x0c, 0x00, 0x0d, 0x00, 0x08, 0x11, 0x1f, 0x88, 0x89, 0x00, 0x0e,
        0xdc, 0xcc, 0x6e, 0xe6, 0xdd, 0xdd, 0xd9, 0x99, 0xbb, 0xbb, 0x67, 0x63, 0x6e, 0x0e, 0xec, 0xcc,
        0xdd, 0xdc, 0x99, 0x9f, 0xbb, 0xb9, 0x33, 0x3e, 0x3c, 0x42, 0xb9, 0xa5, 0xb9, 0xa5, 0x42, 0x3c,
        0x21, 0x04, 0x01, 0x11, 0xa8, 0x00, 0x1a, 0x13, 0xbe, 0x20, 0xfe, 0x23, 0x7d, 0xfe, 0x34, 0x20,
        0xf5, 0x06, 0x19, 0x78, 0x86, 0x23, 0x05, 0x20, 0xfb, 0x86, 0x20, 0xfe, 0x3e, 0x01, 0xe0, 0x50
    ];
    BootROMS.BIOS_CGB = [
        0x31, 0xfe, 0xff, 0x3e, 0x02, 0xc3, 0x7c, 0x00, 0xd3, 0x00, 0x98, 0xa0, 0x12, 0xd3, 0x00, 0x80,
        0x00, 0x40, 0x1e, 0x53, 0xd0, 0x00, 0x1f, 0x42, 0x1c, 0x00, 0x14, 0x2a, 0x4d, 0x19, 0x8c, 0x7e,
        0x00, 0x7c, 0x31, 0x6e, 0x4a, 0x45, 0x52, 0x4a, 0x00, 0x00, 0xff, 0x53, 0x1f, 0x7c, 0xff, 0x03,
        0x1f, 0x00, 0xff, 0x1f, 0xa7, 0x00, 0xef, 0x1b, 0x1f, 0x00, 0xef, 0x1b, 0x00, 0x7c, 0x00, 0x00,
        0xff, 0x03, 0xce, 0xed, 0x66, 0x66, 0xcc, 0x0d, 0x00, 0x0b, 0x03, 0x73, 0x00, 0x83, 0x00, 0x0c,
        0x00, 0x0d, 0x00, 0x08, 0x11, 0x1f, 0x88, 0x89, 0x00, 0x0e, 0xdc, 0xcc, 0x6e, 0xe6, 0xdd, 0xdd,
        0xd9, 0x99, 0xbb, 0xbb, 0x67, 0x63, 0x6e, 0x0e, 0xec, 0xcc, 0xdd, 0xdc, 0x99, 0x9f, 0xbb, 0xb9,
        0x33, 0x3e, 0x3c, 0x42, 0xb9, 0xa5, 0xb9, 0xa5, 0x42, 0x3c, 0x58, 0x43, 0xe0, 0x70, 0x3e, 0xfc,
        0xe0, 0x47, 0xcd, 0x75, 0x02, 0xcd, 0x00, 0x02, 0x26, 0xd0, 0xcd, 0x03, 0x02, 0x21, 0x00, 0xfe,
        0x0e, 0xa0, 0xaf, 0x22, 0x0d, 0x20, 0xfc, 0x11, 0x04, 0x01, 0x21, 0x10, 0x80, 0x4c, 0x1a, 0xe2,
        0x0c, 0xcd, 0xc6, 0x03, 0xcd, 0xc7, 0x03, 0x13, 0x7b, 0xfe, 0x34, 0x20, 0xf1, 0x11, 0x72, 0x00,
        0x06, 0x08, 0x1a, 0x13, 0x22, 0x23, 0x05, 0x20, 0xf9, 0xcd, 0xf0, 0x03, 0x3e, 0x01, 0xe0, 0x4f,
        0x3e, 0x91, 0xe0, 0x40, 0x21, 0xb2, 0x98, 0x06, 0x4e, 0x0e, 0x44, 0xcd, 0x91, 0x02, 0xaf, 0xe0,
        0x4f, 0x0e, 0x80, 0x21, 0x42, 0x00, 0x06, 0x18, 0xf2, 0x0c, 0xbe, 0x20, 0xfe, 0x23, 0x05, 0x20,
        0xf7, 0x21, 0x34, 0x01, 0x06, 0x19, 0x78, 0x86, 0x2c, 0x05, 0x20, 0xfb, 0x86, 0x20, 0xfe, 0xcd,
        0x1c, 0x03, 0x18, 0x02, 0x00, 0x00, 0xcd, 0xd0, 0x05, 0xaf, 0xe0, 0x70, 0x3e, 0x11, 0xe0, 0x50,
        0x21, 0x00, 0x80, 0xaf, 0x22, 0xcb, 0x6c, 0x28, 0xfb, 0xc9, 0x2a, 0x12, 0x13, 0x0d, 0x20, 0xfa,
        0xc9, 0xe5, 0x21, 0x0f, 0xff, 0xcb, 0x86, 0xcb, 0x46, 0x28, 0xfc, 0xe1, 0xc9, 0x11, 0x00, 0xff,
        0x21, 0x03, 0xd0, 0x0e, 0x0f, 0x3e, 0x30, 0x12, 0x3e, 0x20, 0x12, 0x1a, 0x2f, 0xa1, 0xcb, 0x37,
        0x47, 0x3e, 0x10, 0x12, 0x1a, 0x2f, 0xa1, 0xb0, 0x4f, 0x7e, 0xa9, 0xe6, 0xf0, 0x47, 0x2a, 0xa9,
        0xa1, 0xb0, 0x32, 0x47, 0x79, 0x77, 0x3e, 0x30, 0x12, 0xc9, 0x3e, 0x80, 0xe0, 0x68, 0xe0, 0x6a,
        0x0e, 0x6b, 0x2a, 0xe2, 0x05, 0x20, 0xfb, 0x4a, 0x09, 0x43, 0x0e, 0x69, 0x2a, 0xe2, 0x05, 0x20,
        0xfb, 0xc9, 0xc5, 0xd5, 0xe5, 0x21, 0x00, 0xd8, 0x06, 0x01, 0x16, 0x3f, 0x1e, 0x40, 0xcd, 0x4a,
        0x02, 0xe1, 0xd1, 0xc1, 0xc9, 0x3e, 0x80, 0xe0, 0x26, 0xe0, 0x11, 0x3e, 0xf3, 0xe0, 0x12, 0xe0,
        0x25, 0x3e, 0x77, 0xe0, 0x24, 0x21, 0x30, 0xff, 0xaf, 0x0e, 0x10, 0x22, 0x2f, 0x0d, 0x20, 0xfb,
        0xc9, 0xcd, 0x11, 0x02, 0xcd, 0x62, 0x02, 0x79, 0xfe, 0x38, 0x20, 0x14, 0xe5, 0xaf, 0xe0, 0x4f,
        0x21, 0xa7, 0x99, 0x3e, 0x38, 0x22, 0x3c, 0xfe, 0x3f, 0x20, 0xfa, 0x3e, 0x01, 0xe0, 0x4f, 0xe1,
        0xc5, 0xe5, 0x21, 0x43, 0x01, 0xcb, 0x7e, 0xcc, 0x89, 0x05, 0xe1, 0xc1, 0xcd, 0x11, 0x02, 0x79,
        0xd6, 0x30, 0xd2, 0x06, 0x03, 0x79, 0xfe, 0x01, 0xca, 0x06, 0x03, 0x7d, 0xfe, 0xd1, 0x28, 0x21,
        0xc5, 0x06, 0x03, 0x0e, 0x01, 0x16, 0x03, 0x7e, 0xe6, 0xf8, 0xb1, 0x22, 0x15, 0x20, 0xf8, 0x0c,
        0x79, 0xfe, 0x06, 0x20, 0xf0, 0x11, 0x11, 0x00, 0x19, 0x05, 0x20, 0xe7, 0x11, 0xa1, 0xff, 0x19,
        0xc1, 0x04, 0x78, 0x1e, 0x83, 0xfe, 0x62, 0x28, 0x06, 0x1e, 0xc1, 0xfe, 0x64, 0x20, 0x07, 0x7b,
        0xe0, 0x13, 0x3e, 0x87, 0xe0, 0x14, 0xfa, 0x02, 0xd0, 0xfe, 0x00, 0x28, 0x0a, 0x3d, 0xea, 0x02,
        0xd0, 0x79, 0xfe, 0x01, 0xca, 0x91, 0x02, 0x0d, 0xc2, 0x91, 0x02, 0xc9, 0x0e, 0x26, 0xcd, 0x4a,
        0x03, 0xcd, 0x11, 0x02, 0xcd, 0x62, 0x02, 0x0d, 0x20, 0xf4, 0xcd, 0x11, 0x02, 0x3e, 0x01, 0xe0,
        0x4f, 0xcd, 0x3e, 0x03, 0xcd, 0x41, 0x03, 0xaf, 0xe0, 0x4f, 0xcd, 0x3e, 0x03, 0xc9, 0x21, 0x08,
        0x00, 0x11, 0x51, 0xff, 0x0e, 0x05, 0xcd, 0x0a, 0x02, 0xc9, 0xc5, 0xd5, 0xe5, 0x21, 0x40, 0xd8,
        0x0e, 0x20, 0x7e, 0xe6, 0x1f, 0xfe, 0x1f, 0x28, 0x01, 0x3c, 0x57, 0x2a, 0x07, 0x07, 0x07, 0xe6,
        0x07, 0x47, 0x3a, 0x07, 0x07, 0x07, 0xe6, 0x18, 0xb0, 0xfe, 0x1f, 0x28, 0x01, 0x3c, 0x0f, 0x0f,
        0x0f, 0x47, 0xe6, 0xe0, 0xb2, 0x22, 0x78, 0xe6, 0x03, 0x5f, 0x7e, 0x0f, 0x0f, 0xe6, 0x1f, 0xfe,
        0x1f, 0x28, 0x01, 0x3c, 0x07, 0x07, 0xb3, 0x22, 0x0d, 0x20, 0xc7, 0xe1, 0xd1, 0xc1, 0xc9, 0x0e,
        0x00, 0x1a, 0xe6, 0xf0, 0xcb, 0x49, 0x28, 0x02, 0xcb, 0x37, 0x47, 0x23, 0x7e, 0xb0, 0x22, 0x1a,
        0xe6, 0x0f, 0xcb, 0x49, 0x20, 0x02, 0xcb, 0x37, 0x47, 0x23, 0x7e, 0xb0, 0x22, 0x13, 0xcb, 0x41,
        0x28, 0x0d, 0xd5, 0x11, 0xf8, 0xff, 0xcb, 0x49, 0x28, 0x03, 0x11, 0x08, 0x00, 0x19, 0xd1, 0x0c,
        0x79, 0xfe, 0x18, 0x20, 0xcc, 0xc9, 0x47, 0xd5, 0x16, 0x04, 0x58, 0xcb, 0x10, 0x17, 0xcb, 0x13,
        0x17, 0x15, 0x20, 0xf6, 0xd1, 0x22, 0x23, 0x22, 0x23, 0xc9, 0x3e, 0x19, 0xea, 0x10, 0x99, 0x21,
        0x2f, 0x99, 0x0e, 0x0c, 0x3d, 0x28, 0x08, 0x32, 0x0d, 0x20, 0xf9, 0x2e, 0x0f, 0x18, 0xf3, 0xc9,
        0x3e, 0x01, 0xe0, 0x4f, 0xcd, 0x00, 0x02, 0x11, 0x07, 0x06, 0x21, 0x80, 0x80, 0x0e, 0xc0, 0x1a,
        0x22, 0x23, 0x22, 0x23, 0x13, 0x0d, 0x20, 0xf7, 0x11, 0x04, 0x01, 0xcd, 0x8f, 0x03, 0x01, 0xa8,
        0xff, 0x09, 0xcd, 0x8f, 0x03, 0x01, 0xf8, 0xff, 0x09, 0x11, 0x72, 0x00, 0x0e, 0x08, 0x23, 0x1a,
        0x22, 0x13, 0x0d, 0x20, 0xf9, 0x21, 0xc2, 0x98, 0x06, 0x08, 0x3e, 0x08, 0x0e, 0x10, 0x22, 0x0d,
        0x20, 0xfc, 0x11, 0x10, 0x00, 0x19, 0x05, 0x20, 0xf3, 0xaf, 0xe0, 0x4f, 0x21, 0xc2, 0x98, 0x3e,
        0x08, 0x22, 0x3c, 0xfe, 0x18, 0x20, 0x02, 0x2e, 0xe2, 0xfe, 0x28, 0x20, 0x03, 0x21, 0x02, 0x99,
        0xfe, 0x38, 0x20, 0xed, 0x21, 0xd8, 0x08, 0x11, 0x40, 0xd8, 0x06, 0x08, 0x3e, 0xff, 0x12, 0x13,
        0x12, 0x13, 0x0e, 0x02, 0xcd, 0x0a, 0x02, 0x3e, 0x00, 0x12, 0x13, 0x12, 0x13, 0x13, 0x13, 0x05,
        0x20, 0xea, 0xcd, 0x62, 0x02, 0x21, 0x4b, 0x01, 0x7e, 0xfe, 0x33, 0x20, 0x0b, 0x2e, 0x44, 0x1e,
        0x30, 0x2a, 0xbb, 0x20, 0x49, 0x1c, 0x18, 0x04, 0x2e, 0x4b, 0x1e, 0x01, 0x2a, 0xbb, 0x20, 0x3e,
        0x2e, 0x34, 0x01, 0x10, 0x00, 0x2a, 0x80, 0x47, 0x0d, 0x20, 0xfa, 0xea, 0x00, 0xd0, 0x21, 0xc7,
        0x06, 0x0e, 0x00, 0x2a, 0xb8, 0x28, 0x08, 0x0c, 0x79, 0xfe, 0x4f, 0x20, 0xf6, 0x18, 0x1f, 0x79,
        0xd6, 0x41, 0x38, 0x1c, 0x21, 0x16, 0x07, 0x16, 0x00, 0x5f, 0x19, 0xfa, 0x37, 0x01, 0x57, 0x7e,
        0xba, 0x28, 0x0d, 0x11, 0x0e, 0x00, 0x19, 0x79, 0x83, 0x4f, 0xd6, 0x5e, 0x38, 0xed, 0x0e, 0x00,
        0x21, 0x33, 0x07, 0x06, 0x00, 0x09, 0x7e, 0xe6, 0x1f, 0xea, 0x08, 0xd0, 0x7e, 0xe6, 0xe0, 0x07,
        0x07, 0x07, 0xea, 0x0b, 0xd0, 0xcd, 0xe9, 0x04, 0xc9, 0x11, 0x91, 0x07, 0x21, 0x00, 0xd9, 0xfa,
        0x0b, 0xd0, 0x47, 0x0e, 0x1e, 0xcb, 0x40, 0x20, 0x02, 0x13, 0x13, 0x1a, 0x22, 0x20, 0x02, 0x1b,
        0x1b, 0xcb, 0x48, 0x20, 0x02, 0x13, 0x13, 0x1a, 0x22, 0x13, 0x13, 0x20, 0x02, 0x1b, 0x1b, 0xcb,
        0x50, 0x28, 0x05, 0x1b, 0x2b, 0x1a, 0x22, 0x13, 0x1a, 0x22, 0x13, 0x0d, 0x20, 0xd7, 0x21, 0x00,
        0xd9, 0x11, 0x00, 0xda, 0xcd, 0x64, 0x05, 0xc9, 0x21, 0x12, 0x00, 0xfa, 0x05, 0xd0, 0x07, 0x07,
        0x06, 0x00, 0x4f, 0x09, 0x11, 0x40, 0xd8, 0x06, 0x08, 0xe5, 0x0e, 0x02, 0xcd, 0x0a, 0x02, 0x13,
        0x13, 0x13, 0x13, 0x13, 0x13, 0xe1, 0x05, 0x20, 0xf0, 0x11, 0x42, 0xd8, 0x0e, 0x02, 0xcd, 0x0a,
        0x02, 0x11, 0x4a, 0xd8, 0x0e, 0x02, 0xcd, 0x0a, 0x02, 0x2b, 0x2b, 0x11, 0x44, 0xd8, 0x0e, 0x02,
        0xcd, 0x0a, 0x02, 0xc9, 0x0e, 0x60, 0x2a, 0xe5, 0xc5, 0x21, 0xe8, 0x07, 0x06, 0x00, 0x4f, 0x09,
        0x0e, 0x08, 0xcd, 0x0a, 0x02, 0xc1, 0xe1, 0x0d, 0x20, 0xec, 0xc9, 0xfa, 0x08, 0xd0, 0x11, 0x18,
        0x00, 0x3c, 0x3d, 0x28, 0x03, 0x19, 0x20, 0xfa, 0xc9, 0xcd, 0x1d, 0x02, 0x78, 0xe6, 0xff, 0x28,
        0x0f, 0x21, 0xe4, 0x08, 0x06, 0x00, 0x2a, 0xb9, 0x28, 0x08, 0x04, 0x78, 0xfe, 0x0c, 0x20, 0xf6,
        0x18, 0x2d, 0x78, 0xea, 0x05, 0xd0, 0x3e, 0x1e, 0xea, 0x02, 0xd0, 0x11, 0x0b, 0x00, 0x19, 0x56,
        0x7a, 0xe6, 0x1f, 0x5f, 0x21, 0x08, 0xd0, 0x3a, 0x22, 0x7b, 0x77, 0x7a, 0xe6, 0xe0, 0x07, 0x07,
        0x07, 0x5f, 0x21, 0x0b, 0xd0, 0x3a, 0x22, 0x7b, 0x77, 0xcd, 0xe9, 0x04, 0xcd, 0x28, 0x05, 0xc9,
        0xcd, 0x11, 0x02, 0xfa, 0x43, 0x01, 0xcb, 0x7f, 0x28, 0x04, 0xe0, 0x4c, 0x18, 0x28, 0x3e, 0x04,
        0xe0, 0x4c, 0x3e, 0x01, 0xe0, 0x6c, 0x21, 0x00, 0xda, 0xcd, 0x7b, 0x05, 0x06, 0x10, 0x16, 0x00,
        0x1e, 0x08, 0xcd, 0x4a, 0x02, 0x21, 0x7a, 0x00, 0xfa, 0x00, 0xd0, 0x47, 0x0e, 0x02, 0x2a, 0xb8,
        0xcc, 0xda, 0x03, 0x0d, 0x20, 0xf8, 0xc9, 0x01, 0x0f, 0x3f, 0x7e, 0xff, 0xff, 0xc0, 0x00, 0xc0,
        0xf0, 0xf1, 0x03, 0x7c, 0xfc, 0xfe, 0xfe, 0x03, 0x07, 0x07, 0x0f, 0xe0, 0xe0, 0xf0, 0xf0, 0x1e,
        0x3e, 0x7e, 0xfe, 0x0f, 0x0f, 0x1f, 0x1f, 0xff, 0xff, 0x00, 0x00, 0x01, 0x01, 0x01, 0x03, 0xff,
        0xff, 0xe1, 0xe0, 0xc0, 0xf0, 0xf9, 0xfb, 0x1f, 0x7f, 0xf8, 0xe0, 0xf3, 0xfd, 0x3e, 0x1e, 0xe0,
        0xf0, 0xf9, 0x7f, 0x3e, 0x7c, 0xf8, 0xe0, 0xf8, 0xf0, 0xf0, 0xf8, 0x00, 0x00, 0x7f, 0x7f, 0x07,
        0x0f, 0x9f, 0xbf, 0x9e, 0x1f, 0xff, 0xff, 0x0f, 0x1e, 0x3e, 0x3c, 0xf1, 0xfb, 0x7f, 0x7f, 0xfe,
        0xde, 0xdf, 0x9f, 0x1f, 0x3f, 0x3e, 0x3c, 0xf8, 0xf8, 0x00, 0x00, 0x03, 0x03, 0x07, 0x07, 0xff,
        0xff, 0xc1, 0xc0, 0xf3, 0xe7, 0xf7, 0xf3, 0xc0, 0xc0, 0xc0, 0xc0, 0x1f, 0x1f, 0x1e, 0x3e, 0x3f,
        0x1f, 0x3e, 0x3e, 0x80, 0x00, 0x00, 0x00, 0x7c, 0x1f, 0x07, 0x00, 0x0f, 0xff, 0xfe, 0x00, 0x7c,
        0xf8, 0xf0, 0x00, 0x1f, 0x0f, 0x0f, 0x00, 0x7c, 0xf8, 0xf8, 0x00, 0x3f, 0x3e, 0x1c, 0x00, 0x0f,
        0x0f, 0x0f, 0x00, 0x7c, 0xff, 0xff, 0x00, 0x00, 0xf8, 0xf8, 0x00, 0x07, 0x0f, 0x0f, 0x00, 0x81,
        0xff, 0xff, 0x00, 0xf3, 0xe1, 0x80, 0x00, 0xe0, 0xff, 0x7f, 0x00, 0xfc, 0xf0, 0xc0, 0x00, 0x3e,
        0x7c, 0x7c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x88, 0x16, 0x36, 0xd1, 0xdb, 0xf2, 0x3c, 0x8c,
        0x92, 0x3d, 0x5c, 0x58, 0xc9, 0x3e, 0x70, 0x1d, 0x59, 0x69, 0x19, 0x35, 0xa8, 0x14, 0xaa, 0x75,
        0x95, 0x99, 0x34, 0x6f, 0x15, 0xff, 0x97, 0x4b, 0x90, 0x17, 0x10, 0x39, 0xf7, 0xf6, 0xa2, 0x49,
        0x4e, 0x43, 0x68, 0xe0, 0x8b, 0xf0, 0xce, 0x0c, 0x29, 0xe8, 0xb7, 0x86, 0x9a, 0x52, 0x01, 0x9d,
        0x71, 0x9c, 0xbd, 0x5d, 0x6d, 0x67, 0x3f, 0x6b, 0xb3, 0x46, 0x28, 0xa5, 0xc6, 0xd3, 0x27, 0x61,
        0x18, 0x66, 0x6a, 0xbf, 0x0d, 0xf4, 0x42, 0x45, 0x46, 0x41, 0x41, 0x52, 0x42, 0x45, 0x4b, 0x45,
        0x4b, 0x20, 0x52, 0x2d, 0x55, 0x52, 0x41, 0x52, 0x20, 0x49, 0x4e, 0x41, 0x49, 0x4c, 0x49, 0x43,
        0x45, 0x20, 0x52, 0x7c, 0x08, 0x12, 0xa3, 0xa2, 0x07, 0x87, 0x4b, 0x20, 0x12, 0x65, 0xa8, 0x16,
        0xa9, 0x86, 0xb1, 0x68, 0xa0, 0x87, 0x66, 0x12, 0xa1, 0x30, 0x3c, 0x12, 0x85, 0x12, 0x64, 0x1b,
        0x07, 0x06, 0x6f, 0x6e, 0x6e, 0xae, 0xaf, 0x6f, 0xb2, 0xaf, 0xb2, 0xa8, 0xab, 0x6f, 0xaf, 0x86,
        0xae, 0xa2, 0xa2, 0x12, 0xaf, 0x13, 0x12, 0xa1, 0x6e, 0xaf, 0xaf, 0xad, 0x06, 0x4c, 0x6e, 0xaf,
        0xaf, 0x12, 0x7c, 0xac, 0xa8, 0x6a, 0x6e, 0x13, 0xa0, 0x2d, 0xa8, 0x2b, 0xac, 0x64, 0xac, 0x6d,
        0x87, 0xbc, 0x60, 0xb4, 0x13, 0x72, 0x7c, 0xb5, 0xae, 0xae, 0x7c, 0x7c, 0x65, 0xa2, 0x6c, 0x64,
        0x85, 0x80, 0xb0, 0x40, 0x88, 0x20, 0x68, 0xde, 0x00, 0x70, 0xde, 0x20, 0x78, 0x20, 0x20, 0x38,
        0x20, 0xb0, 0x90, 0x20, 0xb0, 0xa0, 0xe0, 0xb0, 0xc0, 0x98, 0xb6, 0x48, 0x80, 0xe0, 0x50, 0x1e,
        0x1e, 0x58, 0x20, 0xb8, 0xe0, 0x88, 0xb0, 0x10, 0x20, 0x00, 0x10, 0x20, 0xe0, 0x18, 0xe0, 0x18,
        0x00, 0x18, 0xe0, 0x20, 0xa8, 0xe0, 0x20, 0x18, 0xe0, 0x00, 0x20, 0x18, 0xd8, 0xc8, 0x18, 0xe0,
        0x00, 0xe0, 0x40, 0x28, 0x28, 0x28, 0x18, 0xe0, 0x60, 0x20, 0x18, 0xe0, 0x00, 0x00, 0x08, 0xe0,
        0x18, 0x30, 0xd0, 0xd0, 0xd0, 0x20, 0xe0, 0xe8, 0xff, 0x7f, 0xbf, 0x32, 0xd0, 0x00, 0x00, 0x00,
        0x9f, 0x63, 0x79, 0x42, 0xb0, 0x15, 0xcb, 0x04, 0xff, 0x7f, 0x31, 0x6e, 0x4a, 0x45, 0x00, 0x00,
        0xff, 0x7f, 0xef, 0x1b, 0x00, 0x02, 0x00, 0x00, 0xff, 0x7f, 0x1f, 0x42, 0xf2, 0x1c, 0x00, 0x00,
        0xff, 0x7f, 0x94, 0x52, 0x4a, 0x29, 0x00, 0x00, 0xff, 0x7f, 0xff, 0x03, 0x2f, 0x01, 0x00, 0x00,
        0xff, 0x7f, 0xef, 0x03, 0xd6, 0x01, 0x00, 0x00, 0xff, 0x7f, 0xb5, 0x42, 0xc8, 0x3d, 0x00, 0x00,
        0x74, 0x7e, 0xff, 0x03, 0x80, 0x01, 0x00, 0x00, 0xff, 0x67, 0xac, 0x77, 0x13, 0x1a, 0x6b, 0x2d,
        0xd6, 0x7e, 0xff, 0x4b, 0x75, 0x21, 0x00, 0x00, 0xff, 0x53, 0x5f, 0x4a, 0x52, 0x7e, 0x00, 0x00,
        0xff, 0x4f, 0xd2, 0x7e, 0x4c, 0x3a, 0xe0, 0x1c, 0xed, 0x03, 0xff, 0x7f, 0x5f, 0x25, 0x00, 0x00,
        0x6a, 0x03, 0x1f, 0x02, 0xff, 0x03, 0xff, 0x7f, 0xff, 0x7f, 0xdf, 0x01, 0x12, 0x01, 0x00, 0x00,
        0x1f, 0x23, 0x5f, 0x03, 0xf2, 0x00, 0x09, 0x00, 0xff, 0x7f, 0xea, 0x03, 0x1f, 0x01, 0x00, 0x00,
        0x9f, 0x29, 0x1a, 0x00, 0x0c, 0x00, 0x00, 0x00, 0xff, 0x7f, 0x7f, 0x02, 0x1f, 0x00, 0x00, 0x00,
        0xff, 0x7f, 0xe0, 0x03, 0x06, 0x02, 0x20, 0x01, 0xff, 0x7f, 0xeb, 0x7e, 0x1f, 0x00, 0x00, 0x7c,
        0xff, 0x7f, 0xff, 0x3f, 0x00, 0x7e, 0x1f, 0x00, 0xff, 0x7f, 0xff, 0x03, 0x1f, 0x00, 0x00, 0x00,
        0xff, 0x03, 0x1f, 0x00, 0x0c, 0x00, 0x00, 0x00, 0xff, 0x7f, 0x3f, 0x03, 0x93, 0x01, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x42, 0x7f, 0x03, 0xff, 0x7f, 0xff, 0x7f, 0x8c, 0x7e, 0x00, 0x7c, 0x00, 0x00,
        0xff, 0x7f, 0xef, 0x1b, 0x80, 0x61, 0x00, 0x00, 0xff, 0x7f, 0x00, 0x7c, 0xe0, 0x03, 0x1f, 0x7c,
        0x1f, 0x00, 0xff, 0x03, 0x40, 0x41, 0x42, 0x20, 0x21, 0x22, 0x80, 0x81, 0x82, 0x10, 0x11, 0x12,
        0x12, 0xb0, 0x79, 0xb8, 0xad, 0x16, 0x17, 0x07, 0xba, 0x05, 0x7c, 0x13, 0x00, 0x00, 0x00, 0x00
    ];
    return BootROMS;
}());


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Timer: () => (/* binding */ Timer)
/* harmony export */ });
var Timer = /** @class */ (function () {
    function Timer(m_mmu) {
        this.m_mmu = m_mmu;
        this.DIV = 0xFF04;
        this.TIMA = 0xFF05;
        this.TMA = 0xFF06;
        this.TAC = 0xFF07;
        this.IF = 0xFF0F;
        this.DIV_BIT = [7, 1, 3, 5];
        this.fallingEdgeDelay = false;
        this.pendingOverflow = false;
        this.fallingEdgeDelay = false;
        this.pendingOverflow = false;
    }
    Timer.prototype.step = function () {
        if (this.pendingOverflow) {
            this.m_mmu.write(this.TIMA, this.m_mmu.read(this.TMA));
            this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x04);
            this.pendingOverflow = false;
        }
        // Increment DIV
        var div = (this.m_mmu.read(this.DIV) << 8) + this.m_mmu.read(this.DIV - 1);
        div += 1;
        this.m_mmu.write(this.DIV, div >> 8);
        this.m_mmu.write(this.DIV - 1, div);
        this.updateEdge(div);
    };
    Timer.prototype.updateEdge = function (div) {
        var temp1 = this.m_mmu.read(this.TAC);
        var temp2 = this.DIV_BIT[this.m_mmu.read(this.TAC) & 0x03];
        temp1;
        temp2;
        if ((this.m_mmu.read(this.TAC) & 0x04) == 0x00) {
            return;
        }
        var bit = (div & (0x04 << this.DIV_BIT[this.m_mmu.read(this.TAC) & 0x03])) != 0;
        if (this.fallingEdgeDelay && !bit) {
            var tima = this.m_mmu.read(this.TIMA) + 1;
            this.m_mmu.write(this.TIMA, tima);
            if (tima > 0xFF) {
                this.pendingOverflow = true;
            }
        }
        this.fallingEdgeDelay = bit;
    };
    return Timer;
}());



/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Keyboard: () => (/* binding */ Keyboard)
/* harmony export */ });
var Keyboard = /** @class */ (function () {
    function Keyboard(m_mmu) {
        var _this = this;
        this.m_mmu = m_mmu;
        this.P1 = 0xFF00;
        this.IF = 0xFF0F;
        addEventListener("keydown", function (event) {
            _this.getKeyDown(event);
        });
        addEventListener("keyup", function (event) {
            _this.getKeyUp(event);
        });
        this.m_jState1 = 0xFF;
        this.m_jState2 = 0xFF;
    }
    Keyboard.prototype.step = function () {
        if ((this.m_mmu.read(this.P1) & 0x10) == 0) {
            this.m_mmu.write(this.P1, (this.m_mmu.read(this.P1) & 0xF0) + (this.m_jState1 & 0x0F));
        }
        else {
            this.m_mmu.write(this.P1, (this.m_mmu.read(this.P1) & 0xF0) + (this.m_jState2 & 0x0F));
        }
    };
    Keyboard.prototype.getKeyDown = function (event) {
        if (!event.repeat) {
            if (event.code == "ArrowRight") {
                this.m_jState1 &= 0xFE;
            }
            else if (event.code == "ArrowLeft") {
                this.m_jState1 &= 0xFD;
            }
            else if (event.code == "ArrowUp") {
                this.m_jState1 &= 0xFB;
            }
            else if (event.code == "ArrowDown") {
                this.m_jState1 &= 0xF7;
            }
            else if (event.code == "KeyS") {
                this.m_jState2 &= 0xFE;
            }
            else if (event.code == "KeyA") {
                this.m_jState2 &= 0xFD;
            }
            else if (event.code == "ShiftRight") {
                this.m_jState2 &= 0xFB;
            }
            else if (event.code == "Enter") {
                this.m_jState2 &= 0xF7;
            }
            this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x10);
        }
    };
    Keyboard.prototype.getKeyUp = function (event) {
        if (event.code == "ArrowRight") {
            this.m_jState1 |= 0x01;
        }
        else if (event.code == "ArrowLeft") {
            this.m_jState1 |= 0x02;
        }
        else if (event.code == "ArrowUp") {
            this.m_jState1 |= 0x04;
        }
        else if (event.code == "ArrowDown") {
            this.m_jState1 |= 0x08;
        }
        else if (event.code == "KeyS") {
            this.m_jState2 |= 0x01;
        }
        else if (event.code == "KeyA") {
            this.m_jState2 |= 0x02;
        }
        else if (event.code == "ShiftRight") {
            this.m_jState2 |= 0x04;
        }
        else if (event.code == "Enter") {
            this.m_jState2 |= 0x08;
        }
    };
    return Keyboard;
}());



/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _classes_machine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
var width = 160;
var height = 144;
var scale = 2;
var machine;
var colorMap = [0X00, 0X08, 0X10, 0X18, 0X20, 0X29, 0X31, 0X39,
    0X41, 0X4A, 0X52, 0X5A, 0X62, 0X6A, 0X73, 0X7B,
    0X83, 0X8B, 0X94, 0X9C, 0XA4, 0XAC, 0XB4, 0XBD,
    0XC5, 0XCD, 0XD5, 0XDE, 0XE6, 0XEE, 0XF6, 0XFF];
ctx.canvas.width = width * scale;
ctx.canvas.height = height * scale;
var myImageData = ctx.createImageData(width * scale, height * scale);
function wrapper() {
    var data = myImageData.data;
    var frame = machine.getFrame();
    var index1 = 0;
    for (var i = 0; i < height; i++) {
        for (var x = 0; x < scale; x++) {
            for (var j = 0; j < width; j++) {
                for (var y = 0; y < scale; y++) {
                    var index2 = (i * width) + j;
                    data[(index1 * 4)] = colorMap[(frame[index2] & 0x001F)];
                    data[(index1 * 4) + 1] = colorMap[(frame[index2] & 0x03E0) >> 5];
                    data[(index1 * 4) + 2] = colorMap[(frame[index2] & 0x7C00) >> 10];
                    data[(index1 * 4) + 3] = 255;
                    index1++;
                }
            }
        }
    }
    ctx.putImageData(myImageData, 0, 0);
}
var fileSelector = document.getElementById('file-selector');
fileSelector.addEventListener('change', function (e) {
    var files = e.target.files;
    machine = new _classes_machine__WEBPACK_IMPORTED_MODULE_0__.Machine(files[0]);
    setInterval(wrapper, 1000 / 60);
});
function loadRemoteFile(url) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.responseType = "blob";
    xmlhttp.onload = function () {
        var blob = xmlhttp.response;
        var file = new File([blob], "foo.txt", { type: "text/plain" });
        machine = new _classes_machine__WEBPACK_IMPORTED_MODULE_0__.Machine(file);
        setInterval(wrapper, 1000 / 60);
    };
    xmlhttp.send();
}
var button1 = document.getElementById('tetris');
button1.addEventListener("click", function () {
    loadRemoteFile('https://asori015.github.io/GB-Files/01-001.data');
});
var button2 = document.getElementById('poke-red');
button2.addEventListener("click", function () {
    loadRemoteFile('https://asori015.github.io/GB-Files/02-001.data');
});
var button3 = document.getElementById('zelda');
button3.addEventListener("click", function () {
    loadRemoteFile('https://asori015.github.io/GB-Files/03-001.data');
});

})();

/******/ })()
;