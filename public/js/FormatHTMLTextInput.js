"use strict";

//-----------------------------------------------------------------------------
//    const inputObject = new FormatInventoryNumber("#elementID", { maxLength: 6 });
//    inputObject.setPrefixText({ prefixText: 'HELLO', fixed: true });
//    inputObject.allowOnlyNumericEntries();
//    inputObject.setFixedSymbol({ symbol: '.', symbolPosition: 8 });
//-----------------------------------------------------------------------------


export default class FormatHTMLTextInput {

    constructor(inputFieldId, { maxLength }){
        
        if( $(`${inputFieldId}`).attr('type') !== 'text' )
            return console.error(`ERROR in FormatHTMLTextInput class constructor: type of input is not 'text'.`);

        this.inputField = $(`${inputFieldId}`);
        this.inputMaxLength = maxLength;
        this.acceptableKeysRanges = [];
        this.fixedSymbols = [];
        console.log(`Object created for formatting HTML text input (${inputFieldId}).`);
    }


    setPrefixText({ prefixText, fixed } ){
        if( this.prefixText !== undefined && this.prefixText !== null )
            return console.error(`ERROR in setPrefixText(): prefix for ${this.inputField} have already been set.`);

        this.prefixText = prefixText;
        this.prefixLength = prefixText.length;

        $(this.inputField).val(this.prefixText);

        if(fixed === true){
            this._fixedPrefixCaretControl();
        }
    }


    _fixedPrefixCaretControl(){
        this.inputField.on('focus click', eventHandler => {
            var element = eventHandler.target;
    
            if( element.selectionEnd < this.prefixLength ){
                element.selectionStart = element.value.length;
                element.selectionEnd = element.value.length;
            }
        });
    
        this.inputField.on('select', eventHandler => {
            var element = eventHandler.target;
    
            if( element.selectionStart < this.prefixLength && element.selectionEnd >= this.prefixLength){
                element.selectionStart = element.selectionEnd;
            }
            else if( element.selectionStart >= this.prefixLength && element.selectionEnd < this.prefixLength){
                element.selectionEnd = element.selectionStart;
            }
            else if( element.selectionStart < this.prefixLength && element.selectionEnd < this.prefixLength){
                element.selectionStart = this.prefixLength;
                element.selectionEnd = this.prefixLength;
            }
        });

        this.inputField.on('keydown', eventHandler => {
            var element = eventHandler.target;
            const currentTextLength = element.value.length;
            // If Home key is pressed, it will position the caret right after the prefix text intead of position 0
            if( eventHandler.key === 'Home' ){
                element.selectionStart = this.prefixLength;
                element.selectionEnd = this.prefixLength;
            }
            // If the caret is right after the prefix, it cannot be moved to the left using the ArrowLeft, Backspace or Home keys
            if (  element.selectionEnd == this.prefixLength &&
                ( eventHandler.key === 'Backspace' || eventHandler.key === 'ArrowLeft' || eventHandler.key === 'Home' ) )
            {  
                eventHandler.preventDefault();
            }
            // When the input field reaches the max length, it allows only the use of the arrows, delete/backsapce and home/end keys
            if ( currentTextLength === (this.inputMaxLength + this.prefixLength) && 
                 eventHandler.key !== 'Backspace' &&
                 eventHandler.key !== 'Delete' &&
                 eventHandler.key !== 'ArrowLeft' &&
                 eventHandler.key !== 'ArrowRight' &&
                 eventHandler.key !== 'Home' &&
                 eventHandler.key !== 'End' )
                {
                    console.log('%cAlready reached the maximum length.', 'color: red; font-weight: bold');
                    eventHandler.preventDefault();
                }
        });
    }

    
    allowOnlyNumericEntries(){
        const DIGIT_CODE_0 = 48;
        const DIGIT_CODE_9 = 57;
        const NUMPAD_CODE_0 = 96;
        const NUMPAD_CODE_9 = 105;
        
        this.acceptableKeysRanges.push(
            { lowerLimit: DIGIT_CODE_0, upperLimit: DIGIT_CODE_9 },
            { lowerLimit: NUMPAD_CODE_0, upperLimit: NUMPAD_CODE_9 }
        );

        this.inputField.on('keydown', eventHandler =>{    
            if( !this._checkIfKeyIsValid(eventHandler.which) &&
                eventHandler.key !== 'Backspace' && eventHandler.key !== 'Delete' &&
                eventHandler.key !== 'ArrowLeft' && eventHandler.key !== 'ArrowRight' &&
                eventHandler.key !== 'Home' && eventHandler.key !== 'End' )
            {
                console.log('%cOnly numeric entries are allowed.', 'color: red; font-weight: bold');
                eventHandler.preventDefault();
            }
        });
    }


