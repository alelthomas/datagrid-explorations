import React from 'react';
import { Box, Button, IconButton, TextField } from '@mui/material';
import { ChevronLeft, ChevronRight, Search } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';

interface DateConstraints {
  minDate: Date;
  maxDate: Date;
}

interface CalendarHeaderProps {
  currentDate: Date;
  searchQuery: string;
  isDatePickerOpen: boolean;
  dateConstraints: DateConstraints;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onDateChange: (date: Date | null) => void;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDatePickerOpen: () => void;
  onDatePickerClose: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  searchQuery,
  isDatePickerOpen,
  dateConstraints,
  onPreviousMonth,
  onNextMonth,
  onDateChange,
  onSearchChange,
  onDatePickerOpen,
  onDatePickerClose,
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: { xs: 'stretch', sm: 'center' },
      gap: { xs: 2, sm: 3 },
      width: '100%'
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 1,
        flexShrink: 0,
        p: 1,
        borderRadius: 3,
        height: '72px'
      }}>
        <IconButton
          onClick={onPreviousMonth}
          size="small"
          sx={{
            color: 'text.primary',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <ChevronLeft />
        </IconButton>
        <DatePicker
          value={currentDate}
          onChange={onDateChange}
          open={isDatePickerOpen}
          onOpen={onDatePickerOpen}
          onClose={onDatePickerClose}
          minDate={dateConstraints.minDate}
          maxDate={dateConstraints.maxDate}
          views={['month', 'year']}
          slotProps={{
            textField: {
              onClick: onDatePickerOpen,
              sx: {
                '& .MuiInputBase-root': {
                  height: '40px',
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '& .MuiInputBase-input': {
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                },
                '& .MuiInputAdornment-root': {
                  display: 'none',
                },
              },
            },
            popper: {
              sx: {
                '& .MuiPaper-root': {
                  borderRadius: '12px',
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                },
                '& .MuiPickersCalendarHeader-root': {
                  marginTop: '8px',
                },
              },
            },
          }}
        />
        <IconButton
          onClick={onNextMonth}
          size="small"
          sx={{
            color: 'text.primary',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <ChevronRight />
        </IconButton>
        <Button
          variant="outlined"
          onClick={() => onDateChange(new Date(2025, 4, 1))}
          sx={{
            borderColor: '#000000',
            borderRadius: 2,
            whiteSpace: 'nowrap',
            minWidth: '100px',
            textTransform: 'none',
            color: '#000000',
            height: '40px',
            backgroundColor: '#ffffff',
            fontWeight: 'bold',
          }}
        >
          Today
        </Button>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        p: 1,
        borderRadius: 3,
        height: '72px',
        flex: 1
      }}>
        <TextField
          placeholder="Search"
          value={searchQuery}
          onChange={onSearchChange}
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              height: '40px',
              borderRadius: '20px',
              backgroundColor: '#ffffff'
            }
          }}
          InputProps={{
            startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
          }}
        />
      </Box>
    </Box>
  );
}; 