
const db = require("../../config/db")

const fs = require('fs')


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

    async deleteRecipefiles(recipId, fileId){

        const client = await db.connect()

        try {

            const query = `SELECT recipe_files.id AS recipe_files_id, recipe_files.file_id AS recipe_files_file_id, files.* 
            FROM recipe_files INNER JOIN files ON (recipe_files.file_id = files.id)
            WHERE recipe_id = $1 AND file_id = $2`

            let results = await db.query(query, [recipId, fileId])
            const file = results.rows[0]

    //return console.log(file)

            fs.unlinkSync(file.path)

                try {

                    await client.query('BEGIN')

                    
                    
                    const queryFiles = 'DELETE FROM files WHERE id = $1'
                    
                    await client.query(queryFiles, [fileId])
                    
                    const queryRecipeFiles = 'DELETE FROM recipe_files WHERE id = $1'
                    
                    await client.query(queryRecipeFiles, [recipId])
                    


                    await client.query('COMMIT')

                    
                } catch (err) {
                    
                    await client.query('ROLLBACK')
                    throw err
                    
                }finally{
                    client.release()
                }
        
    
        } catch (err) {
                console.error(err)
                
        }

    }


}