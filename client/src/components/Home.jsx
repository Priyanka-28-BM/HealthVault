import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center py-10 px-4 bg-gray-100 text-black">
      <Link
        to="/signup"
        className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition"
      >

      </Link>
    </main>
  );
};

export default Home;
