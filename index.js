String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

const binHexMap = {
    "0000": "0",
    "0001": "1",
    "0010": "2",
    "0011": "3",
    "0100": "4",
    "0101": "5",
    "0110": "6",
    "0111": "7",
    "1000": "8",
    "1001": "9",
    "1010": "A",
    "1011": "B",
    "1100": "C",
    "1101": "D",
    "1110": "E",
    "1111": "F"
}

const hexBinMap = {
    "0": "0000",
    "1": "0001",
    "2": "0010",
    "3": "0011",
    "4": "0100",
    "5": "0101",
    "6": "0110",
    "7": "0111",
    "8": "1000",
    "9": "1001",
    "A": "1010",
    "B": "1011",
    "C": "1100",
    "D": "1101",
    "E": "1110",
    "F": "1111"
}

class Clocker {
    constructor() {
        this.active = 0
        this.global = 0
    }

    tick (){
        this.active += 1
        this.global += 1
        if(this.active == 10){
            intBrain.process()
            floatBrain.process()
            mathBrain.getValue()
        }
    }

    activeReset() {
        this.active = 0
    }
}

class IntBrain {
    constructor() {
        this.In = {
            "dec": document.getElementById("decIn"),
            "bin": document.getElementById("binIn"),
            "rev": document.getElementById("revIn"),
            "add": document.getElementById("addIn"),
            "reg": document.getElementById("regIn"),
            "hex": document.getElementById("hexIn")
        }
        
        this.Span = {
            "dec": document.getElementById("decSpan"),
            "bin": document.getElementById("binSpan"),
            "rev": document.getElementById("revSpan"),
            "add": document.getElementById("addSpan"),
            "reg": document.getElementById("regSpan"),
            "hex": document.getElementById("hexSpan")
        }
        
        this.Val = {
            "dec": 0,
            "bin": 0,
            "rev": 0,
            "add": 0,
            "reg": 0,
            "hex": 0
        }

        this.lastActive = "dec"
    }

    onlyDigits(string){
        for (let i = 0; i < string.length; i += 1) {
            if(isFinite(string[i]) == false){
                return false
            }
        }
        return true
    }

    getValue(){
        for(const [key, value] of Object.entries(this.In)){
            value.style.color = "#000000"
        }

        for(const [key, value] of Object.entries(this.Span)){
            //console.log(value)
            value.style.color = "#000000"
        }

        if(!this.onlyDigits(this.In["dec"].value)){
            if(this.In["dec"].value[0] == "-" && this.In["dec"].value.length > 1 && this.onlyDigits(this.In["dec"].value.slice(1))){
                this.Val["dec"] = parseInt(this.In["dec"].value)
            } else {
                this.Span["dec"].style.color = "#FF0000"
                this.Val["dec"] = 0
            }
        } else {
            this.Val["dec"] = parseInt(this.In["dec"].value);
        }

        for(const [key, value] of Object.entries(this.In)){
            if(key != "dec" && key != "hex"){
                if(!this.onlyDigits(value.value)){
                    this.Val[key] = 0;
                    this.Span[key].style.color = "#FF0000"
                } else {
                    this.Val[key] = value.value;
                }
            }
        }

        this.Val["hex"] = this.In["hex"].value;
    }

    setValue(exeption){
        if(exeption == "empty"){
            this.In["dec"].value = ""
            this.In["bin"].value = ""
            this.In["rev"].value = ""
            this.In["add"].value = ""
            this.In["hex"].value = ""
            return undefined
        }
        if(exeption != "dec"){
            this.In["dec"].value = this.Val["dec"]
        }
        if(exeption != "bin"){
            this.In["bin"].value = this.Val["bin"]
        }
        if(exeption != "rev"){
            this.In["rev"].value = this.Val["rev"]
        }
        if(exeption != "add"){
            this.In["add"].value = this.Val["add"]
        }
        if(exeption != "hex"){
            this.In["hex"].value = this.Val["hex"]
        }
    }

