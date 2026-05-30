
const API="http://localhost:3000/api/v1/auth";
const o=(d)=>document.getElementById("o").innerText=JSON.stringify(d,null,2);

async function reg(){
let r=await fetch(API+"/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.value,password:p.value})});
o(await r.json());
}
async function login(){
let r=await fetch(API+"/login",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.value,password:p.value})});
o(await r.json());
}
async function profile(){let r=await fetch(API+"/profile",{credentials:"include"});o(await r.json());}
async function refresh(){let r=await fetch(API+"/refresh",{method:"POST",credentials:"include"});o(await r.json());}
async function logout(){let r=await fetch(API+"/logout",{method:"POST",credentials:"include"});o(await r.json());}
