const { AngpaoAPI } = require('angpao-api');

const angpao = new AngpaoAPI('089xxxxxxx');
angpao.redeem(AngpaoAPI.extractVoucherId('https://gift.truemoney.com/campaign/?v=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'));
