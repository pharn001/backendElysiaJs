import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();


export const Bookcontroller = {
  create : async ({body} :{
    body:{
        name:string,
        price:number
    }
  })=>{
    try{
        const book = await prisma.book.create({
            data:{
                name:body.name,
                price:body.price
            }

        })
        return book
    }catch(err){}
  } 
}