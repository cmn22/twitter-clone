import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from 'react-query';
import axios from 'axios';

import TextInput from '../components/TextInput';
import Button from '../components/Button';

import useForm from '../hooks/useForm';
import { useAuth } from '../contexts/auth-context';

import { loadScript } from '../utils/utils';
import { GOOGLE_CLIENT_ID, API_BASE_URL } from '../utils/config';
import * as logger from '../utils/logger';

import { signinFormValidator } from '../utils/validator';
import usePageTitle from '../hooks/usePageTitle';

const Signin = () => {
  usePageTitle('Sign-in / Twittie');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const { validateForm } = signinFormValidator;

  const loginPassword = useMutation(({ username, password }) => {
    return axios.post(`${API_BASE_URL}/api/auth/login/password`, {
      username,
      password,
    });
  });

  const googleSignin = useMutation(({ token }) => {
    return axios.post('/api/auth/signin/google', { token });
  });

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: validateForm,
    onSubmit: async (values) => {
      loginPassword.mutate(
        {
          username: values.username,
          password: values.password,
        },
        {
          onSuccess: (response) => {
            const { user, accessToken, expiresAt } = response.data;
            login(user, accessToken, expiresAt);
            if (user.newUser) {
              navigate('/signup/success');
            } else if (location.state?.from?.pathname) {
              navigate(location.state?.from?.pathname);
            } else {
              navigate('/');
            }
          },
          onError: (err) => {
            const error = err.response.data.errors || err.response.data.error;
            if (Array.isArray(error)) {
              const errors = error.reduce((acc, cur) => {
                acc[cur.param] = cur.msg;
                return acc;
              }, {});
              form.setMultipleFieldsError(errors);
            } else {
              form.setFieldError('password', error.message);
            }
          },
        }
      );
    },
  });

  useEffect(() => {
    const loadGoogleSDK = async () => {
      try {
        await loadScript('https://accounts.google.com/gsi/client');
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            googleSignin.mutate(
              { token: response.credential },
              {
                onSuccess: (res) => {
                  const { user, accessToken, expiresAt } = res.data;
                  login(user, accessToken, expiresAt);
                  if (!user.newUser) {
                    navigate('/');
                  } else {
                    navigate('/signup/success');
                  }
                },
                onError: (error) => {
                  logger.error(error);
                },
              }
            );
          },
          ux_mode: 'popup',
          context: 'signin',
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google'),
          {
            size: 'medium',
            type: 'standard',
            text: 'signin_with',
            shape: 'pill',
            theme: 'filled_blue',
            logo_alignment: 'left',
          }
        );
      } catch (error) {
        logger.error(error);
      }
    };
    loadGoogleSDK();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    navigate,
    login,
    // exclude mutations - linter prevents listing only mutation function
  ]);

  return (
    <div className="bg-background h-screen py-10 px-10 flex justify-center items-center">
      <div className="max-w-xs w-full">
        <div className="mb-4">
          <h3 className="text-on-background text-3xl font-black text-center">
            Sign in to Twittie
          </h3>
        </div>
        <div>
          <form className="mb-8" onSubmit={form.handleSubmit}>
            <div className="relative mb-4">
              <TextInput
                id="username"
                name="username"
                label="Email or username"
                value={form.values.username}
                error={form.touched.username ? form.errors.username : ''}
                onFocus={form.handleFocus}
                onBlur={form.handleBlur}
                onChange={form.handleChange}
              />
            </div>
            <div className="relative mb-4">
              <TextInput
                id="password"
                name="password"
                label="Password"
                type="password"
                value={form.values.password}
                error={form.touched.password ? form.errors.password : ''}
                onFocus={form.handleFocus}
                onBlur={form.handleBlur}
                onChange={form.handleChange}
              />
            </div>
            <div>
              <Button type="submit" isLoading={loginPassword.isLoading}>
                Sign in
              </Button>
            </div>
          </form>
          <div>
            <span className="text-on-background text-base mb-2">
              Don&apos;t have an account?
            </span>
            <Link
              to="/signup"
              className="font-source-sans-pro text-primary inline-block ml-1 font-semibold"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
