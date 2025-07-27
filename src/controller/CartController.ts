import { CartInterface } from "../interfece/CartInterface";
import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

export const CartController = {
    add: async ({ body }: {
        body: CartInterface
    }) => {
        const cart = await prisma.cart.findFirst({
            where: {
                bookId: body.bookId,
                memberId: body.memberId,
               
            }
        });
         let qty =1;
         if(cart !== null){
        
            await prisma.cart.update({
                where: {
                    id: cart.id
                },
                data: {
                    qty:cart.qty + 1
                }
            })
         }else{
             await prisma.cart.create({
            data: {
                bookId: body.bookId,
                memberId: body.memberId,
                qty: 1
            }
        })
         }
       
        return cart;
    },
    list:async ({params}:{params:{memberId:string}})=>{
        try {
            const carts = await prisma.cart.findMany({
                where: {
                    memberId: params.memberId
                },
               select:{
                   id:true,
                   qty:true,
                   book:true,
               }
            })
            return carts;
        } catch (error) {
            return {error:error}
            
        }
    }
}