    process(){
        this.getValue()
        if(!document.activeElement.value && this.In[document.activeElement.id.slice(0, 3)]){
            document.getElementById(document.activeElement.id.slice(0, 3) + "Span").style.color = "#ff0000"
            //console.log(document.activeElement.id.slice(0, 3) + "Span")
        } else {
            let target = document.activeElement
            if(document.activeElement === this.In["reg"]){
                target = document.getElementById(this.lastActive + "In")
            }
            if(target === this.In["dec"]){
                this.dec()
                this.setValue("dec")
                this.lastActive = "dec"
            }
            if(target === this.In["bin"]){
                this.bin()
                this.setValue("bin")
                this.lastActive = "bin"
            }
            if(target === this.In["rev"]){
                this.rev()
                this.setValue("rev")
                this.lastActive = "rev"
            }
            if(target === this.In["add"]){
                this.add()
                this.setValue("add")
                this.lastActive = "add"
            }
            if(target === this.In["hex"]){
                this.hex()
                this.setValue("hex")
                this.lastActive = "hex"
            }
        }
    }

    dec(){
        this.Val["bin"] = ""
        let x = Math.abs(this.Val["dec"])
        if(x > Math.pow(2, this.Val["reg"]) - 1){
            x = Math.pow(2, this.Val["reg"]) - 1
            this.In["reg"].style.color = "#FF0000"
            this.Span["reg"].style.color = "#FF0000"
        } else if(this.Val["dec"] < -Math.pow(2, this.Val["reg"]-1)+1){
            x = Math.abs(-Math.pow(2, this.Val["reg"]-1)+1)
            this.In["reg"].style.color = "#FF0000"
            this.Span["reg"].style.color = "#FF0000"
        }
        let startVal = this.Val["reg"] - 1

        for(let i = 0; i <= startVal; i += 1){
            if(x < Math.pow(2, i)){
                startVal = i - 1;
                break;
            }
        }

        for(let i = 0; i < this.Val["reg"] - startVal - 1; i += 1){
            this.Val["bin"] += "0"
        }

        for(let i = startVal; i >= 0; i -= 1){
            //console.log(x / Math.pow(2, i))
            this.Val["bin"] += parseInt(x / Math.pow(2, i))
            x %= Math.pow(2, i)
        }

        if(this.Val["dec"] < 0){
            this.Val["rev"] = ""
            for(let i = 0; i < this.Val["reg"]; i += 1){
                if(this.Val["bin"][i] == 1){
                    this.Val["rev"] += 0
                } else {
                    this.Val["rev"] += 1
                }
            }

            this.Val["add"] = this.Val["rev"]
            for(let i = this.Val["reg"]-1; i >= 0; i -= 1){
                if(this.Val["rev"][i] == 0){
                    this.Val["add"] = this.Val["add"].replaceAt(i, "1")
                    i -= 1
                    while(i >= 0){
                        this.Val["add"] = this.Val["add"].replaceAt(i, this.Val["rev"][i])
                        i -= 1
                    }
                } else  if(this.Val["rev"][i] == 1) {
                    this.Val["add"] = this.Val["add"].replaceAt(i, "0")
                }
            }

            this.Val["bin"] = this.Val["bin"].replaceAt(0, "1")
            this.Val["rev"] = this.Val["rev"].replaceAt(0, "1")
            this.Val["add"] = this.Val["add"].replaceAt(0, "1")
            this.Span["bin"].style.color = "#000000"
            this.Span["rev"].style.color = "#000000"
            this.Span["add"].style.color = "#000000"
        } else {
            this.Val["rev"] = "Не існує"
            this.Val["add"] = "Не існує"
            this.In["rev"].style.color = "#FF0000"
            this.In["add"].style.color = "#FF0000"
        }

        this.getHex()
    }

