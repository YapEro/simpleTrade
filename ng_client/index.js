"use strict";
const platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
const core_1 = require("@angular/core");
const app_module_1 = require("./app.module");
if (process.env.ENV === 'production') {
    core_1.enableProdMode();
}
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule);
//# sourceMappingURL=index.js.map