    setFixedSymbol({ symbol, symbolPosition }){
        if(symbol.length > 1)
            return console.error('ERROR in setFixedSymbol(): symbol needs to be only a single char.');
        if(symbolPosition < this.prefixLength)
            return console.error('ERROR in setFixedSymbol(): symbol position not allowed.');
        if( this.fixedSymbols.includes(symbol) )
            return console.error('ERROR in setFixedSymbol(): only one symbol of each type is allowed.');

        this.inputMaxLength++;
        this.fixedSymbols.push(symbol);

        this.inputField.on('keyup keydown', eventHandler => {
            const inputText = this.inputField.val();
            const indexOfSymbol = inputText.indexOf(symbol, this.prefixLength);
            const currentCaretPosition = this.inputField[0].selectionEnd;

            if( inputText.length >= symbolPosition ){
                if(indexOfSymbol < 0){
                    //console.log(`texto > posição - símbolo ${symbol} não encontrado.`);
                    var newInputText = this._insertTextToString(inputText, symbol, symbolPosition);
                }
                else{
                    //console.log(`texto > posição - símbolo ${symbol} já existe.`);
                    let tempText = this._removeTextFromString(inputText, indexOfSymbol, indexOfSymbol+symbol.length);
                    var newInputText = this._insertTextToString(tempText, symbol, symbolPosition);
                }
            }
            else{
                if(indexOfSymbol >= 0){
                    //console.log(`texto < posição - símbolo ${symbol} já existe.`);
                    var newInputText = this._removeTextFromString(inputText, indexOfSymbol, indexOfSymbol+symbol.length);
                }
                else{
                    //console.log(`texto < posição - símbolo ${symbol} não encontrado.`);
                    var newInputText = inputText;
                }
            }
            this.inputField.val( newInputText );
            this._fixCaretPosition(eventHandler, currentCaretPosition, symbolPosition);
        });
    }


    _insertTextToString(string, text, position){
        return string.slice(0, position-1) + text + string.slice(position-1);
    }


    _removeTextFromString(string, start, end){
        return string.slice(0, start) + string.slice(end)
    }


    _fixCaretPosition(eventHandler, currentCaretPosition, symbolPosition){
        if( eventHandler.key === 'Backspace' || eventHandler.key === 'Delete'){
            this._setCaretPosition(currentCaretPosition, 0)
        }
        else if( this._checkIfKeyIsValid(eventHandler.which) ){
            if(currentCaretPosition == symbolPosition)
                this._setCaretPosition(currentCaretPosition, 1)
            else
                this._setCaretPosition(currentCaretPosition, 0)
        }
    }


    _setCaretPosition(position, offset){
        this.inputField[0].selectionStart = position + offset;
        this.inputField[0].selectionEnd = position + offset;
    }


    _checkIfKeyIsValid(keyCode){
        var keyIsValid = true;
        if( this.acceptableKeysRanges.length > 0 ){
            keyIsValid = false;
            for(let range of this.acceptableKeysRanges){
                if( keyCode >= range.lowerLimit && keyCode <= range.upperLimit )
                    keyIsValid = true;
            }
        }
        return keyIsValid;
    }

}