    bin(){
        let x = 0
        let lentgh = this.Val["bin"].length
        let end = 0
        if(lentgh > this.Val["reg"]){
            this.In["reg"].style.color = "#FF0000"
            this.Span["reg"].style.color = "#FF0000"
            end = lentgh - this.Val["reg"]
        }

        let j = 0
        for(let i = lentgh - 1; i >= end; i -= 1){
            if(this.Val["bin"][i] == 1){
                x += Math.pow(2, j)
            }
            j += 1
        }
        if(this.Val["bin"][end] == 1 && lentgh > this.Val["reg"] - 1){
            x = -(x-Math.pow(2, j-1))
        }

        this.Val["dec"] = x

        if(this.Val["dec"] < 0){
            this.Val["rev"] = ""
            for(let i = 0; i < this.Val["reg"]; i += 1){
                if(this.Val["bin"][i] == 1){
                    this.Val["rev"] += 0
                } else {
                    this.Val["rev"] += 1
                }
            }

            this.Val["add"] = this.Val["rev"]
            for(let i = this.Val["reg"]-1; i >= 0; i -= 1){
                if(this.Val["rev"][i] == 0){
                    this.Val["add"] = this.Val["add"].replaceAt(i, "1")
                    i -= 1
                    while(i >= 0){
                        this.Val["add"] = this.Val["add"].replaceAt(i, this.Val["rev"][i])
                        i -= 1
                    }
                } else  if(this.Val["rev"][i] == 1) {
                    this.Val["add"] = this.Val["add"].replaceAt(i, "0")
                }
            }

            this.Val["bin"] = this.Val["bin"].replaceAt(0, "1")
            this.Val["rev"] = this.Val["rev"].replaceAt(0, "1")
            this.Val["add"] = this.Val["add"].replaceAt(0, "1")
            this.Span["bin"].style.color = "#000000"
            this.Span["rev"].style.color = "#000000"
            this.Span["add"].style.color = "#000000"
        } else {
            this.Val["rev"] = "Не існує"
            this.Val["add"] = "Не існує"

            this.In["rev"].style.color = "#FF0000"
            this.In["add"].style.color = "#FF0000"
        }

        this.getHex()
    }

    rev(){
        let lentgh = this.Val["rev"].length
        if(lentgh != this.Val["reg"]){
            this.In["reg"].style.color = "#FF0000"
            this.Span["reg"].style.color = "#FF0000"
            return undefined
        }

        this.Val["bin"] = ""
        for(let i = this.Val["reg"] - 1; i > 0; i -= 1){
            if(this.Val["rev"][i] == 1){
                this.Val["bin"] = "0".concat(this.Val["bin"])
            } else {
                this.Val["bin"] = "1".concat(this.Val["bin"])
            }
        }
        this.Val["bin"] = "1".concat(this.Val["bin"])

        this.bin()
    }

    add(){
        let lentgh = this.Val["add"].length
        if(lentgh != this.Val["reg"]){
            this.In["reg"].style.color = "#FF0000"
            this.Span["reg"].style.color = "#FF0000"
            return undefined
        }

        this.Val["rev"] = ""
        for(let i = this.Val["reg"] - 1; i >= 0; i -= 1){
            if(this.Val["add"][i] == 0){
                this.Val["rev"] = "1".concat(this.Val["rev"])
            } else {
                this.Val["rev"] = "0".concat(this.Val["rev"])
                i -= 1;
                while(i >= 0){
                    this.Val["rev"] = this.Val["add"][i].concat(this.Val["rev"])
                    i -= 1;
                }
                this.rev()
                return undefined
            }
        }
    }

    getHex(){
        let hBin = this.Val["bin"]
        while(hBin.length % 4 != 0){
            hBin = "0".concat(hBin)
        }

        this.Val["hex"] = ""
        for(let i = 0; i < hBin.length; i += 4){
            this.Val["hex"] += binHexMap[hBin.substring(i, i+4)]
        }
        while(this.Val["hex"] != ""){
            if(this.Val["hex"][0] == 0) {
                this.Val["hex"] = this.Val["hex"].slice(1)
            } else {
                break
            }
        }
    }

    hex(){
        this.Val["hex"] = this.Val["hex"].toUpperCase()
        if(this.Val["reg"] < this.Val["hex"].length*4){
            this.In["reg"].style.color = "#FF0000"
            this.Span["reg"].style.color = "#FF0000"
            return undefined
        }

        this.Val["bin"] = ""
        for(let i = 0; i < this.Val["hex"].length; i += 1){
            this.Val["bin"] += hexBinMap[this.Val["hex"][i]]
        }

        this.bin()
    }

