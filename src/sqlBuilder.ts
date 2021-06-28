
   export default `
   var H = {
       /**
        * 等于\n
        * 相当于SQL中的 =
        */
       EQ: Compare,
       /**
        * 不等于\n
        * 相当于SQL中的 !=
        */
       NOT_EQ: Compare,
       /**
        * 大于等于\n
        * 相当于SQL中的 >=
        */
       GE: Compare,
       /**
        * 大于\n
        * 相当于SQL中的 >=
        */
       GT: Compare,
       /**
        * 小于等于\n
        * 相当于SQL中的 <=
        */
       LE: Compare,
       /**
        * 小于\n
        * 相当于SQL中的 <
        */
       LT: Compare,
       /**
        * 在...中\n
        * 相当于SQL中的 IN
        */
       IN: Compare,
       /**
        * 不在...中\n
        * 相当于SQL中的 NOT IN
        */
       NOT_IN: Compare,
       /**
        * 类似，模糊匹配\n
        * 相当于SQL中的 LIKE
        */
       LIKE: Compare,
       /**
        * 不类似，模糊匹配\n
        * 相当于SQL中的 NOT LIKE
        */
       NOT_LIKE: Compare,
       /**
        * 为空值\n
        * 相当于SQL中的 IS NULL
        */
       IS_NULL: Compare,
       /**
        * 不为空值\n
        * 相当于SQL中的 IS NOT NULL
        */
       IS_NOT_NULL: Compare,
       /**
        * 升序
        */
       ASC: Order,
       /**
        * 降序
        */
       DESC: Order,
       /**
        * 左连接
        */
       LEFT_JOIN: joinSql,
       /**
        * 右连接
        */
       RIGHT_JOIN: joinSql,
       /**
        * 内连接
        */
       INNER_JOIN: joinSql,
       /**
        * 嵌套条件\n
        * 例如SQL中 ... where (a>10 or a <5) and (b>10 or b<5)可以表示为\n
        * ...where(H.COUND("a", H.GT, 10).or("a", H.LT, 5)).and(H.COUND("b", H.GT, 10).or("b", H.LT, 5))
        * @param  {any} left 筛选条件左边
        * @param  {Compare} compare 对比符，默认 H.EQ
        * @param  {any} right 筛选条件右边，如果对比符为 H.IS_NULL 或 H.IS_NOT_NULL可不填
        * @return {Cond}
        */
       COND(left, compare, right) {
           class Cond {
               /**
                * @param  {any} left 筛选条件左边
                * @param  {Compare} compare 对比符，默认 H.EQ
                * @param  {any} right 筛选条件右边，如果对比符为 H.IS_NULL 或 H.IS_NOT_NULL可不填
                 * @return {Cond}
                */
               and(left, compare, right) {},
               /**
                * @param  {any} left 筛选条件左边
                * @param  {Compare} compare 对比符，默认 H.EQ
                * @param  {any} right 筛选条件右边，如果对比符为 H.IS_NULL 或 H.IS_NOT_NULL可不填
                 * @return {Cond}
                */
               or(left, compare, right) {}
           }
       },
       /**
        * 返回日期\n
        * 相当于SQL中的 DATE() 函数
        * @param {any} val 字段名或表示时间的字符串
        */
       DATE(val) {},
       /**
        * 返回年份\n
        * 相当于SQL中的 YEAR() 函数
        * @param {any} val 字段名或表示时间的字符串
        */
       YEAR(val) {},
       /**
        * 返回当前时间\n
        * 相当于SQL中的 NOW() 函数
        */
       NOW() {},
       /**
        * 计数\n
        * 相当于SQL中的 COUNT() 函数
        * @param {string} col 字段名，即控件编码
        */
       COUNT(col) {},
       /**
        * @param {string} expression 运算表达式，例如 (a.val1 + a.val2) / b.val1
        */
       EXPR(expression) {}
   }
   `