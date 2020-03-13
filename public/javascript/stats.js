let months = document.querySelectorAll('.month');

if(typeof document.querySelector('#idmois') !== 'undefined') {
    let idmois = document.querySelector('#idmois').value;
    let str = 'month'+idmois;
    document.getElementById(str).classList.add('active');
}

/*months.forEach((onemonth) =>{
    onemonth.addEventListener('click',function(){
        let active = document.querySelector('.active');
        active.classList.toggle('active');
        onemonth.querySelector('a').classList.toggle('active');
    })
})*/


