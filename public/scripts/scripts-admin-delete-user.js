const formDelete = document.querySelector("#form-delete")
formDelete.addEventListener("submit", function(event){

        const confirmation = confirm("deseja deletar? Essa operação removerá todas as receitas que esse usúario criou.")

        if(!confirmation){
                event.preventDefault()
        }   

})