    //convert()

    //makeDec()

    makeBin(dec, reg){
        let bin = ""
        let x = Math.abs(dec)
        if(x > Math.pow(2, reg) - 1){
            x = Math.pow(2, reg) - 1
        } else if(dec < -Math.pow(2, reg-1)+1){
            x = Math.abs(-Math.pow(2, reg-1)+1)
        }
        let startVal = reg - 1

        for(let i = 0; i <= startVal; i += 1){
            if(x < Math.pow(2, i)){
                startVal = i - 1;
                break;
            }
        }

        for(let i = 0; i < reg - startVal - 1; i += 1){
            bin += "0"
        }

        for(let i = startVal; i >= 0; i -= 1){
            //console.log(x / Math.pow(2, i))
            bin += parseInt(x / Math.pow(2, i))
            x %= Math.pow(2, i)
        }

        if(dec < 0){
            bin = bin.replaceAt(0, "1")
        }

        return bin
    }

    makeRev(bin, reg){
        let rev = bin
        for(let i = 1; i < reg; i += 1){
            if(bin[i] == "0"){
                rev = rev.replaceAt(i, "1")
            } else {
                rev = rev.replaceAt(i, "0")
            }
        }
        return rev
    }

    makeAdd(rev, reg){
        let add = rev
        for(let i = reg-1; i >= 0; i -= 1){
            if(rev[i] == 0){
                add = add.replaceAt(i, "1")
                i -= 1
                while(i >= 0){
                    add = add.replaceAt(i, rev[i])
                    i -= 1
                }
            } else  if(rev[i] == 1) {
                add = add.replaceAt(i, "0")
            }
        }
        return add
    }
}


class Brain {
    constructor() {
    }

    BinToDec(bin, reg){
        let dec = 0
        bin = this.Fill(bin, reg)

        for(let i = reg - 1; i > 0; i -= 1){
            dec += parseInt(bin[i]) * Math.pow(2, reg-1-i)
        }

        if(bin[0] == 1){
            dec = -dec
        }

        return dec
    }

    BinToRev(bin, reg){
        bin = this.Fill(bin, reg)
        let rev = bin
        for(let i = 1; i < reg; i += 1){
            if(bin[i] == "0"){
                rev = rev.replaceAt(i, "1")
            } else {
                rev = rev.replaceAt(i, "0")
            }
        }
        rev = rev.replaceAt(0, "1")
        return rev
    }

    BinToAdd(bin, reg){
        let rev = this.BinToRev(bin, reg)
        return this.Sum(rev, 1, reg)
    }

    BinToHex(bin, reg){
        if(reg % 4 != 0){
            reg += 4 - (reg % 4)
        }
        bin = this.Fill(bin, reg)

        let hex = ""
        for(let i = 0; i < reg; i += 4){
            hex += binHexMap[bin.substring(i, i+4)]
        }
        return hex
    }

    DecToBin(dec, reg){
        let bin = ""
        let x = Math.abs(dec)
        if(x > Math.pow(2, reg) - 1){
            x = Math.pow(2, reg) - 1
        } else if(dec < -Math.pow(2, reg-1)+1){
            x = Math.abs(-Math.pow(2, reg-1)+1)
        }
        let startVal = reg - 1

        for(let i = 0; i <= startVal; i += 1){
            if(x < Math.pow(2, i)){
                startVal = i - 1;
                break;
            }
        }

        for(let i = 0; i < reg - startVal - 1; i += 1){
            bin += "0"
        }

        for(let i = startVal; i >= 0; i -= 1){
            bin += parseInt(x / Math.pow(2, i))
            x %= Math.pow(2, i)
        }

        if(dec < 0){
            bin = bin.replaceAt(0, "1")
        }

        return bin
    }

    RevToBin(rev, reg){
        rev = this.Fill(rev, reg)
        let bin = rev
        for(let i = 1; i < reg; i += 1){
            if(rev[i] == "0"){
                bin = bin.replaceAt(i, "1")
            } else {
                bin = bin.replaceAt(i, "0")
            }
        }
        return bin
    }

