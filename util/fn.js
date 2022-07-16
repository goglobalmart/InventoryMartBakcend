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

exports.CheckQty = {
    Qtyms: "",
    add(inputQty, qty, stock, material) {
        // if (inputQty > qty)
      this.Qtyms = `${stock}មិនមាន ${material} គ្រប់។ ចំនួនមានតែ${qty}`
    //   console.log(this.Qtyms)
      return  "ds"
        // console.log(inputQty, qty)
        // console.log(Qtyms)
    },
    get getCheckQtyMesssage() {
        console.log(this.Qtyms)
        return this.Qtyms
    }
}

// exports.checkQtyMessage = 