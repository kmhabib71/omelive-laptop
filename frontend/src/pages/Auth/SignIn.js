import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthProvider";
import SignInForm from "../../components/Auth/SignInForm/SignInForm";

const backendUrl = "http://localhost:5000";

function SignIn() {
  const { isLoggedIn } = useContext(AuthContext);
  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/auth/signin`, user, {
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success("Signed In Successfully!");
        window.location.href = "/";
      }
    } catch (error) {
      toast.error("Error signing in; check email and password.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-violet-500 to-cyan-300">
      <SignInForm
        user={user}
        setUser={setUser}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onSubmit={handleSignIn}
      />
    </div>
  );
}

export default SignIn;

// import React, { useContext, useState } from "react";
// import { Link, Navigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { AuthContext } from "./AuthProvider";
// const backendUrl = "http://localhost:5000";
// function SignIn() {
//   const { isLoggedIn } = useContext(AuthContext);
//   const [user, setUser] = useState({ email: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);

//   console.log("Backend URL:", "http://localhost:5000");
//   // Early return if the user is already logged in
//   if (isLoggedIn) {
//     return <Navigate to="/" replace />;
//   }

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     console.log("User is: ", user);
//     try {
//       const response = await axios.post(`${backendUrl}/api/auth/signin`, user, {
//         withCredentials: true,
//       });
//       if (response.status === 200) {
//         console.log("Success: ", response.data);
//         toast.success("Signed In Successfully!");
//         window.location.href = "/";
//       }
//     } catch (error) {
//       console.log("Error signing in user: ", error);
//       toast.error("Error signing in user; check email and password.");
//     }
//   };
//   return (
//     <div className="flex items-center justify-center h-screen bg-gradient-to-r from-violet-500 to-cyan-300">
//       <form
//         onSubmit={handleRegister}
//         className="w-full max-w-sm bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
//         <div className="flex justify-center items-center">
//           <img src="./svg/Fulltalk.svg" alt="" />
//         </div>
//         <span className="text-m font-bold justify-center items-center">
//           <span className="text-[rgba(140,_82,_255,_1)] [text-shadow:0_0_1px_rgba(140,_82,_255,_1),_0_0_3px_rgba(140,_82,_255,_1),_0_0_1px_rgba(140,_82,_255,_1)]">
//             Meeting,
//           </span>{" "}
//           <span className="text-[rgba(115,_156,_242,_1)] [text-shadow:0_0_1px_rgba(115,_156,_242,_1),_0_0_3px_rgba(115,_156,_242,_1),_0_0_1px_rgba(115,_156,_242,_1)]">
//             connecting,
//           </span>{" "}
//           and{" "}
//           <span className="text-[rgba(92,_225,_230,_1)] [text-shadow:0_0_1px_rgba(92,_225,_230,_1),_0_0_3px_rgba(92,_225,_230,_1),_0_0_1px_rgba(92,_225,_230,_1)]">
//             matching
//           </span>{" "}
//           with
//         </span>
//         <br></br>
//         <span className="flex text-m font-bold justify-center items-center">
//           new friends to the fullest.
//         </span>
//         <br></br>
//         <div className="mb-4">
//           <label
//             htmlFor="email"
//             className="block text-gray-700 text-sm font-bold mb-2">
//             Email
//           </label>
//           <input
//             type="email"
//             name="email"
//             id="email"
//             className="shadow border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             onChange={(e) => setUser({ ...user, email: e.target.value })}
//           />
//         </div>
//         <div className="mb-4">
//           <label
//             htmlFor="password"
//             className="block text-gray-700 text-sm font-bold mb-2">
//             Password
//           </label>
//           <input
//             type={showPassword ? "text" : "password"}
//             name="password"
//             id="password"
//             className="shadow border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             onChange={(e) => setUser({ ...user, password: e.target.value })}
//           />
//         </div>
//         <div className="flex items-center mt-1">
//           <input
//             type="checkbox"
//             checked={showPassword}
//             id="show-password"
//             onChange={(e) => setShowPassword(e.target.checked)}
//           />
//           <label htmlFor="show-password" className="text-xs text-gray-600 pl-2">
//             {" "}
//             Show Password
//           </label>
//         </div>
//         <div className="flex items-center justify-between mb-6 mt-6">
//           <button
//             type="submit"
//             className="bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none">
//             Sign In
//           </button>
//           <p className="text-sm">
//             Don't have an account?
//             <Link
//               to="/register"
//               className="font-bold ml-2 bg-gradient-to-r from-violet-500 to-cyan-300 text-transparent bg-clip-text">
//               Sign Up
//             </Link>
//           </p>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default SignIn;
