import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Header from "./Header/index";
import { toast } from "react-toastify";
import google from "../assets/googlee.svg";
import gmail from "..//assets/gmail.svg";

const SignUpSignIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();

  const createUserDocument = async (user) => {
    setLoading(true);
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = new Date();

      try {
        await setDoc(userRef, {
          name: displayName ? displayName : name,
          email,
          photoURL: photoURL ? photoURL : "",
          createdAt,
        });
        toast.success("Account Created!");
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        console.error("Error creating user document: ", error);
        setLoading(false);
      }
    }
  };

  const signUpWithEmail = async (e) => {
    setLoadingEmail(true);
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;
      await createUserDocument(user);
      toast.success("Successfully Signed Up!");
      setLoadingEmail(false);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
      console.error(
        "Error signing up with email and password: ",
        error.message
      );
      setLoadingEmail(false);
    }
  };

  const signInWithEmail = async (e) => {
    setLoadingEmail(true);
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      navigate("/dashboard");
      toast.success("Logged In Successfully!");
      setLoadingEmail(false);
    } catch (error) {
      toast.error(error.message);
      console.error(
        "Error signing in with email and password: ",
        error.message
      );
      setLoadingEmail(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoadingGoogle(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await createUserDocument(user);
      toast.success("User Authenticated Successfully!");
      setLoadingGoogle(false);
      navigate("/dashboard");
    } catch (error) {
      setLoadingGoogle(false);
      toast.error(error.message);
      console.error("Error signing in with Google: ", error.message);
    }
  };

  return (
    <>
      <Header />
      <div className="wrapper">
        {flag ? (
          <div className="signup-signin-container">
            <h2 className="head" style={{ textAlign: "center", color:"white" }}>
              Log In on <span className="blue-text">Financely.</span>
            </h2>
            <form onSubmit={signUpWithEmail}>
              <div className="input-wrapper">
                <p>Email</p>
                <input type="email" placeholder="johndoe@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="input-wrapper">
                <p>Password</p>
                <input type="password" placeholder="Password@123" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <div className="buttonClass">
                <button disabled={loading} className="btnn" onClick={signInWithEmail} >
                  {/* <span className="google"><img src={gmail}></img></span> */}
                  {loadingEmail ? <span><i class="fa fa-spinner fa-spin"></i> Loading...</span> : "Signin with gmail"}
                </button>
              </div>
            </form>

            <p style={{ textAlign: "center", margin: 0 }}>or</p>
            <div className="buttonClass">
              <button disabled={loading} className="btnn btnn-blue" onClick={signInWithGoogle} >
              
                {loadingGoogle ? <span><i class="fa fa-spinner fa-spin"></i> Loading...</span> :  <span className="google"><img src={google}></img></span>}
              </button>
            </div>

            <p onClick={() => setFlag(!flag)} style={{ 
                textAlign: "center", 
                marginBottom: 0, 
                marginTop: "0.5rem",
                cursor: "pointer",
            }}>
              Or Don't Have An Account? <span className="click">Click Here.</span>
            </p>

          </div>
        ) : (
          <div className="signup-signin-container">
            <h2 style={{ textAlign: "center" }}>
              Sign Up on <span className="blue-text">Financely.</span>
            </h2>
            <form onSubmit={signUpWithEmail}>
              <div className="input-wrapper">
                <p>Full Name</p>
                <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="input-wrapper">
                <p>Email</p>
                <input type="email" placeholder="johndoe@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="input-wrapper">
                <p>Password</p>
                <input type="password" placeholder="Password@123" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <div className="input-wrapper">
                <p>Confirm Password</p>
                <input type="password" placeholder="Password@123" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
              </div>

              <div className="buttonClass">
                <button type="submit" className="btnn">
                {/* <span className="google"><img src={gmail}></img></span> */}
                  {loadingEmail ? <span><i class="fa fa-spinner fa-spin"></i> Loading...</span> : "Signup with gmail"}
                </button>
              </div>
            </form>
            <p style={{ textAlign: "center", margin: 0 }}>or</p>
            <div className="buttonClass">
              <button disabled={loading} className="btnn btnn-blue" onClick={signInWithGoogle}>
                
                {loadingGoogle ? <span><i class="fa fa-spinner fa-spin"></i> Loading...</span> : <span className="google"><img src={google}></img></span>}
              </button>
            </div>
            <p onClick={() => setFlag(!flag)} style={{
                textAlign: "center",
                marginBottom: 0,
                marginTop: "0.5rem",
                cursor: "pointer",
              }}>
              Or Have An Account Already? <span className="click">Click Here</span>
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default SignUpSignIn;
