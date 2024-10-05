import React from 'react';

const Contributors = () => {
  const usernames = ['@jahidgaming8611']; 

  return (
    <div>
      <h2 className="text-primary text-7xl text-center pt-[100px]">CONTRIBUTORS</h2>
      <ul>
        {usernames.map((username, index) => (
          <li className="text-center text-5xl" key={index}>{username}</li>
        ))}
      </ul>
    </div>
  );
};

export default Contributors;

