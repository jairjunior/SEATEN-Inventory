"use strict";
import FormatHTMLTextInput from './FormatHTMLTextInput.js';

//----------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------
export default class CJFInventoryNumberInput extends FormatHTMLTextInput {

    constructor(inputFieldId){
        super(inputFieldId, { maxLength: 6 });

        this.setPrefixText({ prefixText: 'CJF ', fixed: true });
        this.allowOnlyNumericEntries();
        this.setFixedSymbol({ symbol: '.', symbolPosition: 8 });
    }

}