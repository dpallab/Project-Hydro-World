const showFormError=err=>{
    let errEl=document.querySelector('.error');
    errEl.innerHTML=err;
    errEl.classList.add('show');
}

const sendData =(path,data) =>{
    console.log(data);
    console.log(path);
    fetch(path, {
        method:'POST',
        headers: new Headers({'Content-Type':'application/json'}),
        body:JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => processData(data));
}

const processData  = (data) =>{
    console.log(data);
    if(data.login){
        sessionStorage.user=JSON.stringify(data);
        if(location.search.includes('after')){
            let pageId=location.search.split('=')[1];
            location.replace(`/products/${pageId}`);
        }
        else{
            location.replace('/');
        }
    
        
    }
    else if(data.signup){
        location.replace('/');
    }
    else if(data.seller){
        let user=JSON.parse(sessionStorage.user);
        user.seller=true;
        sessionStorage.user=JSON.stringify(user);
        location.replace('/dashboard');
    }
    else if(data.product){
        location.replace('/dashboard');
    }
    else if(data=='review'){
        location.reload();
    }
}

