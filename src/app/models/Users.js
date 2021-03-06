const db = require("../../config/db")

const {date} = require("../../lib/utils")

const {hash} = require('bcryptjs')





module.exports = {

    async findOne(filters){

        let query = "SELECT * FROM users"//WHERE par = value

        Object.keys(filters).map(key => {

            query = `${query}
                ${key}
            `

            Object.keys(filters[key]).map(field => {

                query = `${query} ${field} = '${filters[key][field]}'`
            })


        })

        const results = await db.query(query)

        return results.rows[0]
    },


    async all(){
        
        return db.query("SELECT id, name, email, is_admin, created_at, updated_at FROM users")
        

    },

    async create(data){

        try {
            
            const query =`
                INSERT INTO users (
                    name,
                    email,
                    password,
                    is_admin,
                    created_at,
                    updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            `

            const passwordHash = await hash(data.password, 8)

            const values = [
                data.name,
                data.email,
                passwordHash,
                data.is_admin,
                date(Date.now()).iso,
                date(Date.now()).iso,
            ]

            const results = await db.query(query, values)
            return results.rows[0].id

        } catch (err) {
            console.error(err)
        }

    },

    async update(id, fields){


        try {
            
        

            let query = "UPDATE users SET"

            Object.keys(fields).map((key, index, array) => {

                if((index + 1) < array.length){

                    query = `
                        ${query}
                        ${key} = '${fields[key]}',
                    `
                
                }else{

                    query = `
                        ${query}
                        ${key} = '${fields[key]}'
                        WHERE id = ${id}
                    ` 

                }

            })
            
            await db.query(query)
            return
    
        } catch (err) {
            console.error(err)
        }
    },

    delete(id){

        return db.query(`DELETE FROM users WHERE id = $1`, [id])
    },

    async allAdmins(){

        const results = await db.query(`SELECT * FROM users WHERE is_admin = true`)
        return results.rows
    }

}

