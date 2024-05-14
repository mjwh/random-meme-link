import express from "express";
import { pipeline } from 'stream';
import { createServer } from 'http';
import { promisify } from 'util';

const pipelineAsync = promisify(pipeline);

const fetchRedditMeme = async (searchTerm:any) => {
  const endpoint = 'https://meme-api.com/gimme';
  const response = await fetch(searchTerm ? `${endpoint}/${searchTerm}` : endpoint);
  const data = await response.json();
  return data.url ? data : await fetchRedditMeme();
};

const fetchRandomMeme = async (searchTerm?: any) => {
  const endpoint = 'https://img.randme.me/';
  return await fetch(`${endpoint}?${Date.now()}`);
};

export const server = async () => {
  const app = express();
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.get('/random-meme', async (req, res) => {
    try {
      const data = await fetchRandomMeme(req.query.q);
      const imageResponse = await fetch(data.url);
      if (!imageResponse.ok) {
        throw new Error('An error occurred while fetching the meme.');
      }
      res.setHeader('Content-Type', 'image/jpeg');
      await pipelineAsync(imageResponse.body, res);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred while fetching the meme.');
    }
  });

  const server = createServer(app);
  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running in 3000`);
  });
};