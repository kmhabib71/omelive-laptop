import React from "react";
import TextInput from "../../TextInput/TextInput";
import Checkbox from "../../Checkbox/Checkbox";

function RegisterForm({
  user,
  setUser,
  showPassword,
  setShowPassword,
  onSubmit,
  onSignInClick, // Add this prop
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="flex justify-center items-center">
        <img src="./svg/Fulltalk.svg" alt="Logo" />
      </div>
      <TextInput
        type="email"
        name="email"
        placeholder="Email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <div className="flex gap-2">
        <TextInput
          type="text"
          name="firstName"
          placeholder="First Name"
          value={user.firstName}
          onChange={(e) => setUser({ ...user, firstName: e.target.value })}
        />
        <TextInput
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={user.lastName}
          onChange={(e) => setUser({ ...user, lastName: e.target.value })}
        />
      </div>
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
      <span className="text-xs text-gray-400 mt-1">
        Password must contain at least 8 characters, one uppercase, one
        lowercase, one number and one special character.
      </span>
      <button
        type="submit"
        className="bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none mt-4 w-full">
        Sign Up
      </button>
      <p className="text-sm mt-4 mb-4">
        Have an account?
        <button
          type="button"
          onClick={onSignInClick} // Use the click handler to switch modals
          className="font-bold ml-2 bg-gradient-to-r from-violet-500 to-cyan-300 text-transparent bg-clip-text">
          Sign In
        </button>
      </p>
      <div className="text-xs text-gray-400">
        <span>
          By creating an account through our service, you agree to our{" "}
        </span>
        <span>
          <b className="text-blue-400 hover:underline hover:cursor-pointer">
            Terms of Service
          </b>
          ,{" "}
          <b className="text-blue-400 hover:underline hover:cursor-pointer">
            Community Guidelines
          </b>
          ,
        </span>{" "}
        and{" "}
        <span>
          <b className="text-blue-400 hover:underline hover:cursor-pointer">
            Privacy Notice
          </b>
          .
        </span>
      </div>
    </form>
  );
}

export default RegisterForm;
