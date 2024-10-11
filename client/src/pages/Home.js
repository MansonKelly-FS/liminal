import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <span>
        <line></line> Homepage
      </span>
      <section>
        <span>
          Returning User? <Link to="/login">Login To Your Account</Link>
        </span>
        <h1>Welcome to LIMINAL</h1>

        <p>
          Effortlessly organize, edit, and manage your code with LIMINAL – the
          ultimate web-based code editor. Get started
          today and take control of your code.
          <br />
          <br />
          <Link to="/signup">Create An Account</Link>
        </p>
      </section>
    </main>
  );
}

export default Home;
