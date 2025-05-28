import useAuth from "@/app/hooks/useAuth";

const handleGoogleSignIn = async () => {
    const {googleMethod}= useAuth();    
  try {
    // Implement your Google auth logic here (e.g., Firebase)
    const googleUser = await googleMethod(); // Replace with actual Google auth method
    
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: googleUser.displayName,
        email: googleUser.email,
        photo: googleUser.photoURL,
        google: true
      })
    });

    if (!response.ok) {
      throw new Error('Google registration failed');
    }
    
    // Handle successful registration
  } catch (error) {
    console.error('Google signup error:', error);
  }
};

const handleManualRegister = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        photo: formData.get('photo') || null,
        google: false
      })
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    // Handle successful registration
  } catch (error) {
    console.error('Registration error:', error);
  }
}; 