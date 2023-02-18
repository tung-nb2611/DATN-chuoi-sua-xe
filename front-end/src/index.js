import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from 'react-redux';

import "./index.css";

// core components
import Admin from "layouts/Admin.js";

import "assets/css/material-dashboard-react.css?v=1.9.0";
import Login from "components/Login/Login";
import reduxStore from './util/reduxStore';
import { createSapoTheme, UIComponentProvider } from '@sapo-presentation/sapo-ui-components';
import { createMuiTheme } from "@material-ui/core";
import typography from "./typography";
import { colorBorder, colorInk } from "./palette";

const hist = createBrowserHistory();
const logged = window.sessionStorage.getItem('jwt')
const store = reduxStore();

const colorTextPrimary = "#0F1824";
const colorTextSecondary = "#747C87";

export const createTheme = () => {
  let theme = createSapoTheme(
    {
      typography,
    },
  );

  theme = {
    ...theme,
    overrides: {
      p: {
        fontSize: "12px",
      },
      MuiTypography: {
        caption: {
          fontSize: "0.71rem",
          lineHeight: "12px",
        },
        body2: {
          fontSize: "0.9rem",
          lineHeight: "19px",
        },
        body1: {
          fontSize: "1rem",
          lineHeight: "20px",
        },
        subtitle2: {
          fontSize: "0.875rem",
          lineHeight: "15px",
          fontWeight: 500,
        },
        subtitle1: {
          fontSize: "1rem",
          fontWeight: 500,
          lineHeight: "20px",
        },
        h6: {
          fontSize: "1.125rem",
          fontWeight: 500,
          lineHeight: "20px",
        },
        h5: {
          fontSize: "1.25rem",
          fontWeight: 500,
          lineHeight: "22px",
        },
        h4: {
          fontSize: "1.4rem",
          fontWeight: 500,
          lineHeight: "24px",
        },
        h3: {
          fontSize: "1.7rem",
          fontWeight: 500,
          lineHeight: "30px",
        },
        h2: {},
        h1: {},
        colorTextPrimary: {
          color: colorTextPrimary,
        },
        colorTextSecondary: {
          color: colorTextSecondary,
        },
      },
      MuiButton: {
        root: {
          borderRadius: "10px",
          minWidth: 80,
          color: colorTextPrimary,
          height: "36px",
          lineHeight: 1,
        },
        label: {
          textTransform: "none",
          fontSize: "1rem",
        },
        outlined: {
          borderWidth: "2px",
          padding: "5px 18px 4px",
          borderColor: "#ebedf1",
          fontWeight: "bold",
        },
      },
      MuiIconButton: {
        root: {
          fontSize: "1rem",
          color: colorTextPrimary,
        },
      },
      MuiSelect: {
        root: {
          color: colorTextPrimary,
        },
        icon: {
          "&.MuiSelect-icon": {
            color: colorInk.base40,
          },
          "&.MuiSelect-iconOpen": {
            color: theme.palette.primary.main,
          },
        },
      },
      MuiSnackbar: {
        root: {
          "& .MuiAlert-root": {
            "& .MuiAlert-icon": {
              marginRight: 6,
              fontSize: 24,
            },
            "&.MuiAlert-filledSuccess": {
              backgroundColor: "#0DB473",
            },
            "&.MuiAlert-filledError": {
              backgroundColor: "#EE4747",
            },
          },
        },
      },
      MuiMenu: {
        paper: {
          maxHeight: "305px",
          maxWidth: "600px",
          "& .MuiMenuItem-root": {
            whiteSpace: "unset",
          },
          "&::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
            background: "#fff",
          },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: "8px",
            backgroundColor: "#C4CDD5",
          },
        },
      },
      MuiListItem: {
        root: {
          textDecoration: "none !important",
        },
      },
      MuiMenuItem: {
        root: {
          color: colorTextPrimary,
          margin: "3px 0",
          borderRadius: "3px",
          fontSize: "14px",
          "&:hover, &.Mui-focusVisible": {
            color: theme.palette.primary.main,
            backgroundColor: "#E6F4FF",
          },
          "&.Mui-selected": {
            backgroundColor: "#E6F4FF",
            "&:hover": {
              backgroundColor: "#E6F4FF",
            },
          },
        },
        selected: {
          color: theme.palette.primary.main,
        },
      },
      MuiTextField: {
        root: {
          "& .MuiInputBase-root.Mui-disabled": {
            background: colorInk.base20,
            color: colorInk.base60,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: colorBorder.primary.main,
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: colorBorder.primary.main,
          },
        },
      },
      MuiPaper: {
        root: {
          color: colorTextPrimary,
        },
        rounded: {
          borderRadius: 3,
        },
        elevation1: {
          boxShadow: "none",
        },
      },
      MuiCssBaseline: {
        "@global": {
          " .MuiMenu-list.MuiList-padding": {
            padding: "6px 5px",
          },
        },
      },
    },
  };
  return theme;
};
ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/admin" render={() => {
        return window.sessionStorage.getItem('jwt') ?
          <UIComponentProvider  >
            <Admin />
          </UIComponentProvider> : <Redirect to="/login" />
      }} />
      <Route path="/login" component={Login} />
      <Redirect from="/" to="/admin/areas" />
    </Switch>
  </Router>,
  document.getElementById("root")
);



