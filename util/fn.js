exports.Requestion_Number_Generator = (length) => {
    var str = "" + length
    var pad = "000000"
    var ans = pad.substring(0, pad.length - str.length) + str;
    return ans
}

exports.CountQty = {
    Qty: 0,
    add(newArray) {
        const initialValue = 0;
        const total = newArray.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            initialValue
        );
        Qty = total
    },
    get getTotalQty() {
        return Qty
    }
}