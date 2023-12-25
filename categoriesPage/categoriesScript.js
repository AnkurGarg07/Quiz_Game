//Accessing the username from the url
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("username");

//Displaying the name of user in welcome tab
let playerWelcome=document.querySelector(".playerWelcome");
playerWelcome.innerHTML=`Welcome ${username}`

//accessing category list
let selectedCategory;
let categoryList=document.querySelector(".categoryList")
categoryList.addEventListener("click",(e)=>{
    if(e.target.tagName==="LI"){
        selectedCategory=e.target.innerHTML;
        window.location.href = `../gamePage/main.html?username=${encodeURIComponent(username)}&selectedCategory=${encodeURIComponent(selectedCategory)}`;
    }
})