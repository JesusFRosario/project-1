function second(){
  fetch("https://official-joke-api.appspot.com/random_joke")
		.then(response=>response.json())
		.then(response=>{
    console.log(response)
    document.getElementById("joke").innerHTML=JSON.stringify(response.punchline)
    document.getElementById("joke2").innerHTML=JSON.stringify(response.setup)
})
}
