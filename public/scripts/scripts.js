//------------pega a receita
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


//---------highlight no menu

const currentPage = location.pathname

const menuItems = document.querySelectorAll("header .menu2 a")

for(item of menuItems){

    if(currentPage.includes(item.getAttribute("href"))){
        
        item.classList.add("active")

        


    }

    if (currentPage.includes("about") || currentPage.includes("chefs") ){
        //criar uma maneira melhor para ocultar a bara de pesquisa

        const filter = document.querySelector(".menu2 .filter")

        filter.classList.add("inactive")

    }


}


//------------ paginação

function paginate(selectedPage, totalPages){

    let pages = [],
    oldPage


    for (let currentPage = 1; currentPage <= totalPages; currentPage++){

        const firstAndLastPage = currentPage == 1 || currentPage == totalPages
        const pagesAfterSelectedPage = currentPage <= selectedPage + 2
        const pagesBeforeSelectedPage = currentPage >= selectedPage - 2


        if(firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage){

            if(oldPage && currentPage - oldPage > 2){
                pages.push("...")
            }

            if(oldPage && currentPage - oldPage == 2){
                pages.push(oldPage + 1)
            }

            pages.push(currentPage)

            oldPage = currentPage

        }

    }

    console.log(pages)

    return pages

}

function createPagination(pagination){

    const page = +pagination.dataset.page
    const total = +pagination.dataset.total
    const filter = pagination.dataset.filter 
    const pages = paginate(page, total)

    let elements = ""

    for(let page of pages){

        if(String(page).includes("...")){

            elements += `<span>${page}</span>`
        
        }else{

            if(filter){

                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`

            }else{

                elements += `<a href="?page=${page}">${page}</a>`

            }

        }

    }

    pagination.innerHTML = elements

}

const pagination = document.querySelector(".pagination")

if(pagination){

    createPagination(pagination)

}