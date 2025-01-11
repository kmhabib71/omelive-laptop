import React from "react";
import TextInput from "../../TextInput/TextInput";
import Checkbox from "../../Checkbox/Checkbox";

function SignInForm({
  user,
  setUser,
  showPassword,
  setShowPassword,
  onSubmit,
  onSignUpClick, // Add this prop
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="flex justify-center items-center">
        {/* <img src="./svg/Fulltalk.svg" alt="Logo" /> */}
        <p className=" text-4xl font-bold mb-8">OmeLive</p>
      </div>
      <TextInput
        type="email"
        name="email"
        placeholder="Email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <TextInput
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder="Password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <Checkbox
        checked={showPassword}
        onChange={(e) => setShowPassword(e.target.checked)}
        label="Show Password"
      />
      <button
        type="submit"
        className="bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none mt-4 w-full">
        Sign In
      </button>

      <p className="text-sm mt-4">
        Don't have an account?
        <button
          type="button"
          onClick={onSignUpClick} // Use the click handler to switch modals
          className="font-bold ml-2 bg-gradient-to-r from-violet-500 to-cyan-300 text-transparent bg-clip-text">
          Sign Up
        </button>
      </p>
    </form>
  );
}

export default SignInForm;
