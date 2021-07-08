const sqlite3 = {
    client: 'sqlite3',
    connection: {
        filename: __dirname + '/../database/db.sqlite'
    },
    useNullAsDefault: true
}
module.exports = sqlite3;