const inputRecipes = document.querySelector("#recipes")
                
                const recipe = inputRecipes.value


                if(recipe > 0){

                        const formDelete = document.querySelector("#form-delete")
                        formDelete.addEventListener("submit", function(event){

                                const confirmation = confirm("Voce não pode deletar um chef que tenha receitas")

                                
                                event.preventDefault()
                                 
                        
                        })
                                

                }else{

                        const formDelete = document.querySelector("#form-delete")
                        formDelete.addEventListener("submit", function(event){

                                const confirmation = confirm("deseja deletar?")

                                if(!confirmation){
                                        event.preventDefault()
                                }   
                        
                        })

                }