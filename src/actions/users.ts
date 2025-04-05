"use server";

import supabase from "@/config/supabase-client-config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registerUser = async (payload: any) => {
  try {
    // find if user already exists
    const { data, error } = await supabase
      .from("user_profiles")
      .select()
      .eq("email", payload.email);
    if (data && data.length > 0) {
      throw new Error("User already exists");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    payload.password = hashedPassword;

    // insert user
    const { error: insertError } = await supabase
      .from("user_profiles")
      .insert([payload]);
    if (insertError) {
      throw new Error(insertError.message);
    }

    return {
      success: true,
      message: "User created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const loginUser = async (payload: any) => {
  try {
    // find user
    const { data, error } = await supabase
      .from("user_profiles")
      .select()
      .eq("email", payload.email)
      .eq("role", payload.role);
    if (error) {
      throw new Error("Error finding user");
    }
    if (!data || data.length === 0) {
      throw new Error("User not found");
    }

    // compare password
    const user = data[0];
    const isPasswordValid = await bcrypt.compare(
      payload.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    return {
      success: true,
      data: token,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const validateUserGetId = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return {
      success: true,
      data: decoded,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getCurrentUser = async (token: string) => {
  try {
    const response: any = await validateUserGetId(token);
    if (!response.success) {
      throw new Error(response.message);
    }
    const { data, error } = await supabase
      .from("user_profiles")
      .select()
      .eq("id", response.data.id);
    if (error) {
      throw new Error("Error finding user");
    }
    if (!data || data.length === 0) {
      throw new Error("User not found");
    }
    return {
      success: true,
      data: data[0],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
