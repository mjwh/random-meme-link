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
      const searchTerm = req.query.q;
      const endpoint = 'https://meme-api.com/gimme'
      const response = await fetch(searchTerm ? `${endpoint}/${searchTerm}` : endpoint);
      const data = await response.json();

      if(!data.url) { // If no meme found
        const response = await fetch(endpoint);
        const data = await response.json();
        return res.send('<img src="' + data.url + '" height="350px" />');
      }

      res.send('<img src="' + data.url + '" height="350px" />');
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