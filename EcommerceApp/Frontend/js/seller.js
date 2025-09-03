window.onload=()=>{
    user= JSON.parse(sessionStorage.user||null);
    if(user==null){
         location.replace('/login');
    }
    else if(user.seller){
         location.replace('/dashboard');
    }
}

let applyBtn= document.querySelector('.apply-btn');

applyBtn.addEventListener('click',()=>{
   
let businessName = document.querySelector('#name').value; 
let address = document.querySelector('#address').value; 
let about = document.querySelector('#about').value;
let contact = document.querySelector('#contact').value;
console.log(Number(contact));

if(!businessName.length || !address.length || !about.length || contact.length<10 || !Number(contact)){
   showFormError('Some information is/are incorrect');
}
else{
    sendData('/seller',{
        businessName:businessName,
        address:address,
        about:about,
        contact:contact,
        email:JSON.parse(sessionStorage.user).email
    })
}
});