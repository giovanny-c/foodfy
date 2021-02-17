//paga a receita

const recipes = document.querySelectorAll('.recipe')


for(let recipe of recipes){

    recipe.addEventListener("click", function(){

        const recipeId = recipe.getAttribute("id")

        window.location.href = `/recipes/${recipeId}`




    })

}


//----- esconde os itens de preparo



const toggles = document.querySelectorAll(".subtitle")


for(let tg of toggles){


    
    tg.querySelector(".toggle").addEventListener("click", function(req, res){//click no esconder


        tg.querySelector(".toggle").classList.toggle("hidden")//adiciona classe hidden


        if(tg.querySelector(".toggle").innerHTML = "Esconder" && tg.querySelector(".toggle").className == "toggle hidden"){//se a clase hidden estiver ativa e palavra for esconder

            tg.querySelector(".toggle").innerHTML = "Mostrar"//traca para mostrar

            tg.querySelector(".info").classList.toggle("hidde")//adiciona classe que fas ficar invisivel

        }else{//se nao
            
            tg.querySelector(".toggle").innerHTML = "Esconder"

            tg.querySelector(".info").classList.toggle("hidde")//remove o hidde

        }
        
       /* */

    })
   
}




/*===== SCRIPT DO MODAL=======

const modalOverlay = document.querySelector('.modal-overlay')




for(let recipe of recipes){

    recipe.addEventListener("click", function(){

        modalOverlay.classList.add('active')



        modalOverlay.querySelector("img").src = recipe.querySelector("img").src
        modalOverlay.querySelector(".name").innerHTML = recipe.querySelector(".name").innerHTML
        modalOverlay.querySelector(".author").innerHTML = recipe.querySelector(".author").innerHTML



    })


}

document.querySelector(".close-modal").addEventListener("click", function(){

    modalOverlay.classList.remove('active')


})*/