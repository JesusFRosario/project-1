function store(){
    var stateName=document.getElementById("put").value;
    localStorage.setItem("city",JSON.stringify(stateName));
    
    var content=JSON.parse(localStorage.getItem("city"))
    var head=document.getElementById("header")
   
    g = document.createElement('div');
    g.setAttribute("id", "Div1");
    g.innerHTML=content;
     head.appendChild(g);
     


}
function second(){
    fetch("https://official-joke-api.appspot.com/random_joke")
.then(response=>response.json())
.then(response=>{
    console.log(response)
    document.getElementById("joke").innerHTML=JSON.stringify(response.punchline)
    document.getElementById("joke2").innerHTML=JSON.stringify(response.setup)

})
}
