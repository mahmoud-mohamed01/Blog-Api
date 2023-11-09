import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import 'dotenv/config'



const app = express();
const port =process.env.PORT1||4000;
let Count_id=1;

//establish database 
mongoose.connect("mongodb+srv://admin-mahmoud:mahmoud123@cluster0.rkskfqb.mongodb.net/blogdb");
const blogSchema=new mongoose.Schema(
  {
    id:Number,
    title:String,
    content:String,
    author:String,
    date:String

  }
);

const Blog=mongoose.model("blog",blogSchema);

// In-memory data store
let posts = [
  {
    id: 1,
    title: "The Rise of Decentralized Finance",
    content:
      "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
    author: "Alex Thompson",
    date: "2023-08-01T10:00:00Z",
  },
  {
    id: 2,
    title: "The Impact of Artificial Intelligence on Modern Businesses",
    content:
      "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
    author: "Mia Williams",
    date: "2023-08-05T14:30:00Z",
  },
  {
    id: 3,
    title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
    content:
      "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
    author: "Samuel Green",
    date: "2023-08-10T09:15:00Z",
  },
];

//Blog.insertMany(posts);


let lastId = 3;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// GET All posts
app.get("/posts",async (req,res)=>
{
  let posts=await Blog.find() 
  res.json(posts);
});


// GET a specific post by id
app.get("/posts/:id",async (req,res)=>
{ 
  let post= await Blog.findOne({id:req.params.id});
  res.json(post);
});

// POST a new post
app.post("/posts",async (req,res)=>
{
  lastId++;
  let newPost= new Blog(
  {
    id:lastId,
    title:req.body.title,
    content:req.body.content,
    author:req.body.author,
    date: new Date().toJSON(),
  });
   await newPost.save();
   let post = await Blog.findOne({id:lastId})
  
  res.json(post);
});

// Update a post 
app.patch("/posts/:id",async (req,res)=>
{
  let targetPost= Blog.findOne({id:req.params.id})
  let updatedPost= 
  {
    id:req.params.id,
    title:req.body.title || targetPost.title,
    content:req.body.content || targetPost.content,
    author:req.body.author || targetPost.author,
    date: new Date().toJSON(),
  }

  await Blog.findOneAndUpdate({id:req.params.id},updatedPost);



  res.json(updatedPost);
});

// DELETE a specific post by providing the post id.
app.delete("/posts/:id",async(req,res)=>
{

  await Blog.deleteOne({id:req.params.id});
  res.send("deleted succesfully");
});


//starting the server
app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
