import * as mysql from 'mysql';
export var connect: mysql.Connection;
export var config: mysql.ConnectionConfig;
export var connectMap: Map<string, mysql.Connection>;
export type testCallback = (message?: string, stack?: any) => void;
/**
* 保证所有连接不断开
 */
export function listenConnect(): void {
    setInterval(() => {
        if (connect != undefined) {
            exec("", "", " select version() version;", () => { });
        }
        if (connectMap != undefined) {
            connectMap.forEach((conn, database) => {
                exec("", database, " select version() version;", () => { });
            });
        }
    }, 5 * 60 * 1000);
}


export type QueryCallback = (err: mysql.MysqlError, results?: any, fields?: mysql.FieldInfo[], key?: string) => void
export function showVersion(config0: mysql.ConnectionConfig, callback: mysql.queryCallback) {
    const conn = mysql.createConnection(config0);
    
    conn.query(" select version() version;", (err: mysql.MysqlError, results?: any, fields?: mysql.FieldInfo[]) => {
        conn.destroy();
        callback(err, results, fields);
    });
}
export function showDatabases(config0: mysql.ConnectionConfig, callback: mysql.queryCallback) {
    if (config0 != undefined)
        config = config0;

    if (connect == undefined)
        connect = mysql.createConnection(config);

    connect.query("show databases", callback);
}
export function getDatabases(config0: mysql.ConnectionConfig, callback: mysql.queryCallback) {
    if (config0 != undefined)
        config = config0;
    if (connect == undefined)
        connect = mysql.createConnection(config);
    connect.query("select table_schema as 'database',sum(table_rows) as 'rows',sum(truncate(data_length/1024/1024, 2)) as 'size',sum(truncate(index_length/1024/1024, 2)) as 'index_size'from information_schema.tables  group by table_schema", callback);
}
export function getTabels(database: string, callback: mysql.queryCallback) {
    if (connect == undefined)
        connect = mysql.createConnection(config);
    connect.query("select table_name as 'table',table_rows as 'row',truncate(data_length/1024/1024, 2) as 'size',truncate(index_length/1024/1024, 2) as 'idnex_size',TABLE_COMMENT  comment from information_schema.tables where table_schema='" + database + "'", callback);
}
export function getTabelsSuggestions(callback: mysql.queryCallback) {
    if (connect == undefined)
        connect = mysql.createConnection(config);
    connect.query("select table_schema as 'database', table_name as 'table',table_rows as 'row',truncate(data_length/1024/1024, 2) as 'size',truncate(index_length/1024/1024, 2) as 'idnex_size',TABLE_COMMENT  comment from information_schema.tables ", callback);
}
export function getTablesColumn(database: string, table: string, callback: mysql.queryCallback) {
    if (connect == undefined)
        connect = mysql.createConnection(config);
    var sql = "SELECT COLUMN_NAME,COLUMN_TYPE,COLUMN_DEFAULT,CHARACTER_MAXIMUM_LENGTH,COLUMN_KEY, COLUMN_COMMENT FROM INFORMATION_SCHEMA.Columns WHERE table_name='" + table + "' AND table_schema='" + database + "'";
    connect.query(sql, callback);
}

export function getColumnSuggestions(callback: mysql.queryCallback) {
    if (connect == undefined)
        connect = mysql.createConnection(config);
    connect.query("SELECT table_schema as 'database', TABLE_NAME,COLUMN_NAME, COLUMN_COMMENT FROM INFORMATION_SCHEMA.Columns ", callback);
}

export function exec(key: string, database: string, sql: string, callback: QueryCallback) {
    if (config == undefined) {
        callback({ message: "Please connect to the database first！", stack: "We did not find database connection configuration！", code: "0", errno: 1, fatal: false, name: "Error" }, undefined, undefined, key);
        return;
    }

    if (database == undefined || database == "undefined") {
        if (connect == undefined)
            connect = mysql.createConnection(config);
        connect.query(sql, (error, result, fields) => {
            callback(error, result, fields, key);
        });

    } else {
        if (connectMap == undefined) {
            connectMap = new Map();
        }
        var conn = connectMap.get(database);
        if (conn == undefined || conn == null) {
            conn = mysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: database,

            });
            connectMap.set(database, conn);
        }

        console.log(sql);
        conn.query(sql, (error, result, fields) => {
            callback(error, result, fields, key);
        });
    
    }


}