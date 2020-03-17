let months = document.querySelectorAll('.month');

if(typeof document.querySelector('#idmois') !== 'undefined') {
    let idmois = document.querySelector('#idmois').value;
    let str = 'month'+idmois;
    document.getElementById(str).classList.add('active');
}


