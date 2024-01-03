import React, { useState, ChangeEvent, FormEvent } from "react";

interface ForgotPasswordDialogProps {
  onClose: () => void;
  onSendEmail: (email: string) => void;
}

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({
  onClose,
  onSendEmail,
}) => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Call the onSendEmail function and pass the email as an argument
    onSendEmail(email);
    // Close the dialog
    onClose();
  };

  return (
    <div className="forgot-password-dialog z-10">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email Address:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <button type="submit">Send Email</button>
      </form>
    </div>
  );
};

export default ForgotPasswordDialog;
