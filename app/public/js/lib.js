function setTablePageAndLimit(res, curr, config) {
    let table_name = config.id;
    let limit = config.limit;
    if (res.data.length === 0) {
        if (res.count === 0) {
            curr = 1;
        } else {
            curr = Math.ceil(res.count / limit);
        }
    }
    layui.data(table_name, {
        key: 'curr'
        , value: curr
    });
    layui.data(table_name, {
        key: 'limit'
        , value: limit
    });
}

function getTablePageAndLimit(table_name) {
    const table = layui.data(table_name);
    if (table) {
        const curr = table.curr;
        const limit = table.limit;
        return {
            curr: curr,
            limit: limit
        }
    } else {
        return true;
    }
}