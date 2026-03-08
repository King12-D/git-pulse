import express from 'express';

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// Example: How to extract the user's GitHub session
// The frontend Next.js app passes the NextAuth session token (or JWT)
// Your middleware here should verify the session to ensure the user is logged in
app.get('/api/feed/:userId', (req, res) => {
    // TODO: Feed scoring logic goes here (Dave)
    res.json({ message: "Algo feed placeholder" });
});

app.listen(port, () => {
    console.log(`GitPulse API listening on port ${port}`);
});
