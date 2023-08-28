import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { NavLink } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { AuthContext } from "./../../context/auth-context";

export default function TemporaryDrawer(props) {
  const auth = React.useContext(AuthContext);

  const list = () => (
    <Box
      role="presentation"
      onClick={props.tDrawer(false)}
      onKeyDown={props.tDrawer(false)}
    >
      <Button style={{ marginLeft: "22px" }}>close</Button>
      <List>
        <ListItem>
          <NavLink to="/">
            <Button color="inherit">ALL USER</Button>
          </NavLink>
        </ListItem>
        {auth.isLoggedIn && (
          <ListItem>
            <NavLink to={`/${auth.userId}/places`}>
              <Button color="inherit">MY PLACES</Button>
            </NavLink>
          </ListItem>
        )}
        {auth.isLoggedIn && (
          <ListItem>
            <NavLink to="/places/new">
              <Button color="inherit">ADD PLACE</Button>
            </NavLink>
          </ListItem>
        )}
        {!auth.isLoggedIn && (
          <ListItem>
            <NavLink to="/auth">
              <Button color="inherit">Authentication</Button>
            </NavLink>
          </ListItem>
        )}
      </List>
      <Divider />
      <List>
        {["Contact", "Support", "Helpline 1234"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <React.Fragment>
        {/* <Button onClick={toggleDrawer(true)}>toggle</Button> */}
        <Drawer open={props.st} onClose={props.tDrawer(false)}>
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
