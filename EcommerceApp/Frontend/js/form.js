 //import axios from '../../node_modules/axios/lib/axios.js';


async function verifyEmail(email) {
    const apiKey = 'a24260e2d52631d55feb733f8b9d6377ed3fde59'; // Replace with your Hunter.io API key
    const url = `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${apiKey}`;

    try {
        console.log('url is=',url);
        const response = await axios.get(url);
        if (response.data && response.data.data) {
            console.log('Email Verification Result:', response.data.data);
            return (response);
        } else {
            console.error('No data found for this email.');
        }
    } catch (error) {
        console.error('Error verifying email:', error.message);
        
    }
    
        
    
} 




 window.onload=()=>{
    if(sessionStorage.user){
        user= JSON.parse(sessionStorage.user);
        if (user.email){
            
            location.replace('/');
        }
    }
}
 

let formBtn=document.querySelector('.submit-btn');

formBtn.addEventListener('click',()=>{

    let name=document.querySelector('#name') || null;
    let email=document.querySelector('#email');
    let password=document.querySelector('#password');
    let phone=document.querySelector('#phone') || null;
    let tc=document.querySelector('#TnC') || null;
    let status;
    let statusCode;
console.log(email.value);
//console.log(verifyEmail(email.value));
    //form validation

    verifyEmail(email.value)
            .then(response => {
                const data = response.data.data;
               // status=data.status;
             //   statusCode=data.
                if (data.status === 'valid' || (data.status ==='accept_all' && data.gibberish == false)) {
                    console.log('email is valid');

                    if(name!=null){ //signup page
                        sendData('/signup',{
                            name:name.value,
                            email:email.value,
                            password:password.value,
                            phone:phone.value,
                            tc:tc.checked
                        })
                        }
                        else { //login page
                    
                            sendData('/login',{
                                
                                email:email.value,
                                password:password.value,
                                
                            })   
                        }
                    
                    
                   // result.innerHTML = `The email '${email.value}' is valid.`;
                } else if(data.status === 'invalid'){
                    showFormError('Not valid');
                   // result.innerHTML = `The email '${email.value}' is ${data.status}.`;
                }
            })
            .catch(error => {
                //statusCode=400;
                console.error('Error validating email:', error);
                showFormError('Use proper syntax for email');
                //result.innerHTML = 'Error validating email. Please try again.';
            });
/*     if(true){
        
    }
    else{

 
} */

})