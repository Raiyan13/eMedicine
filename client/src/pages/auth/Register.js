import React, { useState } from "react";
import { Divider } from "antd";
import ColumnGroup from "antd/lib/table/ColumnGroup";
import { auth } from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
    const [email, setEmail] = useState("");

    const submitHandler = async (e) => {
        e.preventDefault();
        const googleConfig = {
            url: "http://localhost:3000/register/done",
            // This must be true.
            handleCodeInApp: true,
        };

        await auth.sendSignInLinkToEmail(email, googleConfig);
        window.localStorage.setItem("emailForSignIn", email);
        toast.success(
            `An email has been sent to ${email}. Please check your inbox.`
        );
        setEmail("");
    };

    const registerForm = () => (
        <form onSubmit={submitHandler}>
            <input
                type="email"
                class="form-control text-center"
                id="regEmail"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
            />
            <div class="d-grid gap-2 col-6 mx-auto mt-3">
                <button class="btn btn-outline-primary" type="submit">
                    Register
                </button>
            </div>
        </form>
    );

    return (
        <div className="d-flex p-5 justify-content-center">
            <div className="row align-items-center">
                <div className="d-flex justify-content-center">
                    <h1 className="text-primary">eMedicine</h1>
                </div>
                <div className="mt-3">
                    <h4 className="d-flex justify-content-center">
                        Get Started With Your Account
                    </h4>
                    <ToastContainer />
                    {registerForm()}
                </div>
            </div>
        </div>
    );
};

export default Register;
