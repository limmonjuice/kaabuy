import { Navigate } from "react-router-dom";
import { useRole } from "../hooks/useRole";

const RoleRoute = ({ children, allowedRoles }) => {
    const { hasAccess } = useRole();

    if (!hasAccess(allowedRoles)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RoleRoute;
