import React from 'react'

function Error() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="w-64 h-64 shrink-0 rounded-full bg-muted overflow-hidden border-2 border-primary/20 shadow-md">
        <img
          src="https://i.pinimg.com/736x/db/4e/2c/db4e2cdacce82d4f9f6d4fc736cef4d2.jpg"
          alt="Error Image"
          className="w-full h-full object-cover"
        />
      </div>
      <h1 className="text-3xl font-bold text-primary mt-4">Error Occurred</h1>
      <p className="text-lg text-gray-600 mt-2">An unexpected error occurred.</p>
    </div>
  );
}


export default Error