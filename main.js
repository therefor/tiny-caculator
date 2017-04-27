function ifSlash(history){
    //判断history最后一次运算是否有+号或-号，以决定做乘法或减法的时候是否需要加括号
    if(history.search(/(\+|\-)\d+$/)!= -1){
        return true;
    }else{ return false;}
}

function modifyTop(lcdTop){
    //调整计算机上面一行的显示
    var maxLength = 8;
    var str = lcdTop.toString();
    var dotNumber;
    if(isNaN(lcdTop)){
        lcdTop = "ERROR NaN"; //如果CE后面紧接着运算符号，会提示此错误
    }else if( str.length <= maxLength){
        //do nothing
    }else if( lcdTop > 99999999){
        lcdTop = "Too Large";
    }else if( lcdTop < -9999999){
        lcdTop = "Too Small";
    }else if(str.search(/\./) !== -1){
        //寻找小数点位置，并截取长度，防止字符串超出LCD屏幕
        dotNumber = maxLength - str.search(/\./) -1;
        if(dotNumber >= 0){
            lcdTop = lcdTop.toFixed(maxLength - str.search(/\./) -1);
        }else{
            lcdTop = Math.round(lcdTop);
        }
    }
    if( str.charAt(0) === "0" && str.length >= 2 && str.charAt(1).search(/\d/) !== -1){
        //不允许出现023.3或者0231.23这种0在前面的情况
        lcdTop= str.slice(1,str.length);
    }

    return lcdTop;
}

$(document).ready(function(){
    var press = "";
    var rezult, history, number, formerCalc, formerPress, lcdTop, decimal;

    function reset(){
        rezult = 0;
        history = 0;
        number = ""; //当前数值
        formerCalc = "";
        formerPress = "";
        lcdTop = 0;
        decimal = false; // 默认没有小数点
    }

    reset();
    $('button').click(function(){
        press = $(this).attr("value");

        if( press === "AC" || ((formerPress ==="AC" || formerPress ==="" || (formerPress ==="CE"&& history ===0)) && (press === "+" || press === "-"|| press === "X" || press ==="/" || press ==="=")) ) {
            reset();
        }else if (press === "CE"){
            number = "";
            lcdTop = 0;
            decimal = false; // 默认没有小数点
        }else if( !isNaN(press) ){
            if(formerPress=== "=") { reset();}// 等号后面输入数字，就重新开始
            if( number.length<= 7 || number === "") { number += press;}
            lcdTop = number;
        }else if( press === "." && decimal ===false){
            if( formerPress === "="){ reset();}// 等号后面输入数字，就重新开始
            if(number === ""){ number = "0";}
            number += press;
            decimal = true;
            lcdTop = number;
        }else if( press === "." && decimal ===true){//已输入小数点，此时计算器啥也不干
        }else if(( press === "+" || press === "-"|| press === "X" || press ==="/" || press ==="=")&&(formerPress === "+" || formerPress === "-" ||formerPress === "X" ||formerPress === "/" || formerPress ==="=" ||formerPress ==="CE")){
            //重复运算按键
            formerCalc = press;
        }else if( press === "+" || press === "-"|| press === "X" || press ==="/" || press ==="=" && formerPress !=="="){

            number = parseFloat(number);
            if (formerCalc === ""){
                //前面没有运算
                rezult = number;
                formerCalc = press;
                history = (number).toString();
            }else{
                switch(formerCalc){
                    case "+":
                        rezult += number;
                        history += "+" + (number).toString();
                        break;
                    case "-":
                        rezult -= number;
                        history += "-" + (number).toString();
                        break;
                    case "X":
                        rezult *= number;
                        if( !ifSlash(history)){
                            history = "" + history + "*" + (number).toString();
                        }else{
                            history = "(" + history + ")*" + (number).toString();}
                        break;
                    case "/":
                        rezult /= number;
                        if( !ifSlash(history)){
                            history = "" + history + "/" + (number).toString();
                        }else{
                            history = "(" + history + ")/" + (number).toString();}
                        break;
                }

                if( press !== "="){ formerCalc = press;}
            }

            number = "";
            decimal = false;
            lcdTop = rezult;

        }

        if(press !== "CE"){ formerPress = press;}
        //将结果进行显示
        lcdTop = modifyTop(lcdTop);
        if(history.length >=24 ){ history = lcdTop;}
        $("#lcdTop").html(lcdTop);
        $("#lcdButtom").html(history);
    });
});
