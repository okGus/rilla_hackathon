import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Extract data from the request body
    const { text } = req.body;

    // Perform your logic here, such as saving the data to a database
    if (!text) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    console.log(text)

    // Respond with the new post data
    return res.status(201).json(text);
  }
}
