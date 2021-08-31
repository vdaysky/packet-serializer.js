function bytes_to_int(bytes) {
    let value = 0;
    for (let i = bytes.length - 1; i >= 0; i--) {
        value = (value * 256) + bytes[i];
    }
    return value;
}
function bytes_to_string(bytes) {
    let res = "";
    for (let b of bytes) {
        res += String.fromCharCode(b);
    }
    return res;
}
function grab_list_component(bytes, start) {
    let res = [];
    let len = 0;
    while (1) {
        let char = bytes[start + len++];
        if (char == 2 || char == 0) {
            console.log("breaking byte:", char);
            if (char == 0) {
                // move pointer backwards to make sure zero is there
                len--;
            }
            break;
        }
        console.log("add", char, "to list component");
        res.push(char);
    }
    return [res, len];
}
class IntegerType {
    grab(bytes, start) {
        let int_bytes = bytes.slice(start, start + 4);
        return [bytes_to_int(int_bytes), 4];
    }
    grab_from_string(bytes, start) {
        let [num_bytes, len] = grab_list_component(bytes, start);
        let int_string = bytes_to_string(num_bytes);
        return [parseInt(int_string), len];
    }
}
export class StringType {
    grab(bytes, start) {
        let string = "";
        let len = 0;
        while (1) {
            let byte = bytes[start + len++];
            if (byte == 0 || byte === undefined) {
                break;
            }
            string += String.fromCharCode(byte);
        }
        return [string, len];
    }
    grab_from_string(bytes, start) {
        let [str_bytes, len] = grab_list_component(bytes, start);
        return [bytes_to_string(str_bytes), len];
    }
}
export class List {
    constructor(entry) {
        this.types = entry;
    }
    grab(bytes, start) {
        let items = [];
        let size = 0;
        while (1) {
            let char = bytes[start + size];
            if (char == 0) {
                console.log("0x0 - list end: ", this.types);
                break;
            }
            if (char == undefined) {
                throw "stream ended while trying to read list item";
            }
            let item = {};
            for (let var_name of Object.keys(this.types)) {
                let type = this.types[var_name];
                let [val, len] = type.grab_from_string(bytes, start + size);
                item[var_name] = val;
                size += len;
            }
            items.push(item);
        }
        return [items, size];
    }
    grab_from_string(bytes, start) {
        return this.grab(bytes, start);
    }
}
export class Obj {
    constructor(types) {
        this.types = types;
    }
    grab(bytes, start) {
        let size = 0;
        let obj = {};
        for (let var_name of Object.keys(this.types)) {
            let type = this.types[var_name];
            let [val, len] = type.grab(bytes, start + size);
            obj[var_name] = val;
            size += len;
        }
        return [obj, size];
    }
    grab_from_string(bytes, start) {
        let size = 0;
        let obj = {};
        for (let var_name of Object.keys(this.types)) {
            let type = this.types[var_name];
            let [val, len] = type.grab(bytes, start + size);
            obj[var_name] = val;
            size += len;
        }
        return [obj, size];
    }
}
export const Int = new IntegerType();
export const Str = new StringType();
