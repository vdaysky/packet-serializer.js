import {Int, Str, Obj, List} from '../out/types.js';

function deserializePacket(bytes, types) {
    let idx = 4;
    let parsed = {};

    parsed.type = bytes[0]
    bytes = bytes.slice(1);
    parsed.id = Int.grab(bytes, 0)[0];
    
    for (let value_name of Object.keys(types)) {
        let value_type = types[value_name];
        let [value, size] = value_type.grab(bytes, idx);
        parsed[value_name] = value;
        idx += size;
    }    
    return parsed;
}

let packet = [12, 87, 4, 0, 0, 97, 98, 99, 0, 234, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 104, 101, 108, 108, 111, 0, 4, 0, 0, 0, 49, 2, 104, 105, 45, 49, 2, 50, 2, 49, 2, 50, 2, 51, 2, 49, 2, 50, 2, 51, 0, 2, 49, 2, 104, 105, 45, 49, 2, 50, 2, 49, 2, 50, 2, 51, 2, 49, 2, 50, 2, 51, 0, 2, 49, 2, 104, 105, 45, 49, 2, 50, 2, 49, 2, 50, 2, 51, 2, 49, 2, 50, 2, 51, 0, 0]



let type = {
    thing: Str,
    thing2: Int,
    thing3: new Obj({
        thing1_1: Int,
        thing1_2: Int,
        thing1_3: Str,
        thing1_4: Int,
        thing1_5: new List({
            thing_1_1_1: Int,
            thing_1_1_2: Str,
            thing_1_1_3: Int,
            thing_1_1_4: new List({
                thing_1_1_4_1: Int,
                thing_1_1_4_2: Int,
                thing_1_1_4_3: Int,
            })

        })

    })

}
console.log(deserializePacket(packet, type).thing3.thing1_5[0].thing_1_1_4);
