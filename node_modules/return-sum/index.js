/*!
 * is-number <https://github.com/gn01792218/sum.git>
 *
 * Copyright (c) 2022, Meng Tse Houng.
 * Released under the MIT License.
 */
'use strict';

module.exports =function sum(...numberArr){
    let sum = 0
    numberArr.forEach(number=>{
        sum+=number
    })
    return sum
}