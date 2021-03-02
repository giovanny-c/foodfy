
const db = require("../../config/db")

const {date} = require("../../lib/utils")


module.exports = {

    all(callback){

        db.query(`
                SELECT 
                chefs.id, chefs.name, chefs.avatar_url AS image, count(recipes) AS recipes
                FROM chefs LEFT JOIN recipes ON(chefs.id =  recipes.chef_id)
                GROUP BY chefs.id         
            `, function(err, results){

                if(err) throw `Database error: ${err}`

                callback(results.rows)

            })


    },

    find(id, callback){

        const query = `
                SELECT 
                chefs.id, chefs.name, chefs.avatar_url AS image, count(recipes) AS recipes
                FROM chefs LEFT JOIN recipes ON(chefs.id =  recipes.chef_id)
                WHERE chefs.id = $1
                GROUP BY chefs.id
            `
        db.query(query, [id], function(err, results){

            if(err) throw `Database error: ${err}`

                callback(results.rows[0])

        })


    },

    findRecipes(id, callback){

        const query = `
            SELECT 
            recipes.name, recipes.image, recipes.id
            FROM chefs JOIN recipes ON(chefs.id =  recipes.chef_id)
            WHERE chefs.id = $1
        `
        db.query(query, [id], function(err, results){

            if(err) throw `Database error: ${err}`

                callback(results.rows)


        })

    },

    create(data, callback){

        const query = `
            INSERT INTO chefs (
            name,
            avatar_url,
            created_at
            ) VALUES ($1, $2, $3)
            RETURNING id
        `

        const values = [
            data.name,
            data.image,
            date(Date.now()).iso
        ]

        db.query(query, values, function(err, results){

            if(err) throw `Database error: ${err}`

            callback(results.rows[0])


        })

    },

    update(data, callback){

        const query = `
            UPDATE chefs SET 
            name=($1),
            avatar_url=($2)
            WHERE id = $3
        `

        const values = [
            data.name,
            data.image,
            data.id
        ]

        db.query(query, values, function(err, results){

            if(err) throw `Database error: ${err}`

            callback()

        })

    },


    delete(id, callback){

        const query = `DELETE FROM chefs WHERE id = $1` 

        db.query(query, [id], function(err, results){

            if(err) throw `Database error: ${err}`

            callback()

        })

    }


}