    AddToBin(add, reg){
        add = this.Fill(add)
        return this.RevToBin(this.Sum(add, "1".repeat(reg), reg), reg)
    }

    HexToBin(hex, reg){
        hex = hex.toString()
        let bin = "0".repeat(reg - hex.length*4)
        hex = hex.toUpperCase()

        for(let i = 0; i < hex.length; i += 1){
            bin += hexBinMap[hex[i]]
        }

        return bin
    }
    
    Convert(number, inType, outType, reg){
        let bin
        inType = inType.toLowerCase()
        outType = outType.toLowerCase()

        if(inType == "bin"){
            bin = number
        } else if(inType == "dec"){
            bin = this.DecToBin(number, reg)
        } else if(inType == "rev"){
            bin = this.RevToBin(number, reg)
        } else if(inType == "add"){
            bin = this.AddToBin(number, reg)
        } else if(inType == "hex"){
            bin = this.HexToBin(number, reg)
        }

        if(outType == "bin"){
            return bin
        } else if(outType == "dec"){
            return this.BinToDec(bin, reg)
        } else if(outType == "rev"){
            return this.BinToRev(bin, reg)
        } else if(outType == "add"){
            return this.BinToAdd(bin, reg)
        } else if(outType == "hex"){
            return this.BinToHex(bin, reg)
        }
    }
    
    Fill(num, reg){
        num = num.toString()
        let filler = num[0]
        num = filler.repeat(reg - num.length) + num
        return num
    }

    Sum(a, b, reg){
        a = this.Fill(a, reg)
        b = this.Fill(b, reg)

        let result = []
        let carryBits = []
        let overflow
        let column

        for (let i = 0; i < reg; i += 1) {
            carryBits[i] = 0;
            result[i] = 0;
        }

        for (let i = reg - 1; i >= 0; i -= 1) {
            column = parseInt(a[i]) + parseInt(b[i]) + carryBits[i]
            result[i] = column % 2
            if (column > 1) {
                if (i > 0) {
                    carryBits[i - 1] = 1
                } else {
                    overflow = 1
                }
            }
        }

        return result.join("")
    }


}

class FloatBrain {
    constructor() {
        this.In = {
            "dec": document.getElementById("decFloatIn"),
            "bin": document.getElementById("binFloatIn"),
            "i3e": document.getElementById("i3eFloatIn"),
            "reg": document.getElementById("regFloatIn"),
        }

        this.Span = {
            "dec": document.getElementById("decFloatSpan"),
            "bin": document.getElementById("binFloatSpan"),
            "i3e": document.getElementById("i3eFloatSpan"),
            "reg": document.getElementById("regFloatSpan")
        }

        this.Val = {
            "dec": 0,
            "bin": 0,
            "i3e": 0,
            "reg": 0
        }

        this.i3eInfoSpan = document.getElementById("i3eInfoSpan")

        this.lastActive = "dec"

        this.In["reg"].addEventListener('change', (event) => {
            this.process()
        });
    }

    onlyDigits(string){
        for (let i = 0; i < string.length; i += 1) {
            if((string[i] == "." && string.length >= 3 && i == string.length-1) || (string[i] == "-" && i == 0)){
                continue
            } else if(isFinite(string[i]) == false){
                return false
            }
        }
        return true
    }

    getValue(){
        for(const [key, value] of Object.entries(this.In)){
            value.style.color = "#000000"
        }

        for(const [key, value] of Object.entries(this.Span)){
            //console.log(value)
            value.style.color = "#000000"
        }

        this.Val["dec"] = parseFloat(this.In["dec"].value)

        if(this.onlyDigits(this.In["bin"].value)){
            this.Val["bin"] = this.In["bin"].value
        } else {
            this.Span["bin"].style.color = "#FF0000"
            this.Val["bin"] = "0.0"
        }

        if(this.onlyDigits(this.In["i3e"].value)){
            this.Val["i3e"] = this.In["i3e"].value
        } else {
            this.Span["i3e"].style.color = "#FF0000"
            this.Val["i3e"] = 0
        }

        this.Val["reg"] = this.In["reg"].value
    }

