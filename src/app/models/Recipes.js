const db = require("../../config/db")

const {date} = require("../../lib/utils")



module.exports = {

    all(){

        return db.query(`
            SELECT 
            recipes.id, recipes.name, chefs.name AS chef
            FROM recipes LEFT JOIN chefs ON(recipes.chef_id = chefs.id)         
            `,)


    },

    find(id){

        const query = `
            SELECT 
            recipes.*, chefs.name AS chef, chefs.id AS chefs_id
            FROM recipes LEFT JOIN chefs ON(recipes.chef_id = chefs.id)
            WHERE recipes.id = $1
            `

        return db.query(query, [id])

    },

    create(data){

        const query = `
                INSERT INTO recipes (
                    name,
                    information,
                    ingredients,
                    preparation,
                    chef_id,
                    created_at
                ) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            `

        const values = [
            data.name,
            data.information,
            data.ingredients,
            data.preparation,
            data.chef,
            date(Date.now()).iso
        ]

        return db.query(query, values)

    },

    update(data){

        const query = `UPDATE recipes SET
                name=($1),
                information=($2),
                ingredients=($3),
                preparation=($4),
                chef_id=($5)
                WHERE id = $6       
            `
        
        const values = [
            data.name,
            data.information,
            data.ingredients,
            data.preparation,
            data.chef,
            data.id

        ]

        return db.query(query, values)

    },

    delete(id, callback){

        db.query(`DELETE FROM recipes WHERE id = $1`, [id], function(err, results){

            if(err) throw `Database error: ${err}`

            

            callback()

        })

    },


    paginate(params){

        const {filter, limit, offset, callback} = params

        let query = ``,
            filterQuery = ``,
            totalQuery = `(SELECT count(*) FROM recipes) AS total`

        if(filter){

            filterQuery = `
                WHERE recipes.name ILIKE '%${filter}%'
            `

            totalQuery = `(
                    SELECT count(*) FROM recipes
                    ${filterQuery} 
                ) AS total
             `

        }



        query = `
            SELECT recipes.id, recipes.name,
            ${totalQuery}, chefs.name AS chef, chefs.id AS chefs_id
            FROM recipes LEFT JOIN chefs ON(recipes.chef_id = chefs.id)
            ${filterQuery}
            LIMIT $1 OFFSET $2
        `
       

        db.query(query, [limit, offset], function(err, results){
            
            if(err) throw `Database error: ${err}`

            
            
            callback(results.rows)

        })
            



    },
    

    chefsSelectedOptions(){

        return db.query(`SELECT name, id FROM  chefs`)

    },

    files(id){

        const query = `SELECT recipe_files.id AS recipe_files_id, recipe_files.file_id AS recipe_files_file_id, files.* 
        FROM recipe_files INNER JOIN files ON (recipe_files.file_id = files.id)
        where recipe_id = $1`

        return db.query(query, [id])

    },




}