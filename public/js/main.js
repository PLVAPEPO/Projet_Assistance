$(document).ready(function () {
    $(".dropdown-trigger").dropdown();
});



function toggleDisp(){
    let modifDate = document.querySelector('#modifDate');
    let formDate = document.querySelector('#formDate');
    let validDate = document.querySelector('#validDate');
    let cancelDate = document.querySelector('#cancelDate');
    let pDate = document.querySelector('#pDate');

    modifDate.classList.toggle('undisplay');
    formDate.classList.toggle('undisplay');
    validDate.classList.toggle('undisplay');
    cancelDate.classList.toggle('undisplay');
    pDate.classList.toggle('undisplay');
}

function confirmForm(){
    let formDate = document.querySelector('#formDate');
    formDate.submit();
}