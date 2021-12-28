"use strict";

const setRegisterPageTitle = () => {
    document.title = 'ICOS | Register';
}

const setRegisterUrlAddress = () => {
    window.history.pushState({page: 2}, 'ICOS | Register', '/app/register');
}

const setRegisterCSSFiles = () => {
    $(`head link`).not(`
                    [href*="reset.css"],
                    [href*="bootstrap.min.css"],
                    [href*="app.css"]`)
                .remove();
    $('head').append(`<link rel="stylesheet" href="../css/register.css">`);
}

//----------------------------------------------------------------------------------------
// Exports the functions in this module
//----------------------------------------------------------------------------------------
export const RegisterPage = {
    setRegisterPageTitle,
    setRegisterUrlAddress,
    setRegisterCSSFiles
};