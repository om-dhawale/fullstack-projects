    import express from "express";
    import authMiddleware from "../middlewares/authMiddleware.js";
    import pool from "../db.js";

    const router = express.Router();
    router.use(authMiddleware)

    router.get('/', async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM notes WHERE user_id = $1', [req.user.user_id]);
            res.status(200).json(result.rows);
        } catch (error) {
            res.status(500).json({message:"Something went wrong."})
        }
    });


    router.post('/', async (req, res) => {
        const {title, body} = req.body;
        if(!title || !body) {
            return res.status(400).json({message: "enter both title and body"});
        }
        const user_id = req.user.user_id || req.user.id;
        try {
            const result = await pool.query('INSERT INTO notes(title, body, user_id) VALUES($1, $2, $3) RETURNING *', [title, body, user_id]);
        res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({message:"Something went wrong"})
        }
    });

    router.put('/:id', async (req, res) => {
        const note_id = req.params.id;
        const{ title, body } = req.body;
        const user_id = req.user.user_id;

        if(!title || !body) {
            return res.status(400).json({message: "enter both title and body"});
        }

        try {
            const result = await pool.query('UPDATE notes SET title=$1, body=$2 WHERE id=$3 AND user_id=$4 RETURNING *', [title, body, note_id, user_id]);
            if(!result.rows[0]){
                return res.status(404).json({message:"the note with this id does not exist"});
            }
            res.status(200).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({message: "Database error"})
        }
    });

    router.delete('/:id', async (req, res) => {
        const note_id = req.params.id;
        const user_id = req.user.user_id;

        try {
            const result = await pool.query('DELETE FROM notes WHERE id=$1 AND user_id=$2 RETURNING *', [note_id, user_id]);
            if(!result.rows[0]){
                return res.status(404).json({message:"the note with this id does not exist"});
            }
            res.status(200).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({message: "Database error"})
        }
    })

    export default router;