    setValue(exeption){
        if(exeption == "empty"){
            this.In["dec"].value = ""
            this.In["bin"].value = ""
            this.In["i3e"].value = ""
            return undefined
        }
        if(exeption != "dec"){
            this.In["dec"].value = this.Val["dec"]
        }
        if(exeption != "bin"){
            this.In["bin"].value = this.Val["bin"]
            if(this.Val["dec"] < 0 && this.In["bin"].value[0]!="-"){
                this.In["bin"].value = "-".concat(this.Val["bin"])
            }
        }
        if(exeption != "i3e"){
            this.In["i3e"].value = this.Val["i3e"]
        }
    }

    process(){
        this.getValue()
        this.i3eInfoSpan.innerHTML = ""
        if(!document.activeElement.value && this.In[document.activeElement.id.slice(0, 3)]){
            document.getElementById(document.activeElement.id.slice(0, 3) + "FloatSpan").style.color = "#ff0000"
        } else {
            let target = document.activeElement
            if(target === this.In["dec"] || target === this.In["reg"]){
                this.dec()
                this.geti3e()
                this.setValue("dec")
                this.lastActive = "dec"
            }
            if(target === this.In["bin"]){
                this.bin()
                this.geti3e()
                this.setValue("bin")
                this.lastActive = "bin"
            }
            if(target === this.In["i3e"]){
                this.i3e()
                this.setValue("i3e")
                this.lastActive = "i3e"
            }
        }
    }

    dec(){
        let x = Math.abs(this.Val["dec"])
        let I = parseInt(x)
        let F = x - I

        let startVal = this.Val["reg"] - 1

        this.Val["bin"] = ""
        if(I == 0){
            this.Val["bin"] = "0"
        }

        for(let i = 0; i <= startVal; i += 1){
            if(I < Math.pow(2, i)){
                startVal = i - 1;
                break;
            }
        }

        for(let i = startVal; i >= 0; i -= 1){
            //console.log(x / Math.pow(2, i))
            this.Val["bin"] += parseInt(I / Math.pow(2, i))
            I %= Math.pow(2, i)
        }

        this.Val["bin"] += "."
        let i = 0
        let f = 0
        let minLength = this.Val["bin"].length
        if(F == 0){
            this.Val["bin"] += 0
        } else {
            let lastOne = this.Val["bin"].length
            while (F > 0) {
                f = (F - parseInt(F)) * 2
                this.Val["bin"] += parseInt(f)
                if(parseInt(f) == 1){
                    lastOne = i
                }
                F = f
                i++
                if (i >= this.Val["reg"]) {
                    break;
                }
            }
            this.Val["bin"] = this.Val["bin"].substring(0, minLength+lastOne+1)
        }
    }

    bin(){
        let x = this.Val["bin"]
        if(x[0]=="-"){
            x = x.substring(1)
        }
        let dotIdx = x.length
        let decx = 0

        for(let i = 0; i < x.length; i += 1){
            if(x[i]=="."){
                dotIdx = i

                break
            }
        }

        let I = x.substring(0, dotIdx)
        let F = x.substring(dotIdx+1)

        let j = 0
        for(let i = I.length-1; i >= 0; i -= 1){
            if(I[i] == 1){
                decx += Math.pow(2, j)
            }
            j += 1
        }

        j = -1
        for(let i = 0; i < F.length; i += 1){
            if(F[i] == 1){
                decx += Math.pow(2, j)
            }
            j -= 1
        }

        if(this.Val["bin"][0]=="-") {
            decx = -decx
        }

        this.Val["dec"] = decx
    }

