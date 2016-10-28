const fs                        = require('fs');
const db                        = require('core/repositories/db');
const config                    = require('config');


before(function (done) {
    db.query(`DROP DATABASE IF EXISTS ${config.database.testDatabaseName}`)
    .then(() => db.query(`CREATE DATABASE ${config.database.testDatabaseName} DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;`))
    .then(() => db.query(`USE ${config.database.testDatabaseName};`))
    .then(() => {
        let dbSqlDump = (fs.readFileSync(`databaseStructure.sql`, 'utf8') + '\r\n'
                        + fs.readFileSync(`databaseTestsData.sql`, 'utf8')).split(/;(?:\r\n)+/);
        let promises = [];
        dbSqlDump.forEach((item) => promises.push(db.query(item)));
        return Promise.all(promises);
    })
    .then(() => {
        require("./../index");
        done();
    })
    .catch(done);
});
