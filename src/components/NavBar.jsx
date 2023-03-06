import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div>
      <h1>NavBar</h1>
      <ul>
        <Link to="/">
          <li>Login</li>
        </Link>
        <Link to="/notes">
          <li>Notes</li>
        </Link>
      </ul>
    </div>
  );
};

export default NavBar;
