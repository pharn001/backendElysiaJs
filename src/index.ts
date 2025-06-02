import { Elysia } from "elysia";
import {cors} from "@elysiajs/cors"
import {swagger} from "@elysiajs/swagger"
import { staticPlugin } from "@elysiajs/static";
import {jwt} from "@elysiajs/jwt"; 
import customerController from "./controller/customerController";//export defaulf
import { Bookcontroller } from "./controller/BookController"; // import const book 
const app = new Elysia()
.use(cors())
.use(swagger())
.use(staticPlugin())
.use(jwt({
  name:"jwt",
  secret:"secret"
}))

// test jwt token
.post("/login",async ({jwt,cookie: {auth}}) =>{
const user = {
  id:1,
  name:"who name",
  level:"admin"
}
  const token = await jwt.sign(user)
   auth.set({
    value:token,
    httpOnly:true,
    secure:true,
    maxAge: 60 * 60 * 24 * 7 // 1 week
   })
   return {token:token}
})
// get a data in cookie 
.get("/profile", ({jwt, cookie : {auth}}) =>{
  const user = jwt.verify(auth.value)
   return user
})
.post("/logout", ({jwt, cookie:{auth}}) =>{
  auth.remove()
  return {message:"remove cookied"}
})
  .get("/", () => "Hello Elysia")
  .get("/hello", () => "Hello api  Elysia")
  .get("json-data", () => {
    return { massage: "Hello Elysia", data: [1, 2, 3, 4, 5] }
  })
  .get("json-data/:name", ({ params }) => {
    return {
      name: params.name,
      massage: "Hello Elysia",
    }
  })
  .get("/api/parson/:id/:name", ({ params }: {
    params: { id: string, name: string }
  }) => {
    return { id: params.id, name: params.name }
  })
  // .get("book/get",{})
// post method
  .post("/book/create", ({body}:{
      body:{
      id:string,
      title:string,
      price:number
    }
  })=>{
    return {
      id: body.id,
      title: body.title,
      price: body.price,
      message: "Book created successfully"
    }
  })

  // put method
  .put("/book/update/:id",({ params, body }:{
    params:{id:string},
    body:{
      title:string,
      price:number
    }
  })=>{
    
    return {
      body
    }
  })

  // delete
  .delete("book/delete/:id",({params}:{
    params:{
      id:string
    }
  })=>{
    return {
      id:params.id
    }
  })

  // upload file
  .post("/upload-file",({ body }:{
    body :{
      file:File
     }
  }) =>{
    Bun.write('public/upload/' + body.file.name, body.file)
    return {
      massage:"upload file success!"
    }
  })
  // white file
  .get("/write-file", ()=>{
    Bun.write('test.txt',"write file whit nothing")
    return {
      message :"success"
    }
  })
  // read file 
  .get("read-file",()=>{
    const file = Bun.file("test.txt")
    return file.text()
  })

  .post("/api/book/create",Bookcontroller.create)
  .listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
