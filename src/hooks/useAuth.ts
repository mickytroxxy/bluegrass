import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setAccountInfo, useSignupMutation } from "../store/slices/accountInfo";
import { defaultRegisterCms, useCms } from "./useCms";

export type FormField = {
    name: string;
    value: string;
    type: string;
    label: string;
    required: boolean;
    error: string;
}

export const useAuth = () => {
    const {accountInfo} = useSelector((state: RootState) => state.accountInfo);
    const dispatch = useDispatch();
    const [signupMutation] = useSignupMutation();

    const {getCms} = useCms();
    const {fullName,email,password,mobileNumber,...rest} = getCms('register') || defaultRegisterCms;

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
    const signout = () => {};
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

        // Call the API
        try {
            const result = await signupMutation({
                fullName: fullNameField!.value,
                email: emailField!.value,
                phoneNumber: phoneNumberField!.value,
                password: passwordField!.value,
            }).unwrap();

            // If successful, update Redux store with user info
            if (result.success && result.user) {
                dispatch(setAccountInfo(result.user));
                console.log("Signup successful:", result);
                // Navigation will happen automatically due to Redux state change
            }
        } catch (error: any) {
            // Log the error as requested
            console.error("Signup failed:", error);

            // Set a general error message
            setFieldError("email", "Registration failed. Please try again.");
        }

        // As requested, navigate to home screen regardless of success/failure
        // This will happen automatically when accountInfo is set in Redux
        // The app/index.tsx will conditionally render HomeScreen when accountInfo exists

        // For demo purposes, if the API call failed, we still set some dummy account info
        // to trigger navigation as requested
        if (!accountInfo) {
            dispatch(setAccountInfo({
                fullName: fullNameField!.value,
                email: emailField!.value,
                phoneNumber: phoneNumberField!.value,
            }));
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
