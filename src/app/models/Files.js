
const db = require("../../config/db")

const fs = require('fs')
const { throws } = require("assert")


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

            const query = `SELECT recipe_files.id AS tbrecipefiles_id , files.id AS tbfiles_id, files.name, files.path 
            FROM recipe_files INNER JOIN files ON (recipe_files.file_id = files.id)
            WHERE recipe_id = $1` //traz os ids das duas tabelas + o path

            let results = await db.query(query, [recipId])
            const file = results.rows[0]
            

                try {


                    await client.query('BEGIN')

        
                    
                    const queryFiles = 'DELETE FROM files WHERE id = $1'
                    
                    await client.query(queryFiles, [file.tbfiles_id])
                    
                    const queryRecipeFiles = 'DELETE FROM recipe_files WHERE id = $1'
                    
                    await client.query(queryRecipeFiles, [file.tbrecipefiles_id])
                    


                    await client.query('COMMIT')


                    fs.unlinkSync(file.path)
                    
                } catch (err) {
                    
                    await client.query('ROLLBACK')//nao ta funcionando
                    throw err
                    
                }finally{
                    client.release()
                }
        
    
        } catch (err) {
                console.error(err)
                
        }

    },

    createChefFile({filename, path}){

        return db.query('INSERT INTO files (name, path) VALUES ($1, $2) RETURNING id', [filename, path])
        

    },

    updateChefFile({filename, path, file_id, oldPath}){  

        if(oldPath) fs.unlinkSync(oldPath)//remove o file antigo da aplicação

            const query = `UPDATE files SET 
                        name=($1),
                        path=($2)
                        WHERE id = $3`

            return db.query(query, [filename, path, file_id]) //atauliza com o novo file
             
        
    },


    deleteChefFiles(file_id, path){

        fs.unlinkSync(path) //remove o file da app

        return db.query('DELETE FROM files WHERE id = $1', [file_id]) //remove do banco

    }
    

    

}