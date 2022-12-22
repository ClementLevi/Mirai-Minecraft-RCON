/**
 * 我准备多语言支持干什么
 */
const path = require("path");
const YAML = require("yaml");
const fs = require("fs");

function loadLangName() {
    try {
        let file = fs.readFileSync(
            path.resolve("./config/config.yml"),
            "utf-8"
        );
        var lang = YAML.parse(file)["lang"];
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
    return lang;
}

function loadLangContent(languageName) {
    try {
        var localeContent = JSON.parse(
            fs.readFileSync(path.resolve("./locale/" + languageName + ".json"))
        );
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
    return localeContent
}

let translation = loadLangContent(loadLangName())
module.exports =  translation ;