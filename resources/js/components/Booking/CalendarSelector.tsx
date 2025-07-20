import React, { useState } from 'react';
import { 
    Box, 
    Button, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions,
    IconButton,
    Typography,
    Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';

interface CalendarSelectorProps {
    onWeekSelected: (date: moment.Moment) => void;
    currentWeek: moment.Moment;
}

const CalendarSelector: React.FC<CalendarSelectorProps> = ({ onWeekSelected, currentWeek }) => {
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<moment.Moment>(currentWeek);
    const theme = useTheme();

    const handleOpen = () => {
        setSelectedDate(currentWeek);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = () => {
        onWeekSelected(selectedDate);
        handleClose();
    };

    return (
        <>
            <IconButton
                onClick={handleOpen}
                sx={{
                    bgcolor: 'secondary.main',
                    color: 'secondary.contrastText',
                    borderRadius: 2,
                    '&:hover': {
                        bgcolor: 'secondary.dark'
                    }
                }}
                title="Sélectionner une semaine"
            >
                <CalendarTodayIcon fontSize="small" />
            </IconButton>

            <Dialog 
                open={open} 
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        bgcolor: 'rgba(255,255,255,0.98)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    textAlign: 'center', 
                    color: 'secondary.main',
                    fontWeight: 700,
                    pb: 1
                }}>
                    Sélectionner une semaine
                </DialogTitle>
                
                <DialogContent sx={{ pt: 2 }}>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        gap: 3
                    }}>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                            Choisissez une date pour naviguer vers la semaine correspondante
                        </Typography>
                        
                        <DatePicker
                            value={selectedDate}
                            onChange={(newValue) => {
                                if (newValue) {
                                    setSelectedDate(newValue);
                                }
                            }}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    variant: 'outlined',
                                    sx: {
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': {
                                                borderColor: 'secondary.main',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'secondary.main',
                                            }
                                        }
                                    }
                                }
                            }}
                        />

                        <Paper elevation={1} sx={{ 
                            p: 2, 
                            bgcolor: 'grey.50',
                            borderRadius: 2,
                            width: '100%'
                        }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Semaine sélectionnée :
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                                {selectedDate.startOf('isoWeek').format('DD/MM/YYYY')} - {selectedDate.endOf('isoWeek').format('DD/MM/YYYY')}
                            </Typography>
                        </Paper>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button 
                        onClick={handleClose}
                        sx={{ 
                            color: 'text.secondary',
                            fontWeight: 600
                        }}
                    >
                        Annuler
                    </Button>
                    <Button 
                        onClick={handleConfirm}
                        variant="contained"
                        sx={{ 
                            bgcolor: 'secondary.main',
                            color: 'secondary.contrastText',
                            fontWeight: 700,
                            borderRadius: 2,
                            px: 3,
                            '&:hover': {
                                bgcolor: 'secondary.dark'
                            }
                        }}
                    >
                        Aller à cette semaine
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CalendarSelector; 