import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core";
import Navbar from "../../shared/components/Navbar/Navbar";
import Input from "./../../shared/components/FormElements/Input";
import Button from "@material-ui/core/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import { useHttp } from "./../../shared/hooks/http-hook";
import ImageUpload from "./../../shared/components/ImageUpload";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
} from "./../../shared/Utlis/validators";
import { useForm } from "./../../shared/hooks/form-hook";
import { AuthContext } from "./../../shared/context/auth-context";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),

    "& .MuiTextField-root": {
      backgroundColor: "rgb(255, 255, 255)",
      margin: theme.spacing(1),
      width: "40vw",
      minWidth: "300px",
    },
    "& .MuiButtonBase-root": {
      margin: theme.spacing(2),
    },
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  textAlign: "center",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Auth() {
  const auth = useContext(AuthContext);

  const classes = useStyles();
  const handleClose = () => setOpen(false);

  const [isLogin, setIsLogin] = useState(true);
  const [open, setOpen] = useState(false);

  const { loading, err, sendRequest, clearError } = useHttp();

  const [formData, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "title from place in db",
        isValid: false,
      },
      password: {
        value: "description from place in db",
        isValid: false,
      },
    },
    true
  );

  const submitFormHandler = async (e) => {
    e.preventDefault();
    clearError();
    setOpen(true);
    if (isLogin) {
      try {
        const reqData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/login",
          "POST",
          JSON.stringify({
            password: formData.inputs.password.value,
            email: formData.inputs.email.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        setOpen(false);
        auth.logIn(reqData.userId, reqData.token, null);
      } catch (err) {
        console.log("Error occured!");
      }
    } else {
      try {
        const formdata = new FormData();
        formdata.append("name", formData.inputs.name.value);
        formdata.append("password", formData.inputs.password.value);
        formdata.append("email", formData.inputs.email.value);
        formdata.append("image", formData.inputs.image.value);
        const reqData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/signup",
          "POST",
          formdata
        );
        setOpen(false);
        auth.logIn(reqData.userId, reqData.token);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const switchForm = () => {
    if (!isLogin) {
      setFormData(
        { ...formData, name: undefined, image: undefined },
        formData.inputs.email.isvalid && formData.inputs.password.isvalid
      );
    } else {
      setFormData(
        {
          ...formData.inputs,
          name: { value: "", isValid: false },
          image: { value: null, isValid: false },
        },
        false
      );
    }
    setIsLogin((prev) => !prev);
  };

  style.backgroundColor = err ? "red" : "green";

  return (
    <>
      <Navbar />
      <h1 style={{ textAlign: "center", color: "white" }}>
        USER AUTHENTICATION
      </h1>
      <Modal
        onClose={handleClose}
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {loading ? (
            <>
              <CircularProgress sx={{ margin: "auto", width: "200px" }} />
              <h2>IN PROGRESS...</h2>
            </>
          ) : null}
          {open && err}
          {err && <h1>Please sign up again.</h1>}
        </Box>
      </Modal>
      <form className={classes.root} onSubmit={submitFormHandler}>
        {!isLogin && (
          <Input
            label="Name"
            name="name"
            type="text"
            validator={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
            val={formData.email}
          ></Input>
        )}
        <Input
          label="Email"
          name="email"
          type="text"
          validator={[VALIDATOR_EMAIL()]}
          onInput={inputHandler}
          val={formData.email}
        ></Input>
        {!isLogin && (
          <ImageUpload id="image" onInput={inputHandler}></ImageUpload>
        )}
        <Input
          label="Password"
          name="password"
          type="password"
          validator={[VALIDATOR_MINLENGTH(5)]}
          onInput={inputHandler}
          val={formData.password}
        />
        <div>
          <Button variant="contained" type="reset" onClick={switchForm}>
            Switch to {isLogin ? "Sign Up" : "Log In"}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!formData.isValid}
          >
            {!isLogin ? "Sign Up" : "Log In"}
          </Button>
        </div>
      </form>
    </>
  );
}
