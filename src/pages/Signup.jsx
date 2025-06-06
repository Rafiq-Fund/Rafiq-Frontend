import React, { useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Stack,
  Avatar,
  MenuItem,
  Select,
} from "@mui/material";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link } from "react-router";
import axios from "axios";

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

const validationSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Phone number must contain only digits")
    .min(7, "Phone number must be at least 7 digits")
    .required("Phone number is required"),
  countryCode: yup.string().required("Country code is required"),
  birthDate: yup
    .date()
    .required("Birth date is required")
    .max(new Date(), "Birth date cannot be in the future"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  profileImage: yup
    .mixed()
    .test("fileType", "Only JPEG and PNG images are allowed", (value) => {
      if (!value) return true; // if no file, skip validation
      return value && ["image/jpeg", "image/png"].includes(value.type);
    }),
});

function Signup() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      countryCode: "+1",
      birthDate: "",
      password: "",
      confirmPassword: "",
      profileImage: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      formik.setSubmitting(true);
      const formData = new FormData();
      formData.append("username", values.email.split("@")[0]);
      formData.append("email", values.email);
      formData.append("phone", values.phoneNumber);
      formData.append("first_name", values.firstName);
      formData.append("last_name", values.lastName);
      formData.append("birth_date", values.birthDate);
      formData.append("password", values.password);
      formData.append("password2", values.confirmPassword);
      formData.append("address", values.address || "");
      if (values.profileImage) {
        formData.append("profile_picture", values.profileImage);
      }

      axios
        .post(`${VITE_SERVER_URL || ""}/account/register/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          formik.setSubmitting(false);
          formik.resetForm();
          setConfirmOpen(true);
        })
        .catch((error) => {
          formik.setSubmitting(false);
        });
    },
  });

  const handleConfirm = () => {
    setConfirmOpen(false);
    window.location.href = "/signin";
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("profileImage", file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Country code options
  const countryCodes = [
    { code: "+20", label: "EG" },
    { code: "+1", label: "US" },
    { code: "+44", label: "UK" },
    { code: "+971", label: "UAE" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        bgcolor: "#f5f5fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 0,
        m: 0,
      }}
    >
      <Container
        component="main"
        maxWidth="lg"
        disableGutters
        sx={{
          display: "flex",
          alignItems: "stretch",
          justifyContent: "center",
          height: "100vh",
          minWidth: "100vw",
          p: 0,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            borderRadius: 0,
            flexGrow: 1,
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
            display: "flex",
          }}
        >
          <Stack direction="row" sx={{ height: "100%", width: "100%" }}>
            <Box
              sx={{
                width: "50%",
                display: { xs: "none", md: "block" },
                position: "relative",
                height: "100vh",
              }}
            >
              <Avatar
                src="/signup.jpg"
                variant="square"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 1,
                  opacity: 0.7,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(135deg,#7b5fc996 0%, #4a2f8f 100%)",
                  opacity: 0.6,
                  zIndex: 2,
                }}
              />
            </Box>

            {/* Form Section */}
            <Box
              sx={{
                width: { xs: "100%", md: "50%" },
                height: "100vh",
                p: { xs: 2, md: 4 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box sx={{ width: "100%", maxWidth: 480 }}>
                <Typography
                  component="h1"
                  variant="h3"
                  align="center"
                  gutterBottom
                  sx={{ fontWeight: 600, mb: 3, color: "#4a2f8f" }}
                >
                  <VolunteerActivismIcon sx={{ mr: 1, fontSize: "36px" }} />
                  Rafiq
                </Typography>
                <Box
                  component="form"
                  onSubmit={formik.handleSubmit}
                  encType="multipart/form-data"
                >
                  {formik.touched.profileImage &&
                    formik.errors.profileImage && (
                      <Typography
                        color="error"
                        variant="body2"
                        align="center"
                        sx={{ mb: 2 }}
                      >
                        {formik.errors.profileImage}
                      </Typography>
                    )}

                  <Stack direction="row" spacing={2}>
                    <TextField
                      fullWidth
                      id="firstName"
                      name="firstName"
                      label="First Name"
                      size="small"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.firstName &&
                        Boolean(formik.errors.firstName)
                      }
                      helperText={
                        formik.touched.firstName && formik.errors.firstName
                      }
                      margin="normal"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1,
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#7b5fc9",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#7b5fc9",
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      id="lastName"
                      name="lastName"
                      label="Last Name"
                      size="small"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.lastName &&
                        Boolean(formik.errors.lastName)
                      }
                      helperText={
                        formik.touched.lastName && formik.errors.lastName
                      }
                      margin="normal"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1,
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#7b5fc9",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#7b5fc9",
                        },
                      }}
                    />
                  </Stack>

                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email Address"
                    type="email"
                    size="small"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    margin="normal"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#7b5fc9",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#7b5fc9",
                      },
                    }}
                  />

                  <Stack direction="row" spacing={2} sx={{ my: 1 }}>
                    <FormControl sx={{ width: "30%" }}>
                      <InputLabel id="countryCode-label">
                        Country Code
                      </InputLabel>
                      <Select
                        labelId="countryCode-label"
                        id="countryCode"
                        name="countryCode"
                        value={formik.values.countryCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Country Code"
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderRadius: 1,
                            "&.Mui-focused": {
                              borderColor: "#7b5fc9",
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#7b5fc9",
                          },
                        }}
                      >
                        {countryCodes.map((option) => (
                          <MenuItem key={option.code} value={option.code}>
                            {option.code} ({option.label})
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.countryCode &&
                        formik.errors.countryCode && (
                          <FormHelperText error>
                            {formik.errors.countryCode}
                          </FormHelperText>
                        )}
                    </FormControl>
                    <TextField
                      fullWidth
                      id="phoneNumber"
                      name="phoneNumber"
                      label="Phone Number"
                      size="small"
                      value={formik.values.phoneNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.phoneNumber &&
                        Boolean(formik.errors.phoneNumber)
                      }
                      helperText={
                        formik.touched.phoneNumber && formik.errors.phoneNumber
                      }
                      margin="normal"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1,
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#7b5fc9",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#7b5fc9",
                        },
                      }}
                    />
                  </Stack>
                  <TextField
                    fullWidth
                    id="address"
                    name="address"
                    label="Address"
                    size="small"
                    value={formik.values.address || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.address && Boolean(formik.errors.address)
                    }
                    helperText={formik.touched.address && formik.errors.address}
                    margin="normal"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#7b5fc9",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#7b5fc9",
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    id="birthDate"
                    name="birthDate"
                    label="Birth Date"
                    type="date"
                    size="small"
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    value={formik.values.birthDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.birthDate &&
                      Boolean(formik.errors.birthDate)
                    }
                    helperText={
                      formik.touched.birthDate && formik.errors.birthDate
                    }
                    margin="normal"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#7b5fc9",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#7b5fc9",
                      },
                    }}
                  />

                  <FormControl
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#7b5fc9",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#7b5fc9",
                      },
                    }}
                  >
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <OutlinedInput
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.password &&
                        Boolean(formik.errors.password)
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                    {formik.touched.password && formik.errors.password && (
                      <FormHelperText error>
                        {formik.errors.password}
                      </FormHelperText>
                    )}
                  </FormControl>

                  <FormControl
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#7b5fc9",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#7b5fc9",
                      },
                    }}
                  >
                    <InputLabel htmlFor="confirmPassword">
                      Confirm Password
                    </InputLabel>
                    <OutlinedInput
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.confirmPassword &&
                        Boolean(formik.errors.confirmPassword)
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                            size="small"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Confirm Password"
                    />
                    {formik.touched.confirmPassword &&
                      formik.errors.confirmPassword && (
                        <FormHelperText error>
                          {formik.errors.confirmPassword}
                        </FormHelperText>
                      )}
                  </FormControl>

                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 2 }}
                  >
                    <FormControl fullWidth margin="normal">
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{
                          py: 1.5,
                          borderRadius: 1,
                          borderColor: "#7b5fc9",
                          textTransform: "none",
                          color: "#7b5fc9",
                        }}
                      >
                        Upload Profile Image (PNG/JPG)
                        <input
                          type="file"
                          name="profileImage"
                          hidden
                          accept="image/png, image/jpeg"
                          onChange={handleImageChange}
                        />
                      </Button>
                      {formik.touched.profileImage &&
                        formik.errors.profileImage && (
                          <FormHelperText error sx={{ mt: 1 }}>
                            {formik.errors.profileImage}
                          </FormHelperText>
                        )}
                      {formik.values.profileImage && (
                        <Typography
                          variant="caption"
                          color="#4a2f8f"
                          sx={{ mt: 1, display: "block" }}
                        >
                          Selected file: {formik.values.profileImage.name}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mb: 2,
                      py: 1,
                      borderRadius: 1,
                      textTransform: "none",
                      fontSize: "1rem",
                      background: "#7b5fc9",
                    }}
                    disabled={!formik.isValid || formik.isSubmitting}
                  >
                    Sign Up
                  </Button>

                  <Typography variant="body2" align="center">
                    Already have an account?{" "}
                    <Link
                      to="/signin"
                      underline="hover"
                      sx={{ fontWeight: 500, color: "#4a2f8f" }}
                    >
                      Sign in
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Stack>
        </Paper>
      </Container>
      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Your Email"
        description="A confirmation link was sent to your email—please check your inbox and click the link to verify."
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
    </Box>
  );
}

export default Signup;
