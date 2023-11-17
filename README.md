# angpao-api

[![npm version](https://img.shields.io/npm/v/angpao-api.svg)](https://www.npmjs.com/package/angpao-api)

API wrapper around Truemoney Wallet's angpao system

## Usage

```ts
import { AngpaoAPI } from 'angpao-api';

const angpao = new AngpaoAPI('089xxxxxxx');
angpao.redeem(AngpaoAPI.extractVoucherId('https://gift.truemoney.com/campaign/?v=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'));
```
