# AngpaoAPI

API wrapper around Truemoney Wallet's angpao system

## Usage

```ts
import { AngpaoAPI } from './angpao-api';

const angpao = new AngpaoAPI('089xxxxxxx');
angpao.redeem(AngpaoAPI.extractVoucherId('https://gift.truemoney.com/campaign/?v=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'));
```