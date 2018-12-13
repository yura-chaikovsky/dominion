const Server                    = require("dominion");
const Config                    = use("config");


Server.addComponent(use("components/sessions"));
Server.addComponent(use("components/permissions"));
Server.addComponent(use("components/accounts"));
Server.addComponent(use("components/tracking"));
Server.addComponent(use("components/logging"));
Server.addComponent(use("components/authorize"));

Server.addComponent(require("./components/accounts"));

Server.start(Config);


if (Config.env.development) {
    const fs = require("fs");
    const openAPIJSON = Server.openApiJSON({
        "title": "Dominion Framework",
        "description": "Dominion Framework API Developers Docs",
        "version": "1.0.0",
        "contact": {
            "email": "yura.chaikovsky@gmail.com"
        }
    });
    fs.writeFileSync("./statoksystems.openapi.json", JSON.stringify(openAPIJSON, null, 4));
}