module.exports = {
    age(timestamp){//function para encontrar idade

        const today = new Date();
        const birthDate = new Date(timestamp);

        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();

        if(month < 0 || month == 0 && today.getDate() < birthDate.getDate()){

            age = age - 1;

        }

        return age;

    },
    
    date(timestamp){

        const date = new Date(timestamp);

        const year = date.getUTCFullYear();

        const month = `0${date.getUTCMonth() + 1}`.slice(-2);//slice(-2) vai pegar os dois ultimos caracteres da string
        

        const day = `0${date.getUTCDate()}`.slice(-2);

        const hour = `0${date.getHours()}`.slice(-2)

        const minutes = `0${date.getMinutes()}`.slice(-2)

        

        return { 
            day,
            month,
            year,
            iso: `${year}-${month}-${day} ${hour}:${minutes}`,//tipo ISO
            birthday: `${day}/${month}`,
            format: `${day}/${month}/${year}`

       }

        


    }


}