    geti3e(){
        let x = this.Val["bin"]
        if(x[0]=="-"){
            x = x.substring(1)
        }
        let dotIdx = x.length
        let decx = 0

        let Pl
        let Pk
        let Ml

        if(this.Val["reg"]=="16"){
            Pl = 5
            Pk = 15
            Ml = 10
        } else if(this.Val["reg"]=="64"){
            Pl = 11
            Pk = 1023
            Ml = 52
        } else {
            Pl = 8
            Pk = 127
            Ml = 23
        }

        for(let i = 0; i < x.length; i += 1){
            if(x[i]=="."){
                dotIdx = i
                break
            }
        }

        if(this.Val["dec"] >= 0){
            this.Val["i3e"] = "0"
        } else {
            this.Val["i3e"] = "1"
        }

        let I = x.substring(1, dotIdx)
        let M = I.concat(x.substring(dotIdx+1))

        let P = dotIdx - 1 + Pk
        let Pb = ""
        let startVal = Pl-1

        for(let i = startVal; i >= 0; i -= 1){
            //console.log(x / Math.pow(2, i))
            Pb += parseInt(P/ Math.pow(2, i))
            P %= Math.pow(2, i)
        }

        while(M.length < Ml){
            M += "0"
        }

        if(M.length > Ml){
            M = M.substring(0, Ml)
        }

        this.Val["i3e"] += Pb + M

        this.i3eInfoSpan.innerHTML = "Біт знаку: " + this.Val["i3e"][0] + "<br>Порядок: " + Pb + "<br>Мантиса: " + M
    }

    i3e(){
        let x = this.Val["i3e"]
        if(x.length != this.Val["reg"]){
            this.In["reg"].style.color = "#FF0000"
            this.Span["reg"].style.color = "#FF0000"
            return undefined
        }

        let Pl
        let Pk
        let Ml

        if(this.Val["reg"]=="16"){
            Pl = 5
            Pk = 15
            Ml = 10
        } else if(this.Val["reg"]=="64"){
            Pl = 11
            Pk = 1023
            Ml = 52
        } else {
            Pl = 8
            Pk = 127
            Ml = 23
        }

        if(x[0] == 1){
            this.Val["bin"] = "-1"
        } else {
            this.Val["bin"] = "1"
        }

        x = x.slice(1)

        let Pb = x.slice(0, Pl)
        let P = -Pk
        let j = 0
        for(let i = Pb.length-1; i >= 0; i -= 1){
            if(Pb[i] == 1){
                P += Math.pow(2, j)
            }
            j += 1
        }

        x = x.slice(Pl)
        this.i3eInfoSpan.innerHTML = "Біт знаку: " + this.Val["i3e"][0] + "<br>Порядок: " + Pb + "<br>Мантиса: " + x

        this.Val["bin"] += x.substring(0, P) + "." + x.substring(P)
        this.bin()
    }
}

class MathBrain {
    constructor(){
        this.Buttons = {
            "acn": "",
            "adp": "",
            "acp": "",
            "bcn": "",
            "bdp": "",
            "bcp": "",
            "swp": "",
            "sum": "",
            "dif": "",
            "mul": "",
            "div": ""
        }

        for(const [key, value] of Object.entries(this.Buttons)){
            this.Buttons[key] = document.getElementById(key + "Button")
        }

        this.Buttons["adp"].onclick = () => {this.set("b", this.a)}
        this.Buttons["bdp"].onclick = () => {this.set("a", this.b)}
        this.Buttons["swp"].onclick = () => {let temporary = this.a; this.set("a", this.b); this.set("b", temporary)}
        this.Buttons["sum"].onclick = () => {this.Sum(); this.buildStory()}

        this.aIn = document.getElementById("amvIn")
        this.bIn = document.getElementById("bmvIn")

        this.aSpan = document.getElementById("amvSpan")
        this.bSpan = document.getElementById("bmvSpan")

        this.storySpan = document.getElementById("mathStory")

        this.reg = 32
        this.a = 0
        this.b = 0
        this.story = ["<br>Пам'ятаймо про правила академічної доброчесності.<br>Автори не несуть відповідальність за мету використання сервісу користувачем."]

        this.separator = "————————————————————————————————————————————————————————————"
    }

    buildStory(){
        this.storySpan.innerHTML = ""
        this.story.forEach(action => {
            this.storySpan.innerHTML = action + this.storySpan.innerHTML
        })
    }

