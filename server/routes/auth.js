import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/test', (req, res) => {
    console.log(req.headers);
    
})

router.get('/users', async (req, res) => {
    const result = await pool.query('SELECT * FROM users');
    res.status(200).json(result.rows);
})

router.post('/register', async (req, res) => {
    const { email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json({message: "enter both email and password"});
    }
    const hashedPassword =  await bcrypt.hash(password, 10);

    try {
        await pool.query('INSERT INTO users(email, password) VALUES($1, $2)', [email, hashedPassword]);
        res.status(201).json({message: "user registered successfully"});
    } catch (error) {
       res.status(500).json({message: `Something went wrong.`}) 
    }
    
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({message: "enter both email and password"});
    }
    try {
        const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
        if(!result.rows[0]) {
            return res.status(404).json({message:"email not found"})
        }
        const storedPassword = result.rows[0].password;
        const match = await bcrypt.compare(password, storedPassword);
        if(!match){
            return res.status(400).json({message:"please enter valid credentials"});
        } else {
            const token = jwt.sign(
                {user_id: result.rows[0].id},
                process.env.JWT_SECRET,
                {expiresIn: '1h'}
            );
            res.status(200).json({
                message:"you are logged in successfully.",
                token: token
            });
        }
    } catch (error) {
        res.status(500).json({message: "something went wrong"})
    }
    
});



export default router; 