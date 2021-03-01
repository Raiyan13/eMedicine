import React, { useState } from "react";
import { Divider } from "antd";
import ColumnGroup from "antd/lib/table/ColumnGroup";

const Register = () => {
    const [email, setEmail] = useState("");

    const submitHandler = () => {};
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
                            <button
                                class="btn btn-outline-primary"
                                type="submit"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
