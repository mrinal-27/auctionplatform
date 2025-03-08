const express=require('express');
const mongoose= require('mongoose');
const cors=require('cors');
const bcryptjs=require('bcryptjs');
const jsonwebtoken=require('jsonwebtoken');

const app=express();
//server is being configured to handle json
app.use(express.json());
//cors will help server to accept requests from multiple domains
app.use(cors());

const SECRET_KEY='mysecretkey2707';
mongoose.connect('mongodb://localhost:27017/');

//user schema
const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});
//create table user ( username char(10) not null unique)
const User =mongoose.model('User', userSchema);

