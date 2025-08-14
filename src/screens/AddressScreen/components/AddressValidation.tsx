import * as yup from 'yup';
export const AddressValidateSchema = yup.object().shape({
  fullName: yup
    .string()
    .min(3, 'Full Name must be at least 3 characters')
    .required('Full Name is required'),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Please enter a valid mobile number')
    .required('Phone number is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  location: yup.string().required('Location is required'),
  addressLine1: yup
    .string()
    .min(3, 'Address Line 1 must be at least 3 characters')
    .required('Address Line 1 is required'),
// addressLine2: yup
//   .string()
//   .optional()
//   .transform(value => (value == null ? '' : value)), // convert null → ''

  pincode: yup
    .string()
    .matches(/^[0-9]{6}$/, 'Invalid pincode')
    .required('Pincode is required'),
});
