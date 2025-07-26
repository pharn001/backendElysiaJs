import { PrismaClient } from "../../generated/prisma";
import type { BookInterface } from "../interfece/BookInterfece";
const prisma = new PrismaClient();
 

export const Bookcontroller = {
  create : async ({body} :{  body:  BookInterface})=>{
    try{
      const imageName = body.image.name; // get file name from body
      const image = body.image; // opject File  
        const book = await prisma.book.create({
            data:{
              name:body.name,
              isdn:body.isdn,
              price:parseInt( body.price.toString() ),
              description:body.description,
              image:body.image.name,
            }
        })
        Bun.write("public/upload/" + imageName, image)
        return book
    }catch(error){
      console.log(error);
      return {error}
    }
  } ,
  list :async () =>{
    try {
      return await prisma.book.findMany(
        {
          orderBy: {
            createAt: 'asc'
          }
        }
      )
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
      const nameImg= body.image.name ?? "";
      const image = body.image ?? null;
  const oldImage= await prisma.book.findMany({
          where: { 
            id: params.id
          }
        })
      if(nameImg !== ""){
     


        const file = Bun.file("public/upload/" + oldImage[0].image);
        if(await file.exists()){
          await file.delete()
        }
        Bun.write("public/upload/" + nameImg, image) 
      }


      const book = await prisma.book.update({

        data:{
          name:body.name,
          price: parseInt(body.price.toString()),
          description:body.description,
          isdn:body.isdn,    
          image:nameImg ?? oldImage[0].image  
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