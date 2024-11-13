interface LComponentsUser {
  form: {
    username: string;
    password: string;
    changePassword: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    role: string;
    newPassword: string;
  };
  role: {
    admin: string;
    normal: string;
  };
  delete: {
    tooltip: {
      adminUserNonDeletable: string;
    };
  };
  messageBox: {
    prompt: {
      changePassword: string;
    };
  };
  rules: {
    invalidPassword: string;
  };
}