    selectReg(){
        this.reg = 8
        while(this.reg < this.a.length && this.reg < 64){
            this.reg *= 2
        }
        while(this.reg < this.b.length && this.reg < 64){
            this.reg *= 2
        }
    }

    onlyBin(string){
        if(!parseInt(string)){
            return false
        }
        for (let i = 0; i < string.length; i += 1) {
            if(string[i] != "0" && string[i] != "1"){
                return false
            }
        }
        return true
    }

    getValue(){
        this.aIn.style.color = "#000000"
        this.bIn.style.color = "#000000"
        this.aSpan.style.color = "#000000"
        this.bSpan.style.color = "#000000"

        if(this.onlyBin(this.aIn.value) && this.aIn.value.length > 0){
            this.a = this.aIn.value
        } else {
            this.a = 0
            this.aIn.style.color = "#FF0000"
            this.aSpan.style.color = "#FF0000"
        }

        if(this.onlyBin(this.bIn.value) && this.bIn.value.length > 0){
            this.b = this.bIn.value
        } else {
            this.b = 0
            this.bIn.style.color = "#FF0000"
            this.bSpan.style.color = "#FF0000"
        }

        this.selectReg()
        this.Fill()
    }

    set(where, val){
        if(where == "a"){
            this.aIn.value = val
        } else if(where == "b"){
            this.bIn.value = val
        }
        this.getValue()
    }

    Fill(){
        this.a = "0".repeat(this.reg - this.a.length) + this.a
        this.b = "0".repeat(this.reg - this.b.length) + this.b
    }

    Sum() {
        this.Fill()
        let snapshot = "<br>Нагадуємо, що від'ємні числа необхідно подавати у ДОДАТКОВОМУ коді!<br><br>"

        let result = []
        let carryBits = []
        let overflow
        let column

        for (let i = 0; i < this.reg; i += 1) {
            carryBits[i] = 0;
            result[i] = 0;
        }

        for (let i = this.reg - 1; i >= 0; i -= 1) {
            column = parseInt(this.a[i]) + parseInt(this.b[i]) + carryBits[i]
            result[i] = column % 2
            if (column > 1) {
                if (i > 0) {
                    carryBits[i - 1] = 1
                } else {
                    overflow = 1
                }
            }
        }

        snapshot += "Операція:<br>" + this.a + "<br>+<br> " + this.b + "<br><br><table class='mathStoryTable'>"
        snapshot += "<tr><td> Біти переносу </td>"
        for (let i = 0; i < this.reg; i += 1) {
            if(carryBits[i])
                snapshot += "<td>1</td>"
            else
                snapshot += "<td></td>"
        }

        snapshot += "</tr><tr><td>A</td>"
        for (let i = 0; i < this.reg; i += 1) {
            snapshot += "<td>" + this.a[i] + "</td>"
        }

        snapshot += "</tr><tr><td>B</td>"
        for (let i = 0; i < this.reg; i += 1) {
            snapshot += "<td>" + this.b[i] + "</td>"
        }

        snapshot += "</tr><tr><td>Результат</td>"
        for (let i = 0; i < this.reg; i += 1) {
            snapshot += "<td>" + result[i] + "</td>"
        }

        snapshot += "</tr></table><br><br>"
        snapshot += "Отже, А + В = " + result.join("") + "<br><br>"
        snapshot += this.separator

        //<table class="mathStoryTable"><tr><td>1</td><td>2</td><td>2</td><td>3</td></tr><tr><td>1</td><td>2</td><td>2</td><td>3</td></tr></table>
        this.story.push(snapshot)
    }
}


clocker = new Clocker()

brain = new Brain()
intBrain = new IntBrain()
floatBrain = new FloatBrain()
mathBrain = new MathBrain()
mathBrain.set()

let clocking = () => {
    clocker.tick()
    setTimeout(clocking, 10)
}

clocking()

document.addEventListener("keyup", (event)=>{
    clocker.activeReset()
})

//setTimeout(()=>{mathBrain.aIn.scrollIntoView()}, 500)





