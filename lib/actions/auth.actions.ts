'use server';

import { auth } from "../better-auth/auth";
import { inngest } from "../inngest/client";
import { headers } from "next/headers";

export const signUpWithEmail = async (data: SignUpFormData) => {
  try {
    const response = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.fullName,
      }
    });
    if (response) {
      await inngest.send({
        name: 'app/user.created',
        data: {
          email: data.email,
          name: data.fullName,
          country: data.country,
          investmentGoals: data.investmentGoals,
          riskTolerance: data.riskTolerance,
          preferredIndustry: data.preferredIndustry,
        }
      })
    }
    return { success: true, message: 'Sign up successful', data: response };
  } catch (error) {
    console.log('Error during sign up:', error);
    return { success: false, message: 'Sign up failed' };
  }
};

export const signInWithEmail = async (data: SignInFormData) => {
  try {
    const response = await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      }
    });
    return { success: true, message: 'Sign in successful', data: response };
  } catch (error) {
    console.log('Error during sign in:', error);
    return { success: false, message: 'Sign in failed' };
  }
};

export const signOut = async () => {
  try {
    await auth.api.signOut({ headers: await headers() });
    return { success: true, message: 'Sign out successful' };
  } catch (error) {
    console.log('Error during sign out:', error);
    return { success: false, message: 'Sign out failed' };
  }
};
