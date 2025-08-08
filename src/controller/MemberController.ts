import { PrismaClient } from "../../generated/prisma";
import type { MemberInterface } from "../interfece/MemberInterface";
const prisma = new PrismaClient();

export const MemberController = {
    signup :async ({body}:{body:MemberInterface })=>{
        try {
        const create =   await prisma.member.create({
                data:{                   
                    phone: body.phone,
                    password: body.password,
                    username: body.username
                }
            })
            return create
        } catch (error) {
            return {error:error}
        }
    },
    sigin : async ({body,jwt}:{body:MemberInterface,jwt:any})=>{
        try {
            const member =await prisma.member.findUnique({
                where:{
                    phone: body.phone,
                    password:body.password,
                    username:body.username
                },
                select:{
                    id:true
                }
            })
            if(!member) return new Response("Member not found",{status:404});
            const token =await jwt.sign(member)
       
            console.log(token)
            return {token:token}
            
        } catch (error) {
            return {error:error}
            
        }
    } 
    ,info: async ({ request, jwt }: {
        request: {
            headers: any
        },
        jwt: any
    }) => {
        try {
            const token = request.headers.get("Authorization")?.replace("Bearer ", "");
            const payload = await jwt.verify(token); 
            const member = await prisma.member.findUnique({
                where: {
                    id: payload.id
                },
                select: {
                    name: true,
                    id: true,
                   
                }
            })
            return member;
        } catch (error) {
            console.log(error)
            return error;

        }
    },

}
