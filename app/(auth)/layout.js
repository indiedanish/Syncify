import Header from "../../components/header"

const AuthLayout = ({ children }) => {
    return <div className="flex justify-center pt-40">
        <Header/>
        {children}

        </div>;
  };
  
  export default AuthLayout;