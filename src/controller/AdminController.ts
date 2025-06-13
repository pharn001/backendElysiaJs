import { PrismaClient } from "../../generated/prisma";
import type {AdminInterface} from "../interfece/AdminInterface"
const prisma = new PrismaClient();

export const AdminController = {
    create: async ({ body } : {body:AdminInterface}) =>{
        try {
            const admin = await prisma.admin.create({
                data:body
            })
            return admin;
        } catch (error) {
            return error;
        }
    },
    signin : async ({body,jwt}:{
        body: {
            username: string;
            password: string;
        }
        jwt:any 
    })=>{
        try {
            const checkadmin = await prisma.admin.findFirst({
                where :{
                     username: body.username,
                    password: body.password,
                    satus:"active"
                },
                select: {
                    id:true,
                   name:true,
                }
            })
            if(!checkadmin) {
                return new Response("user not fould",{status:401})
            }

            const token = await jwt.sign(checkadmin)
            console.log(token)
            return {status: true,token}
        } catch (error) {
            return error
        }
    }
}