import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            borderTop: '1px solid rgba(0,0,0,0.08)',
            background: 'var(--bg-paper)',
            color: 'var(--text-secondary)',
            padding: 16
        }}>
            <div className="footer-content" style={{
                maxWidth: 1200,
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} AgriCraft</p>
                <span style={{ fontSize: 12 }}>Built with a light pastel theme</span>
            </div>
        </footer>
    );
};

export default Footer;