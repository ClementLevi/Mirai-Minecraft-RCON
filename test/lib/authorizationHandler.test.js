<<<<<<< HEAD
const assert = require("assert");
const path = require("path");

const { isPermitted,listPerms } = require(path.resolve("./lib/authorizationHandler"));

describe("In the user group", () => {
    describe("Fn IsPermitted()", () => {
        it("1234567 (OP Group) can do anything", () => {
            assert.equal(isPermitted("abc", 1234567), true);
        });
        it("", () => {
            assert.equal(isPermitted("stop", 1234567), true);
        });
        it("Anyone outside the permission list can do nothing", () => {
            assert.equal(isPermitted("stop", 1234568), false);
        });
        it("", () => {
            assert.equal(isPermitted("abc", 1234568), false);
        });
        it("Grouped user can do permitted things", () => {
            assert.equal(isPermitted("stop", 114514), false);
        });
        it("", () => {
            assert.equal(isPermitted("abc", 114514), false);
        });
        it("", () => {
            assert.equal(isPermitted("abc", 1919810), false);
        });
        it("RegExp can match", () => {
            assert.equal(
                isPermitted("fill 0 0 0 2 2 2 minecraft:stone", 114514),
                true
            );
        });
        it("", () => {
            assert.equal(isPermitted("lg i", 1919810), true);
        });
    });
    describe("Fn listPerms\nDisplay specific user's permission", ()=>{
        it("1",()=>{
            assert.equal(listPerms(1234567).toString(), [ '.+' ].toString());
        })
        it("2",()=>{
            assert.equal(listPerms(1234568).toString(), [].toString());
        })
        it("3",()=>{
            assert.equal(listPerms(114514).toString(), [ 'fill' ].toString());
        })
        it("4",()=>{
            assert.equal(listPerms(1919810).toString(), [ 'ledger i', 'lg i' ].toString());
        })
    })
});
=======
const assert = require("assert");
const path = require("path");

const { isPermitted,listPerms } = require(path.resolve("./lib/authorizationHandler"));

describe("In the user group", () => {
    describe("Fn IsPermitted()", () => {
        it("1234567 (OP Group) can do anything", () => {
            assert.equal(isPermitted("abc", 1234567), true);
        });
        it("", () => {
            assert.equal(isPermitted("stop", 1234567), true);
        });
        it("Anyone outside the permission list can do nothing", () => {
            assert.equal(isPermitted("stop", 1234568), false);
        });
        it("", () => {
            assert.equal(isPermitted("abc", 1234568), false);
        });
        it("Grouped user can do permitted things", () => {
            assert.equal(isPermitted("stop", 114514), false);
        });
        it("", () => {
            assert.equal(isPermitted("abc", 114514), false);
        });
        it("", () => {
            assert.equal(isPermitted("abc", 1919810), false);
        });
        it("RegExp can match", () => {
            assert.equal(
                isPermitted("fill 0 0 0 2 2 2 minecraft:stone", 114514),
                true
            );
        });
        it("", () => {
            assert.equal(isPermitted("lg i", 1919810), true);
        });
    });
    describe("Fn listPerms\nDisplay specific user's permission", ()=>{
        it("1",()=>{
            assert.equal(listPerms(1234567).toString(), [ '.+' ].toString());
        })
        it("2",()=>{
            assert.equal(listPerms(1234568).toString(), [].toString());
        })
        it("3",()=>{
            assert.equal(listPerms(114514).toString(), [ 'fill' ].toString());
        })
        it("4",()=>{
            assert.equal(listPerms(1919810).toString(), [ 'ledger i', 'lg i' ].toString());
        })
    })
});
>>>>>>> a96c88f (test modify: merged and cleaned unit tests)
