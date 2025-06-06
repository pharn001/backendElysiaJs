
export default {
    list : () =>{
        const customers = [
            {id:1, name: "jondoe", email:"nothing@gmail.com"},
            {id:2, name: "jon", email:"John@gmail.com"},
        ]
        return customers;
    },
 // create 
    create: ({body}:{
        body:{
            id:number,
            name:string,
            emial:string
        }
    })=>{
        return body;
    },

    // update

    update:({params, body}:{
        body:{
        id:number
        name:string,
        emial:string
        },
        params:{
            id:string
        }
    })=>{
        return { body:body, id:params.id} 
    },
    
    //delete 
    remove:({params}:{
        params:{
            id:string
        }
    }) => {
        return {id:params.id}
     }
}