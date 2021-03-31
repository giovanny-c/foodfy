
const db = require("../../config/db")

const {date} = require("../../lib/utils")


module.exports = {

    all(){

       return db.query(`
                SELECT 
                chefs.id, chefs.name, chefs.file_id ,count(recipes) AS recipes
                FROM chefs LEFT JOIN recipes ON(chefs.id =  recipes.chef_id)
                GROUP BY chefs.id         
            `)


    },

    find(id){//Join triplo ?

        const query = `
                SELECT 
                chefs.id, chefs.name, count(recipes) AS recipes, chefs.file_id
                FROM chefs LEFT JOIN recipes ON(chefs.id =  recipes.chef_id)
                WHERE chefs.id = $1
                GROUP BY chefs.id
            `
        return db.query(query, [id])


    },

    findRecipes(id){

        const query = `
            SELECT 
            recipes.name, recipes.id
            FROM chefs JOIN recipes ON(chefs.id =  recipes.chef_id)
            WHERE chefs.id = $1
        `
        return db.query(query, [id])

    },

    create(data, file_id){

        const query = `
            INSERT INTO chefs (
            name,
            created_at,
            file_id
            ) VALUES ($1, $2, $3)
            RETURNING id
        `

        const values = [
            data.name,
            date(Date.now()).iso,
            file_id || ""

        ]

        return db.query(query, values)

    },

    update(data, fileId){

        const query = `
            UPDATE chefs SET 
            name=($1),
            file_id=($2)
            WHERE id = $3
        `

        const values = [
            data.name,
            fileId,
            data.id
        ]

        return db.query(query, values)

    },


    delete(id){

        const query = `DELETE FROM chefs WHERE id = $1` 

        return db.query(query, [id])

    },

    file(file_id){//todas as imgens de uma receita

        const query = `SELECT * FROM files WHERE id = $1`

        return db.query(query, [file_id])

    },



}