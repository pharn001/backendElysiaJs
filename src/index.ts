import { Elysia } from "elysia";
import {cors} from "@elysiajs/cors"
import {swagger} from "@elysiajs/swagger"
import { staticPlugin } from "@elysiajs/static";
import {jwt} from "@elysiajs/jwt"; 
import customerController from "./controller/customerController";//export defaulf
import { Bookcontroller } from "./controller/BookController"; // import const book 
import { AdminController } from "./controller/AdminController";
import { MemberController } from "./controller/MemberController";
import { CartController } from "./controller/CartController";
const app = new Elysia()
.use(cors())
.use(swagger())
.use(staticPlugin(
  {
    prefix: "/public/upload",    //URL prefix ที่จะใช้เรียกไฟล์ เช่น http://localhost:3001/public/upload/xxx.png
    maxAge: 60 * 60 * 24 * 7, // 1 week
    assets:'./public/upload' //  assets	ตำแหน่งโฟลเดอร์ในเครื่องเซิร์ฟเวอร์ที่เก็บไฟล์จริง (./public/upload)
  }
))
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
// ເຊັກໂທເຄັ້ນ ຜ່ານ headers ຈາກ font-end
.get('/info', async ({jwt,request}) =>{
  if(request.headers.get('Authorization') === null){
    return {message:" no Authorization"}
  }
  const token = request.headers.get("Authorization") ?? "";
  if(token === ""){
    return {message:"no Auth"}
  }
  const payload = await jwt.verify(token);
  return {
    message:"Hello ElysiaJS",
    payload: payload
  }
})
// customer controller
.get("/customer", customerController.list)
.post("/customer",customerController.create)
.put("/customer/:id",customerController.update)
.delete("/customer/:id",customerController.remove)

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

  // ລວມ group api ທີ່ຢູ່ໃນ ຫົວຂໍ້ດຽວກັນ ຫຼື ຈັດລະບຽບໃຫ້ api 
  .group("/api/book", app => app
    .post("/",Bookcontroller.create)
    .get("/",Bookcontroller.list)
    .put("/:id",Bookcontroller.update)
    .delete("/:id",Bookcontroller.delete)
  )
// api with database connection

/*
  .post("/api/book/create",Bookcontroller.create)
  .get("api/book/data",Bookcontroller.list)
  .put("api/book/update/:id",Bookcontroller.update) 
  .delete("api/book/delete/:id",Bookcontroller.delete)
*/

// admin controller
  .group("/api/admin", app => app 
    .post("/create", AdminController.create)
    .post("/signin", AdminController.signin)
    .get("/info", AdminController.info)
    .put("/update", AdminController.update)
    .get("/list", AdminController.list)
    .put("/update-data/:id", AdminController.updateData)
    .delete("/remove/:id",AdminController.remove)
  )
  .group("/api/member", app => app
    .post("/register", MemberController.signup)
    .post("/signin", MemberController.sigin)
    .get("/info", MemberController.info)
  )
  .group("/api/cart", app => app
    .post("/add", CartController.add)
    .get("/list/:memberId",CartController.list)
  )
  .listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
