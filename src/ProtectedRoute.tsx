import React from "react";
import { useAuth } from "contexts/auth.context";
import { useNavigate, Outlet } from 'react-router-dom';
import SweetAlert from "react-bootstrap-sweetalert";

export const ProtectedRoute = () => {
  const navigate = useNavigate();
  let { user } = useAuth();
    return (<>
      {(!user || !user.token || user.token === "") ? (
        <SweetAlert
          title="You must be signed in!"
          onCancel={() => navigate("/auth/sign-in/default")}
          onConfirm={() => navigate("/auth/sign-in/default")}
          confirmBtnCssClass={"px-5"}
          style={{"color": "red"}}
        />
      ) : (
        <Outlet />
      )}
  </>);
};
