
export default {
    list : () =>{

    },
 // create 
    create: ({body}:{
        body:{
            id:string,
            name:string,
            emial:string
        }
    })=>{

    },

    // update

    update:({params, body}:{
        body:{
        id:string
        name:string,
        emial:string
        },
        params:{
            id:string
        }
    })=>{},
    
    //delete 
    remove:({params}:{
        params:{
            id:string
        }
    }) => { }
}