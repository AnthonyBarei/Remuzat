import React, { useState } from 'react';
import { 
    Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton, Typography, Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
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

    const handleOpen = () => { setSelectedDate(currentWeek); setOpen(true); };
    const handleClose = () => setOpen(false);
    const handleConfirm = () => { onWeekSelected(selectedDate); handleClose(); };

    return (
        <>
            <IconButton
                onClick={handleOpen}
                sx={{
                    width: 36, height: 36, borderRadius: 2,
                    bgcolor: 'transparent',
                    color: 'text.secondary',
                    border: `1.5px solid ${theme.palette.divider}`,
                    transition: 'all 0.15s ease',
                    '&:hover': {
                        bgcolor: `${theme.palette.primary.main}10`,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.dark,
                    },
                }}
                title="Sélectionner une semaine"
                size="small"
            >
                <CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>

            <Dialog 
                open={open} 
                onClose={handleClose}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: '0 8px 40px rgba(84,73,65,0.12)',
                    }
                }}
            >
                <DialogTitle sx={{ 
                    fontWeight: 700, fontSize: '1.05rem',
                    color: 'text.primary', pb: 0.5,
                }}>
                    Aller à une semaine
                </DialogTitle>
                
                <DialogContent sx={{ pt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                            Choisissez une date pour naviguer vers la semaine correspondante.
                        </Typography>
                        
                        <DatePicker
                            value={selectedDate}
                            onChange={(newValue) => { if (newValue) setSelectedDate(newValue); }}
                            slotProps={{
                                textField: {
                                    fullWidth: true, variant: 'outlined', size: 'small',
                                }
                            }}
                        />

                        <Box sx={{ 
                            p: 2, bgcolor: `${theme.palette.primary.main}08`,
                            borderRadius: 2, border: `1px solid ${theme.palette.primary.main}18`,
                        }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                Semaine sélectionnée
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mt: 0.25 }}>
                                {selectedDate.clone().startOf('isoWeek').format('DD/MM/YYYY')} — {selectedDate.clone().endOf('isoWeek').format('DD/MM/YYYY')}
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2.5, pt: 0.5 }}>
                    <Button onClick={handleClose} sx={{ color: 'text.secondary', fontWeight: 500, borderRadius: 2 }}>
                        Annuler
                    </Button>
                    <Button 
                        onClick={handleConfirm}
                        variant="contained"
                        sx={{ 
                            bgcolor: 'primary.main', color: '#fff',
                            fontWeight: 600, borderRadius: 2, px: 2.5,
                            boxShadow: 'none',
                            '&:hover': { bgcolor: 'primary.dark' },
                        }}
                    >
                        Confirmer
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CalendarSelector;
