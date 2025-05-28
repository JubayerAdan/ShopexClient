export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, photo, provider } = req.body;

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user document
    const newUser = {
      name,
      email,
      photo,
      provider: provider || 'email',
      createdAt: new Date(),
      // Add other default fields as needed
    };

    await usersCollection.insertOne(newUser);
    return res.status(201).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 