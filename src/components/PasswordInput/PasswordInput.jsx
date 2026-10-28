import "./PasswordInput.css";

import { useState } from "react";

import { FiEye, FiEyeOff } from "react-icons/fi";

// Password <input> with an eye button to show / hide what was typed.
// Accepts the same props as a normal <input>.
function PasswordInput(props) {

  const [visible, setVisible] = useState(false);

  return (

    <div className="password-field">

      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`password-input ${props.className || ""}`}
      />

      <button
        type="button"
        className="password-toggle"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        title={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((v) => !v)}
      >
        {/* Icon shows the current state: crossed-out eye = hidden, open eye = visible */}
        {visible ? <FiEye /> : <FiEyeOff />}
      </button>

    </div>

  );

}

export default PasswordInput;
