let dict1 = new Map([[1, 2], [3, 4]]);
let dict2 = new Map([["a", 2], ["b", 4]]);
let dict3 = new Map([]);
set(dict3, "foo", "bar");
output(get(dict3, "foo"));
set(dict3, "garage", "out");
output(dict3);
output("The dict has", size(dict3), "entries in it.");
each(entries(dict3), function (entry) {
	let key = at(entry, 0);
	let value = at(entry, 1);
	return output(key, "=", value);
});
/*
Runtime functions:
*/

function output(...args) {
    console.log(...args);
}

function add(...args) {
    return args.reduce((sum, num) => sum + num, 0);
}

function sub(x, y) {
    return x - y;
}

function mul(...args) {
    return args.reduce((sum, num) => sum * num, 1);
}

function div(x, y) {
    return x / y;
}

function remainder(x, y) {
    return x % y;
}

function abs(n) {
    return Math.abs(n);
}

function pow(n, m) {
    return Math.pow(n, m);
}

function sqrt(x) {
    return Math.sqrt(x);
}

function gt(x, y) {
    return x > y;
}

function eq(one, other) {
    return one === other;
}

function concat(...args) {
    return args.reduce((sum, num) => sum + num, "");
}

function split(str, separator) {
    return str.split(separator);
}

function join(arr, separator) {
    return arr.join(separator);
}

function at(arr, index) {
    return arr[index];
}

function substring(string, start, end) {
    return string.substring(start, end);
}

function toUpperCase(string) {
    return string.toUpperCase();
}

function toLowerCase(string) {
    return string.toLowerCase();
}

function each(arr, fun) {
    return arr.forEach(fun);
}

function map(arr, fun) {
    return arr.map(fun);
}

function filter(arr, fun) {
    return arr.filter(fun);
}

function reduce(arr, fun, initValue) {
    return arr.reduce(fun, initValue);
}

function entries(map) {
    return Array.from(map.entries());
}

function get(map, key) {
    return map.get(key);
}

function set(map, key, value) {
    map.set(key, value);
}

function size(setOrMap) {
    return setOrMap.size;
}

function length(arr) {
    return arr.length;
}

function $if(cond, consequent, alternate) {
    if (cond) {
        return consequent();
    } else {
        return alternate();
    }
}