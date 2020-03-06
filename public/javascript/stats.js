let months = document.querySelectorAll('.month');


months.forEach((onemonth) =>{
    onemonth.addEventListener('click',function(){
        let active = document.querySelector('.active');
        active.classList.toggle('active');
        onemonth.querySelector('a').classList.toggle('active');
    })
})
