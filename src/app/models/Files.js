const db = require("../../config/db")


module.exports = {

    async createRecipeFiles({filename, path, recipe_id}){//file

        const client = await db.connect()
        
        try{//tenta isso:

            await client.query('BEGIN')//começa a transação
            const queryFiles = 'INSERT INTO files (name, path) VALUES ($1, $2) RETURNING id'
            const valuesFiles = [
                filename,
                path,
            ]

            const res = await client.query(queryFiles, valuesFiles) //inserindo em files

            const queryRecipeFiles = 'INSERT INTO recipe_files (recipe_id, file_id) VALUES ($1, $2)'
            const valuesRecipeFiles = [
                recipe_id, 
                res.rows[0].id 
            ]

            await client.query( queryRecipeFiles, valuesRecipeFiles) //inserindo em recipe_files com o id que retornou da tabela files

            await client.query('COMMIT') //Manda tudo de uma vez

        }catch(err){//se nao funcionar
        
            await client.query('ROLLBACK') //volta a transação
            throw err
        
        }finally{
            client.release()//termina a transação
        }
    
    
    
    
    },

    async deleteRecipefiles(productId, fileId)


}