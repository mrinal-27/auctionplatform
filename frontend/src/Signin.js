import React from "react";


const Signin = () => {
  return (
    <div className="container">
      <h2>Signin</h2>
      <form>
        <input type="text" placeholder="Username" required />
        <input type="password" placeholder="Password" required />
        <input type="submit"></input>
      </form>
    </div>
  );
};

export default Signin;
