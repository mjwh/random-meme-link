// server.ts
import { createServer } from "http";
import express from "express";

export const server = async () => {
  const app = express();

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.get('/random-meme', async (req, res) => {
    try {
      const response = await fetch('https://meme-api.com/gimme');
      const data = await response.json();
      res.send(data.url);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred while fetching the meme.');
    }
  });

  const server = createServer(app);

  server.listen(3000, () => {
    console.log(`Server running in 3000`);
  });
};