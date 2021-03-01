const db = require("../../config/db")

const {date} = require("../../lib/utils")

module.exports = {

    all(callback){

        db.query(`
            SELECT 
            recipes.id, recipes.name, recipes.image, chefs.name AS chef
            FROM recipes LEFT JOIN chefs ON(recipes.chef_id = chefs.id)         
            `, function(err, results){

                if(err) throw `Database error: ${err}`

                callback(results.rows)

            })


    },

    find(id, callback){

        const query = `
            SELECT 
            recipes.*, chefs.name AS chef, chefs.id AS chefs_id
            FROM recipes LEFT JOIN chefs ON(recipes.chef_id = chefs.id)
            WHERE recipes.id = $1
            `

        db.query(query, [id], function(err, results){
            if(err) throw `Database error: ${err}`

            

            callback(results.rows[0])
        })

    },

    create(data, callback){

        const query = `
                INSERT INTO recipes (
                    name,
                    image,
                    information,
                    ingredients,
                    preparation,
                    chef_id,
                    created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id
            `

        const values = [
            data.name,
            data.image,
            data.information,
            data.ingredients,
            data.preparation,
            data.chef,
            date(Date.now()).iso
        ]

        db.query(query, values, function(err, results){
            if(err) throw `Database error: ${err}`

            

            callback(results.rows[0])

        })

    },

    update(data, callback){

        const query = `UPDATE recipes SET
                name=($1),
                image=($2),
                information=($3),
                ingredients=($4),
                preparation=($5),
                chef_id=($6)
                WHERE id = $7       
            `
        
        const values = [
            data.name,
            data.image,
            data.information,
            data.ingredients,
            data.preparation,
            data.chef,
            data.id

        ]

        db.query(query, values, function(err, results){
            if(err) throw `Database error: ${err}`

            

            callback()
        })

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
            SELECT recipes.id, recipes.name, recipes.image,
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
    

    chefsSelectedOptions(callback){

        db.query(`SELECT name, id FROM  chefs`, function(err, results){
            if(err) throw `Database error: ${err}`

            

            callback(results.rows)


        })

    }




}