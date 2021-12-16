const isCreditCardNumberValid = (cardNumber, expDate='12/99') => {
    const getNums = cardNumber.toLowerCase().split('-').join('');

    // Geçerli kart numarası için gerekli koşullar
    const checkList = [
        checkLastNum(cardNumber),
        checkNumForm(cardNumber),
        checkDifNums(getNums),
        checkSumOfNums(getNums),
        checkLuhn(getNums),
        checkExpDate(expDate),
    ]

    if (checkList.every(x => x === true)) {
        return true
    } else {
        return false
    }

    // Son numara kontrolü 
    function checkLastNum(cardNums) {
        return (Number(cardNums[cardNums.length - 1]) % 2 === 0 );
    }

    // Kart numarası formatı ve 'tüm karakterler sayı mı?' kontrolü
    // Geçerli formatlar: '1111222233334444' '1111-2222-3333-4444' '1111-22223333-4444'
    function checkNumForm(cardNums) {
        let count = 0;
        let allowedChar = '0123456789-';
        for (let i=0; i<cardNums.length; i++){
            if(!allowedChar.includes(cardNums[i])){
                return false
            } else if(cardNums[i] == '-'){
                count += 1
            }        
        }
        const formatOne = (cardNums.length === 16 && !cardNums.includes('-'));
        const formatTwo = (cardNums.length === 19 && (cardNums[4] =='-' && cardNums[9] == '-' && cardNums[14] =='-'  && count <= 3));
        const formatThree = (cardNums.length === 18 && (cardNums[4] =='-' && cardNums[13] =='-'  && count <= 2));

        return (formatOne || formatTwo || formatThree)
    }

    // Luhn Algoritması kontrolü
    function checkLuhn(cardNums) {
        let oddSum = 0;
        let evenSum = 0;
        let numArr = cardNums.split('');
        for(let i=0; i<numArr.length; i++){
            if (i % 2 === 0){
                if (numArr[i]*2 > 9){
                    evenSum += ((numArr[i] * 2) - 9);
                } else {
                    evenSum += numArr[i] * 2;
                }
            } else {
                oddSum += parseInt(numArr[i]);
            }
        }
        return (oddSum + evenSum) % 10 === 0;
    }

    // Sayıların toplamının kontrolü
    function checkSumOfNums(cardNums) {
        const numArr = cardNums.split('');
        return numArr.reduce((a, b) => Number(a) + Number(b), 0) > 16;
    }

    // Farklı sayı kontrolü
    function checkDifNums(cardNums) {  
        for(let i=0; i<cardNums.length - 1; i++) {
            if(cardNums[i] != cardNums[i+1]){
                return true;
            } else {
                continue;
            }
        }
        return false;
    }

    // Kullanım tarihi kontrolü (formatlar: "mm/yy" "mm-yy")
    function checkExpDate(expDate) {
        const expMonth = Number(expDate.slice(0,2));
        const expYear = Number(expDate.slice(3,5)) + 2000;
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        // ay ve yıl rakam kontrolü
        const numbers = '0123456789';
        const dateNumbers = (expDate.slice(0,2) + expDate.slice(3,5)).split('');
        const isDateNumsValid = dateNumbers.every((x) => numbers.includes(x));
        
        // Yanlış tarih yazımı kontrolü
        if (
            isDateNumsValid 
            && expDate.length === 5 
            && (expMonth <= 12) 
            && (expMonth >= 1) 
            && ('-/'.includes(expDate[2]))
        ) {
            // Kullanım süresi kontrolü
            if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
                return false
            } else {
                return true
            }

        } else {
            return false
        }
        
    }

}

// --Kart numarası ve tarih içeren testler--
// console.log(isCreditCardNumberValid('2222-2222-2222-2224', '12-23')) 
// console.log(isCreditCardNumberValid('2222-22222222-2222', '11-31')) 
// console.log(isCreditCardNumberValid('ab2222222c222224', '11/27'))
// console.log(isCreditCardNumberValid('2222----2222----2222----2224', '12-25'))
// console.log(isCreditCardNumberValid('5555555555554444', '12-23'))

// --Yalnızca kart numarası içeren testler--
// console.log(isCreditCardNumberValid('2222-2222-2222-2224'))
// console.log(isCreditCardNumberValid('22a2-c2222b22-2224'))
// console.log(isCreditCardNumberValid('2222----2222----2222----2224'))
// console.log(isCreditCardNumberValid('5555555555554444'))