/* eslint-disable react/no-unescaped-entities */
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { resetPasswordValidate } from '../helper/validate';

import styles from '../styles/Username.module.css';

const Reset = () => {
  const formik = useFormik({
    initialValues: {
      password: '',
      confirm_pwd: '',
    },
    validate: resetPasswordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass} style={{ width: '50%' }}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Reset</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-5">
              Enter new password.
            </span>
          </div>

          <form className="pt-20" onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps('password')}
                type="text"
                className={styles.textbox}
                placeholder="New Password"
              />
              <input
                {...formik.getFieldProps('confirm_pwd')}
                type="text"
                className={styles.textbox}
                placeholder="Repeat Password"
              />
              <button className={styles.btn} type="submit">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reset;
