import React from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import theme from '../../theme';

const ThemeProvider = ({ children }) => {
    return (
        <MUIThemeProvider theme={theme}>
            {children}
        </MUIThemeProvider>
    );
};

export default ThemeProvider;