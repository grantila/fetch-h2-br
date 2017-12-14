'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const iltorb_1 = require("iltorb");
function brDecode() {
    return {
        name: 'br',
        decode(stream) {
            return stream.pipe(iltorb_1.decompressStream());
        }
    };
}
exports.default = brDecode;
exports.brDecode = brDecode;
//# sourceMappingURL=index.js.map