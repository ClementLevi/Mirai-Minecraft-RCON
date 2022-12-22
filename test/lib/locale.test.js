const assert = require("assert");
const { describe } = require("mocha");
const path = require("path");

const translation = require(path.resolve("./lib/locale"));

// 有io，不写了干脆
describe("locale.js", () => {
    it("Can load language file", () => {
        assert.ok(translation);
    });
});
