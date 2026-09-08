import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <main className="login">
      <div className="login-content">
        <div className="login-brand">
          ONBID
        </div>

        <div className="login-eyebrow">
          ACCESS RESTRICTED
        </div>

        <h1>
          This room is
          <br />
          <em>not yours.</em>
        </h1>

        <p className="login-description">
          You don't have permission to access
          this part of the auction house.
        </p>

        <button
          type="button"
          className="login-button"
          onClick={() => navigate("/")}
        >
          BACK TO ONBID
        </button>
      </div>
    </main>
  );
}

export default Unauthorized;