import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setAccountInfo } from "../store/slices/accountInfo";
import { defaultRegisterCms, useCms } from "./useCms";
import useFetch from "./useFetch";

export type FormField = {
    name: string;
    value: string;
    type: string;
    label: string;
    required: boolean;
    error: string;
}

export const useAuth = () => {
    const { accountInfo } = useSelector((state: RootState) => state.accountInfo);
    const dispatch = useDispatch();
    const { fetchData } = useFetch();
    const { getCms } = useCms();
    const { fullName, email, password, mobileNumber, ...rest } = getCms('register') || defaultRegisterCms;

    const [formData, setFormData] = useState<FormField[]>([
        {
            name: "fullName",
            value: "",
            type: "text",
            label: fullName,
            required: true,
            error: "",
        },
        {
            name: "phoneNumber",
            value: "",
            type: "text",
            label: mobileNumber,
            required: true,
            error: "",
        },
        {
            name: "email",
            value: "",
            type: "email",
            label: email,
            required: true,
            error: "",
        },
        {
            name: "password",
            value: "",
            type: "password",
            label: password,
            required: true,
            error: "",
        }
    ]);

    const handleChange = (name: string, value: string) => {
        setFormData((prev) => {
            return prev.map((item) => {
                if (item?.name === name) {
                    return { ...item, value, error: "" };
                }
                return item;
            });
        });
    };

    const setFieldError = (fieldName: string, errorMessage: string) => {
        setFormData((prev) => {
            return prev.map((item) => {
                if (item?.name === fieldName) {
                    return { ...item, error: errorMessage };
                }
                return item;
            });
        });
    };

    const signin = () => {};
    const signout = () => { dispatch(setAccountInfo(null)); };
    const signup = async () => {
        // Clear previous errors
        formData.forEach(field => {
            if (field.error) {
                setFieldError(field.name, "");
            }
        });

        // Validation
        let hasErrors = false;

        // Get current form values
        const fullNameField = formData.find(f => f.name === "fullName");
        const emailField = formData.find(f => f.name === "email");
        const phoneNumberField = formData.find(f => f.name === "phoneNumber");
        const passwordField = formData.find(f => f.name === "password");

        // Validate required fields
        if (!fullNameField?.value.trim()) {
            setFieldError("fullName", "Full name is required");
            hasErrors = true;
        }

        if (!emailField?.value.trim()) {
            setFieldError("email", "Email is required");
            hasErrors = true;
        } else {
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                setFieldError("email", "Please enter a valid email address");
                hasErrors = true;
            }
        }

        if (!phoneNumberField?.value.trim()) {
            setFieldError("phoneNumber", "Phone number is required");
            hasErrors = true;
        }

        if (!passwordField?.value.trim()) {
            setFieldError("password", "Password is required");
            hasErrors = true;
        } else if (passwordField.value.length < 6) {
            setFieldError("password", "Password must be at least 6 characters");
            hasErrors = true;
        }

        // If validation fails, don't proceed
        if (hasErrors) {
            return;
        }

        // Call the API using fetchData
        try {
            const result = await fetchData({
                endPoint: "/api/register", // Change to your actual endpoint
                method: "POST",
                data: {
                    fullName: fullNameField!.value,
                    email: emailField!.value,
                    phoneNumber: phoneNumberField!.value,
                    password: passwordField!.value,
                },
            });

            // If successful, update Redux store with user info
            if (result && result.success && result.user) {
                dispatch(setAccountInfo(result.user));
                console.log("Signup successful:", result);
            } else {
                setFieldError("email", result?.message || "Registration failed. Please try again.");
            }
        } catch (error: any) {
            // Log the error as requested
            console.error("Signup failed:", error);
            setFieldError("email", "Registration failed. Please try again.");
        }
    };

    return {
        accountInfo,
        signin, signout, signup,
        formData,
        handleChange,
        setFieldError,
        rest
    };
};
