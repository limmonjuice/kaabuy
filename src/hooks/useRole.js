import { useAuth } from "../context/AuthContext";

export const useRole = () => {
    const { user } = useAuth();

    const isOwner = () => {
        return user?.role === 'owner';
    };

    const isStaff = () => {
        return user?.role === 'staff';
    };

    const hasAccess = (allowedRoles) => {
        if (!user?.role) return false;
        return allowedRoles.includes(user.role);
    };

    return {
        role: user?.role,
        isOwner: isOwner(),
        isStaff: isStaff(),
        hasAccess
    };
};
