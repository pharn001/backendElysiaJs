import { PrismaClient } from "../../generated/prisma";
import type { BookInterface } from "../interfece/BookInterfece";
const prisma = new PrismaClient();
 

export const Bookcontroller = {
  create : async ({body} :{  body:  BookInterface})=>{
    try{
        const book = await prisma.book.create({
            data:{
              name:body.name,
              isdn:body.isdn,
                price:body.price,
              description:body.description
            }
        })
        return book
    }catch(error){
      console.log(error);
      return {error}
    }
  } ,
  list :async () =>{
    try {
      return await prisma.book.findMany()
    }catch(err){
       return err
     
    }
  },
  update : async ({params,body}:{
    params:{
      id:string
    },
    body:BookInterface
  }) =>{
    try{
      const book = await prisma.book.update({
        data:{
          name:body.name,
          price:body.price,
          description:body.description,
                isdn:body.isdn,
                createAt:body.createAt
        },
        where:{
          id:params.id
        }
      })
      return book;
    }catch(error){
      console.log(error)
      return error
    }
  },
  delete : async ({params}:{params:{id:string}})=>{
    try {
      await prisma.book.delete({
        where:{id:params.id}
      })
      return {
        message:"delete success!"
      }
    } catch (error) {
      return error
    }
  }
}