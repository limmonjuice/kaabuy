// pages/Unauthorized.jsx
import { useNavigate } from 'react-router-dom'

const Unauthorized = () => {
    const navigate = useNavigate()

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh',
            textAlign: 'center',
            padding: '20px'
        }}>
            <h1 style={{ fontSize: '72px', margin: '0' }}>🚫</h1>
            <h2>403 - Access Denied</h2>
            <p>You don't have permission to access this resource.</p>
            <div style={{ marginTop: '20px' }}>
                <button 
                    onClick={() => navigate(-1)}
                    style={{ 
                        marginRight: '10px', 
                        padding: '10px 20px',
                        cursor: 'pointer'
                    }}
                >
                    Go Back
                </button>
                <button 
                    onClick={() => navigate('/dashboard')}
                    style={{ 
                        padding: '10px 20px',
                        cursor: 'pointer'
                    }}
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    )
}

export default Unauthorized