import React, { useState, useEffect } from 'react';
import { useError } from '../context/ErrorContext';
import {
    Snackbar,
    Alert,
    AlertTitle,
    Slide,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    useTheme,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

// Force children to be a ReactElement so Slide types align
const TransitionUp = (props: TransitionProps & { children: React.ReactElement<any, any> }) => {
    const { children, ...other } = props;
    return (
        <Slide {...other} direction="down">
            {children}
        </Slide>
    );
};

const ErrorSnackbar: React.FC = () => {
    const theme = useTheme();
    const { error, errorData, clearError } = useError();
    const [showDetails, setShowDetails] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // Open snackbar whenever a new error appears
    useEffect(() => {
        if (error) {
            setSnackbarOpen(true);
        }
    }, [error]);

    if (!error) return null;

    // Close snackbar only on explicit close, not clickaway
    const handleSnackbarClose = (_: unknown, reason?: string) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    // Close details dialog and clear the error completely
    const handleDialogClose = () => {
        setShowDetails(false);
        clearError();
    };

    return (
        <>
            <Snackbar
                open={snackbarOpen}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                TransitionComponent={TransitionUp}
                onClose={handleSnackbarClose}
                autoHideDuration={6000}
                sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 2 }}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    onClose={handleSnackbarClose}
                    sx={{
                        boxShadow: theme.shadows[6],
                        borderRadius: 2,
                        fontSize: '1rem',
                    }}
                    action={
                        errorData ? (
                            <Button color="inherit" size="small" onClick={() => setShowDetails(true)}>
                                Details
                            </Button>
                        ) : null
                    }
                >
                    <AlertTitle><strong>Error</strong></AlertTitle>
                    {error.message}
                </Alert>
            </Snackbar>

            <Dialog
                open={showDetails}
                onClose={(_, reason) => {
                    if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
                    handleDialogClose();
                }}
                fullWidth
                maxWidth="md"
                PaperProps={{ sx: { p: 2, bgcolor: theme.palette.background.paper } }}
            >
                <DialogTitle>Error Details</DialogTitle>
                <DialogContent dividers>
                    <Typography
                        component="pre"
                        sx={{
                            fontFamily: 'Monaco, Menlo, Consolas, monospace',
                            fontSize: '0.875rem',
                            whiteSpace: 'pre-wrap',
                        }}
                    >
                        {JSON.stringify(errorData, null, 2)}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} variant="contained" color="error">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ErrorSnackbar;